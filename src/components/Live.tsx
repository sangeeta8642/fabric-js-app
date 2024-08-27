"use client";
import React from "react";

type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
};


  const Live = ({ canvasRef}: Props) => {
  return (
    <main className="relative flex h-full w-full flex-1 items-center justify-center" id="canvas">
        <canvas ref={canvasRef} />
    </main>
  );
};

export default Live;
