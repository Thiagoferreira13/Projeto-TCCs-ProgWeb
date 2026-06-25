import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface TableColumn {
  key: string;
  label: string;
  minWidth?: string;
}

@Component({
  selector: 'app-table-list',
  imports: [FormsModule, MatIconModule],
  templateUrl: './table-list.html',
  styleUrl: './table-list.css',
  encapsulation: ViewEncapsulation.None,
})
export class TableList implements OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  pageInput = '1';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage']) {
      this.pageInput = String(this.currentPage);
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get shownItems(): number {
    const start = (this.currentPage - 1) * this.pageSize;
    return Math.min(this.pageSize, this.totalItems - start);
  }

  get startItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  goToTypedPage(): void {
    const page = Number(this.pageInput);

    if (!Number.isFinite(page)) {
      this.pageInput = String(this.currentPage);
      return;
    }

    const clampedPage = Math.min(this.totalPages, Math.max(1, Math.trunc(page)));
    this.pageInput = String(clampedPage);
    this.goToPage(clampedPage);
  }
}