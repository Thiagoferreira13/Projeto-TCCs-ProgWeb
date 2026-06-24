export interface Aluno {
  id: number;
  nome: string;
  matricula: string;
  curso: number | { id: number; nome: string; sigla: string, codigo: string };
}
