import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CrudService } from './crud.service';
import { UnidadeAcademica } from '../models/unidade-academica.model';

@Injectable({
  providedIn: 'root'
})
export class UnidadeAcademicaService extends CrudService<UnidadeAcademica> {

  constructor(http: HttpClient) {
    super(
      http,
      'http://127.0.0.1:8000/api/unidades-academicas/'
    );
  }
}
