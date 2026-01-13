import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accordion',
  imports: [CommonModule],
  templateUrl: './accordion.html',
  styleUrl: './accordion.css',
  standalone: true
})
export class Accordion {
  isOpen = signal(false);

  toggle() {
    this.isOpen.update(value => !value);
  }
}

