import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export interface TableColumn {
  key: string;
  label: string;
  minWidth?: string;
}

export type PageItem = number | '...';

@Component({
  selector: 'app-table-list',
  imports: [MatIconModule],
  templateUrl: './table-list.html',
  styleUrl: './table-list.css',
  encapsulation: ViewEncapsulation.None,
})
export class TableList {
  @Input() columns: TableColumn[] = [];
  @Input() totalItems: number = 0;
  @Input() shownItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  @Input() windowSize: number = 1;

  @Output() pageChange = new EventEmitter<number>();

  get pageItems(): PageItem[] {
    const { currentPage, totalPages, windowSize } = this;

    if (totalPages <= 1) return [1];

    const rangeStart = Math.max(2, currentPage - windowSize);
    const rangeEnd = Math.min(totalPages - 1, currentPage + windowSize);

    const items: PageItem[] = [1];

    if (rangeStart > 2) {
      items.push('...');
    }

    for (let p = rangeStart; p <= rangeEnd; p++) {
      items.push(p);
    }

    if (rangeEnd < totalPages - 1) {
      items.push('...');
    }

    items.push(totalPages);

    return items;
  }

  isEllipsis(item: PageItem): item is '...' {
    return item === '...';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}