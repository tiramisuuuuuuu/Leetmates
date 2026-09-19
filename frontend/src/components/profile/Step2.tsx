import CountryDropdown from "./CountryDropdown";
import Dropdown from "./Dropdown";

export default function MatchingData() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-1">
      <p className="text-xs text-ink-muted">Data used for user matching</p>
      <div className="w-full flex flex-col-reverse justify-end items-center gap-1.5">
        <Dropdown />
        <CountryDropdown />
      </div>
    </div>
  );
}
