import { useAssetPrefix } from "../store/assetPrefixStore";
import { useAuth } from "../store/authStore";
import { useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import Auth from "./auth/Auth";
import Profile from "./auth/Profile";
import Toast from "./Toast";
import CompleteProfile from "./profile/CompleteProfile";
import { useProfileForm } from "../store/profileFormStore";
import FriendsList from "./friends/FriendsList";
import { FaUserFriends } from "react-icons/fa";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Modal from "./friends/Modal";
import EnableNotifications from "./EnableNotifications";

const queryClient = new QueryClient();

export default function Lobby() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const [darkMode, setDarkMode] = useState(false);
  const isLoggedIn = useAuth((state) => state.session !== null);
  const authLoading = useAuth((state) => state.loading);
  const showProfileForm = useProfileForm((state) => state.showModal);
  const [modalOpen, setModalOpen] = useState(false);

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

        <button
          className="absolute bottom-0 right-1.5 flex items-center gap-0.5 text-white text-[12px]"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {!darkMode && (
            <>
              Light Mode <IoSunnyOutline size={16} />
            </>
          )}
          {darkMode && (
            <>
              Dark Mode <IoMoonOutline size={14} />
            </>
          )}
        </button>

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

        {isLoggedIn && (
          <div className="absolute inset-12 flex justify-center items-center">
            <Modal
              title="Push Notifications"
              closeModal={() => {}}
            >
              <EnableNotifications />
            </Modal>       
          </div>
        )}

        {showProfileForm && (
          <div className="absolute inset-12 flex justify-center items-center">
            <CompleteProfile />
          </div>
        )}

        <button
          className="absolute top-1 right-1.5 flex justify-center items-center text-gray-500"
          onClick={() => setModalOpen(true)}
        >
          <FaUserFriends size={16} />
        </button>

        {modalOpen && <FriendsList closeModal={() => setModalOpen(false)} />}

        <Toast />
      </div>
    </QueryClientProvider>
  );
}
