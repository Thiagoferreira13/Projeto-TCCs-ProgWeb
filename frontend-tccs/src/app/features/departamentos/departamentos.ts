import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Departamento } from '../../core/models/departamento.model';
import { UnidadeAcademica } from '../../core/models/unidade-academica.model';
import { DepartamentoService } from '../../core/service/departamento.service';
import { UnidadeAcademicaService } from '../../core/service/unidade-academica.service';
import { ConfirmModal } from '../../shared/components/confirm-modal/confirm-modal';
import { FormModal, DialogField } from '../../shared/components/form-modal/form-modal';
import { ListPage } from '../../shared/pages/list-page/list-page';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { TableList, TableColumn } from '../../shared/components/table-list/table-list';
import { getApiErrorMessage } from '../../core/utils/api-error';

interface FormInitialValue {
  nome: string;
  sigla: string;
  unidade_academica: string;
}

@Component({
  selector: 'app-departamentos',
  imports: [MatIconModule, PageHeader, TableList, ListPage, ConfirmModal, FormModal, SearchBar],
  templateUrl: './departamentos.html',
  styleUrl: './departamentos.css',
})
export class Departamentos implements OnInit {

  private departamentoService = inject(DepartamentoService);
  private unidadeAcademicaService = inject(UnidadeAcademicaService);
  private cdr = inject(ChangeDetectorRef);

  columns: TableColumn[] = [
    { key: 'nome', label: 'Nome', minWidth: '240px' },
    { key: 'sigla', label: 'Sigla', minWidth: '120px' },
    { key: 'unidade_academica', label: 'Unidade Acadêmica', minWidth: '220px' },
    { key: 'acoes', label: 'Ações', minWidth: '80px' },
  ];

  fields: DialogField[] = [
    { key: 'nome', label: 'Nome', type: 'text', placeholder: 'Ex: Departamento de Ciência da Computação', required: true },
    { key: 'sigla', label: 'Sigla', type: 'text', placeholder: 'Ex: DCC', required: true },
    {
      key: 'unidade_academica',
      label: 'Unidade Acadêmica',
      type: 'select',
      placeholder: 'Selecione uma unidade acadêmica...',
      required: true,
      options: []
    },
  ];

  departamentos: Departamento[] = [];
  unidadesAcademicas: UnidadeAcademica[] = [];
  unidadeAcademicaOptions: { value: string; label: string }[] = [];
  searchQuery = '';
  currentPage = 1;
  readonly pageSize = 10;

  formOpen = false;
  departamentoEmEdicao: Departamento | null = null;
  initialValue: FormInitialValue | null = null;
  formError: string | null = null;

  confirmOpen = false;
  departamentoParaExcluir: Departamento | null = null;

  ngOnInit(): void {
    this.carregarUnidadesAcademicas();
    this.carregarDepartamentos();
  }

  carregarUnidadesAcademicas(): void {
    this.unidadeAcademicaService.listar().subscribe({
      next: (unidadesAcademicas) => {
        this.unidadesAcademicas = unidadesAcademicas;
        this.unidadeAcademicaOptions = unidadesAcademicas.map(unidadeAcademica => ({
          value: String(unidadeAcademica.id),
          label: unidadeAcademica.nome
        }));

        const campo = this.fields.find(field => field.key === 'unidade_academica');
        if (campo) {
          campo.options = this.unidadeAcademicaOptions;
        }

        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar unidades acadêmicas', erro)
    });
  }

  carregarDepartamentos(): void {
    this.departamentoService.listar().subscribe({
      next: (departamentos) => {
        this.departamentos = departamentos;
        this.ajustarPaginaAtual();
        this.cdr.detectChanges();
      },
      error: (erro) => console.error('Erro ao carregar departamentos', erro)
    });
  }

  get departamentosFiltrados(): Departamento[] {
    const termo = this.normalizar(this.searchQuery);
    if (!termo) return this.departamentos;

    return this.departamentos.filter(departamento =>
      this.normalizar(departamento.nome).includes(termo) ||
      this.normalizar(departamento.sigla).includes(termo) ||
      this.normalizar(this.getNomeUnidadeAcademica(departamento.unidade_academica)).includes(termo)
    );
  }

  get paginatedDepartamentos(): Departamento[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.departamentosFiltrados.slice(start, start + this.pageSize);
  }

  getNomeUnidadeAcademica(unidadeAcademica: number | string | { id: number; nome: string; sigla?: string }): string {
    if (typeof unidadeAcademica === 'object' && unidadeAcademica !== null) {
      return unidadeAcademica.nome;
    }

    const unidade = this.unidadeAcademicaOptions.find(option => option.value === String(unidadeAcademica));
    return unidade?.label ?? String(unidadeAcademica);
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  abrirCadastro(): void {
    this.departamentoEmEdicao = null;
    this.initialValue = { nome: '', sigla: '', unidade_academica: '' };
    this.formError = null;
    this.formOpen = true;
  }

  editarDepartamento(departamento: Departamento): void {
    this.departamentoEmEdicao = departamento;
    this.formError = null;
    this.initialValue = {
      nome: departamento.nome,
      sigla: departamento.sigla,
      unidade_academica: this.getUnidadeAcademicaId(departamento.unidade_academica)
    };
    this.formOpen = true;
  }

  onSubmit(valores: Record<string, any>): void {
    this.formError = null;

    const dados = {
      nome: valores['nome'],
      sigla: valores['sigla'],
      unidade_academica: Number(valores['unidade_academica'])
    };

    if (this.departamentoEmEdicao) {
      const id = this.departamentoEmEdicao.id;
      this.departamentoService.editar(id, dados).subscribe({
        next: () => this.fecharFormularioERecarregar(),
        error: (erro) => {
          console.error('Erro ao editar departamento', erro);
          this.formError = getApiErrorMessage(erro, 'Não foi possível editar o departamento.');
        }
      });
      return;
    }

    this.departamentoService.criar(dados).subscribe({
      next: () => this.fecharFormularioERecarregar(),
      error: (erro) => {
        console.error('Erro ao cadastrar departamento', erro);
        this.formError = getApiErrorMessage(erro, 'Não foi possível cadastrar o departamento.');
      }
    });
  }

  excluirDepartamento(departamento: Departamento): void {
    this.departamentoParaExcluir = departamento;
    this.confirmOpen = true;
  }

  onConfirmDelete(): void {
    if (!this.departamentoParaExcluir) return;

    this.departamentoService.excluir(this.departamentoParaExcluir.id).subscribe({
      next: () => {
        this.confirmOpen = false;
        this.departamentoParaExcluir = null;
        this.carregarDepartamentos();
      },
      error: (erro) => console.error('Erro ao excluir departamento', erro)
    });
  }

  private fecharFormularioERecarregar(): void {
    this.formOpen = false;
    this.departamentoEmEdicao = null;
    this.initialValue = null;
    this.formError = null;
    this.carregarDepartamentos();
  }

  private ajustarPaginaAtual(): void {
    const totalPages = Math.max(1, Math.ceil(this.departamentosFiltrados.length / this.pageSize));
    if (this.currentPage > totalPages) {
      this.currentPage = totalPages;
    }
  }

  private getUnidadeAcademicaId(unidadeAcademica: number | string | { id: number }): string {
    if (typeof unidadeAcademica === 'object' && unidadeAcademica !== null) {
      return String(unidadeAcademica.id);
    }

    return String(unidadeAcademica);
  }

  private normalizar(valor: string): string {
    return valor.toLocaleLowerCase('pt-BR').trim();
  }
}
