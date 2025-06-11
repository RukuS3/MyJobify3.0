import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacidadTerminosPage } from './privacidad-terminos.page';

describe('PrivacidadTerminosPage', () => {
  let component: PrivacidadTerminosPage;
  let fixture: ComponentFixture<PrivacidadTerminosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacidadTerminosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
