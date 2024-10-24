import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreateEventComponent } from './components/create-event/create-event.component';
import { CardComponent } from './components/card/card.component';
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';
import { EditarPerfilComponent } from './components/editar-perfil/editar-perfil.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'create-event', component: CreateEventComponent},
    { path: 'card', component: CardComponent},
    { path: 'cambiar-password', component: CambiarPasswordComponent},
    { path: 'editar-perfil', component: EditarPerfilComponent},

    { path: '**', pathMatch: "full", redirectTo: '' }
    //Add more routes here for the other pages and components
];
