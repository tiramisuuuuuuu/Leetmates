import type { ReactNode } from "react";
import { IoIosClose } from "react-icons/io";

export default function Modal({
  title,
  children,
  closeModal,
}: {
  title: string;
  children: ReactNode;
  closeModal: () => void;
}) {
  return (
    <div
      className="relative w-full min-w-[255px] min-h-[213px] h-full bg-cream rounded-lg border border-ink flex flex-col gap-1 p-3 
        overflow-y-scroll [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-ink/20 [&::-webkit-scrollbar-thumb]:rounded-full"
    >
      <div className="relative flex flex-row justify-center items-center">
        <h3 className="text-sm font-bold text-ink text-center">{title}</h3>

        <button
          className="absolute right-0 text-ink-muted"
          onClick={closeModal}
        >
          <IoIosClose size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center">{children}</div>
    </div>
  );
}
