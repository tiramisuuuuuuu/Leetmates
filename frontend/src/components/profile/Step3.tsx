import { IoPeopleOutline } from "react-icons/io5";
import { MdOutlineWavingHand } from "react-icons/md";
import { useProfileForm } from "../../store/profileFormStore";

const options = [
  {
    id: "everyone",
    title: "Open to matches",
    description: "Get matched with other Leetmates users.",
  },
  {
    id: "friends",
    title: "Friends only",
    description: "Keep your lobby private for friends.",
  },
];

export default function MatchingPreference() {
  const selected = useProfileForm((state) => state.matchingPreference);
  const setSelected = useProfileForm((state) => state.setMatchingPreference);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2 px-2">
      {options.map((item) => {
        const isSelected = selected === item.id;
        return (
          <button
            key={item.id}
            id={item.id}
            onClick={() => setSelected(item.id)}
            className={`w-full max-w-xs flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 ${
              isSelected
                ? "bg-clay border-clay-dark"
                : "bg-cream-muted border-ink/30 hover:border-ink/50 hover:bg-ink/5"
            }`}
          >
            {item.id === "friends" ? (
              <IoPeopleOutline
                size={16}
                className={`shrink-0 mt-0.5 ${isSelected ? "text-cream" : "text-ink-muted"}`}
              />
            ) : (
              <MdOutlineWavingHand
                size={16}
                className={`shrink-0 mt-0.5 ${isSelected ? "text-cream" : "text-ink-muted"}`}
              />
            )}

            <div className="flex flex-col items-start gap-0.5 min-w-0">
              <p
                className={`text-xs font-semibold ${isSelected ? "text-cream" : "text-ink"}`}
              >
                {item.title}
              </p>
              <p
                className={`text-[11px] leading-snug ${
                  isSelected ? "text-cream/80" : "text-ink-muted"
                }`}
              >
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
