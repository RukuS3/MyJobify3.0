import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserNotificationsComponent } from './user-notifications.component';

@NgModule({
  declarations: [UserNotificationsComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [UserNotificationsComponent]
})
export class UserNotificationsModule {}