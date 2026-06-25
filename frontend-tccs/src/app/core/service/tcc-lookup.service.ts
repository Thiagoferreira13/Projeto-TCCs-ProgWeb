import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, shareReplay } from 'rxjs';
import { Aluno } from '../models/aluno.model';
import { Professor } from '../models/professor.model';
import { AlunoService } from './aluno.service';
import { ProfessorService } from './professor.service';

export interface TccLookupData {
  alunos: Aluno[];
  professores: Professor[];
  alunosPorId: ReadonlyMap<number, Aluno>;
  professoresPorId: ReadonlyMap<number, Professor>;
}

@Injectable({ providedIn: 'root' })
export class TccLookupService {
  private readonly alunoService = inject(AlunoService);
  private readonly professorService = inject(ProfessorService);
  private lookup$?: Observable<TccLookupData>;

  carregar(): Observable<TccLookupData> {
    if (!this.lookup$) {
      this.lookup$ = forkJoin({
        alunos: this.alunoService.listar(),
        professores: this.professorService.listar(),
      }).pipe(
        map(({ alunos, professores }) => {
          const alunosOrdenados = [...alunos].sort((a, b) => a.nome.localeCompare(b.nome));
          const professoresOrdenados = [...professores].sort((a, b) => a.nome.localeCompare(b.nome));

          return {
            alunos: alunosOrdenados,
            professores: professoresOrdenados,
            alunosPorId: new Map<number, Aluno>(alunos.map((aluno) => [aluno.id, aluno] as [number, Aluno])),
            professoresPorId: new Map<number, Professor>(
              professores.map((professor) => [professor.id, professor] as [number, Professor])
            ),
          };
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }

    return this.lookup$;
  }

  formatarAluno(aluno: Aluno): string {
    return `${aluno.nome} (${aluno.matricula})`;
  }

  formatarProfessor(professor: Professor): string {
    return professor.nome;
  }

  invalidarCache(): void {
    this.lookup$ = undefined;
  }
}
