import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AlertVariant = 'basic' | 'destructive' | 'action';

const BASE = 'relative w-full rounded-lg border px-4 py-3 text-sm';

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  basic:       'border-border bg-background text-foreground',
  destructive: 'border-destructive/50 bg-destructive/5 text-destructive dark:border-destructive',
  action:      'border-border bg-background text-foreground',
};

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {
  readonly variant = input<AlertVariant>('basic');
  readonly class   = input<string>('');

  protected readonly hostClass = computed(() =>
    [BASE, VARIANT_CLASSES[this.variant()], this.class()].filter(Boolean).join(' ')
  );

  protected readonly isAction = computed(() => this.variant() === 'action');
}
