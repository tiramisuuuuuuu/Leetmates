import { useAssetPrefix } from "../store/assetPrefixStore";
import { useAuth } from "../store/authStore";
import { useEffect, useState } from "react";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import Auth from "./auth/Auth";
import Profile from "./auth/Profile";
import Toast from "./Toast";
import CompleteProfile from "./complete-profile/CompleteProfile";
import { useProfileForm } from "../store/profileFormStore";
import FriendsList from "./friends/FriendsList";
import { FaUserFriends } from "react-icons/fa";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Modal from "./ui/Modal";
import EnableNotifications from "./notifications/EnableNotifications";
import SettingsPage from "./settings/SettingsPage";
import ProfilePage from "./profile/ProfilePage";
import { BsPeopleFill, BsPersonCircle } from "react-icons/bs";
import FriendsCanvas from "./FriendsCanvas";
import { MdPerson } from "react-icons/md";
import { FaAddressCard, FaRegAddressCard } from "react-icons/fa6";
import { LuIdCard } from "react-icons/lu";
import { RiSettings3Line } from "react-icons/ri";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoIosSettings, IoMdPeople } from "react-icons/io";
import { chromeStorageAdapter } from "../api/chromeStorage";

const APPEARANCE_STORAGE_KEY = "leetmates-dark-mode";

const queryClient = new QueryClient();

export default function Lobby() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const [darkMode, setDarkMode] = useState(false);
  const isLoggedIn = useAuth((state) => state.session !== null);
  const authLoading = useAuth((state) => state.loading);
  const showProfileForm = useProfileForm((state) => state.showModal);
  const showNotificationsForm = useProfileForm(
    (state) => state.showNotificationsModal,
  );
  const setShowNotificationsForm = useProfileForm(
    (state) => state.setShowNotificationsModal,
  );
  const [modalOpen, setModalOpen] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    chromeStorageAdapter.getItem(APPEARANCE_STORAGE_KEY).then((value) => {
      if (mounted) setDarkMode(value === "true");
    });
    return () => {
      mounted = false;
    };
  }, []);

  const toggleAppearance = () => {
    setDarkMode((current) => {
      const next = !current;
      void chromeStorageAdapter.setItem(APPEARANCE_STORAGE_KEY, String(next));
      return next;
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
        className={`[container-type:size] ${darkMode ? "theme-dark" : "theme-light"}`}
      >
        <img
          src={assetPrefix + (darkMode ? "bgDark.svg" : "bg.svg")}
          id="bg-image"
          alt="cozy cafe background"
          className="absolute top-0 left-0 w-full h-full object-cover select-none"
          draggable={false}
        />

        {isLoggedIn && <FriendsCanvas />}

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

        {showNotificationsForm && (
          <div className="absolute inset-12 flex justify-center items-center">
            <Modal
              title="Push Notifications"
              closeModal={() => setShowNotificationsForm(false)}
            >
              <EnableNotifications
                closeModal={() => setShowNotificationsForm(false)}
              />
            </Modal>
          </div>
        )}

        {showProfileForm && (
          <div className="absolute inset-12 flex justify-center items-center">
            <CompleteProfile />
          </div>
        )}

        <div className="absolute top-1 right-0 flex flex-col justify-center items-center gap-2">
          <button
            className="text-gray-500 p-0.5 pr-1.5 pl-1 bg-cream border-clay border-1 border-r-0 rounded-l-[5px]"
            onClick={() => setModalOpen("friends")}
          >
            <BsPeopleFill size={14} className="text-clay-dark" />
          </button>

          <button
            className="text-gray-500 p-0.5 pr-1.5 pl-1 bg-cream border-clay border-1 border-r-0 rounded-l-[5px]"
            onClick={() => setModalOpen("profile")}
          >
            <LuIdCard size={14} className="text-clay-dark" />
          </button>
          <button
            className="text-gray-500 p-0.5 pr-1.5 pl-1 bg-cream border-clay border-1 border-r-0 rounded-l-[5px]"
            onClick={() => setModalOpen("settings")}
          >
            <IoSettingsOutline size={14} className="text-clay-dark" />
          </button>
        </div>

        {modalOpen === "friends" && (
          <FriendsList closeModal={() => setModalOpen(null)} />
        )}

        {modalOpen === "settings" && (
          <SettingsPage
            closeModal={() => setModalOpen(null)}
            toggleAppearance={toggleAppearance}
          />
        )}
        {modalOpen === "profile" && (
          <ProfilePage closeModal={() => setModalOpen(null)} />
        )}

        <Toast />
      </div>
    </QueryClientProvider>
  );
}
