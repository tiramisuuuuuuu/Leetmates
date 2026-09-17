import { useState } from "react";

export default function MatchingData() {
  const [selected, setSelected] = useState("");

  return (
    <>
      <p className="text-xs text-ink-muted">Select country</p>
    </>
  );
}
