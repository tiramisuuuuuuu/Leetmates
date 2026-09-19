import { useState } from "react";
import countriesData from "../../../public/countries.json";
import { useAssetPrefix } from "../../store/assetPrefixStore";
import { useProfileForm } from "../../store/profileFormStore";
import { IoIosArrowDown } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";

export default function CountryDropdown() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const selected = useProfileForm((state) => state.countryCode);
  const setSelected = useProfileForm((state) => state.setCountryCode);
  const [bounds, setBounds] = useState<{ start: number; end: number }>({
    start: 0,
    end: countriesData.length,
  });
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function normalize(str: string) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function handleInputChange(prefix: string) {
    const query = normalize(prefix);

    if (query === "") {
      setBounds({ start: 0, end: countriesData.length });
      setSearch("");
      return;
    }

    // binary search to find the start position of subarr
    let left = 0;
    let right = countriesData.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      if (normalize(countriesData[mid].name) < query) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    const start = left;
    let end = left;

    // find the end position of the subarr
    while (
      end < countriesData.length &&
      normalize(countriesData[end].name).startsWith(query)
    ) {
      end += 1;
    }

    setBounds({ start, end });
    setSearch(prefix);
  }

  return (
    <div
      className="relative w-full flex flex-col max-w-2xs"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setDropdownOpen(false);
        }
      }}
    >
      <div className="relative w-full">
        <div className="w-full flex items-center justify-between bg-cream-muted border border-ink/30 rounded-md px-2.5 py-0.5">
          <div className="flex items-center justify-between gap-2">
            {selected ? (
              <img
                src={
                  assetPrefix +
                  `flags/${countriesData.find((obj) => obj.code === selected)?.code}.svg`
                }
                alt="country flag"
                className="w-3 h-2 object-cover"
              />
            ) : (
              <IoLocationOutline
                size={14}
                className="shrink-0 text-ink-muted"
              />
            )}
            <p
              className={`text-xs ${selected ? "text-ink" : "text-ink-muted"} outline-none`}
            >
              {selected
                ? countriesData.find((obj) => obj.code === selected)?.name
                : "Country"}
            </p>
          </div>
          <IoIosArrowDown className="text-ink/30 self-end justify-self-end" />
        </div>

        <div className="absolute top-0 w-full flex items-center gap-2 bg-transparent border border-transparent opacity-50 rounded-md px-2.5 py-0.5">
          <input
            type="text"
            value={search}
            onFocus={() => {
              handleInputChange("");
              setDropdownOpen(true);
            }}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full min-w-0 bg-transparent text-xs text-transparent outline-none caret-[transparent]  cursor-default"
          />
        </div>
      </div>

      {dropdownOpen && (
        <div className="absolute top-full w-full h-20 overflow-y-scroll border border-ink/30 bg-cream-muted px-2.5 box-border">
          <button
            className="w-full flex flex-row justify-start items-center gap-1"
            onClick={() => {
              setSelected(null);
              setDropdownOpen(false);
            }}
          >
            <p className="text-xs text-ink-muted">Unselected</p>
          </button>
          {countriesData.slice(bounds.start, bounds.end).map((obj) => (
            <button
              id={obj.code}
              className="w-full flex flex-row justify-start items-center gap-1"
              onClick={() => {
                setSelected(obj.code);
                setDropdownOpen(false);
              }}
            >
              <img
                src={assetPrefix + `flags/${obj.code}.svg`}
                alt="country flag"
                className="w-3 h-2 object-cover"
              />
              <p className="text-xs text-ink-muted">{obj.name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
