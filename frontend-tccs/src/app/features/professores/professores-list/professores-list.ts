import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { TableList, TableColumn } from '../../../shared/components/table-list/table-list';
import { ListPage } from '../../../shared/pages/list-page/list-page';
import { ConfirmModal } from '../../../shared/components/confirm-modal/confirm-modal';
import { FormModal, DialogField } from '../../../shared/components/form-modal/form-modal';
import { SearchBar } from '../../../shared/components/search-bar/search-bar';
import { Professor } from '../../../core/models/professor.model';
import { ProfessorService } from '../../../core/service/professor.service';
import { DepartamentoService } from '../../../core/service/departamento.service';

// Tipo para os valores iniciais do formulário
interface FormInitialValue {
  nome: string;
  departamento: string;
}

@Component({
  selector: 'app-professores-list',
  imports: [MatIconModule, PageHeader, TableList, ListPage, ConfirmModal, FormModal, SearchBar],
  templateUrl: './professores-list.html',
  styleUrl: './professores-list.css',
})
export class ProfessoresList implements OnInit {

  private professorService = inject(ProfessorService);
  private departamentoService = inject(DepartamentoService);
  private cdr = inject(ChangeDetectorRef);

  columns: TableColumn[] = [
    { key: 'nome',         label: 'Nome',         minWidth: '220px' },
    { key: 'departamento', label: 'Departamento', minWidth: '200px' },
    { key: 'acoes',        label: 'Ações',        minWidth: '80px'  },
  ];

  professores: Professor[] = [];
  departamentoOptions: { value: string; label: string }[] = [];

  fields: DialogField[] = [
    { key: 'nome', label: 'Nome Completo', type: 'text', placeholder: 'Ex: Dr. João Silva', required: true },
    { key: 'departamento', label: 'Departamento', type: 'select', placeholder: 'Selecione um departamento...', required: true,
      options: []
    },
  ];

  initialValue: FormInitialValue | null = null;

  ngOnInit(): void {
    this.carregarDepartamentos();
    this.carregarProfessores();
  }

  carregarDepartamentos(): void {
    this.departamentoService.listar().subscribe({
      next: (departamentos) => {
        this.departamentoOptions = departamentos.map(d => ({
          value: String(d.id),
          label: d.nome
        }));
        const campo = this.fields.find(f => f.key === 'departamento');
        if (campo) {
          campo.options = this.departamentoOptions;
        }
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar departamentos', erro)
    });
  }

  carregarProfessores(): void {
    this.professorService.listar().subscribe({
      next: (professores) => {
        this.professores = professores;

        const totalPages = Math.max(
          1,
          Math.ceil(this.professores.length / this.pageSize)
        );

        if (this.currentPage > totalPages) {
          this.currentPage = totalPages;
        }

        this.cdr.detectChanges();
      }
    });
  }

  getNomeDepartamento(departamento: number | string | { id: number; nome: string; sigla?: string } ): string {

      if (typeof departamento === 'object' && departamento !== null) {
        return departamento.nome;
      }

      const dep = this.departamentoOptions.find(
        d => d.value === String(departamento)
      );

      return dep?.label ?? String(departamento);
    }

  // ── Paginação ──────────────────────────────────────────────────────────────

  currentPage = 1;
  readonly pageSize = 10;

  get paginatedProfessores(): Professor[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.professores.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // ── Search bar ─────────────────────────────────────────────────────────────

  onSearch(query: string): void {
    this.currentPage = 1;
    if (!query.trim()) {
      this.carregarProfessores();
      return;
    }
    this.professorService.pesquisar(query).subscribe({
      next: professores => {
        this.professores = professores;
        this.cdr.detectChanges();
      },
      error: erro => console.error('Erro na pesquisa', erro)
    });
  }

  // ── Modal de cadastro / edição ─────────────────────────────────────────────

  formOpen = false;
  professorEmEdicao: Professor | null = null;

  abrirCadastro(): void {
    this.professorEmEdicao = null;
    this.initialValue = { nome: '', departamento: '' };
    this.formOpen = true;
  }

  editarProfessor(professor: Professor): void {
    let departamentoStr: string;
    if (typeof professor.departamento === 'object' && professor.departamento !== null) {
      departamentoStr = String(professor.departamento.id);
    } else {
      departamentoStr = String(professor.departamento);
    }
    this.initialValue = {
      nome: professor.nome,
      departamento: departamentoStr
    };
    this.professorEmEdicao = professor;
    this.formOpen = true;
  }

  onSubmit(valores: Record<string, any>): void {
    const dados = {
      nome: valores['nome'],
      departamento: Number(valores['departamento'])
    };

    if (this.professorEmEdicao) {
      const id = this.professorEmEdicao.id!;
      this.professorService.editar(id, dados).subscribe({
        next: () => {
          this.formOpen = false;
          this.professorEmEdicao = null;
          this.initialValue = null;
          this.carregarProfessores();
        },
        error: (erro) => {
          console.error('Erro ao editar professor', erro);
          if (erro.error) console.error('Detalhes:', erro.error);
        }
      });
    } else {
      this.professorService.criar(dados).subscribe({
        next: () => {
          this.formOpen = false;
          this.initialValue = null;
          this.carregarProfessores();
        },
        error: (erro) => {
          console.error('Erro ao cadastrar professor', erro);
          if (erro.error) console.error('Detalhes:', erro.error);
        }
      });
    }
  }

  // ── Modal de confirmação de exclusão ───────────────────────────────────────
  confirmOpen = false;
  professorParaExcluir: Professor | null = null;

  excluirProfessor(professor: Professor): void {
    this.professorParaExcluir = professor;
    this.confirmOpen = true;
  }

  onConfirmDelete(): void {
    if (!this.professorParaExcluir) return;
    const id = this.professorParaExcluir.id!;
    this.professorService.excluir(id).subscribe({
      next: () => {
        this.confirmOpen = false;
        this.professorParaExcluir = null;
        this.carregarProfessores();
      },
      error: (erro) => {
        console.error('Erro ao excluir professor', erro);
        if (erro.error) console.error('Detalhes:', erro.error);
      }
    });
  }
}