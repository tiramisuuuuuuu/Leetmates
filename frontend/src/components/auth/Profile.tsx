import { useAuth } from "../../store/authStore";
import { IoLogOutOutline } from "react-icons/io5";
import SettingButton from "../SettingButton";

export default function Profile() {
  const session = useAuth((state) => state.session);
  const signOut = useAuth((state) => state.signOut);
  return (
    <div>
      {session ? (
        <div>
          <SettingButton
            logo={<IoLogOutOutline size={16} />}
            label="Logout"
            onClick={signOut}
          />
          <p className="text-xs text-white">Email: {session.user.email}</p>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
