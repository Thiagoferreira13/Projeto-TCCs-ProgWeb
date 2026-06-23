import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TccForm } from '../tcc-form/tcc-form';


@Component({
  selector: 'app-tcc-details',
  imports: [MatIconModule, TccForm],
  templateUrl: './tcc-details.html',
  styleUrls: ['./tcc-details.css', '../tccs-shared.css']
})
export class TccDetails {

  editar() {
    console.log('Cancelar edição - vamos implementar a navegação depois');
  }

  voltar() {
    console.log('Atualizar TCC - vamos implementar a chamada à API (PUT/PATCH) depois');
  }

}
