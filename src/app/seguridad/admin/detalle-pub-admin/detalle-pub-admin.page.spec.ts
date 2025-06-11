import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallePubAdminPage } from './detalle-pub-admin.page';

describe('DetallePubAdminPage', () => {
  let component: DetallePubAdminPage;
  let fixture: ComponentFixture<DetallePubAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePubAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
