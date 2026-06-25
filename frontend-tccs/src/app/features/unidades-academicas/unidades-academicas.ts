import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UnidadeAcademica } from '../../core/models/unidade-academica.model';
import { UnidadeAcademicaService } from '../../core/service/unidade-academica.service';
import { ConfirmModal } from '../../shared/components/confirm-modal/confirm-modal';
import { FormModal, DialogField } from '../../shared/components/form-modal/form-modal';
import { ListPage } from '../../shared/pages/list-page/list-page';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { TableList, TableColumn } from '../../shared/components/table-list/table-list';
import { getApiErrorMessage } from '../../core/utils/api-error';

@Component({
  selector: 'app-unidades-academicas',
  imports: [MatIconModule, PageHeader, TableList, ListPage, ConfirmModal, FormModal, SearchBar],
  templateUrl: './unidades-academicas.html',
  styleUrl: './unidades-academicas.css',
})
export class UnidadesAcademicas implements OnInit {

  private unidadeAcademicaService = inject(UnidadeAcademicaService);
  private cdr = inject(ChangeDetectorRef);

  columns: TableColumn[] = [
    { key: 'nome', label: 'Nome', minWidth: '260px' },
    { key: 'sigla', label: 'Sigla', minWidth: '120px' },
    { key: 'acoes', label: 'Ações', minWidth: '80px' },
  ];

  fields: DialogField[] = [
    { key: 'nome', label: 'Nome', type: 'text', placeholder: 'Ex: Instituto de Ciências Exatas e Tecnológicas', required: true },
    { key: 'sigla', label: 'Sigla', type: 'text', placeholder: 'Ex: ICET', required: true },
  ];

  unidadesAcademicas: UnidadeAcademica[] = [];
  searchQuery = '';
  currentPage = 1;
  readonly pageSize = 10;

  formOpen = false;
  unidadeAcademicaEmEdicao: UnidadeAcademica | null = null;
  initialValue: Partial<UnidadeAcademica> | null = null;
  formError: string | null = null;

  confirmOpen = false;
  unidadeAcademicaParaExcluir: UnidadeAcademica | null = null;

  ngOnInit(): void {
    this.carregarUnidadesAcademicas();
  }

  carregarUnidadesAcademicas(): void {
    this.unidadeAcademicaService.listar().subscribe({
      next: (unidadesAcademicas) => {
        this.unidadesAcademicas = unidadesAcademicas;
        this.ajustarPaginaAtual();
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar unidades acadêmicas', erro)
    });
  }

  get unidadesAcademicasFiltradas(): UnidadeAcademica[] {
    const termo = this.normalizar(this.searchQuery);
    if (!termo) return this.unidadesAcademicas;

    return this.unidadesAcademicas.filter(unidadeAcademica =>
      this.normalizar(unidadeAcademica.nome).includes(termo) ||
      this.normalizar(unidadeAcademica.sigla).includes(termo)
    );
  }

  get paginatedUnidadesAcademicas(): UnidadeAcademica[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.unidadesAcademicasFiltradas.slice(start, start + this.pageSize);
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  abrirCadastro(): void {
    this.unidadeAcademicaEmEdicao = null;
    this.initialValue = null;
    this.formError = null;
    this.formOpen = true;
  }

  editarUnidadeAcademica(unidadeAcademica: UnidadeAcademica): void {
    this.unidadeAcademicaEmEdicao = unidadeAcademica;
    this.formError = null;
    this.initialValue = {
      nome: unidadeAcademica.nome,
      sigla: unidadeAcademica.sigla
    };
    this.formOpen = true;
  }

  onSubmit(valores: Record<string, any>): void {
    this.formError = null;

    const dados = {
      nome: valores['nome'],
      sigla: valores['sigla']
    };

    if (this.unidadeAcademicaEmEdicao) {
      const id = this.unidadeAcademicaEmEdicao.id;
      this.unidadeAcademicaService.editar(id, dados).subscribe({
        next: () => this.fecharFormularioERecarregar(),
        error: (erro) => {
          console.error('Erro ao editar unidade acadêmica', erro);
          this.formError = getApiErrorMessage(erro, 'Não foi possível editar a unidade acadêmica.');
          this.cdr.detectChanges();
        }
      });
      return;
    }

    this.unidadeAcademicaService.criar(dados).subscribe({
      next: () => this.fecharFormularioERecarregar(),
      error: (erro) => {
        console.error('Erro ao cadastrar unidade acadêmica', erro);
        this.formError = getApiErrorMessage(erro, 'Não foi possível cadastrar a unidade acadêmica.');
        this.cdr.detectChanges();
      }
    });
  }

  excluirUnidadeAcademica(unidadeAcademica: UnidadeAcademica): void {
    this.unidadeAcademicaParaExcluir = unidadeAcademica;
    this.confirmOpen = true;
  }

  onConfirmDelete(): void {
    if (!this.unidadeAcademicaParaExcluir) return;

    this.unidadeAcademicaService.excluir(this.unidadeAcademicaParaExcluir.id).subscribe({
      next: () => {
        this.confirmOpen = false;
        this.unidadeAcademicaParaExcluir = null;
        this.carregarUnidadesAcademicas();
      },
      error: (erro) => console.error('Erro ao excluir unidade acadêmica', erro)
    });
  }

  private fecharFormularioERecarregar(): void {
    this.formOpen = false;
    this.unidadeAcademicaEmEdicao = null;
    this.initialValue = null;
    this.formError = null;
    this.carregarUnidadesAcademicas();
  }

  private ajustarPaginaAtual(): void {
    const totalPages = Math.max(1, Math.ceil(this.unidadesAcademicasFiltradas.length / this.pageSize));
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }

  private normalizar(valor: string): string {
    return valor.toLocaleLowerCase('pt-BR').trim();
  }
}
