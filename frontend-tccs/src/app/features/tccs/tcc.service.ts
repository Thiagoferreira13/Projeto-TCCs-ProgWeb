import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tcc, TccPayload } from './tcc.model';

@Injectable({ providedIn: 'root' })
export class TccService {
  private baseUrl = 'http://127.0.0.1:8000/api/tccs/';

  constructor(private http: HttpClient) {}

  /** GET /api/tccs/?search=… — lista TCCs, com busca opcional em título e resumo */
  listar(search = ''): Observable<Tcc[]> {
    const params = search
      ? new HttpParams().set('search', search)
      : new HttpParams();
    return this.http.get<Tcc[]>(this.baseUrl, { params });
  }

  /** GET /api/tccs/{id}/ */
  buscarPorId(id: number): Observable<Tcc> {
    return this.http.get<Tcc>(`${this.baseUrl}${id}/`);
  }

  /** POST /api/tccs/ */
  criar(tcc: TccPayload): Observable<Tcc> {
    return this.http.post<Tcc>(this.baseUrl, tcc);
  }

  /** PUT /api/tccs/{id}/ */
  atualizar(id: number, tcc: TccPayload): Observable<Tcc> {
    return this.http.put<Tcc>(`${this.baseUrl}${id}/`, tcc);
  }

  /** DELETE /api/tccs/{id}/ */
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}/`);
  }
}
