import { useState, type ReactNode } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosNotifications,
  IoIosNotificationsOutline,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { TbSunMoon, TbSunset2 } from "react-icons/tb";
import Notifications from "./Notifications";
import { IoDocumentText, IoDocumentTextOutline } from "react-icons/io5";
import { FaBell } from "react-icons/fa6";
import { PiSunHorizon } from "react-icons/pi";

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
      className="w-full h-14  flex flex-row items-center py-4 gap-3 text-clay hover:text-clay-dark cursor-pointer"
      onClick={onClick}
    >
      <div className="w-6 flex justify-center items-center">{icon}</div>

      <div className="flex-1 flex flex-col items-start text-ink">
        <p className="font-semibold">{header}</p>
        <p className="text-ink/60 text-start text-[12px]">{subheader}</p>
      </div>

      {!hideArrow && <IoIosArrowForward className="shrink-0" size={16} />}
    </button>
  );
}

export default function SettingsPage({
  closeModal,
  toggleAppearance,
}: {
  closeModal: () => void;
  toggleAppearance: () => void;
}) {
  const [subpage, setSubpage] = useState<string | null>(null);
  const isMainPage = subpage === null;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-cream/90 flex flex-col text-xs text-start overflow-hidden">
      {/* menu board header */}
      <div className="relative flex flex-row justify-between items-center py-2 px-3 h-[45px]">
        <button
          onClick={() => {
            isMainPage ? closeModal() : setSubpage(null);
          }}
          className="flex flex-row items-center gap-1 text-ink-muted hover:text-ink text-xs font-semibold cursor-pointer rounded-full  transition-colors"
        >
          <IoIosArrowBack size={14} />
          {isMainPage ? "Lobby" : "Back"}
        </button>

        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-ink">
          {!subpage ? "Settings" : subpage}
        </p>
      </div>

      <div className="relative flex-1 flex flex-col overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        {isMainPage && (
          <div className="flex flex-col divide-y divide-ink/[0.06] px-4">
            <SettingButton
              icon={<IoIosNotificationsOutline size={24} />}
              header="Notifications"
              subheader="Manage notification permissions"
              onClick={() => setSubpage("Notifications")}
            />
            <SettingButton
              icon={<IoDocumentTextOutline size={18} />}
              header="Terms and Conditions"
              subheader="Read our terms of use"
              onClick={() => {}}
            />
            <SettingButton
              icon={<TbSunMoon size={20} />}
              header="Appearance"
              subheader="Press to toggle light/dark mode"
              onClick={toggleAppearance}
              hideArrow
            />
          </div>
        )}

        {subpage === "Notifications" && <Notifications />}
      </div>
    </div>
  );
}
