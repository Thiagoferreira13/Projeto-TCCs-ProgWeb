import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { TableList, TableColumn } from '../../../shared/components/table-list/table-list';
import { ListPage } from '../../../shared/pages/list-page/list-page';

interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  curso: string;
}

@Component({
  selector: 'app-alunos-list',
  imports: [MatIconModule, PageHeader, TableList, ListPage],
  templateUrl: './alunos-list.html',
  styleUrl: './alunos-list.css',
})
export class AlunosList {

  columns: TableColumn[] = [
    { key: 'nome',      label: 'Nome',      minWidth: '220px' },
    { key: 'matricula', label: 'Matrícula', minWidth: '140px' },
    { key: 'curso',     label: 'Curso',     minWidth: '200px' },
    { key: 'acoes',     label: 'Ações',     minWidth: '80px'  },
  ];

  alunos: Aluno[] = [
    { id: 1,  nome: 'Ana Paula Silva',       matricula: '2021001', curso: 'Ciência da Computação' },
    { id: 2,  nome: 'Bruno Oliveira Santos', matricula: '2021002', curso: 'Engenharia de Redes' },
    { id: 3,  nome: 'Carla Ferreira',        matricula: '2020003', curso: 'Administração' },
    { id: 4,  nome: 'Daniel Rocha',          matricula: '2020004', curso: 'Sistemas de Informação' },
    { id: 5,  nome: 'Eduarda Martins',       matricula: '2022005', curso: 'Ciência da Computação' },
    { id: 6,  nome: 'Felipe Souza',          matricula: '2022006', curso: 'Engenharia de Software' },
    { id: 7,  nome: 'Gabriela Nunes',        matricula: '2021007', curso: 'Sistemas de Informação' },
    { id: 8,  nome: 'Henrique Lima',         matricula: '2023008', curso: 'Administração' },
    { id: 9,  nome: 'Isabela Costa',         matricula: '2023009', curso: 'Engenharia de Redes' },
    { id: 10, nome: 'João Pedro Alves',      matricula: '2020010', curso: 'Ciência da Computação' },
    { id: 11, nome: 'Karina Rodrigues',      matricula: '2022011', curso: 'Engenharia de Software' },
    { id: 12, nome: 'Lucas Pereira',         matricula: '2021012', curso: 'Sistemas de Informação' },
    { id: 13, nome: 'Mariana Carvalho',      matricula: '2021013', curso: 'Ciência da Computação' },
    { id: 14, nome: 'Nicolas Mendes',        matricula: '2022014', curso: 'Engenharia de Redes' },
    { id: 15, nome: 'Olívia Ribeiro',        matricula: '2020015', curso: 'Administração' },
    { id: 16, nome: 'Pedro Henrique Dias',   matricula: '2023016', curso: 'Sistemas de Informação' },
    { id: 17, nome: 'Quésia Fernandes',      matricula: '2021017', curso: 'Ciência da Computação' },
    { id: 18, nome: 'Rafael Gomes',          matricula: '2022018', curso: 'Engenharia de Software' },
    { id: 19, nome: 'Sabrina Almeida',       matricula: '2020019', curso: 'Administração' },
    { id: 20, nome: 'Thiago Barbosa',        matricula: '2023020', curso: 'Engenharia de Redes' },
    { id: 21, nome: 'Ursula Teixeira',       matricula: '2021021', curso: 'Ciência da Computação' },
    { id: 22, nome: 'Vinícius Moreira',      matricula: '2022022', curso: 'Sistemas de Informação' },
    { id: 23, nome: 'Wesley Cardoso',        matricula: '2020023', curso: 'Engenharia de Software' },
    { id: 24, nome: 'Yasmin Lopes',          matricula: '2023024', curso: 'Administração' },
    { id: 25, nome: 'Amanda Vieira',         matricula: '2021025', curso: 'Ciência da Computação' },
    { id: 26, nome: 'Caio Batista',          matricula: '2022026', curso: 'Engenharia de Redes' },
    { id: 27, nome: 'Débora Castro',         matricula: '2020027', curso: 'Sistemas de Informação' },
    { id: 28, nome: 'Erick Moraes',          matricula: '2023028', curso: 'Engenharia de Software' },
    { id: 29, nome: 'Fernanda Azevedo',      matricula: '2021029', curso: 'Administração' },
    { id: 30, nome: 'Gustavo Freitas',       matricula: '2022030', curso: 'Ciência da Computação' },
    { id: 31, nome: 'Helena Duarte',         matricula: '2020031', curso: 'Sistemas de Informação' },
    { id: 32, nome: 'Igor Tavares',          matricula: '2023032', curso: 'Engenharia de Redes' },
    { id: 33, nome: 'Juliana Melo',          matricula: '2021033', curso: 'Engenharia de Software' },
    { id: 34, nome: 'Leonardo Faria',        matricula: '2022034', curso: 'Ciência da Computação' },
    { id: 35, nome: 'Monique Rezende',       matricula: '2020035', curso: 'Administração' },
    { id: 36, nome: 'Nathan Oliveira',       matricula: '2023036', curso: 'Sistemas de Informação' },
    { id: 37, nome: 'Patrícia Cunha',        matricula: '2021037', curso: 'Engenharia de Redes' },
  ];

  currentPage = 1;
  readonly pageSize = 10;

  get paginatedAlunos(): Aluno[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.alunos.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  editarAluno(aluno: Aluno): void {
    console.log('Editar aluno:', aluno.id);
  }

  excluirAluno(aluno: Aluno): void {
    console.log('Excluir aluno:', aluno.id);
  }
}