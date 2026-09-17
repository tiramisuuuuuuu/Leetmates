import { useAssetPrefix } from "../../store/assetPrefixStore";
import { FaTrashCan } from "react-icons/fa6";
import { BiSolidPencil } from "react-icons/bi";
import { useRef } from "react";
import { useProfileForm } from "../../store/profileFormStore";

export default function Photo() {
  const assetPrefix = useAssetPrefix((state) => state.assetPrefix);
  const updatePhoto = useProfileForm((state) => state.updatePhoto);
  const file = useProfileForm((state) => state.file);
  const previewUrl = useProfileForm((state) => state.previewUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const localUrl = URL.createObjectURL(selectedFile);
      updatePhoto(selectedFile, localUrl);
    }
  };

  return (
    <>
      <div className="relative">
        <img
          src={previewUrl ? previewUrl : assetPrefix + "defaultProfile.svg"}
          id="bg-image"
          alt="cozy cafe background"
          className="w-16 h-16 object-cover select-none rounded-full overflow-hidden"
          draggable={false}
        />

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          className={`absolute top-0 left-0 w-full h-full flex justify-center items-center bg-[#0000001c] ${!file && "hover:bg-[#00000037]"} rounded-full overflow-hidden gap-1`}
          onClick={() => {
            !file && inputRef.current?.click();
          }}
        >
          <button
            onClick={() => {
              file && inputRef.current?.click();
            }}
          >
            <BiSolidPencil size={16} color="white" />
          </button>

          {file && (
            <button
              onClick={() => {
                updatePhoto(null, null);
              }}
            >
              <FaTrashCan size={12} color="white" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-ink-muted">Upload a profile photo</p>
    </>
  );
}
