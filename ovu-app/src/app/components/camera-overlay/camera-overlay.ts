import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CameraService, OverlayImage } from '../../services/camera';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-camera-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './camera-overlay.html',
  styleUrl: './camera-overlay.scss'
})
export class CameraOverlayComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isCameraActive = false;
  overlayImages: OverlayImage[] = [];
  selectedOverlay: OverlayImage | null = null;
  isDrawingMode = false;

  private subscriptions: Subscription[] = [];

  constructor(private cameraService: CameraService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.cameraService.isCameraActive$.subscribe(active => {
        this.isCameraActive = active;
      }),
      this.cameraService.overlayImages$.subscribe(overlays => {
        this.overlayImages = overlays;
      })
    );
  }

  ngAfterViewInit(): void {
    if (this.videoElement) {
      this.cameraService.setVideoElement(this.videoElement.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.cameraService.stopCamera();
  }

  async startCamera(): Promise<void> {
    try {
      await this.cameraService.startCamera();
    } catch (error) {
      console.error('Failed to start camera:', error);
      alert('Failed to access camera. Please ensure camera permissions are granted.');
    }
  }

  stopCamera(): void {
    this.cameraService.stopCamera();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.cameraService.addOverlayImage(file);
    }
  }

  selectOverlay(overlay: OverlayImage): void {
    this.selectedOverlay = overlay;
  }

  removeOverlay(overlay: OverlayImage): void {
    this.cameraService.removeOverlayImage(overlay.id);
    if (this.selectedOverlay?.id === overlay.id) {
      this.selectedOverlay = null;
    }
  }

  updateOverlayOpacity(overlay: OverlayImage, opacity: number): void {
    this.cameraService.updateOverlayImage(overlay.id, { opacity });
  }

  updateOverlayPosition(overlay: OverlayImage, x: number, y: number): void {
    this.cameraService.updateOverlayImage(overlay.id, { position: { x, y } });
  }

  updateOverlayScale(overlay: OverlayImage, scale: number): void {
    this.cameraService.updateOverlayImage(overlay.id, { scale });
  }

  updateOverlayRotation(overlay: OverlayImage, rotation: number): void {
    this.cameraService.updateOverlayImage(overlay.id, { rotation });
  }

  toggleDrawingMode(): void {
    this.isDrawingMode = !this.isDrawingMode;
    if (this.isDrawingMode && this.canvasElement) {
      this.cameraService.startDrawing(this.canvasElement.nativeElement);
    }
  }

  clearDrawing(): void {
    this.cameraService.clearCanvas();
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
}
