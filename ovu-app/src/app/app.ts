import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraOverlayComponent } from './components/camera-overlay/camera-overlay';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CameraOverlayComponent, IonicModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'ovu-app';
}
