import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { CardComponent } from './components/card/card.component';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';
import { GestionEventosComponent } from './components/gestion-eventos/gestion-eventos.component';
import { DetalleEventoComponent } from './components/detalle-evento/detalle-evento.component';
import { ShoppingCarComponent } from './components/shopping-car/shopping-car.component';
import { correoRecuperacionComponent } from './components/correo-recuperacion/correo-recuperacion.component';
import { HistorialComprasComponent } from './components/history/historial-compras.component';
import { GestionCuponesComponent } from './components/gestion-cupones/gestion-cupones.component';
import { VerificarCuentaComponent } from './components/verificar-cuenta/verificar-cuenta.component';
import { LoginGuard } from './guards/permiso.service';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { RolesGuard } from './guards/roles.service';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { HayCuponesComponent } from './components/hay-cupones/hay-cupones.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent,  canActivate: [LoginGuard] },
    { path: 'register', component: RegisterComponent,  canActivate: [LoginGuard] },
    { path: 'create-event', component: CreateEventComponent, canActivate: [RolesGuard], data:
        { expectedRole: ["ADMIN"] }  },
    { path: 'card', component: CardComponent},
    { path: 'cambiar-password', component: CambiarPasswordComponent},

    { path: "gestion-eventos", component: GestionEventosComponent, canActivate: [RolesGuard], data:
        { expectedRole: ["ADMIN"] } },
    { path: 'detalle-evento/:id', component: DetalleEventoComponent },
    { path: 'editar-evento/:id', component: CreateEventComponent, canActivate: [RolesGuard], data:
        { expectedRole: ["ADMIN"] } },
    { path: 'shopping-car', component: ShoppingCarComponent , canActivate: [RolesGuard], data:
        { expectedRole: ["CLIENT"] }},
    { path: 'correo-recuperacion', component: correoRecuperacionComponent},
    { path: 'historial', component: HistorialComprasComponent, canActivate: [RolesGuard], data:
        { expectedRole: ["CLIENT"] } },
    { path: 'gestion-cupones', component: GestionCuponesComponent, canActivate: [RolesGuard], data:
        { expectedRole: ["ADMIN"] } },
    { path: 'validar-cuenta',  component: VerificarCuentaComponent },
    { path: 'home-admin', component: HomeAdminComponent },
    { path: 'user-info', component: UserInfoComponent, canActivate: [RolesGuard], data:
        { expectedRole: ["ADMIN", "CLIENT"] }},
    { path: 'order-details/:id', component: OrderDetailsComponent },
    { path: 'hay-cupones', component: HayCuponesComponent, canActivate: [RolesGuard], data:
        { expectedRole: ["CLIENT"] }},

    { path: '**', pathMatch: "full", redirectTo: '' }
    //Add more routes here for the other pages and components
];
