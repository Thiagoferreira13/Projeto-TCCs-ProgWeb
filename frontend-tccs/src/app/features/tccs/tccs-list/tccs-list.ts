import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TccDeleteModal, TccResumo } from '../tcc-delete-modal/tcc-delete-modal';
import { TccService } from '../tcc.service';
import { Tcc } from '../tcc.model';
import { Router, RouterLink } from '@angular/router';

const ITENS_POR_PAGINA = 10;

// Valores internos que o backend usa no campo `status`
const STATUS_OPTIONS = [
  { valor: '', label: 'Todos os Status' },
  { valor: '0', label: 'Em Elaboração' },
  { valor: '1', label: 'Enviado' },
  { valor: '2', label: 'Aprovado' },
  { valor: '3', label: 'Reprovado' },
];

@Component({
  selector: 'app-tccs',
  imports: [MatIconModule, TccDeleteModal, FormsModule, RouterLink],
  templateUrl: './tccs-list.html',
  styleUrls: ['./tccs-list.css', '../tccs-shared.css'],
})
export class Tccs implements OnInit {
  // ===== SIGNALS =====

  todosTccs = signal<Tcc[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);
  paginaAtual = signal(1);

  tccParaExcluir = signal<TccResumo | null>(null);

  // Filtros
  termoBusca = signal('');
  statusFiltro = signal('');

  // Expõe as opções de status para o template
  readonly statusOptions = STATUS_OPTIONS;

  // ===== COMPUTED =====

  // Filtragem client-side por status (a busca por texto vai ao backend)
  tccsFiltrados = computed(() => {
    const status = this.statusFiltro();
    if (!status) return this.todosTccs();
    return this.todosTccs().filter((t) => t.status === status);
  });

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.tccsFiltrados().length / ITENS_POR_PAGINA))
  );

  tccsDaPagina = computed(() => {
    const inicio = (this.paginaAtual() - 1) * ITENS_POR_PAGINA;
    return this.tccsFiltrados().slice(inicio, inicio + ITENS_POR_PAGINA);
  });

  paginas = computed(() => {
    const atual = this.paginaAtual();
    const total = this.totalPaginas();
    const intervalo = 1;

    const inicio = Math.max(1, atual - intervalo);
    const fim = Math.min(total, atual + intervalo);

    return Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);
  });

  constructor(
       private tccService: TccService,
       private router: Router
     ) {}

  ngOnInit() {
    this.carregarTccs();
  }

  carregarTccs(search = '') {
    this.carregando.set(true);
    this.erro.set(null);

    this.tccService.listar(search).subscribe({
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

  // ===== FILTROS =====

  onBuscaChange(termo: string) {
    this.termoBusca.set(termo);
    this.paginaAtual.set(1);
    // Debounce simples: aguarda 400ms antes de ir ao backend
    clearTimeout((this as any)._buscaTimeout);
    (this as any)._buscaTimeout = setTimeout(() => {
      this.carregarTccs(termo.trim());
    }, 400);
  }

  onStatusChange(status: string) {
    this.statusFiltro.set(status);
    this.paginaAtual.set(1);
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
      aluno: `Aluno #${tcc.aluno}`,
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

  irParaDetalhes(tcc: Tcc) {
       this.router.navigate(['/tccs', tcc.id, 'detalhes']);
  }

  irParaEdicao(tcc: Tcc) {
    this.router.navigate(['/tccs', tcc.id, 'editar']);
  }
}
