import { fabric } from 'fabric';

/**
 * Basic smart guides / snapping for fabric canvas
 */
export function initSmartGuides(canvas: fabric.Canvas) {
  canvas.on('object:moving', (e) => {
    const obj = e.target;
    if (!obj) return;
    
    const centerX = canvas.width! / 2;
    const centerY = canvas.height! / 2;
    const snapZone = 10;
    
    const objCenterX = obj.left! + (obj.width! * obj.scaleX!) / 2;
    const objCenterY = obj.top! + (obj.height! * obj.scaleY!) / 2;
    
    // Horizontal center snap
    if (Math.abs(objCenterX - centerX) < snapZone) {
      obj.set({ left: centerX - (obj.width! * obj.scaleX!) / 2 });
    }
    
    // Vertical center snap
    if (Math.abs(objCenterY - centerY) < snapZone) {
      obj.set({ top: centerY - (obj.height! * obj.scaleY!) / 2 });
    }
  });
}
