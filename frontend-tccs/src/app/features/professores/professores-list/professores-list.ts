import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { TableList, TableColumn } from '../../../shared/components/table-list/table-list';
import { ListPage } from '../../../shared/pages/list-page/list-page';
import { ConfirmModal } from '../../../shared/components/confirm-modal/confirm-modal';
import { FormModal, DialogField } from '../../../shared/components/form-modal/form-modal';
import { SearchBar } from '../../../shared/components/search-bar/search-bar';

interface Professor {
  id: number;
  nome: string;
  departamento: string;
}

@Component({
  selector: 'app-professores-list',
  imports: [MatIconModule, PageHeader, TableList, ListPage, ConfirmModal, FormModal, SearchBar],
  templateUrl: './professores-list.html',
  styleUrl: './professores-list.css',
})
export class ProfessoresList {

  columns: TableColumn[] = [
    { key: 'nome',         label: 'Nome',         minWidth: '220px' },
    { key: 'departamento', label: 'Departamento', minWidth: '200px' },
    { key: 'acoes',        label: 'Ações',        minWidth: '80px'  },
  ];

  professores: Professor[] = [
    { id: 1,  nome: 'Dr. Ricardo Almeida',      departamento: 'Ciência da Computação' },
    { id: 2,  nome: 'Dra. Mariana Costa',        departamento: 'Engenharia de Redes' },
    { id: 3,  nome: 'Prof. Carlos Eduardo Lima', departamento: 'Administração' },
    { id: 4,  nome: 'Profa. Juliana Ferreira',   departamento: 'Sistemas de Informação' },
    { id: 5,  nome: 'Dr. Felipe Martins',        departamento: 'Ciência da Computação' },
    { id: 6,  nome: 'Dra. Camila Rocha',         departamento: 'Engenharia de Software' },
    { id: 7,  nome: 'Prof. André Santos',        departamento: 'Sistemas de Informação' },
    { id: 8,  nome: 'Profa. Patricia Gomes',     departamento: 'Administração' },
    { id: 9,  nome: 'Dr. Leonardo Ribeiro',      departamento: 'Engenharia de Redes' },
    { id: 10, nome: 'Dra. Beatriz Carvalho',     departamento: 'Ciência da Computação' },
    { id: 11, nome: 'Prof. Rafael Souza',        departamento: 'Engenharia de Software' },
    { id: 12, nome: 'Profa. Ana Paula Nunes',    departamento: 'Sistemas de Informação' },
    { id: 13, nome: 'Dr. Gustavo Pereira',       departamento: 'Ciência da Computação' },
    { id: 14, nome: 'Dra. Fernanda Lima',        departamento: 'Engenharia de Redes' },
    { id: 15, nome: 'Prof. Marcos Vinícius',     departamento: 'Administração' },
    { id: 16, nome: 'Profa. Aline Barbosa',      departamento: 'Sistemas de Informação' },
    { id: 17, nome: 'Dr. Eduardo Martins',       departamento: 'Ciência da Computação' },
    { id: 18, nome: 'Dra. Vanessa Azevedo',      departamento: 'Engenharia de Software' },
    { id: 19, nome: 'Prof. Thiago Almeida',      departamento: 'Administração' },
    { id: 20, nome: 'Profa. Larissa Mendes',     departamento: 'Engenharia de Redes' },
    { id: 21, nome: 'Dr. Bruno Tavares',         departamento: 'Ciência da Computação' },
    { id: 22, nome: 'Dra. Natália Ribeiro',      departamento: 'Sistemas de Informação' },
    { id: 23, nome: 'Prof. Diego Cardoso',       departamento: 'Engenharia de Software' },
    { id: 24, nome: 'Profa. Helena Duarte',      departamento: 'Administração' },
    { id: 25, nome: 'Dr. Rodrigo Freitas',       departamento: 'Ciência da Computação' },
    { id: 26, nome: 'Dra. Silvia Monteiro',      departamento: 'Engenharia de Redes' },
    { id: 27, nome: 'Prof. José Henrique',       departamento: 'Sistemas de Informação' },
    { id: 28, nome: 'Profa. Daniela Ribeiro',    departamento: 'Engenharia de Software' },
    { id: 29, nome: 'Dr. Paulo Henrique Dias',   departamento: 'Administração' },
    { id: 30, nome: 'Dra. Elisa Moreira',        departamento: 'Ciência da Computação' },
    { id: 31, nome: 'Prof. Alexandre Lima',      departamento: 'Sistemas de Informação' },
    { id: 32, nome: 'Profa. Renata Souza',       departamento: 'Engenharia de Redes' },
    { id: 33, nome: 'Dr. Victor Hugo',           departamento: 'Engenharia de Software' },
    { id: 34, nome: 'Dra. Priscila Gomes',       departamento: 'Ciência da Computação' },
    { id: 35, nome: 'Prof. Eduardo Barros',      departamento: 'Administração' },
    { id: 36, nome: 'Profa. Sônia Martins',      departamento: 'Sistemas de Informação' },
    { id: 37, nome: 'Dr. Fábio Andrade',         departamento: 'Engenharia de Redes' },
  ];

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
    console.log('Buscar:', query);
  }

  // ── Modal de cadastro / edição ─────────────────────────────────────────────

  formOpen = false;
  professorEmEdicao: Professor | null = null;

  fields: DialogField[] = [
    { key: 'nome',         label: 'Nome Completo', type: 'text',   placeholder: 'Ex: Dr. João Silva', required: true },
    { key: 'departamento', label: 'Departamento',  type: 'select', placeholder: 'Selecione um departamento...', required: true,
      options: [
        { value: 'Administração',          label: 'Administração' },
        { value: 'Ciência da Computação',  label: 'Ciência da Computação' },
        { value: 'Engenharia de Redes',    label: 'Engenharia de Redes' },
        { value: 'Engenharia de Software', label: 'Engenharia de Software' },
        { value: 'Sistemas de Informação', label: 'Sistemas de Informação' },
      ]
    },
  ];

  abrirCadastro(): void {
    this.professorEmEdicao = null;
    this.formOpen = true;
  }

  editarProfessor(professor: Professor): void {
    this.professorEmEdicao = professor;
    this.formOpen = true;
  }

  onSubmit(valores: Record<string, any>): void {
    if (this.professorEmEdicao) {
      console.log('Editar:', valores);
    } else {
      console.log('Cadastrar:', valores);
    }
    this.formOpen = false;
  }

  // ── Modal de confirmação de exclusão ───────────────────────────────────────

  confirmOpen = false;
  professorParaExcluir: Professor | null = null;

  excluirProfessor(professor: Professor): void {
    this.professorParaExcluir = professor;
    this.confirmOpen = true;
  }

  onConfirmDelete(): void {
    console.log('Excluir:', this.professorParaExcluir?.id);
    this.confirmOpen = false;
    this.professorParaExcluir = null;
  }
}