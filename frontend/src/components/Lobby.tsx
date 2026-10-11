import { useAssetPrefix } from "../store/assetPrefixStore";
import { useAuth } from "../store/authStore";
import { useState } from "react";
import {
  IoMoonOutline,
  IoSettingsSharp,
  IoSunnyOutline,
} from "react-icons/io5";
import Auth from "./auth/Auth";
import Profile from "./auth/Profile";
import Toast from "./Toast";
import CompleteProfile from "./profile/CompleteProfile";
import { useProfileForm } from "../store/profileFormStore";
import FriendsList from "./friends/FriendsList";
import { FaUserFriends } from "react-icons/fa";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Modal from "./ui/Modal";
import EnableNotifications from "./notifications/EnableNotifications";
import SettingsPage from "./settings/SettingsPage";

const queryClient = new QueryClient();

export default function Lobby() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const [darkMode, setDarkMode] = useState(false);
  const isLoggedIn = useAuth((state) => state.session !== null);
  const authLoading = useAuth((state) => state.loading);
  const showProfileForm = useProfileForm((state) => state.showModal);
  const [modalOpen, setModalOpen] = useState<string | null>("notifications");

  return (
    <QueryClientProvider client={queryClient}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
        className="[container-type:size]"
      >
        <img
          src={assetPrefix + (darkMode ? "bgDark.svg" : "bg.svg")}
          id="bg-image"
          alt="cozy cafe background"
          className="absolute top-0 left-0 w-full h-full object-cover select-none"
          draggable={false}
        />

        {!authLoading && !isLoggedIn && (
          <div className="absolute inset-5">
            <Auth />
          </div>
        )}

        {isLoggedIn && (
          <div className="absolute bottom-1 left-1.5">
            <Profile />
          </div>
        )}

        {showProfileForm && (
          <div className="absolute inset-12 flex justify-center items-center">
            <Modal
              title="Push Notifications"
              closeModal={() => setModalOpen(null)}
            >
              <EnableNotifications closeModal={() => setModalOpen(null)} />
            </Modal>
          </div>
        )}

        {showProfileForm && (
          <div className="absolute inset-12 flex justify-center items-center">
            <CompleteProfile />
          </div>
        )}

        <div className="absolute top-1 right-1.5 flex flex-col justify-center items-center gap-2">
          <button
            className="text-gray-500"
            onClick={() => setModalOpen("friends")}
          >
            <FaUserFriends size={16} />
          </button>

          <button
            className="text-gray-500"
            onClick={() => setModalOpen("settings")}
          >
            <IoSettingsSharp size={16} />
          </button>
        </div>

        {modalOpen === "friends" && (
          <FriendsList closeModal={() => setModalOpen(null)} />
        )}

        {modalOpen === "settings" && (
          <SettingsPage
            closeModal={() => setModalOpen(null)}
            toggleAppearance={() => setDarkMode((prev) => !prev)}
          />
        )}

        <Toast />
      </div>
    </QueryClientProvider>
  );
}
