import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  title: string;
  nombreUsuario: string = "";
  isLogged = false;
  email: string = "";

  constructor(private tokenService: TokenService) {
    this.title = 'Unieventos';
    this.isLogged = this.tokenService.isLogged();
    if (this.isLogged) {
      this.email = this.tokenService.getEmail();
      this.nombreUsuario = this.tokenService.getNombre();
    }
  }

  public logout() {
    this.tokenService.logout();
  }

}
