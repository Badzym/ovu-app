import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CameraOverlayComponent } from './components/camera-overlay/camera-overlay.component';
import { addIcons } from 'ionicons';
import { 
  addOutline, 
  cameraOutline, 
  camera, 
  stopOutline, 
  stop, 
  pencilOutline, 
  pencil, 
  trashOutline, 
  closeOutline,
  locateOutline,
  refreshOutline,
  imageOutline
} from 'ionicons/icons';

// Register the icons
addIcons({
  'add': addOutline,
  'camera': cameraOutline,
  'camera-filled': camera,
  'stop': stopOutline,
  'stop-filled': stop,
  'pencil': pencilOutline,
  'pencil-filled': pencil,
  'pencil-outline': pencilOutline,
  'trash': trashOutline,
  'close': closeOutline,
  'locate': locateOutline,
  'refresh': refreshOutline,
  'image': imageOutline
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, CameraOverlayComponent],
})
export class AppComponent {
  constructor() {}
}
