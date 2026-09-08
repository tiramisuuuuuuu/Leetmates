import Draggable from "react-draggable";
import styles from "./Window.module.css";
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
    width: 500,
    height: 300,
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
          className={styles.entireWindow}
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
            }}
          >
            <div className={styles.windowContents}>
              <div
                className={`${styles.navBar} ${isDragging && styles.dragging} drag-handle`}
              >
                <p className={styles.header}>Leetmates Lobby</p>
                <button onClick={() => setOpen(false)} className={styles.bttn}>
                  ×
                </button>
              </div>

              <div className={styles.content}>
                <Lobby />
              </div>
            </div>
          </ResizableBox>
        </div>
      </Draggable>
    </div>
  );
}
