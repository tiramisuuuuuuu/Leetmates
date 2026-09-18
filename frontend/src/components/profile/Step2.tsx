import { useState } from "react";
import countriesData from "../../../public/countries.json";
import { useAssetPrefix } from "../../store/assetPrefixStore";

export default function MatchingData() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  return (
    <div className="w-full">
      <div className="w-full flex flex-col">
        <div className="w-full flex items-center gap-2 bg-white/70 border border-ink/30 rounded-md px-2.5 py-0.5">
          {selected != null && (
            <img
              src={assetPrefix + `flags/${countriesData[selected].code}.svg`}
              alt="country flag"
              className="w-3 h-2 object-cover"
            />
          )}
          <input
            type="text"
            value={selected != null ? countriesData[selected].name : ""}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Select country from dropdown"
            className="w-full min-w-0 bg-transparent text-xs text-ink placeholder:text-ink-muted outline-none caret-[transparent]"
            onBlur={() => setSearch("")}
          />
        </div>
        <div className="w-full h-20 overflow-y-scroll border border-ink/30 bg-white/70 px-2.5 box-border">
          <button
            className="w-full flex flex-row justify-start items-center gap-1"
            onClick={() => setSelected(null)}
          >
            <p className="text-xs text-ink-muted">Unselected</p>
          </button>
          {countriesData.map((obj, idx) => (
            <button
              id={obj.code}
              className="w-full flex flex-row justify-start items-center gap-1"
              onClick={() => setSelected(idx)}
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
      </div>
      <p className="text-xs text-ink-muted">Select country</p>
    </div>
  );
}
