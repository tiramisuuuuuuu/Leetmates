import { create } from "zustand";

interface AssetPrefixState {
  assetPrefix: string;
  setAssetPrefix: (name: string) => void;
}

export const useAssetPrefix = create<AssetPrefixState>()((set) => ({
  assetPrefix: "/",
  setAssetPrefix: (newAssetPrefix: string) =>
    set({ assetPrefix: newAssetPrefix }),
}));
