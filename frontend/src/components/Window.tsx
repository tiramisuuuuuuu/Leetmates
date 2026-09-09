import Draggable from "react-draggable";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Lobby from "./Lobby";
import { IoClose } from "react-icons/io5";
import { PiResize } from "react-icons/pi";

const MAX_WIDTH = 500;
const MIN_WIDTH = 200;
const MAX_HEIGHT = 300;
const MIN_HEIGHT = 200;

export default function Window({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const rightBorderRef = useRef<HTMLDivElement>(null);
  const leftBorderRef = useRef<HTMLDivElement>(null);
  const bottomBorderRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState({
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
  });
  const sizeRef = useRef({
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
  });
  const [resized, setResized] = useState({
    width: 300,
    height: 200,
  });
  const resizeDirection = useRef<string | null>(null);

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
    positionRef.current = { x: data.x, y: data.y };
  };

  // initial positioning of Window
  useEffect(() => {
    if (!parentRef.current) return;
    const parent = parentRef.current;

    const x = parent.clientWidth - size.width - 150;
    const y = parent.clientHeight - size.height - 90;

    setPosition({ x: x, y: y });
    positionRef.current = { x: x, y: y };
  }, []);

  // clamp position of Window when parent resizes
  useEffect(() => {
    const clampPosition = () => {
      if (!parentRef.current || !nodeRef.current) return;

      const parent = parentRef.current;
      const child = nodeRef.current;

      const maxX = parent.clientWidth - child.offsetWidth;
      const maxY = parent.clientHeight - child.offsetHeight;

      const currPos = positionRef.current;
      const newPos = {
        x: Math.max(0, Math.min(currPos.x, maxX)),
        y: Math.max(0, Math.min(currPos.y, maxY)),
      };

      setPosition(newPos);
      positionRef.current = newPos;
    };

    window.addEventListener("resize", clampPosition);
    return () => window.removeEventListener("resize", clampPosition);
  }, []);

  function handleResizeBttnClick() {
    if (size.width != MAX_WIDTH || size.height != MAX_HEIGHT) {
      setSize({ width: MAX_WIDTH, height: MAX_HEIGHT });
      sizeRef.current = { width: MAX_WIDTH, height: MAX_HEIGHT };
    } else {
      setSize(resized);
      sizeRef.current = resized;
    }
  }

  useEffect(() => {
    if (
      !rightBorderRef.current ||
      !leftBorderRef.current ||
      !bottomBorderRef.current
    )
      return;

    const rightBorder = rightBorderRef.current;
    const leftBorder = leftBorderRef.current;
    const bottomBorder = bottomBorderRef.current;

    const handlePointerDown = (e: PointerEvent, dir: string) => {
      resizeDirection.current = dir;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!resizeDirection.current) return;

      const dir = resizeDirection.current;
      if (dir === "r") {
        let newWidth = e.clientX - positionRef.current.x;
        newWidth = Math.max(Math.min(newWidth, MAX_WIDTH), MIN_WIDTH);
        const currSize = sizeRef.current;
        const newSize = { width: newWidth, height: currSize.height };
        setSize(newSize);
        sizeRef.current = newSize;
        setResized(newSize);
      } else if (dir === "l") {
        const widthIncrease = positionRef.current.x - e.clientX;
        const currSize = sizeRef.current;
        let newWidth = currSize.width + widthIncrease;
        newWidth = Math.max(Math.min(newWidth, MAX_WIDTH), MIN_WIDTH);
        const newSize = { width: newWidth, height: currSize.height };

        setSize(newSize);
        sizeRef.current = newSize;
        setResized(newSize);

        const rightBorderX = positionRef.current.x + currSize.width;
        const newX = rightBorderX - newWidth;
        const newPos = { x: newX, y: positionRef.current.y };
        setPosition(newPos);
        positionRef.current = newPos;
      } else if (dir === "b") {
        let newHeight = e.clientY - positionRef.current.y;
        newHeight = Math.max(Math.min(newHeight, MAX_HEIGHT), MIN_HEIGHT);
        const currSize = sizeRef.current;
        const newSize = { width: currSize.width, height: newHeight };
        setSize(newSize);
        sizeRef.current = newSize;
        setResized(newSize);
      }
    };

    const stopDragging = () => {
      resizeDirection.current = null;
    };

    rightBorder.addEventListener("pointerdown", (e) =>
      handlePointerDown(e, "r"),
    );
    leftBorder.addEventListener("pointerdown", (e) =>
      handlePointerDown(e, "l"),
    );
    bottomBorder.addEventListener("pointerdown", (e) =>
      handlePointerDown(e, "b"),
    );
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);

    return () => {
      rightBorder.removeEventListener("pointerdown", (e) =>
        handlePointerDown(e, "r"),
      );
      leftBorder.removeEventListener("pointerdown", (e) =>
        handlePointerDown(e, "l"),
      );
      bottomBorder.removeEventListener("pointerdown", (e) =>
        handlePointerDown(e, "b"),
      );
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
    };
  }, []);

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
          className="bg-[#291f19] rounded-md flex flex-col overflow-hidden"
          style={{
            pointerEvents: "auto",
            width: size.width,
            height: size.height,
            display: open ? "flex" : "none",
          }}
        >
          <div
            id="nav-bar"
            className={`drag-handle w-full h-5 bg-[#291f19] flex justify-between items-center box-border px-2.5 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
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

          <div
            ref={leftBorderRef}
            className="absolute top-0 left-0 w-2 h-full bg-transparent cursor-ew-resize "
          />
          <div
            ref={rightBorderRef}
            className="absolute top-0 right-0 w-2 h-full bg-transparent cursor-ew-resize"
          />
          <div
            ref={bottomBorderRef}
            className="absolute bottom-0 left-0 w-full h-2 bg-transparent cursor-ns-resize"
          />
        </div>
      </Draggable>
    </div>
  );
}
