import Draggable from "react-draggable";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import "react-resizable/css/styles.css";
import { ResizableBox } from "react-resizable";
import Lobby from "./Lobby";
import { IoClose } from "react-icons/io5";
import { PiResize } from "react-icons/pi";

const MAX_WIDTH = 500;
const MAX_HEIGHT = 300;

export default function Window({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState({
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
  });
  const [resized, setResized] = useState({
    width: 300,
    height: 250,
  });

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  // initial positioning of Window
  useEffect(() => {
    if (!parentRef.current) return;
    const parent = parentRef.current;

    const x = parent.clientWidth - size.width - 120;
    const y = parent.clientHeight - size.height - 80;

    setPosition({ x: x, y: y });
  }, []);

  // clamp position of Window when parent resizes
  useEffect(() => {
    const clampPosition = () => {
      if (!parentRef.current || !nodeRef.current) return;

      const parent = parentRef.current;
      const child = nodeRef.current;

      const maxX = parent.clientWidth - child.offsetWidth;
      const maxY = parent.clientHeight - child.offsetHeight;

      setPosition((pos) => ({
        x: Math.max(0, Math.min(pos.x, maxX)),
        y: Math.max(0, Math.min(pos.y, maxY)),
      }));
    };

    window.addEventListener("resize", clampPosition);
    return () => window.removeEventListener("resize", clampPosition);
  }, []);

  function handleResizeBttnClick() {
    if (size.width != MAX_WIDTH || size.height != MAX_HEIGHT) {
      setSize({ width: MAX_WIDTH, height: MAX_HEIGHT });
    } else {
      setSize(resized);
    }
  }

  return (
    <div
      ref={parentRef}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <Draggable
        nodeRef={nodeRef}
        position={position}
        onDrag={handleDrag}
        cancel="button"
        onStart={() => setIsDragging(true)}
        onStop={() => setIsDragging(false)}
        handle=".drag-handle"
        bounds="parent"
      >
        <div
          ref={nodeRef}
          id="entire-window"
          className="bg-[#291f19] rounded-md overflow-hidden"
          style={{
            pointerEvents: "auto",
            width: size.width,
            height: size.height,
            display: open ? "block" : "none",
          }}
        >
          <ResizableBox
            width={size.width}
            height={size.height}
            draggableOpts={{ grid: [25, 25] }}
            minConstraints={[200, 200]}
            maxConstraints={[500, 300]}
            resizeHandles={["e", "s", "w"]}
            onResize={(_, { size }) => {
              setSize(size);
              // track latest onResize value, for minimize button
              setResized(size);
            }}
          >
            <div id="window-children" className="w-full h-full flex flex-col">
              <div
                id="nav-bar"
                className={`drag-handle w-full h-8 bg-[#291f19] flex justify-between items-center box-border px-2.5 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              >
                <p className="text-xs text-white">Leetmates Lobby</p>
                <div id="window-buttons" className="flex flex-row gap-0.5">
                  <button
                    id="resize-button"
                    onClick={handleResizeBttnClick}
                    className="flex justify-center items-center text-white"
                  >
                    <PiResize />
                  </button>
                  <button
                    id="close-button"
                    onClick={() => setOpen(false)}
                    className="flex justify-center items-center text-white"
                  >
                    <IoClose />
                  </button>
                </div>
              </div>

              <div id="content" className="flex flex-1">
                <Lobby />
              </div>
            </div>
          </ResizableBox>
        </div>
      </Draggable>
    </div>
  );
}
