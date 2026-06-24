import { Component, OnInit, signal, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TccDeleteModal, TccResumo } from '../tcc-delete-modal/tcc-delete-modal';
import { TccService } from '../tcc.service';
import { Tcc } from '../tcc.model';

const ITENS_POR_PAGINA = 10;

@Component({
  selector: 'app-tccs',
  imports: [MatIconModule, TccDeleteModal],
  templateUrl: './tccs-list.html',
  styleUrls: ['./tccs-list.css', '../tccs-shared.css'],
})
export class Tccs implements OnInit {
  // ===== SIGNALS =====
  // Em projetos Zoneless (sem zone.js), atribuições comuns
  // (this.todosTccs = dados) não disparam a re-renderização da tela.
  // Signals resolvem isso: o Angular sabe exatamente quando o valor
  // muda e atualiza o template automaticamente.

  todosTccs = signal<Tcc[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);
  paginaAtual = signal(1);

  tccParaExcluir = signal<TccResumo | null>(null);

  // ===== COMPUTED (derivados dos signals acima) =====

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.todosTccs().length / ITENS_POR_PAGINA))
  );

  tccsDaPagina = computed(() => {
    const inicio = (this.paginaAtual() - 1) * ITENS_POR_PAGINA;
    return this.todosTccs().slice(inicio, inicio + ITENS_POR_PAGINA);
  });

  // Mostra só um intervalo pequeno de páginas ao redor da atual
  // (ex: na página 5, mostra 4, 5, 6 — não as 25 inteiras)
  paginas = computed(() => {
    const atual = this.paginaAtual();
    const total = this.totalPaginas();
    const intervalo = 1; // quantas páginas mostrar de cada lado da atual

    const inicio = Math.max(1, atual - intervalo);
    const fim = Math.min(total, atual + intervalo);

    return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
  });

  constructor(private tccService: TccService) {}

  ngOnInit() {
    this.carregarTccs();
  }

  carregarTccs() {
    this.carregando.set(true);
    this.erro.set(null);

    this.tccService.listar().subscribe({
      next: (dados) => {
        this.todosTccs.set(dados);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar TCCs:', err);
        this.erro.set('Não foi possível carregar os TCCs. Verifique se o servidor Django está rodando.');
        this.carregando.set(false);
      },
    });
  }

  // ===== PAGINAÇÃO =====

  irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaAtual.set(pagina);
    }
  }

  paginaAnterior() {
    this.irParaPagina(this.paginaAtual() - 1);
  }

  proximaPagina() {
    this.irParaPagina(this.paginaAtual() + 1);
  }

  // ===== STATUS (badge) =====

  getBadgeClass(statusDisplay: string): string {
    return 'badge badge--' + statusDisplay.toLowerCase().replace(' ', '-');
  }

  // ===== EXCLUSÃO =====

  abrirModalExclusao(tcc: Tcc) {
    this.tccParaExcluir.set({
      id: String(tcc.id),
      titulo: tcc.titulo,
      aluno: `Aluno #${tcc.aluno}`, // sem service de Aluno, só temos o ID
      status: tcc.status_display,
    });
  }

  fecharModalExclusao() {
    this.tccParaExcluir.set(null);
  }

  confirmarExclusao() {
    const selecionado = this.tccParaExcluir();
    if (!selecionado) return;

    const id = Number(selecionado.id);
    this.tccService.excluir(id).subscribe({
      next: () => {
        this.todosTccs.update((lista) => lista.filter((t) => t.id !== id));
        this.fecharModalExclusao();

        if (this.tccsDaPagina().length === 0 && this.paginaAtual() > 1) {
          this.paginaAtual.update((p) => p - 1);
        }
      },
      error: (err) => {
        console.error('Erro ao excluir TCC:', err);
        this.erro.set('Não foi possível excluir o TCC.');
        this.fecharModalExclusao();
      },
    });
  }
}
