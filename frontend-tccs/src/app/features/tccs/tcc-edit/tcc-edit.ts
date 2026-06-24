import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TccForm } from '../tcc-form/tcc-form';

@Component({
  selector: 'app-tcc-edit',
  imports: [MatIconModule, TccForm],
  templateUrl: './tcc-edit.html',
  styleUrls: ['./tcc-edit.css', '../tccs-shared.css'],
})
export class TccEdit implements OnInit {
  tccId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.tccId = this.route.snapshot.paramMap.get('id');
    console.log('Editando TCC id:', this.tccId);
    // Aqui depois vamos buscar os dados reais da API
    // e preencher o app-tcc-form com eles
  }

  cancelar() {
    console.log('Cancelar edição - vamos implementar a navegação depois');
  }

  salvar() {
    console.log('Atualizar TCC - vamos implementar a chamada à API (PUT/PATCH) depois');
  }
}
