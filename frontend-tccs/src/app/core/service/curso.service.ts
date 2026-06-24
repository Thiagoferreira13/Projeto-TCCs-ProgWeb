import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { Curso } from '../models/curso.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService extends CrudService<Curso> {

  constructor(http: HttpClient) {
    super(
      http,
      'http://127.0.0.1:8000/api/cursos/'
    );
  }
}