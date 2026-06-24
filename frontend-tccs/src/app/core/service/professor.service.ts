import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CrudService } from './crud.service';
import { Professor } from '../models/professor.model';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService extends CrudService<Professor> {

  constructor(http: HttpClient) {
    super(
      http,
      'http://127.0.0.1:8000/api/professores/'
    );
  }

  pesquisar(termo: string) {
    return this.listar({
      search: termo
    });
  }
}