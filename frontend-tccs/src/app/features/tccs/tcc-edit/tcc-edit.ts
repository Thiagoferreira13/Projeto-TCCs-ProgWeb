import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TccForm } from '../tcc-form/tcc-form';
import { TccService } from '../tcc.service';
import { Tcc, TccPayload } from '../tcc.model';

@Component({
  selector: 'app-tcc-edit',
  imports: [MatIconModule, TccForm],
  templateUrl: './tcc-edit.html',
  styleUrls: ['./tcc-edit.css', '../tccs-shared.css'],
})
export class TccEdit implements OnInit {
  @ViewChild(TccForm) tccForm!: TccForm;

  tccId!: number;
  tcc = signal<Tcc | null>(null);

  carregando = signal(false);
  salvando = signal(false);
  erro = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tccService: TccService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.erro.set('ID do TCC não informado na rota.');
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
        this.tcc.set(dados); // alimenta o [tcc] do <app-tcc-form>, que faz o patchValue
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar TCC:', err);
        this.erro.set('Não foi possível carregar os dados deste TCC.');
        this.carregando.set(false);
      },
    });
  }

  cancelar() {
    this.router.navigate(['/tccs']);
  }

  salvar() {
    const form = this.tccForm.form;

    if (form.invalid) {
      form.markAllAsTouched();
      this.erro.set('Preencha todos os campos obrigatórios.');
      return;
    }

    const valores = form.getRawValue();

    const payload: TccPayload = {
      titulo: valores.titulo,
      resumo: valores.resumo,
      palavras_chave: valores.palavras_chave,
      tipo: valores.tipo,
      idioma: valores.idioma,
      aluno: valores.aluno!,
      orientador: valores.orientador!,
      coorientador: valores.coorientador,
      presidente: valores.presidente!,
      primeiro_membro: valores.primeiro_membro!,
      segundo_membro: valores.segundo_membro!,
      semestre_letivo_defesa: valores.semestre_letivo_defesa || null,
      status: valores.status,
      arquivo: this.tcc()?.arquivo ?? null, // mantém o arquivo já existente
    };

    this.salvando.set(true);
    this.erro.set(null);

    this.tccService.atualizar(this.tccId, payload).subscribe({
      next: () => {
        this.salvando.set(false);
        this.router.navigate(['/tccs']);
      },
      error: (err) => {
        console.error('Erro ao atualizar TCC:', err);
        this.erro.set('Não foi possível atualizar o TCC.');
        this.salvando.set(false);
      },
    });
  }
}
