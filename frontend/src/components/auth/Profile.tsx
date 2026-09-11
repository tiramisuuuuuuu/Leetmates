import { useAuth } from "../../store/authStore";
export default function Profile() {
  const session = useAuth((state) => state.session);
  return (
    <div>
      {session ? (
        <div>
          <p className="text-xs text-white">Email: {session.user.email}</p>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
