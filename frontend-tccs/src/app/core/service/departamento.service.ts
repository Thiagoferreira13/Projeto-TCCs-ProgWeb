import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { Departamento } from '../models/departamento.model';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService extends CrudService<Departamento> {

  constructor(http: HttpClient) {
    super(
      http,
      'http://127.0.0.1:8000/api/departamentos/'
    );
  }
}