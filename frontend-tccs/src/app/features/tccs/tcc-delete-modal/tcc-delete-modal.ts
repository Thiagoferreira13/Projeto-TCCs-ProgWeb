import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface TccResumo {
  id: number;
  titulo: string;
  aluno: string;
  status: string;
}

@Component({
  selector: 'app-tcc-delete-modal',
  imports: [MatIconModule],
  templateUrl: './tcc-delete-modal.html',
  styleUrls: ['./tcc-delete-modal.css', '../tccs-shared.css'],
})
export class TccDeleteModal {
  // Dados do TCC que está sendo excluído, vindos do componente pai (tccs-list)
  @Input() tcc: TccResumo | null = null;

  // Avisa o pai quando o usuário confirma ou cancela
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onConfirmar() {
    this.confirmar.emit();
  }

  onCancelar() {
    this.cancelar.emit();
  }

  getBadgeClass(status: string): string {
    return 'badge badge--' + status.toLowerCase().replace(' ', '-');
  }
}
