import Draggable from "react-draggable";
import styles from "./Window.module.css";
import { useRef, useState } from "react";

export default function Window({ open }: { open: boolean }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

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
          className={styles.main}
          style={{
            pointerEvents: "auto",
          }}
        >
          <div
            className={`${styles.navBar} ${isDragging && styles.dragging} drag-handle`}
          >
            <button onClick={() => setIsSmall(true)}>min</button>
          </div>
          <p className={styles.text}>Here is some text</p>
        </div>
      </Draggable>
    </div>
  );
}
