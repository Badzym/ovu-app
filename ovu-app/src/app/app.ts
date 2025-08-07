import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraOverlayComponent } from './components/camera-overlay/camera-overlay';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CameraOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'ovu-app';
}
