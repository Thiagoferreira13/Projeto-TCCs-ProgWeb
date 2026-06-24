/**
 * Espelha exatamente o que TCCSerializer (Django) retorna.
 * aluno, orientador, coorientador, presidente, primeiro_membro e
 * segundo_membro são apenas IDs numéricos (chaves estrangeiras) —
 * o backend não expande esses relacionamentos.
 */
export interface Tcc {
  id: number;
  titulo: string;
  resumo: string;
  palavras_chave: string;

  tipo: string;            // ex: 'MONOGRAFIA'
  tipo_display: string;    // ex: 'Monografia'

  idioma: string;          // ex: 'PT'
  idioma_display: string;  // ex: 'Português'

  aluno: number;
  orientador: number;
  coorientador: number | null;

  presidente: number;
  primeiro_membro: number;
  segundo_membro: number;

  semestre_letivo_defesa: string | null;

  status: string;          // ex: '0', '1', '2', '3'
  status_display: string;  // ex: 'Em Elaboração', 'Aprovado'...

  arquivo: string | null;  // URL do arquivo, ou null se não tiver
}

/**
 * Formato usado ao CRIAR ou EDITAR um TCC (envio para a API).
 * Igual ao Tcc, mas sem "id" (gerado pelo backend) e sem os campos
 * "_display" (são só leitura, calculados pelo backend).
 */
export type TccPayload = Omit<
  Tcc,
  'id' | 'tipo_display' | 'idioma_display' | 'status_display'
>;
