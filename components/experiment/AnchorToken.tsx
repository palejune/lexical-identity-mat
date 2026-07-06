"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface AnchorTokenProps {
  text: string;
}

const ANCHOR_CIRCLE_SIZE_PX = 96;
const ANCHOR_HORIZONTAL_PADDING_PX = 16;
const ANCHOR_MAX_FONT_SIZE_PX = 18;
const ANCHOR_MIN_FONT_SIZE_PX = 9;
const ANCHOR_AVAILABLE_WIDTH_PX =
  ANCHOR_CIRCLE_SIZE_PX - ANCHOR_HORIZONTAL_PADDING_PX;

export function AnchorToken({ text }: AnchorTokenProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState(ANCHOR_MAX_FONT_SIZE_PX);

  useLayoutEffect(() => {
    const element = textRef.current;
    if (!element) {
      return;
    }

    let nextFontSize = ANCHOR_MAX_FONT_SIZE_PX;
    element.style.fontSize = `${nextFontSize}px`;

    while (
      nextFontSize > ANCHOR_MIN_FONT_SIZE_PX &&
      element.scrollWidth > ANCHOR_AVAILABLE_WIDTH_PX
    ) {
      nextFontSize -= 1;
      element.style.fontSize = `${nextFontSize}px`;
    }

    setFontSize(nextFontSize);
  }, [text]);

  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center rounded-full border border-violet-200 bg-white text-center shadow-md"
      aria-label="기준 표현"
      role="status"
    >
      <span
        ref={textRef}
        className="max-w-full px-2 font-bold leading-none text-slate-900"
        style={{
          fontSize: `${fontSize}px`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
}
