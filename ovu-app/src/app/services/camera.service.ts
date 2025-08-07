import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OverlayImage {
  id: string;
  src: string;
  opacity: number;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private stream: MediaStream | null = null;
  private isCameraActive = new BehaviorSubject<boolean>(false);
  private overlayImages = new BehaviorSubject<OverlayImage[]>([]);

  constructor() {}

  // Camera control methods
  async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (this.videoElement) {
        this.videoElement.srcObject = this.stream;
        this.isCameraActive.next(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw error;
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
    this.isCameraActive.next(false);
  }

  // Overlay management
  addOverlayImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const overlay: OverlayImage = {
        id: Date.now().toString(),
        src: e.target?.result as string,
        opacity: 0.5,
        position: { x: 50, y: 50 },
        scale: 1,
        rotation: 0
      };
      
      const currentOverlays = this.overlayImages.value;
      this.overlayImages.next([...currentOverlays, overlay]);
    };
    reader.readAsDataURL(file);
  }

  removeOverlayImage(id: string): void {
    const currentOverlays = this.overlayImages.value;
    this.overlayImages.next(currentOverlays.filter(overlay => overlay.id !== id));
  }

  updateOverlayImage(id: string, updates: Partial<OverlayImage>): void {
    const currentOverlays = this.overlayImages.value;
    const updatedOverlays = currentOverlays.map(overlay => 
      overlay.id === id ? { ...overlay, ...updates } : overlay
    );
    this.overlayImages.next(updatedOverlays);
  }

  // Drawing functionality
  startDrawing(canvas: HTMLCanvasElement): void {
    this.canvasElement = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDraw = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastX = clientX - rect.left;
      lastY = clientY - rect.top;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const currentX = clientX - rect.left;
      const currentY = clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();

      lastX = currentX;
      lastY = currentY;
    };

    const stopDraw = () => {
      isDrawing = false;
    };

    // Mouse events
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseout', stopDraw);

    // Touch events for mobile
    canvas.addEventListener('touchstart', startDraw);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDraw);
  }

  clearCanvas(): void {
    if (this.canvasElement) {
      const ctx = this.canvasElement.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      }
    }
  }

  // Getters
  get isCameraActive$(): Observable<boolean> {
    return this.isCameraActive.asObservable();
  }

  get overlayImages$(): Observable<OverlayImage[]> {
    return this.overlayImages.asObservable();
  }

  setVideoElement(video: HTMLVideoElement): void {
    this.videoElement = video;
  }
}
