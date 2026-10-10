import type { ReactNode } from "react";
import { useAssetPrefix } from "../../store/assetPrefixStore";

export default function Menu({
  position,
  children,
}: {
  position: "top" | "bottom";
  children: ReactNode;
}) {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);

  return (
    <div
      className={`absolute ${position == "top" ? "bottom-full" : "top-full"} left-1/2 -translate-x-1/2 bg-cream-muted border-1 border-ink/40 rounded-md p-2 py-1 m-0.5 text-[10px] flex justify-center items-center`}
    >
      <img
        src={assetPrefix + "triangle.svg"}
        id="bg-image"
        alt="cozy autumn background"
        className={`absolute w-2 h-1.5 object-cover select-none ${position == "top" ? "rotate-180 top-full" : "bottom-full"}`}
        draggable={false}
      />
      {children}
    </div>
  );
}
