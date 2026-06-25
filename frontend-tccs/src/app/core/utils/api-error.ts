const DEFAULT_FIELD_LABELS: Record<string, string> = {
  codigo: 'Código',
  curso: 'Curso',
  departamento: 'Departamento',
  matricula: 'Matrícula',
  nome: 'Nome',
  sigla: 'Sigla',
  unidade_academica: 'Unidade Acadêmica',
};

export function getApiErrorMessage(
  error: any,
  fallback = 'Não foi possível salvar. Verifique os dados e tente novamente.',
  fieldLabels: Record<string, string> = {}
): string {
  const payload = error?.error ?? error;
  const labels = { ...DEFAULT_FIELD_LABELS, ...fieldLabels };

  if (!payload) {
    return fallback;
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.join(' ');
  }

  if (typeof payload === 'object') {
    const messages = Object.entries(payload)
      .flatMap(([field, value]) => {
        const fieldLabel = labels[field] ?? field;
        const fieldMessages = Array.isArray(value) ? value : [value];

        return fieldMessages.map(message => `${fieldLabel}: ${String(message)}`);
      })
      .filter(Boolean);

    return messages.length ? messages.join(' ') : fallback;
  }

  return fallback;
}
