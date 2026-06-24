import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tcc } from '../tcc.model';

@Component({
  selector: 'app-tcc-form',
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: './tcc-form.html',
  styleUrls: ['./tcc-form.css'],
})
export class TccForm implements OnChanges {
  // Quando true, todos os campos ficam bloqueados (usado em tcc-details)
  @Input() somenteLeitura = false;

  // Dados para preencher o formulário (usado em tcc-edit e tcc-details)
  @Input() tcc: Tcc | null = null;

  // Formulário exposto para o componente pai (tcc-create/tcc-edit) ler
  // o valor ao salvar, via @ViewChild.
  form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    resumo: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    palavras_chave: new FormControl('', { nonNullable: true }),
    tipo: new FormControl('MONOGRAFIA', { nonNullable: true }),
    idioma: new FormControl('PT', { nonNullable: true }),

    aluno: new FormControl<number | null>(null, { validators: [Validators.required] }),
    orientador: new FormControl<number | null>(null, { validators: [Validators.required] }),
    coorientador: new FormControl<number | null>(null),

    presidente: new FormControl<number | null>(null, { validators: [Validators.required] }),
    primeiro_membro: new FormControl<number | null>(null, { validators: [Validators.required] }),
    segundo_membro: new FormControl<number | null>(null, { validators: [Validators.required] }),

    semestre_letivo_defesa: new FormControl('', { nonNullable: true }),
    status: new FormControl('0', { nonNullable: true }),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tcc'] && this.tcc) {
      this.form.patchValue({
        titulo: this.tcc.titulo,
        resumo: this.tcc.resumo,
        palavras_chave: this.tcc.palavras_chave,
        tipo: this.tcc.tipo,
        idioma: this.tcc.idioma,
        aluno: this.tcc.aluno,
        orientador: this.tcc.orientador,
        coorientador: this.tcc.coorientador,
        presidente: this.tcc.presidente,
        primeiro_membro: this.tcc.primeiro_membro,
        segundo_membro: this.tcc.segundo_membro,
        semestre_letivo_defesa: this.tcc.semestre_letivo_defesa ?? '',
        status: this.tcc.status,
      });
    }

    if (changes['somenteLeitura']) {
      if (this.somenteLeitura) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }
}
