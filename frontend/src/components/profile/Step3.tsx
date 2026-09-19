import { IoPeopleOutline } from "react-icons/io5";
import { MdOutlineWavingHand } from "react-icons/md";
import { useProfileForm } from "../../store/profileFormStore";

const options = [
  {
    id: "everyone",
    title: "Open to matches",
    description: "Get matched with other Leetmates users.",
    shortDescription: "(Public lobby)",
  },
  {
    id: "friends",
    title: "Friends only",
    description: "Keep your lobby private for friends.",
    shortDescription: "(Private lobby)",
  },
];

export default function MatchingPreference() {
  const selected = useProfileForm((state) => state.matching);
  const setSelected = useProfileForm((state) => state.setMatching);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-1.5">
      {options.map((item) => (
        <button
          id={item.id}
          className={`w-full max-w-2xs flex flex-row items-center gap-2  ${selected === item.id ? "bg-clay border-clay-dark" : "bg-cream-muted border border-ink/30"} rounded-md px-2.5 py-0.5`}
          onClick={() => setSelected(item.id)}
        >
          {item.id === "friends" ? (
            <IoPeopleOutline
              className={
                selected == item.id ? "text-cream" : "text-shadow-clay-dark"
              }
            />
          ) : (
            <MdOutlineWavingHand
              className={
                selected == item.id ? "text-cream" : "text-shadow-clay-dark"
              }
            />
          )}
          <div
            className={`flex flex-col justify-center items-start ${selected == item.id ? "text-cream" : "text-shadow-clay-dark"}`}
          >
            <p className="text-xs font-semibold">{item.title}</p>
            <p className="text-xs text-start [@container(max-height:320px)]:hidden">
              {item.description}
            </p>
            <p className="hidden text-xs text-start [@container(max-height:320px)]:block">
              {item.shortDescription}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
