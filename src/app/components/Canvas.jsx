// "use client"
// import { useEffect, useRef, useState } from 'react';
// import * as fabric from 'fabric';

// const Canvas = () => {
//   const canvasRef = useRef(null);
//   const [canvas, setCanvas] = useState(null);
//   const [mode, setMode] = useState('shapeless'); // Default mode: shapeless

//   useEffect(() => {
//     const canvasObj = new fabric.Canvas(canvasRef.current);
//     setCanvas(canvasObj);

//     return () => {
//       canvasObj.dispose();
//     };
//   }, []);

//   useEffect(() => {
//     if (!canvas) return;

//     canvas.isDrawingMode = mode === 'shapeless';

//     if (mode !== 'shapeless') {
//       canvas.on('mouse:down', handleDrawShape);
//     } else {
//       canvas.off('mouse:down', handleDrawShape);
//     }

//     return () => {
//       canvas.off('mouse:down', handleDrawShape);
//     };
//   }, [canvas, mode]);

//   const handleDrawShape = (event) => {
//     const pointer = canvas.getPointer(event.e);
//     const activeObject = canvas.getActiveObject();

//     // Check if click is on an existing shape
//     if (activeObject) {
//       return; // Exit if there's an active object
//     }

//     let shape;

//     switch (mode) {
//       case 'circle':
//         shape = new fabric.Circle({
//           left: pointer.x,
//           top: pointer.y,
//           radius: 50,
//           fill: 'blue',
//         });
//         break;
//       case 'square':
//         shape = new fabric.Rect({
//           left: pointer.x,
//           top: pointer.y,
//           width: 100,
//           height: 100,
//           fill: 'green',
//         });
//         break;
//       case 'rectangle':
//         shape = new fabric.Rect({
//           left: pointer.x,
//           top: pointer.y,
//           width: 150,
//           height: 100,
//           fill: 'red',
//         });
//         break;
//       case 'triangle':
//         shape = new fabric.Triangle({
//           left: pointer.x,
//           top: pointer.y,
//           width: 100,
//           height: 100,
//           fill: 'yellow',
//         });
//         break;
//       default:
//         break;
//     }

//     if (shape) {
//       canvas.add(shape);
//     }
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: '10px' }}>
//         <button onClick={() => setMode('circle')}>Circle</button>
//         <button onClick={() => setMode('square')}>Square</button>
//         <button onClick={() => setMode('rectangle')}>Rectangle</button>
//         <button onClick={() => setMode('triangle')}>Triangle</button>
//         <button onClick={() => setMode('shapeless')}>Shapeless</button>
//       </div>
//       <canvas ref={canvasRef} width={800} height={600} style={{ border: '5px solid red' }}  />
//     </div>
//   );
// };

// export default Canvas;
