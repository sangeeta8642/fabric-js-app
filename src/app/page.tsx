"use client";

// import Canvas from "./components/Canvas";
// import Canvas2 from './components/Canvas2'
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvasZoom,
  handleResize,
  initializeFabric,
} from "../lib/canvas";
import Live from "../components/Live";
import { Navbar, RightSidebar } from "../components";
import { ActiveElement, Attributes } from "../types/type";
import { defaultNavElement } from "../constants";
import { handleDelete } from "../lib/key-events";
import { handleImageUpload } from "../lib/shapes";
// import RightSidebar from '../components';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const isEditingRef = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontWeight: "",
    fontFamily: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);
    selectedShapeRef.current = elem?.value as string;

    switch (elem?.value) {
      case "reset":
        fabricRef.current.clear();
        setActiveElement(defaultNavElement);
        setElementAttributes({
          width: "",
          height: "",
          fontSize: "",
          fontWeight: "",
          fontFamily: "",
          fill: "#aabbcc",
          stroke: "#aabbcc",
        })
        break;

      case "delete":
        handleDelete(fabricRef.current);
        setActiveElement(defaultNavElement);
        setElementAttributes({
          width: "",
          height: "",
          fontSize: "",
          fontWeight: "",
          fontFamily: "",
          fill: "#aabbcc",
          stroke: "#aabbcc",
        })
        break;

      case "image":
        imageInputRef.current?.click();
        isDrawing.current = false;

        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false;
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef });

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
    });

    canvas.on("selection:cleared", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    });

    canvas.on("object:scaling", (options: any) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    });

    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        setActiveElement,
      });
    });

    canvas.on("mouse:wheel", (options) => {
      handleCanvasZoom({
        options,
        canvas,
      });
    });

    window.addEventListener("resize", () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <main className="h-screen overflow-hidden">
      {/* <h1 className="text-3xl">Fabric.js Shapes Drawing</h1> */}
      {/* <Canvas /> */}
      {/* <Canvas2 /> */}
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(e: any) => {
          e.stopPropagation();

          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
          });
        }}
      />
      <div className="w-full h-full flex">
        <Live canvasRef={canvasRef} />
        {/* <RightSidebar/> */}
        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          isEditingRef={isEditingRef}
          activeObjectRef={activeObjectRef}
        />
      </div>
    </main>
  );
}
