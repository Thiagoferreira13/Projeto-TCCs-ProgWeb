import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TccForm } from '../tcc-form/tcc-form';
import { TccService } from '../tcc.service';
import { Tcc } from '../tcc.model';

@Component({
  selector: 'app-tcc-details',
  imports: [MatIconModule, TccForm],
  templateUrl: './tcc-details.html',
  styleUrls: ['./tcc-details.css', '../tccs-shared.css']
})
export class TccDetails implements OnInit {
  tccId!: number;
  tcc = signal<Tcc | null>(null);

  carregando = signal(false);
  erro = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tccService: TccService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.erro.set('TCC não informado na rota.');
      return;
    }

    this.tccId = Number(idParam);
    this.carregarTcc();
  }

  carregarTcc() {
    this.carregando.set(true);
    this.erro.set(null);

    this.tccService.buscarPorId(this.tccId).subscribe({
      next: (dados) => {
        this.tcc.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar TCC:', err);
        this.erro.set('Não foi possível carregar os dados deste TCC.');
        this.carregando.set(false);
      },
    });
  }

  editar() {
    this.router.navigate(['/tccs', this.tccId, 'editar']);
  }

  voltar() {
    this.router.navigate(['/tccs']);
  }
}
