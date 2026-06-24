import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-modal',
  imports: [MatIconModule],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModal {
  @Input() open = false;
  @Input() title = 'Confirmar';
  @Input() message = 'Tem certeza que deseja realizar esta ação?';
  @Input() warningText: string | null = null;
  @Input() confirmLabel = 'Confirmar';
  @Input() cancelLabel = 'Cancelar';
  /** Quando true, o botão de confirmação fica vermelho (ação destrutiva) */
  @Input() destructive = false;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
 
  onConfirm(): void {
    this.confirmed.emit();
  }
 
  onCancel(): void {
    this.cancelled.emit();
  }

}
