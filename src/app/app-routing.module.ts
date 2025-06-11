import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',  
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./seguridad/auth/auth.module').then(m => m.AuthPageModule),
  },
  {
    path: 'inicio',
    loadChildren: () => import('./seguridad/inicio/inicio.module').then(m => m.InicioPageModule),
    canActivate: [AuthGuard] // 👈 protegida
  },
  {
    path: 'registro',
    loadChildren: () => import('./seguridad/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'trabajos/detalle-publicacion/:id',
    loadChildren: () => import('./seguridad/trabajos/detalle-publicacion/detalle-publicacion.module').then(m => m.DetallePublicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-publicacion',
    loadChildren: () => import('./seguridad/trabajos/detalle-publicacion/detalle-publicacion.module').then(m => m.DetallePublicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'miperfil',
    loadChildren: () => import('./seguridad/miperfil/miperfil.module').then(m => m.MiperfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'informacion',
    loadChildren: () => import('./seguridad/informacion/informacion.module').then(m => m.InformacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'crear-publicacion',
    loadChildren: () => import('./seguridad/crear-publicacion/crear-publicacion.module').then(m => m.CrearPublicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-publicacion',
    loadChildren: () => import('./seguridad/add-publicacion/add-publicacion.module').then(m => m.AddPublicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'contactanos',
    loadChildren: () => import('./seguridad/contacto/contactanos/contactanos.module').then(m => m.ContactanosPageModule)
  },
  {
    path: 'terminos-condiciones',
    loadChildren: () => import('./seguridad/contacto/terminos-condiciones/terminos-condiciones.module').then(m => m.TerminosCondicionesPageModule)
  },
  {
    path: 'privacidad-terminos',
    loadChildren: () => import('./seguridad/contacto/privacidad-terminos/privacidad-terminos.module').then(m => m.PrivacidadTerminosPageModule)
  },
  {
    path: 'quienes-somos',
    loadChildren: () => import('./seguridad/contacto/quienes-somos/quienes-somos.module').then(m => m.QuienesSomosPageModule)
  },
  {
    path: 'edit-publicacion/:id',
    loadChildren: () => import('./seguridad/edit-publicacion/edit-publicacion.module').then(m => m.EditPublicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./seguridad/auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./seguridad/auth/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'save-publicacion',
    loadChildren: () => import('./seguridad/save-publicacion/save-publicacion.module').then(m => m.SavePublicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'solicitud-empleo',
    loadChildren: () => import('./seguridad/solicitud-empleo/solicitud-empleo.module').then(m => m.SolicitudEmpleoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ver-perfil-detalle',
    loadChildren: () => import('./seguridad/contacto/ver-perfil-detalle/ver-perfil-detalle.module').then( m => m.VerPerfilDetallePageModule)
  },
  {
    path: 'admin/panel',
    loadChildren: () => import('./seguridad/admin/panel/panel.module').then(m => m.PanelPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'denuncia-detalle/:id',
    loadChildren: () => import('./seguridad/admin/denuncia-detalle/denuncia-detalle.module').then( m => m.DenunciaDetallePageModule)
  },
  {
    path: 'detalle-pub-admin/:id',
    loadChildren: () => import('./seguridad/admin/detalle-pub-admin/detalle-pub-admin.module').then(m => m.DetallePubAdminPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
