import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { TccService } from '../tccs/tcc.service';
import { EstatisticasGrupo, TccEstatisticas } from '../tccs/tcc.model';

interface SummaryCard {
  label: string;
  value: number;
  icon: string;
  helper: string;
  tone: 'primary' | 'success' | 'warning' | 'danger';
}

interface RankingItem {
  label: string;
  value: number;
  percent: number;
}

interface InsightCard {
  title: string;
  value: string;
  description: string;
  icon: string;
  tone: 'blue' | 'green' | 'amber' | 'teal';
}

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly tccService = inject(TccService);

  carregando = signal(true);
  erro = signal<string | null>(null);
  estatisticas = signal<TccEstatisticas | null>(null);

  readonly statusColors = ['#2563eb', '#f59e0b', '#16a34a', '#dc2626'];
  readonly tipoColors = ['#004AC6', '#0891b2', '#7c3aed', '#db2777', '#16a34a'];
  readonly idiomaColors = ['#0f766e', '#f97316'];
  readonly semestreColors = ['#004AC6', '#0891b2', '#16a34a', '#f59e0b'];

  readonly doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    layout: { padding: 4 },
    plugins: {
      tooltip: {
        backgroundColor: '#111827',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 }
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          color: '#374151',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    }
  };

  readonly barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        padding: 12,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', maxRotation: 0 }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#e5e7eb' },
        ticks: { color: '#6b7280', precision: 0 }
      }
    }
  };

  readonly horizontalBarOptions: ChartOptions<'bar'> = {
    ...this.barOptions,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: '#e5e7eb' },
        ticks: { color: '#6b7280', precision: 0 }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#374151' }
      }
    }
  };

  summaryCards = computed<SummaryCard[]>(() => {
    const stats = this.estatisticas();
    if (!stats) return [];

    const emAndamento = (stats.por_status['Em Elaboração'] ?? 0) + (stats.por_status['Enviado'] ?? 0);

    return [
      { label: 'TCCs cadastrados', value: stats.total_geral, icon: 'description', helper: 'Base acadêmica atual', tone: 'primary' },
      { label: 'Aprovados', value: stats.por_status['Aprovado'] ?? 0, icon: 'check_circle', helper: `${this.approvalRate()}% do total`, tone: 'success' },
      { label: 'Em andamento', value: emAndamento, icon: 'pending_actions', helper: 'Elaboração ou envio', tone: 'warning' },
      { label: 'Reprovados', value: stats.por_status['Reprovado'] ?? 0, icon: 'cancel', helper: 'Demandam atenção', tone: 'danger' },
    ];
  });

  approvalRate = computed(() => {
    const stats = this.estatisticas();
    if (!stats?.total_geral) return 0;
    return Math.round(((stats.por_status['Aprovado'] ?? 0) / stats.total_geral) * 100);
  });

  dominantStatus = computed(() => this.topEntry(this.estatisticas()?.por_status));
  topCurso = computed(() => this.topEntry(this.estatisticas()?.por_curso));
  topOrientador = computed(() => this.topEntry(this.estatisticas()?.por_orientador));
  topSemestre = computed(() => this.topEntry(this.estatisticas()?.por_semestre));

  insights = computed<InsightCard[]>(() => [
    {
      title: 'Curso em destaque',
      value: this.topCurso()?.label ?? 'Sem dados',
      description: `${this.topCurso()?.value ?? 0} TCCs cadastrados`,
      icon: 'school',
      tone: 'blue'
    },
    {
      title: 'Orientação mais ativa',
      value: this.topOrientador()?.label ?? 'Sem dados',
      description: `${this.topOrientador()?.value ?? 0} orientações vinculadas`,
      icon: 'supervisor_account',
      tone: 'green'
    },
    {
      title: 'Status predominante',
      value: this.dominantStatus()?.label ?? 'Sem dados',
      description: `${this.dominantStatus()?.value ?? 0} registros nessa situação`,
      icon: 'insights',
      tone: 'amber'
    },
    {
      title: 'Semestre mais movimentado',
      value: this.topSemestre()?.label ?? 'Sem dados',
      description: `${this.topSemestre()?.value ?? 0} defesas registradas`,
      icon: 'event',
      tone: 'teal'
    }
  ]);

  statusChartData = computed<ChartData<'doughnut'>>(() =>
    this.toDoughnutData(this.estatisticas()?.por_status, 'Status', this.statusColors)
  );

  tipoChartData = computed<ChartData<'bar'>>(() =>
    this.toBarData(this.estatisticas()?.por_tipo, 'TCCs por tipo', this.tipoColors)
  );

  idiomaChartData = computed<ChartData<'doughnut'>>(() =>
    this.toDoughnutData(this.estatisticas()?.por_idioma, 'Idiomas', this.idiomaColors)
  );

  semestreChartData = computed<ChartData<'bar'>>(() =>
    this.toBarData(this.estatisticas()?.por_semestre, 'TCCs por semestre', this.semestreColors)
  );

  orientadores = computed(() => this.toRanking(this.estatisticas()?.por_orientador, 6));
  cursos = computed(() => this.toRanking(this.estatisticas()?.por_curso, 5));
  departamentos = computed(() => this.toRanking(this.estatisticas()?.por_departamento, 5));
  unidades = computed(() => this.toRanking(this.estatisticas()?.por_unidade_academica, 5));

  isEmpty = computed(() => {
    const stats = this.estatisticas();
    return !!stats && stats.total_geral === 0;
  });

  ngOnInit(): void {
    this.carregarEstatisticas();
  }

  carregarEstatisticas(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.tccService.estatisticas().subscribe({
      next: (estatisticas) => {
        this.estatisticas.set(estatisticas);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar estatísticas:', err);
        this.erro.set('Não foi possível carregar o dashboard. Verifique se o servidor Django está rodando.');
        this.carregando.set(false);
      }
    });
  }

  private toDoughnutData(group: EstatisticasGrupo | undefined, label: string, colors: string[]): ChartData<'doughnut'> {
    const entries = this.entries(group);

    return {
      labels: entries.map(item => item.label),
      datasets: [{
        label,
        data: entries.map(item => item.value),
        backgroundColor: colors,
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 6
      }]
    };
  }

  private toBarData(group: EstatisticasGrupo | undefined, label: string, colors: string[]): ChartData<'bar'> {
    const entries = this.entries(group);

    return {
      labels: entries.map(item => item.label),
      datasets: [{
        label,
        data: entries.map(item => item.value),
        backgroundColor: entries.map((_, index) => colors[index % colors.length]),
        borderColor: entries.map((_, index) => colors[index % colors.length]),
        borderRadius: 6,
        borderWidth: 1
      }]
    };
  }

  private toRanking(group: EstatisticasGrupo | undefined, limit: number): RankingItem[] {
    const entries = this.entries(group)
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);

    const max = entries[0]?.value || 1;

    return entries.map(item => ({
      ...item,
      percent: Math.max(6, Math.round((item.value / max) * 100))
    }));
  }

  private entries(group: EstatisticasGrupo | undefined): RankingItem[] {
    return Object.entries(group ?? {}).map(([label, value]) => ({
      label,
      value,
      percent: 0
    }));
  }

  private topEntry(group: EstatisticasGrupo | undefined): RankingItem | null {
    return this.entries(group).sort((a, b) => b.value - a.value)[0] ?? null;
  }
}
