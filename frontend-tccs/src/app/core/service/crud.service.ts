import { HttpClient } from '@angular/common/http';

export abstract class CrudService<T> {

  constructor(
    protected http: HttpClient,
    protected api: string
  ) {
    this.api = api.endsWith('/') ? api : `${api}/`;
  }

listar(params?: Record<string, string>) {
  return this.http.get<T[]>(this.api, { params });
}

criar(data: Partial<T>) {
  return this.http.post<T>(this.api, data);
}

buscar(id: number) {
  return this.http.get<T>(`${this.api}${id}/`);
}

editar(id: number, data: Partial<T>) {
  return this.http.put<T>(`${this.api}${id}/`, data);
}

excluir(id: number) {
  return this.http.delete(`${this.api}${id}/`);
}
}