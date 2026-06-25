import { Component, Input, OnChanges, OnInit, SimpleChanges, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tcc } from '../tcc.model';
import { Aluno } from '../../../core/models/aluno.model';
import { Professor } from '../../../core/models/professor.model';
import { TccLookupData, TccLookupService } from '../tcc-lookup.service';

type ProfessorControlName =
  | 'orientador'
  | 'coorientador'
  | 'presidente'
  | 'primeiro_membro'
  | 'segundo_membro';

@Component({
  selector: 'app-tcc-form',
  imports: [MatIconModule, ReactiveFormsModule],
  templateUrl: './tcc-form.html',
  styleUrls: ['./tcc-form.css'],
})
export class TccForm implements OnChanges, OnInit {
  private readonly tccLookupService = inject(TccLookupService);

  // Quando true, todos os campos ficam bloqueados (usado em tcc-details)
  @Input() somenteLeitura = false;

  // Dados para preencher o formulário (usado em tcc-edit e tcc-details)
  @Input() tcc: Tcc | null = null;

  lookup = signal<TccLookupData | null>(null);
  carregandoOpcoes = signal(true);
  erroOpcoes = signal<string | null>(null);

  alunos = computed(() => this.lookup()?.alunos ?? []);
  professores = computed(() => this.lookup()?.professores ?? []);

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

  ngOnInit(): void {
    this.carregarOpcoes();
  }

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
      this.aplicarModoLeitura();
    }
  }

  carregarOpcoes(): void {
    this.carregandoOpcoes.set(true);
    this.erroOpcoes.set(null);

    this.tccLookupService.carregar().subscribe({
      next: (lookup) => {
        this.lookup.set(lookup);
        this.carregandoOpcoes.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar opções do formulário de TCC:', err);
        this.erroOpcoes.set('Não foi possível carregar alunos e professores.');
        this.carregandoOpcoes.set(false);
      },
    });
  }

  alunoLabel(aluno: Aluno): string {
    return this.tccLookupService.formatarAluno(aluno);
  }

  professorLabel(professor: Professor): string {
    return this.tccLookupService.formatarProfessor(professor);
  }

  alunoSelecionadoAusente(): boolean {
    const alunoId = this.form.controls.aluno.value;
    return this.idSelecionadoAusente(alunoId, this.lookup()?.alunosPorId);
  }

  professorSelecionadoAusente(controlName: ProfessorControlName): boolean {
    const professorId = this.form.controls[controlName].value;
    return this.idSelecionadoAusente(professorId, this.lookup()?.professoresPorId);
  }

  alunoSelecionadoId(): number | null {
    return this.form.controls.aluno.value;
  }

  professorSelecionadoId(controlName: ProfessorControlName): number | null {
    return this.form.controls[controlName].value;
  }

  private idSelecionadoAusente(
    id: number | null,
    mapa: ReadonlyMap<number, unknown> | undefined
  ): boolean {
    return !this.carregandoOpcoes() && id !== null && !mapa?.has(id);
  }

  private aplicarModoLeitura(): void {
    if (this.somenteLeitura) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }
}
