import { Component, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-camera-overlay',
  templateUrl: './camera-overlay.component.html',
  styleUrls: ['./camera-overlay.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CameraOverlayComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedImage: string | null = null;
  imageOpacity: number = 0.5;
  imagePosition = { x: 0, y: 0 };
  imageRotation: number = 0;
  imageScale: number = 1;
  isDragging = false;
  dragStart = { x: 0, y: 0 };
  
  // Camera properties
  isCameraActive = false;
  cameraStream: MediaStream | null = null;

  // Back button handling
  private backButtonPressed = false;
  private backButtonTimeout: any = null;

  ngAfterViewInit() {
    // Initialize video element immediately when view is ready
    this.initializeVideoElement();
    
    // Also try again after a short delay to ensure DOM is fully ready
    setTimeout(() => {
      this.initializeVideoElement();
    }, 100);

    // Request full screen on mobile devices
    this.requestFullScreen();

    // Add hardware back button listener for mobile
    this.setupBackButtonHandler();
  }

  private setupBackButtonHandler() {
    // For mobile devices, listen for hardware back button
    if (this.isMobileDevice()) {
      // Add event listener for hardware back button
      document.addEventListener('backbutton', (event: any) => {
        event.preventDefault();
        this.handleBackButton();
      }, false);

      // Also listen for browser back button
      window.addEventListener('popstate', (event: any) => {
        event.preventDefault();
        this.handleBackButton();
      });

      // Prevent default back behavior
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', (event: any) => {
        event.preventDefault();
        this.handleBackButton();
      });
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: any) {
    this.stopCamera();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.handleBackButton();
  }

  private handleBackButton() {
    if (!this.backButtonPressed) {
      // First back press - show popup
      this.backButtonPressed = true;
      this.showExitPopup();
      
      // Reset after 2 seconds
      this.backButtonTimeout = setTimeout(() => {
        this.backButtonPressed = false;
      }, 2000);
    } else {
      // Second back press - exit app
      this.exitApp();
    }
  }

  private showExitPopup() {
    // Show a simple notification instead of confirm dialog
    this.showNotification('Press back again to exit the app');
  }

  private showNotification(message: string) {
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      max-width: 80%;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 2000);
  }

  private exitApp() {
    // Stop camera before exiting
    this.stopCamera();
    
    // Try to close the app
    if (window.navigator && (window.navigator as any).app) {
      // Cordova/PhoneGap
      (window.navigator as any).app.exitApp();
    } else if ((window as any).close) {
      // Browser - try to close window
      (window as any).close();
    } else {
      // Fallback - go to home page or show message
      alert('Please close the app manually');
    }
  }

  private requestFullScreen() {
    // Check if we're on a mobile device
    if (this.isMobileDevice()) {
      // Try to request full screen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err: any) => {
          console.log('Full screen request failed:', err);
        });
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        (document.documentElement as any).webkitRequestFullscreen().catch((err: any) => {
          console.log('Full screen request failed:', err);
        });
      } else if ((document.documentElement as any).mozRequestFullScreen) {
        (document.documentElement as any).mozRequestFullScreen().catch((err: any) => {
          console.log('Full screen request failed:', err);
        });
      } else if ((document.documentElement as any).msRequestFullscreen) {
        (document.documentElement as any).msRequestFullscreen().catch((err: any) => {
          console.log('Full screen request failed:', err);
        });
      }
    }
  }

  private isAndroidDevice(): boolean {
    return /Android/i.test(navigator.userAgent);
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  private initializeVideoElement() {
    const videoElement = document.querySelector('video') as HTMLVideoElement;
    if (videoElement) {
      videoElement.addEventListener('loadedmetadata', () => {
        console.log('Video metadata loaded');
      });
      videoElement.addEventListener('error', (e) => {
        console.error('Video error:', e);
      });
      console.log('Video element found and initialized');
    } else {
      console.log('Video element not available yet');
    }
  }

  private getVideoElement(): HTMLVideoElement | null {
    return document.querySelector('video') as HTMLVideoElement;
  }

  async startCamera(): Promise<void> {
    try {
      if (this.isCameraActive) {
        this.stopCamera();
        return;
      }

      console.log('Starting camera...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      // Request camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        audio: false // We don't need audio for this app
      });

      console.log('Camera stream obtained:', stream);
      
      this.cameraStream = stream;
      this.isCameraActive = true;
      
      // Wait for the next tick to ensure video element is ready
      setTimeout(async () => {
        const video = this.getVideoElement();
        if (video) {
          console.log('Video element found:', video);
          
          // Set the video source
          video.srcObject = stream;
          
          // Set video properties
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;
          
          try {
            await video.play();
            console.log('Video started playing successfully');
          } catch (playError) {
            console.error('Failed to play video:', playError);
            // Try to play without user interaction (for mobile)
            video.play().catch(e => {
              console.error('Video play failed:', e);
              alert('Camera started but video playback failed. Please try again.');
            });
          }
        } else {
          console.error('Video element not found - checking again...');
          // Try again after a longer delay
          setTimeout(async () => {
            const video = this.getVideoElement();
            if (video) {
              console.log('Video element found on retry:', video);
              
              video.srcObject = stream;
              video.autoplay = true;
              video.playsInline = true;
              video.muted = true;
              
              try {
                await video.play();
                console.log('Video started playing successfully on retry');
              } catch (playError) {
                console.error('Failed to play video on retry:', playError);
              }
            } else {
              console.error('Video element still not found after retry');
              alert('Camera started but video element not found. Please refresh the page.');
            }
          }, 500);
        }
      }, 100);
      
      console.log('Camera started successfully');
    } catch (error) {
      console.error('Failed to start camera:', error);
      
      let errorMessage = 'Failed to access camera. ';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please grant camera permissions in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Camera is not supported on this device.';
        } else {
          errorMessage += error.message;
        }
      }
      
      alert(errorMessage);
    }
  }

  stopCamera(): void {
    console.log('Stopping camera...');
    
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped:', track.kind);
      });
      this.cameraStream = null;
    }
    
    const video = this.getVideoElement();
    if (video) {
      video.srcObject = null;
    }
    
    this.isCameraActive = false;
    console.log('Camera stopped');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      console.log('Image selected:', file.name);
      
      // Create a FileReader to read the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        // Reset position and rotation for new image
        this.imagePosition = { x: 0, y: 0 };
        this.imageRotation = 0;
        this.imageScale = 1;
        console.log('Image loaded successfully');
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  updateOpacity(event: any): void {
    this.imageOpacity = event.target.value;
  }

  updateRotation(event: any): void {
    this.imageRotation = event.target.value;
  }

  updateScale(event: any): void {
    this.imageScale = event.target.value;
  }

  // Touch/Mouse events for moving image
  onTouchStart(event: TouchEvent): void {
    // Single touch - drag only
    this.isDragging = true;
    const touch = event.touches[0];
    this.dragStart = {
      x: touch.clientX - this.imagePosition.x,
      y: touch.clientY - this.imagePosition.y
    };
    event.preventDefault();
  }

  onTouchMove(event: TouchEvent): void {
    if (this.isDragging) {
      // Single touch drag
      const touch = event.touches[0];
      this.imagePosition = {
        x: touch.clientX - this.dragStart.x,
        y: touch.clientY - this.dragStart.y
      };
    }
    event.preventDefault();
  }

  onTouchEnd(event: TouchEvent): void {
    this.isDragging = false;
  }

  // Mouse events for desktop
  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.dragStart = {
      x: event.clientX - this.imagePosition.x,
      y: event.clientY - this.imagePosition.y
    };
    event.preventDefault();
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      this.imagePosition = {
        x: event.clientX - this.dragStart.x,
        y: event.clientY - this.dragStart.y
      };
      event.preventDefault();
    }
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  clearImage(): void {
    this.selectedImage = null;
    this.imageOpacity = 0.5;
    this.imagePosition = { x: 0, y: 0 };
    this.imageRotation = 0;
    this.imageScale = 1;
  }

  resetImage(): void {
    this.imagePosition = { x: 0, y: 0 };
    this.imageRotation = 0;
    this.imageScale = 1;
    this.imageOpacity = 0.5;
  }

  // Clean up camera when component is destroyed
  ngOnDestroy(): void {
    this.stopCamera();
    if (this.backButtonTimeout) {
      clearTimeout(this.backButtonTimeout);
    }
  }

  // Debug method to test camera permissions
  async testCameraPermissions(): Promise<void> {
    try {
      console.log('Testing camera permissions...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('getUserMedia is not supported in this browser');
        return;
      }

      // List available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log('Available video devices:', videoDevices);
      alert(`Found ${videoDevices.length} camera(s): ${videoDevices.map(d => d.label || 'Unknown').join(', ')}`);

      // Test getting a stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log('Test stream obtained:', stream);
      alert('Camera permissions granted! Stream has ' + stream.getTracks().length + ' tracks');
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
      
    } catch (error) {
      console.error('Camera test failed:', error);
      alert('Camera test failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}
