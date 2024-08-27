// "use client"

// import fabric from "fabric";
// import { v4 as uuid4 } from "uuid";
// // import { defaultNavElement } from "@/constants";
// // import { createSpecificShape } from "./shapes";

// export const defaultNavElement = {
//   icon: "/assets/select.svg",
//   name: "Select",
//   value: "select",
// };

// // initialize fabric canvas
// export const initializeFabric = ({ fabricRef, canvasRef }) => {
//   // get canvas element
//   const canvasElement = document.getElementById("canvas");

//   // create fabric canvas
//   const canvas = new fabric.Canvas(canvasRef.current, {
//     width: canvasElement?.clientWidth,
//     height: canvasElement?.clientHeight,
//   });

//   // set canvas reference to fabricRef so we can use it later anywhere outside canvas listener
//   fabricRef.current = canvas;

//   return canvas;
// };

// // instantiate creation of custom fabric object/shape and add it to canvas
// export const handleCanvasMouseDown = ({
//   options,
//   canvas,
//   selectedShapeRef,
//   isDrawing,
//   shapeRef,
// }) => {
//   // get pointer coordinates
//   const pointer = canvas.getPointer(options.e);

//   /**
//    * get target object i.e., the object that is clicked
//    * findtarget() returns the object that is clicked
//    *
//    * findTarget: http://fabricjs.com/docs/fabric.Canvas.html#findTarget
//    */
//   const target = canvas.findTarget(options.e, false);

//   // set canvas drawing mode to false
//   canvas.isDrawingMode = false;

//   // if selected shape is freeform, set drawing mode to true and return
//   if (selectedShapeRef.current === "freeform") {
//     isDrawing.current = true;
//     canvas.isDrawingMode = true;
//     canvas.freeDrawingBrush.width = 5;
//     return;
//   }

//   canvas.isDrawingMode = false;

//   // if target is the selected shape or active selection, set isDrawing to false
//   if (
//     target &&
//     (target.type === selectedShapeRef.current ||
//       target.type === "activeSelection")
//   ) {
//     isDrawing.current = false;

//     // set active object to target
//     canvas.setActiveObject(target);

//     /**
//      * setCoords() is used to update the controls of the object
//      * setCoords: http://fabricjs.com/docs/fabric.Object.html#setCoords
//      */
//     target.setCoords();
//   } else {
//     isDrawing.current = true;

//     // create custom fabric object/shape and set it to shapeRef
//     shapeRef.current = createSpecificShape(selectedShapeRef.current, pointer);

//     // if shapeRef is not null, add it to canvas
//     if (shapeRef.current) {
//       // add: http://fabricjs.com/docs/fabric.Canvas.html#add
//       canvas.add(shapeRef.current);
//     }
//   }
// };

// // handle mouse move event on canvas to draw shapes with different dimensions
// export const handleCanvaseMouseMove = ({
//   options,
//   canvas,
//   isDrawing,
//   selectedShapeRef,
//   shapeRef,
//   syncShapeInStorage,
// }) => {
//   // if selected shape is freeform, return
//   if (!isDrawing.current) return;
//   if (selectedShapeRef.current === "freeform") return;

//   canvas.isDrawingMode = false;

//   // get pointer coordinates
//   const pointer = canvas.getPointer(options.e);

//   // depending on the selected shape, set the dimensions of the shape stored in shapeRef in previous step of handelCanvasMouseDown
//   // calculate shape dimensions based on pointer coordinates
//   switch (selectedShapeRef?.current) {
//     case "rectangle":
//       shapeRef.current?.set({
//         width: pointer.x - (shapeRef.current?.left || 0),
//         height: pointer.y - (shapeRef.current?.top || 0),
//       });
//       break;

//     case "circle":
//       shapeRef.current.set({
//         radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
//       });
//       break;

//     case "triangle":
//       shapeRef.current?.set({
//         width: pointer.x - (shapeRef.current?.left || 0),
//         height: pointer.y - (shapeRef.current?.top || 0),
//       });
//       break;

//     case "line":
//       shapeRef.current?.set({
//         x2: pointer.x,
//         y2: pointer.y,
//       });
//       break;

//     case "image":
//       shapeRef.current?.set({
//         width: pointer.x - (shapeRef.current?.left || 0),
//         height: pointer.y - (shapeRef.current?.top || 0),
//       });

//     default:
//       break;
//   }

//   // render objects on canvas
//   // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
//   canvas.renderAll();

//   // sync shape in storage
//   if (shapeRef.current?.objectId) {
//     syncShapeInStorage(shapeRef.current);
//   }
// };

// // handle mouse up event on canvas to stop drawing shapes
// export const handleCanvasMouseUp = ({
//   canvas,
//   isDrawing,
//   shapeRef,
//   activeObjectRef,
//   selectedShapeRef,
//   syncShapeInStorage,
//   setActiveElement,
// }) => {
//   isDrawing.current = false;
//   if (selectedShapeRef.current === "freeform") return;

//   // sync shape in storage as drawing is stopped
//   syncShapeInStorage(shapeRef.current);

//   // set everything to null
//   shapeRef.current = null;
//   activeObjectRef.current = null;
//   selectedShapeRef.current = null;

//   // if canvas is not in drawing mode, set active element to default nav element after 700ms
//   if (!canvas.isDrawingMode) {
//     setTimeout(() => {
//       setActiveElement(defaultNavElement);
//     }, 700);
//   }
// };

// // update shape in storage when object is modified
// export const handleCanvasObjectModified = ({ options, syncShapeInStorage }) => {
//   const target = options.target;
//   if (!target) return;

//   if (target?.type == "activeSelection") {
//     // fix this
//   } else {
//     syncShapeInStorage(target);
//   }
// };

// // update shape in storage when path is created when in freeform mode
// export const handlePathCreated = ({ options, syncShapeInStorage }) => {
//   // get path object
//   const path = options.path;
//   if (!path) return;

//   // set unique id to path object
//   path.set({
//     objectId: uuid4(),
//   });

//   // sync shape in storage
//   syncShapeInStorage(path);
// };

// // check how object is moving on canvas and restrict it to canvas boundaries
// export const handleCanvasObjectMoving = ({ options }) => {
//   // get target object which is moving
//   const target = options.target;

//   // target.canvas is the canvas on which the object is moving
//   const canvas = target.canvas;

//   // set coordinates of target object
//   target.setCoords();

//   // restrict object to canvas boundaries (horizontal)
//   if (target && target.left) {
//     target.left = Math.max(
//       0,
//       Math.min(
//         target.left,
//         (canvas.width || 0) - (target.getScaledWidth() || target.width || 0)
//       )
//     );
//   }

//   // restrict object to canvas boundaries (vertical)
//   if (target && target.top) {
//     target.top = Math.max(
//       0,
//       Math.min(
//         target.top,
//         (canvas.height || 0) - (target.getScaledHeight() || target.height || 0)
//       )
//     );
//   }
// };

// // set element attributes when element is selected
// export const handleCanvasSelectionCreated = ({
//   options,
//   isEditingRef,
//   setElementAttributes,
// }) => {
//   // if user is editing manually, return
//   if (isEditingRef.current) return;

//   // if no element is selected, return
//   if (!options?.selected) return;

//   // get the selected element
//   const selectedElement = options?.selected[0];

//   // if only one element is selected, set element attributes
//   if (selectedElement && options.selected.length === 1) {
//     // calculate scaled dimensions of the object
//     const scaledWidth = selectedElement?.scaleX
//       ? selectedElement?.width * selectedElement?.scaleX
//       : selectedElement?.width;

//     const scaledHeight = selectedElement?.scaleY
//       ? selectedElement?.height * selectedElement?.scaleY
//       : selectedElement?.height;

//     setElementAttributes({
//       width: scaledWidth?.toFixed(0).toString() || "",
//       height: scaledHeight?.toFixed(0).toString() || "",
//       fill: selectedElement?.fill?.toString() || "",
//       stroke: selectedElement?.stroke || "",
//       // @ts-ignore
//       fontSize: selectedElement?.fontSize || "",
//       // @ts-ignore
//       fontFamily: selectedElement?.fontFamily || "",
//       // @ts-ignore
//       fontWeight: selectedElement?.fontWeight || "",
//     });
//   }
// };

// // update element attributes when element is scaled
// export const handleCanvasObjectScaling = ({
//   options,
//   setElementAttributes,
// }) => {
//   const selectedElement = options.target;

//   // calculate scaled dimensions of the object
//   const scaledWidth = selectedElement?.scaleX
//     ? selectedElement?.width * selectedElement?.scaleX
//     : selectedElement?.width;

//   const scaledHeight = selectedElement?.scaleY
//     ? selectedElement?.height * selectedElement?.scaleY
//     : selectedElement?.height;

//   // set element attributes
//   setElementAttributes({
//     width: scaledWidth?.toFixed(0).toString() || "",
//     height: scaledHeight?.toFixed(0).toString() || "",
//   });
// };

// // render all objects on canvas
// export const renderCanvas = ({ canvasRef, fabricRef, objects }) => {
//   const canvas = fabricRef.current;

//   // clear canvas
//   canvas?.clear();

//   // if no objects, return
//   if (!objects || objects.length === 0) return;

//   // add objects to canvas
//   objects.forEach((object) => {
//     const fabricObject = object.type
//       ? new fabric[object.type](object)
//       : fabric.util.enlivenObjects([object], (enlivenedObjects) => {
//           return enlivenedObjects[0];
//         });

//     if (fabricObject) {
//       canvas?.add(fabricObject);
//     }
//   });

//   // render all objects on canvas
//   canvas?.renderAll();
// };
