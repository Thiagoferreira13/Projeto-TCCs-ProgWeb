import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface DialogFieldOption {
  value: string;
  label: string;
}

export interface DialogField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: DialogFieldOption[];
}

@Component({
  selector: 'app-form-modal',
  imports: [ReactiveFormsModule, MatIconModule],
  templateUrl: './form-modal.html',
  styleUrl: './form-modal.css',
})

export class FormModal {
  @Input() open = false;
 
  @Input() title = 'Cadastrar';
  @Input() titleIcon = 'add_circle';
 
  @Input() submitLabel = 'Salvar';
  @Input() cancelLabel = 'Cancelar';
 
  @Input() fields: DialogField[] = [];
 
  @Input() initialValue: Record<string, any> | null = null;
 
  @Output() submitted = new EventEmitter<Record<string, any>>();
  @Output() cancelled = new EventEmitter<void>();
 
  form = new FormGroup({});
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this.buildForm();
    }
 
    if (changes['initialValue'] || changes['open']) {
      if (this.open) {
        setTimeout(() => {
          if (this.initialValue) {
            this.form.patchValue(this.initialValue);
          } else {
            this.form.reset();
          }
        });
      }
    }
  }
 
  private buildForm(): void {
    const controls: Record<string, FormControl> = {};
 
    for (const field of this.fields) {
      controls[field.key] = new FormControl(
        '',
        field.required ? [Validators.required] : []
      );
    }
 
    this.form = new FormGroup(controls);
  }
 
  isInvalid(key: string): boolean {
    const control = this.form.get(key);
    return !!(control?.invalid && control?.touched);
  }
 
  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.submitted.emit(this.form.value as Record<string, any>);
  }
 
  onCancel(): void {
    this.cancelled.emit();
  }
 
  get isEditMode(): boolean {
    return this.initialValue !== null;
  }
}
