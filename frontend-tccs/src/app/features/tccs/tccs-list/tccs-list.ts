import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TccDeleteModal, TccResumo } from '../tcc-delete-modal/tcc-delete-modal';
import { TccService } from '../../../core/service/tcc.service';
import { Tcc } from '../../../core/models/tcc.model';
import { Router, RouterLink } from '@angular/router';
import { TccLookupData, TccLookupService } from '../../../core/service/tcc-lookup.service';

const ITENS_POR_PAGINA = 10;

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
  lookup = signal<TccLookupData | null>(null);
  carregando = signal(false);
  carregandoLookups = signal(false);
  erro = signal<string | null>(null);
  erroLookups = signal<string | null>(null);
  paginaAtual = signal(1);
  paginaDigitada = signal('1');

  tccParaExcluir = signal<TccResumo | null>(null);

  // Filtros
  termoBusca = signal('');
  statusFiltro = signal('');

  readonly statusOptions = STATUS_OPTIONS;

  // ===== COMPUTED =====

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

  itemInicial = computed(() =>
    this.tccsFiltrados().length === 0 ? 0 : (this.paginaAtual() - 1) * ITENS_POR_PAGINA + 1
  );

  itemFinal = computed(() =>
    Math.min(this.itemInicial() + this.tccsDaPagina().length - 1, this.tccsFiltrados().length)
  );

  constructor(
    private tccService: TccService,
    private tccLookupService: TccLookupService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarLookups();
    this.carregarTccs();
  }

  carregarLookups() {
    this.carregandoLookups.set(true);
    this.erroLookups.set(null);

    this.tccLookupService.carregar().subscribe({
      next: (lookup) => {
        this.lookup.set(lookup);
        this.carregandoLookups.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar alunos e professores:', err);
        this.erroLookups.set('Não foi possível carregar os nomes de alunos e professores.');
        this.carregandoLookups.set(false);
      },
    });
  }

  carregarTccs(search = '') {
    this.carregando.set(true);
    this.erro.set(null);

    this.tccService.listar(search).subscribe({
      next: (dados) => {
        this.todosTccs.set(dados);
        if (this.paginaAtual() > this.totalPaginas()) {
          this.irParaPagina(this.totalPaginas());
        }
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
    this.paginaDigitada.set('1');
    clearTimeout((this as any)._buscaTimeout);
    (this as any)._buscaTimeout = setTimeout(() => {
      this.carregarTccs(termo.trim());
    }, 400);
  }

  onStatusChange(status: string) {
    this.statusFiltro.set(status);
    this.paginaAtual.set(1);
    this.paginaDigitada.set('1');
  }

  // ===== PAGINAÇÃO =====

  irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaAtual.set(pagina);
      this.paginaDigitada.set(String(pagina));
    }
  }

  irParaPaginaDigitada() {
    const pagina = Number(this.paginaDigitada());

    if (!Number.isFinite(pagina)) {
      this.paginaDigitada.set(String(this.paginaAtual()));
      return;
    }

    const paginaFinal = Math.min(this.totalPaginas(), Math.max(1, Math.trunc(pagina)));
    this.paginaDigitada.set(String(paginaFinal));
    this.irParaPagina(paginaFinal);
  }

  onPaginaDigitadaChange(valor: string) {
    this.paginaDigitada.set(valor);
  }

  // ===== STATUS (badge) =====

  getBadgeClass(statusDisplay: string): string {
    return 'badge badge--' + statusDisplay.toLowerCase().replace(' ', '-');
  }

  getNomeAluno(alunoId: number): string {
    if (this.carregandoLookups()) return 'Carregando opções...';
    const aluno = this.lookup()?.alunosPorId.get(alunoId);
    return aluno ? this.tccLookupService.formatarAluno(aluno) : 'Aluno não encontrado';
  }

  getNomeProfessor(professorId: number): string {
    if (this.carregandoLookups()) return 'Carregando opções...';
    const professor = this.lookup()?.professoresPorId.get(professorId);
    return professor ? this.tccLookupService.formatarProfessor(professor) : 'Professor não encontrado';
  }

  // ===== EXCLUSÃO =====

  abrirModalExclusao(tcc: Tcc) {
    this.tccParaExcluir.set({
      id: tcc.id,
      titulo: tcc.titulo,
      aluno: this.getNomeAluno(tcc.aluno),
      status: tcc.status_display,
    });
  }

  fecharModalExclusao() {
    this.tccParaExcluir.set(null);
  }

  confirmarExclusao() {
    const selecionado = this.tccParaExcluir();
    if (!selecionado) return;

    const id = selecionado.id;
    this.tccService.excluir(id).subscribe({
      next: () => {
        this.todosTccs.update((lista) => lista.filter((t) => t.id !== id));
        this.fecharModalExclusao();

        if (this.tccsDaPagina().length === 0 && this.paginaAtual() > 1) {
          this.irParaPagina(this.paginaAtual() - 1);
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
