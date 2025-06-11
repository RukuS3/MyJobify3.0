import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerPerfilDetallePage } from './ver-perfil-detalle.page';

describe('VerPerfilDetallePage', () => {
  let component: VerPerfilDetallePage;
  let fixture: ComponentFixture<VerPerfilDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPerfilDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
