import type { ReactNode } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { TbSunset2 } from "react-icons/tb";

function SettingButton({
  icon,
  header,
  subheader,
  onClick,
  hideArrow,
}: {
  icon: ReactNode;
  header: string;
  subheader: string;
  onClick: () => void;
  hideArrow?: boolean;
}) {
  return (
    <button
      className="w-full h-14  flex flex-row items-center p-4 py-4 gap-3 text-ink-muted hover:text-clay cursor-pointer"
      onClick={onClick}
    >
      {icon}

      <div className="flex-1 flex flex-col items-start text-ink">
        <p className="font-semibold">{header}</p>
        <p className="text-ink-muted text-start text-[12px]">{subheader}</p>
      </div>

      {!hideArrow && <IoIosArrowForward className="shrink-0" size={16} />}
    </button>
  );
}

function Heading({ label }: { label: string }) {
  return (
    <div className="flex flex-row items-center gap-2 px-4 pt-3 pb-1">
      <span className="text-[13px] text-clay-dark">{label}</span>
      <div className="flex-1 h-px bg-ink/15" />
    </div>
  );
}

export default function SettingsPage({
  closeModal,
  toggleAppearance,
}: {
  closeModal: () => void;
  toggleAppearance: () => void;
}) {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-cream/90 flex flex-col text-xs text-start overflow-hidden">
      {/* menu board header */}
      <div className="relative flex flex-row justify-between items-center py-2 px-3 h-[45px]">
        <button
          onClick={() => closeModal()}
          className="flex flex-row items-center gap-1 text-ink-muted hover:text-ink text-xs font-semibold cursor-pointer rounded-full  transition-colors"
        >
          <IoIosArrowBack size={14} />
          Lobby
        </button>

        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-ink">
          Settings
        </p>
      </div>

      <div className="relative flex-1 flex flex-col overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        <Heading label="General" />
        <div className="flex flex-col divide-y divide-ink/[0.06]">
          <SettingButton
            icon={<IoMdNotificationsOutline size={25} />}
            header="Notifications"
            subheader="Manage notification permissions"
            onClick={() => {}}
          />
          <SettingButton
            icon={<AiOutlineFileText size={25} />}
            header="Terms and Conditions"
            subheader="Read our terms of use"
            onClick={() => {}}
          />
          <SettingButton
            icon={<TbSunset2 size={25} />}
            header="Appearance"
            subheader="Press to toggle light/dark mode"
            onClick={toggleAppearance}
            hideArrow
          />
        </div>
      </div>
    </div>
  );
}
