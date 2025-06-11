import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SavePublicacionPage } from './save-publicacion.page';

describe('SavePublicacionPage', () => {
  let component: SavePublicacionPage;
  let fixture: ComponentFixture<SavePublicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SavePublicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
