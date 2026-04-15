import { fabric } from 'fabric';

export class CanvasHistory {
  private canvas: fabric.Canvas;
  private history: string[] = [];
  private historyIndex: number = -1;
  private isProcessing: boolean = false;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.init();
  }

  private init() {
    this.saveHistory();
    this.canvas.on('object:added', () => this.saveHistory());
    this.canvas.on('object:modified', () => this.saveHistory());
    this.canvas.on('object:removed', () => this.saveHistory());
  }

  private saveHistory() {
    if (this.isProcessing) return;
    try {
      const json = JSON.stringify(this.canvas.toJSON());
      this.historyIndex++;
      this.history = this.history.slice(0, this.historyIndex);
      this.history.push(json);
    } catch (e) {
      console.error(e);
    }
  }

  public undo(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.canUndo()) return resolve();
      this.isProcessing = true;
      this.historyIndex--;
      const state = this.history[this.historyIndex];
      this.canvas.loadFromJSON(state, () => {
        this.canvas.renderAll();
        this.isProcessing = false;
        resolve();
      });
    });
  }

  public redo(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.canRedo()) return resolve();
      this.isProcessing = true;
      this.historyIndex++;
      const state = this.history[this.historyIndex];
      this.canvas.loadFromJSON(state, () => {
        this.canvas.renderAll();
        this.isProcessing = false;
        resolve();
      });
    });
  }

  public canUndo(): boolean {
    return this.historyIndex > 0;
  }

  public canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  public dispose() {
    this.canvas.off('object:added');
    this.canvas.off('object:modified');
    this.canvas.off('object:removed');
  }
}
