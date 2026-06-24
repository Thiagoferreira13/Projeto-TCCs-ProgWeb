import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { TableList, TableColumn } from '../../../shared/components/table-list/table-list';
import { ListPage } from '../../../shared/pages/list-page/list-page';
import { ConfirmModal } from '../../../shared/components/confirm-modal/confirm-modal';
import { FormModal, DialogField } from '../../../shared/components/form-modal/form-modal';
import { SearchBar } from '../../../shared/components/search-bar/search-bar';
import { Aluno } from '../../../core/models/aluno.model';
import { AlunoService } from '../../../core/service/aluno.service';
import { CursoService } from '../../../core/service/curso.service';

// Tipo para os valores iniciais do formulário
interface FormInitialValue {
  nome: string;
  matricula: string;
  curso: string;  // ID do curso como string
}

@Component({
  selector: 'app-alunos-list',
  imports: [MatIconModule, PageHeader, TableList, ListPage, ConfirmModal, FormModal, SearchBar],
  templateUrl: './alunos-list.html',
  styleUrl: './alunos-list.css',
})
export class AlunosList implements OnInit {

  private alunoService = inject(AlunoService);
  private cursoService = inject(CursoService);
  private cdr = inject(ChangeDetectorRef);

  columns: TableColumn[] = [
    { key: 'nome',      label: 'Nome',      minWidth: '220px' },
    { key: 'matricula', label: 'Matrícula', minWidth: '140px' },
    { key: 'curso',     label: 'Curso',     minWidth: '200px' },
    { key: 'acoes',     label: 'Ações',     minWidth: '80px'  },
  ];

  alunos: Aluno[] = [];
  cursoOptions: { value: string; label: string }[] = [];

  fields: DialogField[] = [
    { key: 'nome',      label: 'Nome Completo', type: 'text',   placeholder: 'Ex: Maria Eduarda Santos', required: true },
    { key: 'matricula', label: 'Matrícula',     type: 'text',   placeholder: 'Ex: 202400123',            required: true },
    { key: 'curso',     label: 'Curso',         type: 'select', placeholder: 'Selecione um curso...',    required: true,
      options: []  // Será preenchido dinamicamente
    },
  ];

  initialValue: FormInitialValue | null = null;

  ngOnInit(): void {
    this.carregarCursos();
    this.carregarAlunos();
  }

  carregarCursos(): void {
    this.cursoService.listar().subscribe({
      next: (cursos) => {
        this.cursoOptions = cursos.map(c => ({
          value: String(c.id),
          label: c.nome
        }));
        const campo = this.fields.find(f => f.key === 'curso');
        if (campo) {
          campo.options = this.cursoOptions;
        }
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar cursos', erro)
    });
  }

  carregarAlunos(): void {
    this.alunoService.listar().subscribe({
      next: (alunos) => {
        this.alunos = alunos;

        const totalPages = Math.max(
          1,
          Math.ceil(this.alunos.length / this.pageSize)
        );

        if (this.currentPage > totalPages) {
          this.currentPage = totalPages;
        }

        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar alunos', erro)
    });
  }

  getNomeCurso(curso: number | string | { id: number; nome: string }): string {
    if (typeof curso === 'object' && curso !== null) {
      return curso.nome;
    }
    const found = this.cursoOptions.find(c => c.value === String(curso));
    return found?.label ?? String(curso);
  }

  // ── Paginação ──────────────────────────────────────────────────────────────

  currentPage = 1;
  readonly pageSize = 10;

  get paginatedAlunos(): Aluno[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.alunos.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // ── Search bar ─────────────────────────────────────────────────────────────

  onSearch(query: string): void {
    this.currentPage = 1;
    if (!query.trim()) {
      this.carregarAlunos();
      return;
    }
    this.alunoService.pesquisar(query).subscribe({
      next: alunos => {
        this.alunos = alunos;
        this.cdr.detectChanges();
      },
      error: erro => console.error('Erro na pesquisa', erro)
    });
  }

  // ── Modal de cadastro / edição ─────────────────────────────────────────────

  formOpen = false;
  alunoEmEdicao: Aluno | null = null;

  abrirCadastro(): void {
    this.alunoEmEdicao = null;
    this.initialValue = { nome: '', matricula: '', curso: '' };
    this.formOpen = true;
  }

  editarAluno(aluno: Aluno): void {
    let cursoStr: string;
    if (typeof aluno.curso === 'object' && aluno.curso !== null) {
      cursoStr = String(aluno.curso.id);
    } else {
      cursoStr = String(aluno.curso);
    }
    this.initialValue = {
      nome: aluno.nome,
      matricula: aluno.matricula,
      curso: cursoStr
    };
    this.alunoEmEdicao = aluno;
    this.formOpen = true;
  }

  onSubmit(valores: Record<string, any>): void {
    const dados = {
      nome: valores['nome'],
      matricula: valores['matricula'],
      curso: Number(valores['curso'])
    };

    if (this.alunoEmEdicao) {
      const id = this.alunoEmEdicao.id!;
      this.alunoService.editar(id, dados).subscribe({
        next: () => {
          this.formOpen = false;
          this.alunoEmEdicao = null;
          this.initialValue = null;
          this.carregarAlunos();
        },
        error: (erro) => {
          console.error('Erro ao editar aluno', erro);
          if (erro.error) console.error('Detalhes:', erro.error);
        }
      });
    } else {
      this.alunoService.criar(dados).subscribe({
        next: () => {
          this.formOpen = false;
          this.initialValue = null;
          this.carregarAlunos();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar aluno', erro);
          if (erro.error) console.error('Detalhes:', erro.error);
        }
      });
    }
  }

  // ── Modal de confirmação de exclusão ───────────────────────────────────────
  confirmOpen = false;
  alunoParaExcluir: Aluno | null = null;

  excluirAluno(aluno: Aluno): void {
    this.alunoParaExcluir = aluno;
    this.confirmOpen = true;
  }

  onConfirmDelete(): void {
    if (!this.alunoParaExcluir) return;
    const id = this.alunoParaExcluir.id!;
    this.alunoService.excluir(id).subscribe({
      next: () => {
        this.confirmOpen = false;
        this.alunoParaExcluir = null;
        this.carregarAlunos();
      },
      error: (erro) => {
        console.error('Erro ao excluir aluno', erro);
        if (erro.error) console.error('Detalhes:', erro.error);
      }
    });
  }
}