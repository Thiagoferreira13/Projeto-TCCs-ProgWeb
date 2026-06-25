import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CrudService } from './crud.service';
import { Aluno } from '../models/aluno.model';

@Injectable({
  providedIn: 'root'
})
export class AlunoService extends CrudService<Aluno> {

  constructor(http: HttpClient) {
    super(
      http,
      'http://127.0.0.1:8000/api/alunos/'
    );
  }

  pesquisar(termo: string) {
    return this.listar({
      search: termo
    });
  }
}
