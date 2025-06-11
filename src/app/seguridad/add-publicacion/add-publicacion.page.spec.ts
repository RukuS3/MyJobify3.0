import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPublicacionPage } from './add-publicacion.page';

describe('AddPublicacionPage', () => {
  let component: AddPublicacionPage;
  let fixture: ComponentFixture<AddPublicacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPublicacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
