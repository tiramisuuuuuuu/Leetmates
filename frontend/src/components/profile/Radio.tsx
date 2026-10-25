import { useProfileForm } from "../../store/profileFormStore";
import { IoMdRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io";
import { options } from "../complete-profile/Step3";

export default function Radio({ editing }: { editing: boolean }) {
  const selected = useProfileForm((state) => state.matchingPreference);
  const setSelected = useProfileForm((state) => state.setMatchingPreference);

  return (
    <div className="w-full h-full flex flex-row justify-center items-center gap-2 flex-wrap">
      {options.map((item) => {
        const isSelected = selected === item.id;
        return (
          <button
            key={item.id}
            id={item.id}
            onClick={() => setSelected(item.id)}
            disabled={!editing}
            className={`flex-1 min-w-[180px] flex items-start gap-2.5 rounded-md px-3 py-2.5 text-left border border-ink/20 ${!editing && !isSelected && "bg-ink/[0.04]"} ${editing && "hover:bg-ink/5"}`}
          >
            {isSelected ? (
              <IoMdRadioButtonOn
                size={16}
                className={`shrink-0 mt-0.5 text-ink-muted`}
              />
            ) : (
              <IoMdRadioButtonOff
                size={16}
                className={`shrink-0 mt-0.5 text-ink-muted`}
              />
            )}

            <div className="flex flex-col items-start gap-0.5 min-w-0">
              <p className={`text-xs font-semibold text-ink`}>{item.title}</p>
              <p className={`text-[11px] leading-snug text-ink-muted`}>
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
