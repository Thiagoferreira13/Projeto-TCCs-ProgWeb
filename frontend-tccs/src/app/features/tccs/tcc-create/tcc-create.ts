import { Component, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TccForm } from '../tcc-form/tcc-form';
import { TccService } from '../../../core/service/tcc.service';
import { TccPayload } from '../../../core/models/tcc.model';

@Component({
  selector: 'app-tcc-create',
  imports: [MatIconModule, TccForm],
  templateUrl: './tcc-create.html',
  styleUrls: ['./tcc-create.css', '../tccs-shared.css'],
})
export class TccCreate {
  @ViewChild(TccForm) tccForm!: TccForm;

  salvando = signal(false);
  erro = signal<string | null>(null);

  constructor(
    private tccService: TccService,
    private router: Router
  ) {}

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
      arquivo: null, // upload de arquivo fora do escopo por enquanto
    };

    this.salvando.set(true);
    this.erro.set(null);

    this.tccService.criar(payload).subscribe({
      next: () => {
        this.salvando.set(false);
        this.router.navigate(['/tccs']);
      },
      error: (err) => {
        console.error('Erro ao criar TCC:', err);
        this.erro.set('Não foi possível criar o TCC. Verifique os dados e tente novamente.');
        this.salvando.set(false);
      },
    });
  }
}
