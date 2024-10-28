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

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'create-event', component: CreateEventComponent},
    { path: 'card', component: CardComponent},
    { path: 'cambiar-password', component: CambiarPasswordComponent},
    { path: 'editar-perfil', component: EditarPerfilComponent},
    { path: "gestion-eventos", component: GestionEventosComponent },
    { path: 'detalle-evento/:id', component: DetalleEventoComponent },
    { path: 'editar-evento/:id', component: CreateEventComponent },
    { path: 'shopping-car', component: ShoppingCarComponent },
    { path: 'correo-recuperacion', component: correoRecuperacionComponent},
    { path: 'historial', component: HistorialComprasComponent },
    { path: 'gestion-cupones', component: GestionCuponesComponent },

    { path: '**', pathMatch: "full", redirectTo: '' }
    //Add more routes here for the other pages and components
];
