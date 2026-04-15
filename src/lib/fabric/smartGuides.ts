import { fabric } from 'fabric';
import { useAppStore } from '@/lib/store';

/**
 * Basic smart guides / snapping for fabric canvas
 */
export function initSmartGuides(canvas: fabric.Canvas) {
  // Create guide lines
  const lineProps = {
    stroke: '#FF0000',
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.8,
    excludeFromExport: true, // Crucial so they don't print!
  };

  const vLine = new fabric.Line([0, 0, 0, canvas.height!], { ...lineProps, visible: false });
  const hLine = new fabric.Line([0, 0, canvas.width!, 0], { ...lineProps, visible: false });

  canvas.add(vLine, hLine);

  canvas.on('object:moving', (e) => {
    if (!useAppStore.getState().snapToGrid) {
       vLine.set({ visible: false });
       hLine.set({ visible: false });
       return;
    }
    
    const obj = e.target;
    if (!obj) return;
    
    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;
    const snapZone = 10;
    
    let snappedX = false;
    let snappedY = false;

    const objWidth = obj.width! * (obj.scaleX || 1);
    const objHeight = obj.height! * (obj.scaleY || 1);
    
    const objCenterX = obj.left! + objWidth / 2;
    const objCenterY = obj.top! + objHeight / 2;
    
    // Horizontal center snap (locking the X coordinate)
    if (Math.abs(objCenterX - centerX) < snapZone) {
      obj.set({ left: centerX - objWidth / 2 });
      vLine.set({ x1: centerX, y1: 0, x2: centerX, y2: canvas.height!, visible: true });
      vLine.bringToFront();
      snappedX = true;
    } else {
      vLine.set({ visible: false });
    }
    
    // Vertical center snap (locking the Y coordinate)
    if (Math.abs(objCenterY - centerY) < snapZone) {
      obj.set({ top: centerY - objHeight / 2 });
      hLine.set({ x1: 0, y1: centerY, x2: canvas.width!, y2: centerY, visible: true });
      hLine.bringToFront();
      snappedY = true;
    } else {
      hLine.set({ visible: false });
    }
  });

  // Hide guides when mouse released
  canvas.on('mouse:up', () => {
    vLine.set({ visible: false });
    hLine.set({ visible: false });
    canvas.requestRenderAll();
  });
}
