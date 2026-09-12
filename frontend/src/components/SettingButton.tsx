interface ButtonProps {
  logo: React.ReactNode;
  label: string;
  onClick: () => void;
}

export default function SettingButton({ logo, label, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-row justify-center items-center gap-1.5 text-white text-xs font-semibold cursor-pointer bg-clay hover:bg-clay-dark active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md my-2 px-3 py-1 rounded-full"
    >
      {logo}
      <p>{label}</p>
    </button>
  );
}
