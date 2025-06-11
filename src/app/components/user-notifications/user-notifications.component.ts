import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-notifications',
  template: `
    <ion-card *ngIf="notificaciones && notificaciones.length > 0" class="notificaciones-card">
      <ion-card-header>
        <ion-card-title>Notificaciones</ion-card-title>
        <ion-icon name="close-outline" (click)="cerrarTodas()" class="close-icon"></ion-icon>
      </ion-card-header>
      <ion-card-content>
        <ion-item *ngFor="let notificacion of notificaciones">
          {{ notificacion.mensaje }}
          <ion-icon name="close-circle" slot="end" (click)="cerrarUna(notificacion.id)"></ion-icon>
        </ion-item>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`
    .notificaciones-card {
      position: fixed;
      top: 70px;
      right: 20px;
      width: 300px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 9999;
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      background: white;
      border-radius: 8px;
    }
    .close-icon {
      float: right;
      cursor: pointer;
      font-size: 1.4rem;
      color: #999;
    }
    ion-icon[slot="end"] {
      cursor: pointer;
      color: #999;
      font-size: 1.2rem;
    }
  `]
})
export class UserNotificationsComponent {
  @Input() notificaciones: any[] = [];
  @Output() cerrar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<string>(); 

  cerrarUna(id: string) {
    this.eliminar.emit(id);
  }

  cerrarTodas() {
    this.cerrar.emit();
  }
}
