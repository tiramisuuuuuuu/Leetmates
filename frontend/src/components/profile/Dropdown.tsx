import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { LuGraduationCap } from "react-icons/lu";

const options = ["Undergrad", "Master's", "Out of school"];

export default function Dropdown() {
  const [selected, setSelected] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className="relative w-full flex flex-col max-w-2xs"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setDropdownOpen(false);
        }
      }}
    >
      <button
        onClick={() => setDropdownOpen(true)}
        className="w-full flex items-center justify-between bg-cream-muted border border-ink/30 rounded-md px-2.5 py-0.5"
      >
        <div className="flex flex-row items-center gap-2">
          <LuGraduationCap size={14} className="shrink-0 text-ink-muted" />
          <p
            className={`text-xs ${selected ? "text-ink" : "text-ink-muted"} outline-none`}
          >
            {selected ? selected : "Current status"}
          </p>
        </div>
        <IoIosArrowDown className="text-ink/30 self-end justify-self-end" />
      </button>

      {dropdownOpen && (
        <div className="absolute top-full w-full max-h-20 overflow-y-scroll border border-ink/30 bg-cream-muted px-2.5 box-border">
          <button
            className="w-full flex flex-row justify-start items-center gap-1"
            onClick={() => {
              setSelected(null);
              setDropdownOpen(false);
            }}
          >
            <p className="text-xs text-ink-muted">Unselected</p>
          </button>
          {options.map((val) => (
            <button
              id={val}
              className="w-full flex flex-row justify-start items-center gap-1"
              onClick={() => {
                setSelected(val);
                setDropdownOpen(false);
              }}
            >
              <p className="text-xs text-ink-muted">{val}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
