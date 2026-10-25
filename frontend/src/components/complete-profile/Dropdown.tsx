import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { LuGraduationCap } from "react-icons/lu";
import { useProfileForm } from "../../store/profileFormStore";

const options = ["Undergrad", "Master's", "PhD", "Working", "Other"];

export default function Dropdown({
  variant,
  disabled,
}: {
  variant?: string;
  disabled?: boolean;
}) {
  const selected = useProfileForm((state) => state.currentStatus);
  const setSelected = useProfileForm((state) => state.setCurrentStatus);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      className="relative w-full flex flex-col"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          if (!disabled) {
            setDropdownOpen(false);
          }
        }
      }}
    >
      <button
        onClick={() => !disabled && setDropdownOpen(true)}
        className={`w-full flex items-center justify-between ${variant ? "border border-ink/20 py-1.5" : "bg-cream-muted border border-ink/30 py-0.5"} px-2.5 rounded-md ${variant && disabled && "bg-ink/[0.04]"}`}
      >
        <div className="flex flex-row items-center gap-2">
          {!variant && (
            <LuGraduationCap size={14} className="shrink-0 text-ink-muted" />
          )}
          <p
            className={`text-xs ${selected ? "text-ink" : "text-ink-muted"} outline-none`}
          >
            {selected
              ? selected
              : !disabled
                ? "Select current status"
                : "Unselected"}
          </p>
        </div>
        {!disabled && (
          <IoIosArrowDown className="text-ink/30 self-end justify-self-end" />
        )}
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
