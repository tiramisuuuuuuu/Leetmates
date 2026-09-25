import { FaGraduationCap } from "react-icons/fa6";
import CountryDropdown from "./CountryDropdown";
import Dropdown from "./Dropdown";
import { BiGlobe } from "react-icons/bi";

export default function MatchingData() {
  return (
    <div className="w-full h-full flex flex-col justify-start gap-1">
      <p className="text-xs text-ink-muted text-center">
        Data used for user matching
      </p>

      <div className="flex flex-col-reverse gap-2 items-center">
        <div className="flex flex-col gap-1 w-full max-w-2xs">
          <span className="flex items-center gap-1.5 text-[10px] text-ink-muted px-0.5">
            <FaGraduationCap size={12} />
            Current status
          </span>
          <Dropdown />
        </div>

        <div className="flex flex-col gap-1 w-full max-w-2xs">
          <span className="flex items-center gap-1.5 text-[10px] text-ink-muted px-0.5">
            <BiGlobe size={12} />
            Country
          </span>
          <CountryDropdown />
        </div>
      </div>
    </div>
  );
}
