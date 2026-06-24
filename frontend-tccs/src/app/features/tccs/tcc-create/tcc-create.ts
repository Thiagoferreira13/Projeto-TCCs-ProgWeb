import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TccForm } from '../tcc-form/tcc-form';

@Component({
  selector: 'app-tcc-create',
  imports: [MatIconModule, TccForm],
  templateUrl: './tcc-create.html',
  styleUrls: ['./tcc-create.css', '../tccs-shared.css'],
})
export class TccCreate {

  cancelar() {
    console.log('Cancelar criação - vamos implementar a navegação depois');
  }

  salvar() {
    console.log('Criar TCC - vamos implementar a chamada à API (POST) depois');
  }
}
