import { Component, Input, booleanAttribute } from '@angular/core';
import { NgClass } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.css',
  host: {
    'class': 'inline-block'
  }
})
export class Button {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'default';
  @Input({ transform: booleanAttribute }) disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  get buttonClasses(): string {
    const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-medium transition duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer border border-transparent';
    
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-xs)] hover:opacity-90',
      secondary: 'bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-[var(--shadow-xs)] hover:opacity-80',
      destructive: 'bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-[var(--shadow-xs)] hover:opacity-90',
      outline: 'border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] shadow-[var(--shadow-xs)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
      ghost: 'hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] text-[var(--foreground)]',
      link: 'text-[var(--primary)] underline-offset-4 hover:underline decoration-[var(--primary)]'
    };

    const sizes: Record<ButtonSize, string> = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3 text-xs',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10 p-0'
    };

    return `${base} ${variants[this.variant]} ${sizes[this.size]}`;
  }
}
