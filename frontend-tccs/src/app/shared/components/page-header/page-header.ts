import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  imports: [MatIconModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  @Input() pageTitle = '';
  @Input() subtitle = '';
  @Input() buttonText = '';
  @Input() buttonIcon = '';
}
