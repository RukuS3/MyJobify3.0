import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AperturaPage } from './apertura.page';

describe('AperturaPage', () => {
  let component: AperturaPage;
  let fixture: ComponentFixture<AperturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AperturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
