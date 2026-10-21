import type { ReactNode } from "react";
import type { Profile } from "../../types/profile";
import {
  IoLocationOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { SiLeetcode } from "react-icons/si";
import CountryDropdown from "../complete-profile/CountryDropdown";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-muted">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full min-w-0 rounded-md border border-ink/20 px-2.5 py-1.5 text-xs text-ink " +
  "placeholder:text-ink-muted outline-none focus:border-ink/50 " +
  "disabled:bg-ink/[0.04] disabled:text-ink-muted";

export function UserDetailsForm({
  profile,
  editing,
}: {
  profile: Profile;
  editing?: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-2.5 text-xs text-ink">
      <Field label="Email" icon={<IoMailOutline size={12} />}>
        <input type="text" value={"email"} disabled className={inputClass} />
      </Field>

      <Field label="LeetCode" icon={<SiLeetcode size={12} />}>
        <input
          type="text"
          value={"leetcode username"}
          disabled
          className={inputClass}
        />
      </Field>

      <Field label="Country" icon={<IoLocationOutline size={12} />}>
        <CountryDropdown variant="large" disabled={!editing} />
      </Field>

      {editing && (
        <Field label="Display name" icon={<IoPersonOutline size={12} />}>
          <input
            type="text"
            placeholder="Display name"
            value={profile.username}
            className={inputClass}
          />
        </Field>
      )}
    </div>
  );
}
