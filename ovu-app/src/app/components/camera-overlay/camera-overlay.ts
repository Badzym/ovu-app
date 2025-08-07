import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CameraService, OverlayImage } from '../../services/camera';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-camera-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
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

  updateOverlayOpacity(overlay: OverlayImage, value: any): void {
    const opacity = typeof value === 'number' ? value : value?.lower || 0.5;
    this.cameraService.updateOverlayImage(overlay.id, { opacity });
  }

  updateOverlayPosition(overlay: OverlayImage, x: any, y: any): void {
    const posX = typeof x === 'number' ? x : parseInt(x) || 0;
    const posY = typeof y === 'number' ? y : parseInt(y) || 0;
    this.cameraService.updateOverlayImage(overlay.id, { position: { x: posX, y: posY } });
  }

  updateOverlayScale(overlay: OverlayImage, value: any): void {
    const scale = typeof value === 'number' ? value : value?.lower || 1;
    this.cameraService.updateOverlayImage(overlay.id, { scale });
  }

  updateOverlayRotation(overlay: OverlayImage, value: any): void {
    const rotation = typeof value === 'number' ? value : value?.lower || 0;
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
