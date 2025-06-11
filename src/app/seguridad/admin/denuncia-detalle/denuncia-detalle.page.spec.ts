import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DenunciaDetallePage } from './denuncia-detalle.page';

describe('DenunciaDetallePage', () => {
  let component: DenunciaDetallePage;
  let fixture: ComponentFixture<DenunciaDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DenunciaDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
