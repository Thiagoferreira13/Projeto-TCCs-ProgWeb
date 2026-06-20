import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { TccDeleteModal, TccResumo } from '../tcc-delete-modal/tcc-delete-modal';

interface Tcc {
  id: string;
  titulo: string;
  aluno: string;
  curso: string;
  orientador: string;
  tipo: string;
  semestre: string;
  status: 'Aprovado' | 'Em Elaboração' | 'Enviado' | 'Reprovado';
  arquivo: boolean;
}

@Component({
  selector: 'app-tccs',
  imports: [
    MatIconModule,TccDeleteModal
  ],
  templateUrl: './tccs-list.html',
  styleUrls: ['./tccs-list.css', '../tccs-shared.css'],
})

export class Tccs {
  tccs: Tcc[] = [
    {
      id: 'TCC-2023-089',
      titulo: 'Sistemas de Recomendação Baseados em IA para Bibliotecas Acadêmicas',
      aluno: 'Ana Paula Silva',
      curso: 'Ciência da Computação',
      orientador: 'Dr. Ricardo Mendes',
      tipo: 'Monografia',
      semestre: '2023.2',
      status: 'Aprovado',
      arquivo: true,
    },
    {
      id: 'TCC-2024-012',
      titulo: 'Análise de Desempenho de Redes 5G em Áreas Urbanas',
      aluno: 'Bruno Oliveira Santos',
      curso: 'Engenharia de Redes',
      orientador: 'Msc. Helena Costa',
      tipo: 'Projeto Prático',
      semestre: '2024.1',
      status: 'Em Elaboração',
      arquivo: false,
    },
    {
      id: 'TCC-2024-003',
      titulo: 'Impactos Sociais do Teletrabalho na Administração Pública',
      aluno: 'Carla Ferreira',
      curso: 'Administração',
      orientador: 'Dr. Marcos Viana',
      tipo: 'Monografia',
      semestre: '2024.1',
      status: 'Enviado',
      arquivo: true,
    },
    {
      id: 'TCC-2023-102',
      titulo: 'Estudo Comparativo de Frameworks JavaScript: React vs Vue',
      aluno: 'Daniel Rocha',
      curso: 'Sistemas de Informação',
      orientador: 'Msc. Patrícia Lima',
      tipo: 'Monografia',
      semestre: '2023.2',
      status: 'Reprovado',
      arquivo: true,
    },
  ];

  getBadgeClass(situacao: string): string {
    return 'badge badge--' + situacao.toLowerCase().replace(' ', '-');
  }

  tccParaExcluir: TccResumo | null = null;

  abrirModalExclusao(tcc: Tcc) {
    this.tccParaExcluir = {
      id: tcc.id,
      titulo: tcc.titulo,
      aluno: tcc.aluno,
      status: tcc.status,
    };
  }

  fecharModalExclusao() {
    this.tccParaExcluir = null;
  }

  confirmarExclusao() {
    console.log('Excluir TCC:', this.tccParaExcluir?.id);
    // depois: chamar API DELETE aqui
    this.fecharModalExclusao();
  }
}


