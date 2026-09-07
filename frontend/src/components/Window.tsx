import Draggable from "react-draggable";
import styles from "./Window.module.css";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import "react-resizable/css/styles.css";
import { ResizableBox } from "react-resizable";

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
    width: 400,
    height: 300,
  });

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <div
      ref={parentRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        display: open ? "block" : "none",
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
          className={styles.window}
          style={{
            pointerEvents: "auto",
            width: size.width,
            height: size.height,
          }}
        >
          <ResizableBox
            width={size.width}
            height={size.height}
            draggableOpts={{ grid: [25, 25] }}
            minConstraints={[100, 100]}
            maxConstraints={[500, 300]}
            resizeHandles={["e", "s", "w"]}
            onResize={(_, { size }) => {
              setSize(size);
            }}
          >
            <div>
              <div
                className={`${styles.navBar} ${isDragging && styles.dragging} drag-handle`}
              >
                <button onClick={() => setOpen(false)} className={styles.bttn}>
                  ❌️
                </button>
              </div>

              <p className={styles.text}>Here is some text</p>
            </div>
          </ResizableBox>
        </div>
      </Draggable>
    </div>
  );
}
