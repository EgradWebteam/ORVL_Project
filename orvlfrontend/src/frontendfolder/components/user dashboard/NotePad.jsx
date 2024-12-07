import React, { useRef, useEffect, useState } from 'react';
import '../user dashboard/NotePadcalbookmark.css';
import { FaEraser } from "react-icons/fa6";
import Draggable from "react-draggable";

const NotePad = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [notepad, setNotepad] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [isEraser, setIsEraser] = useState(false);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    setStartPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    clearTimeout(longPressTimer);
  };

  const opennotepad = () => {
    setNotepad(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();

    if (!isEraser) {
      setDrawings((prevDrawings) => [
        ...prevDrawings,
        ctx.getImageData(0, 0, canvas.width, canvas.height),
      ]);
    }

    setStartPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    draw(e);
  };

  const handleMouseDown = (e) => {
    const timer = setTimeout(() => startDrawing(e), 300);
    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    endDrawing();
    clearTimeout(longPressTimer);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawings([]); // Clear the drawings array
  };

  const cancel = () => {
    setNotepad(false);
    setDrawings([]); // Clear drawings on cancel
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const dataUrl = tempCanvas.toDataURL();
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'notepad-drawing.png';
    link.click();
  };

  const usePen = () => {
    setIsEraser(false);
    setColor('#000000'); // Reset color when switching to pen
  };

  const useEraser = () => {
    setIsEraser(true);
  };

  const undoLastDraw = () => {
    if (drawings.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < drawings.length - 1; i++) {
        ctx.putImageData(drawings[i], 0, 0);
      }

      setDrawings(drawings.slice(0, -1));
    }
  };

  useEffect(() => {
    if (notepad && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth * 0.838;
      canvas.height = window.innerHeight * 0.9;
    }
  }, [notepad]);

  return (
    <div className='NOTEPAD'>
      <h1 onClick={opennotepad} className='NOTEPADH1'>NotePad</h1>
      {notepad && (
        <Draggable handle=".drag-handle">
          <div className='padfornote'> 
            <div className='notepadbtns drag-handle'>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <button onClick={usePen} className='notepadbtn'>Pen</button>
              <button onClick={useEraser} className='notepadbtn earser'>Eraser</button>
              <button onClick={clearCanvas} className='notepadbtn'>Clear</button>
              <button onClick={saveCanvas} className='notepadbtn'>Save</button>
              <button onClick={undoLastDraw} className='notepadbtn'>Undo</button>
              <button onClick={cancel} className='notepadbtn'>Cancel</button>
            </div>
            <canvas
              className='canvasnotpad'
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={endDrawing}
              onMouseMove={handleMouseMove}
              style={{ border: '1px solid #000', cursor: 'crosshair' }}
            />
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default NotePad;
