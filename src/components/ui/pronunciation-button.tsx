"use client";
import { Volume2Icon } from "lucide-react";
import React from "react";
import useSound from "use-sound";

export default function PronunciationButton() {
  const [play] = useSound("/audio/zeit_pronunciation.mp3");

  return (
    <Volume2Icon
      className="stroke-1 hover:fill-primary transition-colors size-5 cursor-pointer"
      onClick={() => play()}
    />
  );
}
