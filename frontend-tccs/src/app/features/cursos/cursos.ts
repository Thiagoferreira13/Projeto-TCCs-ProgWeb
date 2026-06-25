import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Curso } from '../../core/models/curso.model';
import { CursoService } from '../../core/service/curso.service';
import { ConfirmModal } from '../../shared/components/confirm-modal/confirm-modal';
import { FormModal, DialogField } from '../../shared/components/form-modal/form-modal';
import { ListPage } from '../../shared/pages/list-page/list-page';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { TableList, TableColumn } from '../../shared/components/table-list/table-list';
import { getApiErrorMessage } from '../../core/utils/api-error';

@Component({
  selector: 'app-cursos',
  imports: [MatIconModule, PageHeader, TableList, ListPage, ConfirmModal, FormModal, SearchBar],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class Cursos implements OnInit {

  private cursoService = inject(CursoService);
  private cdr = inject(ChangeDetectorRef);

  columns: TableColumn[] = [
    { key: 'nome', label: 'Nome', minWidth: '240px' },
    { key: 'sigla', label: 'Sigla', minWidth: '120px' },
    { key: 'codigo', label: 'Código', minWidth: '140px' },
    { key: 'acoes', label: 'Ações', minWidth: '80px' },
  ];

  fields: DialogField[] = [
    { key: 'nome', label: 'Nome', type: 'text', placeholder: 'Ex: Ciência da Computação', required: true },
    { key: 'sigla', label: 'Sigla', type: 'text', placeholder: 'Ex: BCC', required: true },
    { key: 'codigo', label: 'Código', type: 'text', placeholder: 'Ex: 10G', required: true },
  ];

  cursos: Curso[] = [];
  searchQuery = '';
  currentPage = 1;
  readonly pageSize = 10;

  formOpen = false;
  cursoEmEdicao: Curso | null = null;
  initialValue: Partial<Curso> | null = null;
  formError: string | null = null;

  confirmOpen = false;
  cursoParaExcluir: Curso | null = null;

  ngOnInit(): void {
    this.carregarCursos();
  }

  carregarCursos(): void {
    this.cursoService.listar().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.ajustarPaginaAtual();
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar cursos', erro)
    });
  }

  get cursosFiltrados(): Curso[] {
    const termo = this.normalizar(this.searchQuery);
    if (!termo) return this.cursos;

    return this.cursos.filter(curso =>
      this.normalizar(curso.nome).includes(termo) ||
      this.normalizar(curso.sigla).includes(termo) ||
      this.normalizar(curso.codigo).includes(termo)
    );
  }

  get paginatedCursos(): Curso[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.cursosFiltrados.slice(start, start + this.pageSize);
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  abrirCadastro(): void {
    this.cursoEmEdicao = null;
    this.initialValue = null;
    this.formError = null;
    this.formOpen = true;
  }

  editarCurso(curso: Curso): void {
    this.cursoEmEdicao = curso;
    this.formError = null;
    this.initialValue = {
      nome: curso.nome,
      sigla: curso.sigla,
      codigo: curso.codigo
    };
    this.formOpen = true;
  }

  onSubmit(valores: Record<string, any>): void {
    this.formError = null;

    const dados = {
      nome: valores['nome'],
      sigla: valores['sigla'],
      codigo: valores['codigo']
    };

    if (this.cursoEmEdicao) {
      const id = this.cursoEmEdicao.id;
      this.cursoService.editar(id, dados).subscribe({
        next: () => this.fecharFormularioERecarregar(),
        error: (erro) => {
          console.error('Erro ao editar curso', erro);
          this.formError = getApiErrorMessage(erro, 'Não foi possível editar o curso.');
        }
      });
      return;
    }

    this.cursoService.criar(dados).subscribe({
      next: () => this.fecharFormularioERecarregar(),
      error: (erro) => {
        console.error('Erro ao cadastrar curso', erro);
        this.formError = getApiErrorMessage(erro, 'Não foi possível cadastrar o curso.');
      }
    });
  }

  excluirCurso(curso: Curso): void {
    this.cursoParaExcluir = curso;
    this.confirmOpen = true;
  }

  onConfirmDelete(): void {
    if (!this.cursoParaExcluir) return;

    this.cursoService.excluir(this.cursoParaExcluir.id).subscribe({
      next: () => {
        this.confirmOpen = false;
        this.cursoParaExcluir = null;
        this.carregarCursos();
      },
      error: (erro) => console.error('Erro ao excluir curso', erro)
    });
  }

  private fecharFormularioERecarregar(): void {
    this.formOpen = false;
    this.cursoEmEdicao = null;
    this.initialValue = null;
    this.formError = null;
    this.carregarCursos();
  }

  private ajustarPaginaAtual(): void {
    const totalPages = Math.max(1, Math.ceil(this.cursosFiltrados.length / this.pageSize));
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }

  private normalizar(valor: string): string {
    return valor.toLocaleLowerCase('pt-BR').trim();
  }
}
