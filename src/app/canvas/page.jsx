"use client";

import React, { useEffect, useRef } from "react";
import * as fabric from "fabric";

const shapes = [
  "Rectangle",
  "Circle",
  "Triangle",
  "Polygon",
  "Ellipse",
  "Line",
];

const CanvasPage = () => {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false); // To track drawing state
  const lineRef = useRef(null); // To keep a reference to the current line being drawn

  useEffect(() => {
    canvasRef.current = new fabric.Canvas("canvas", {
      width: 800,
      height: 600,
      backgroundColor: "#fff",
    });

    return () => {
      canvasRef.current.dispose();
    };
  }, []);

  const addShape = (shape) => {
    canvasRef.current.isDrawingMode = false;
    canvasRef.current.selection = true;


    
    let obj;
    switch (shape) {
      case "Rectangle":
        obj = new fabric.Rect({
          left: 100,
          top: 100,
          fill: "blue",
          width: 150,
          height: 100,
        });
        break;
      case "Circle":
        obj = new fabric.Circle({
          left: 200,
          top: 200,
          fill: "red",
          radius: 50,
        });
        break;
      case "Triangle":
        obj = new fabric.Triangle({
          left: 300,
          top: 300,
          fill: "green",
          width: 100,
          height: 100,
        });
        break;
      case "Polygon":
        obj = new fabric.Polygon(
          [
            { x: 200, y: 10 },
            { x: 250, y: 50 },
            { x: 250, y: 100 },
            { x: 150, y: 100 },
            { x: 150, y: 50 },
          ],
          {
            left: 150,
            top: 150,
            fill: "purple",
          }
        );
        break;
      case "Ellipse":
        obj = new fabric.Ellipse({
          left: 400,
          top: 200,
          fill: "orange",
          rx: 75,
          ry: 50,
        });
        break;

      case "Line":
        canvasRef.current.isDrawingMode = false;
        canvasRef.current.selection = true;

        canvasRef.current.on("mouse:down", handleMouseDown);
        canvasRef.current.on("mouse:move", handleMouseMove);
        canvasRef.current.on("mouse:up", handleMouseUp);
        return;


      default:
        break;
    }

    if (obj && canvasRef.current) {
      canvasRef.current.add(obj);
    }
  };

  const handleMouseDown = (event) => {
    isDrawingRef.current = true;

    const pointer = canvasRef.current.getPointer(event.e);
    const points = [pointer.x, pointer.y, pointer.x, pointer.y];

    lineRef.current = new fabric.Line(points, {
      stroke: "black",
      strokeWidth: 2,
      selectable: true,
    });

    canvasRef.current.add(lineRef.current);
  };

  const handleMouseMove = (event) => {
    if (!isDrawingRef.current || !lineRef.current) return;

    const pointer = canvasRef.current.getPointer(event.e);
    lineRef.current.set({ x2: pointer.x, y2: pointer.y });

    canvasRef.current.renderAll();
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
    lineRef.current = null;

    canvasRef.current.selection = true;
    canvasRef.current.forEachObject((obj) => {
      obj.set("selectable", true);
    });

    canvasRef.current.off("mouse:move", handleMouseMove);
  };




  const handleColorChange = (color) => {
    if (canvasRef.current) {
      if (canvasRef.current.isDrawingMode) {
        canvasRef.current.freeDrawingBrush.color = color;
      } else {
        // Change the color of the selected object
        const activeObject = canvasRef.current.getActiveObject();
        if (activeObject) {
          if (activeObject.type === "line") {
            activeObject.set("stroke", color); // Change stroke color for lines
          } else if (activeObject.type === "group") {
            activeObject.getObjects().forEach((obj) => {
              if (obj.type === "line") {
                obj.set("stroke", color);
              } else {
                obj.set("fill", color);
              }
            });
          } else {
            activeObject.set("fill", color); // Change fill color for other shapes
          }
          canvasRef.current.renderAll();
        }
      }
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-4 mb-4">
        {shapes.map((shape) => (
          <button
            key={shape}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => addShape(shape)}
          >
            {shape}
          </button>
          ))}
          </div>
          <div className="flex space-x-4 mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Choose Fill Color:
          <input
            type="color"
            onChange={(e) => handleColorChange(e.target.value)}
            className="ml-2"
          />
        </label>
        {/* <label className="block text-gray-700 text-sm font-bold mb-2">
          Brush Size:
          <input
            type="number"
            min="1"
            max="100"
            defaultValue="5"
            onChange={(e) => handleBrushSizeChange(e.target.value)}
            className="ml-2"
          />
        </label> */}
      </div>
      <canvas id="canvas" className="border" />
    </div>
  );
};

export default CanvasPage;
// "use client";

// import React, { useEffect, useRef } from "react";
// import RectangleShape from "@/shapes/Rectangle";
// import CircleShape from "@/shapes/Circle";
// import TriangleShape from "@/shapes/Triangle";
// import PolygonShape from "@/shapes/Polygon";
// import EllipseShape from "@/shapes/Ellipse";
// import LineShape from "@/shapes/Line";
// import FreeDrawShape from "@/shapes/FreeDraw";
// import * as fabric from 'fabric'

// const CanvasPage = () => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     // Initialize the canvas on mount
//     canvasRef.current = new fabric.Canvas("canvas", {
//       width: 800,
//       height: 600,
//       backgroundColor: "#fff",
//     });

//     // Clean up canvas on unmount
//     return () => {
//       canvasRef.current.dispose();
//     };
//   }, []);

//   // Handle color change for drawing
//   const handleColorChange = (color) => {
//     const canvas = canvasRef.current;
//     if (canvas) {
//       if (canvas.isDrawingMode) {
//         canvas.freeDrawingBrush.color = color;
//       } else {
//         const activeObject = canvas.getActiveObject();
//         if (activeObject) {
//           if (activeObject.type === "line") {
//             activeObject.set("stroke", color);
//           } else if (activeObject.type === "group") {
//             activeObject.getObjects().forEach((obj) => {
//               if (obj.type === "line") {
//                 obj.set("stroke", color);
//               } else {
//                 obj.set("fill", color);
//               }
//             });
//           } else {
//             activeObject.set("fill", color);
//           }
//           canvas.renderAll();
//         }
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div className="flex space-x-4 mb-4">
//         <RectangleShape canvas={canvasRef.current} />
//         <CircleShape canvas={canvasRef.current} />
//         <TriangleShape canvas={canvasRef.current} />
//         <PolygonShape canvas={canvasRef.current} />
//         <EllipseShape canvas={canvasRef.current} />
//         <LineShape canvas={canvasRef.current} />
//         <FreeDrawShape canvas={canvasRef.current} />

//         <label className="block text-gray-700 text-sm font-bold mb-2">
//           Choose Fill Color:
//           <input
//             type="color"
//             onChange={(e) => handleColorChange(e.target.value)}
//             className="ml-2"
//           />
//         </label>
//       </div>
//       <canvas id="canvas" className="border" />
//     </div>
//   );
// };

// export default CanvasPage;
