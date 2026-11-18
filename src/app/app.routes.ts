
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Productos } from './pages/productos/productos';
import { Usuario } from './pages/usuario/usuario';
import { Admin } from './pages/admin/admin';
import { Panel } from './pages/panel/panel';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'productos', component: Productos },
  { path: 'usuario', component: Usuario, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
    { path: 'panel', component: Panel, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'login' },
];

