import { useState, type ReactNode } from "react";
import type { Profile } from "../../types/profile";
import {
  IoLocationOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { SiLeetcode } from "react-icons/si";
import CountryDropdown from "../complete-profile/CountryDropdown";
import Dropdown from "../complete-profile/Dropdown";
import { FaGraduationCap } from "react-icons/fa6";
import { useAuth } from "../../store/authStore";
import { MdOutlineWavingHand } from "react-icons/md";
import Radio from "./Radio";
import { useProfileForm } from "../../store/profileFormStore";

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
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-ink-muted">
        {icon}
        {label}
      </span>
      {children}
    </div>
  );
}

const inputClass =
  "w-full min-w-0 rounded-md border border-ink/20 px-2.5 py-1.5 text-xs text-ink " +
  "placeholder:text-ink-muted outline-none focus:border-ink/50 " +
  "disabled:bg-ink/[0.04] disabled:text-ink-muted";

export function AccountDetailsForm({
  profile,
  editing,
}: {
  profile: Profile;
  editing?: boolean;
}) {
  const session = useAuth((state) => state.session);
  const displayName = useProfileForm((state) => state.displayName);
  const setDisplayName = useProfileForm((state) => state.setDisplayName);

  return (
    <div className="flex w-full flex-col gap-2.5 text-xs text-ink">
      <Field label="Display name" icon={<IoPersonOutline size={12} />}>
        <input
          type="text"
          placeholder="Display name"
          value={displayName ?? ""}
          onChange={(e) => setDisplayName(e.target.value)}
          className={inputClass}
          disabled={!editing}
        />
      </Field>

      <Field label="Email" icon={<IoMailOutline size={12} />}>
        <input
          type="text"
          value={session?.user.email}
          disabled
          className={inputClass}
        />
      </Field>

      <Field label="LeetCode" icon={<SiLeetcode size={12} />}>
        <input
          type="text"
          value={profile.leetcodeId}
          disabled
          className={inputClass}
        />
      </Field>
    </div>
  );
}

export function MatchingDataForm({ editing }: { editing?: boolean }) {
  return (
    <div className="flex w-full flex-col-reverse gap-2.5 text-xs text-ink">
      <Field label="Current status" icon={<FaGraduationCap size={12} />}>
        <Dropdown variant="large" disabled={!editing} />
      </Field>

      <Field label="Country" icon={<IoLocationOutline size={12} />}>
        <CountryDropdown variant="large" disabled={!editing} />
      </Field>

      <Field
        label="Matching Preference"
        icon={<MdOutlineWavingHand size={12} />}
      >
        <Radio editing={editing ?? false} />
      </Field>
    </div>
  );
}
