import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tcc, TccPayload } from './tcc.model';

@Injectable({ providedIn: 'root' })
export class TccService {
  // Ajuste aqui se o endereço do Django mudar.
  private baseUrl = 'http://127.0.0.1:8000/api/tccs/';

  constructor(private http: HttpClient) {}

  /** GET /api/tccs/ — lista todos os TCCs */
  listar(): Observable<Tcc[]> {
    return this.http.get<Tcc[]>(this.baseUrl);
  }

  /** GET /api/tccs/{id}/ — busca um TCC específico (usado na edição) */
  buscarPorId(id: number): Observable<Tcc> {
    return this.http.get<Tcc>(`${this.baseUrl}${id}/`);
  }

  /** POST /api/tccs/ — cria um novo TCC */
  criar(tcc: TccPayload): Observable<Tcc> {
    return this.http.post<Tcc>(this.baseUrl, tcc);
  }

  /** PUT /api/tccs/{id}/ — atualiza um TCC existente (substitui todos os campos) */
  atualizar(id: number, tcc: TccPayload): Observable<Tcc> {
    return this.http.put<Tcc>(`${this.baseUrl}${id}/`, tcc);
  }

  /** DELETE /api/tccs/{id}/ — exclui um TCC */
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }
}
