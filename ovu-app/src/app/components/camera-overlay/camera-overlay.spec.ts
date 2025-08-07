import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraOverlay } from './camera-overlay';

describe('CameraOverlay', () => {
  let component: CameraOverlay;
  let fixture: ComponentFixture<CameraOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
