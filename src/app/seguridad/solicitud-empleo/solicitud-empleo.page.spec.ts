import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudEmpleoPage } from './solicitud-empleo.page';

describe('SolicitudEmpleoPage', () => {
  let component: SolicitudEmpleoPage;
  let fixture: ComponentFixture<SolicitudEmpleoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudEmpleoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
