import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPublicacionPage } from './edit-publicacion.page';

describe('EditPublicacionPage', () => {
  let component: EditPublicacionPage;
  let fixture: ComponentFixture<EditPublicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPublicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
