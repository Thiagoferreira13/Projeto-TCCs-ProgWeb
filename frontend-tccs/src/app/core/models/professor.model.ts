export interface Professor {
  id: number;
  nome: string;
  departamento: number | { id: number; nome: string; sigla?: string };
}
