import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';

// Importar módulo de notificaciones
import { UserNotificationsModule } from './components/user-notifications/user-notifications.module';

// ======== Firebase ===========
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule, PERSISTENCE } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment.prod';

// ======== Locale Chile ===========
import { registerLocaleData } from '@angular/common';
import localeCl from '@angular/common/locales/es-CL';

registerLocaleData(localeCl);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    AngularFireAuthModule,
    IonicStorageModule.forRoot(),
    UserNotificationsModule 
  ],
  providers: [
    { provide: PERSISTENCE, useValue: 'local' },
    { provide: LOCALE_ID, useValue: 'es-CL' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
