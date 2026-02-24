import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// ─── DropdownItem interface ─────────────────────────────────────────────────
export interface DropdownItem {
  id: string;
  label: string;
  /** Inline SVG string (e.g. full <svg>…</svg> markup) */
  icon?: string;
  type?: 'item' | 'checkbox' | 'radio' | 'separator' | 'label';
  checked?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  /** Radio group name – required when type === 'radio' */
  group?: string;
  /** Keyboard shortcut display label, e.g. "⌘+T" */
  shortcut?: string;
  /** Navigation URL – renders the item as an <a> element when provided */
  href?: string;
  /** Anchor target attribute, e.g. '_blank' */
  target?: string;
  /** Anchor rel attribute; defaults to 'noopener noreferrer' when target='_blank' */
  rel?: string;
}

// ─── DropdownMenu Component ─────────────────────────────────────────────────
@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative inline-block' },
})
export class DropdownMenu implements OnDestroy {

  // ── Inputs ────────────────────────────────────────────────────────────────
  @Input() set items(value: DropdownItem[]) {
    this.internalItems.set(this._deepClone(value));
  }

  /** Visual variant hint – used in the host template for context */
  @Input() variant: string = 'basic';

  /** Additional Tailwind classes for the menu panel */
  @Input() panelClass: string = '';

  /**
   * Close the menu after a regular 'item' click.
   * Checkbox / radio items never auto-close regardless of this flag.
   */
  @Input() closeOnSelect: boolean = true;

  // ── State signals ─────────────────────────────────────────────────────────
  readonly isOpen: WritableSignal<boolean> = signal(false);
  readonly internalItems: WritableSignal<DropdownItem[]> = signal([]);
  readonly activeIndex: WritableSignal<number> = signal(-1);

  // ── Derived ───────────────────────────────────────────────────────────────
  /** IDs of items that can receive keyboard focus (no separator / label / disabled) */
  readonly focusableItems = computed<DropdownItem[]>(() =>
    this.internalItems().filter(
      (i) => i.type !== 'separator' && i.type !== 'label' && !i.disabled,
    ),
  );

  /** The item ID currently highlighted via keyboard */
  readonly highlightedId = computed<string | null>(() => {
    const idx = this.activeIndex();
    return idx >= 0 ? (this.focusableItems()[idx]?.id ?? null) : null;
  });

  // ── Private ───────────────────────────────────────────────────────────────
  private _docClickHandler: ((e: MouseEvent) => void) | null = null;

  constructor(
    private readonly _el: ElementRef<HTMLElement>,
    private readonly _sanitizer: DomSanitizer,
  ) {}

  // ── Public API ────────────────────────────────────────────────────────────
  toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    this.isOpen.set(true);
    this.activeIndex.set(-1);
    this._docClickHandler = (e: MouseEvent) => {
      if (!this._el.nativeElement.contains(e.target as Node)) {
        this.close();
      }
    };
    document.addEventListener('click', this._docClickHandler, true);
  }

  close(): void {
    this.isOpen.set(false);
    this.activeIndex.set(-1);
    this._removeDocListener();
  }

  // ── Item interaction ──────────────────────────────────────────────────────
  onItemClick(item: DropdownItem, event: MouseEvent): void {
    if (item.disabled) return;
    event.stopPropagation();

    if (item.type === 'checkbox') {
      this._toggleCheckbox(item.id);
      return; // never close on checkbox
    }
    if (item.type === 'radio') {
      this._selectRadio(item.id, item.group ?? '');
      return; // never close on radio
    }
    if (this.closeOnSelect) {
      this.close();
    }
  }

  isHighlighted(id: string): boolean {
    return this.highlightedId() === id;
  }

  // ── Icon helper ───────────────────────────────────────────────────────────
  safeIcon(svg: string): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(svg);
  }

  // ── Keyboard handler (bound on host container) ────────────────────────────
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.open();
      }
      return;
    }

    const focusable = this.focusableItems();
    const cur = this.activeIndex();

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.set(
          cur < focusable.length - 1 ? cur + 1 : 0,
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.set(
          cur > 0 ? cur - 1 : focusable.length - 1,
        );
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (cur >= 0 && cur < focusable.length) {
          const item = focusable[cur];
          if (item.type === 'checkbox') {
            this._toggleCheckbox(item.id);
          } else if (item.type === 'radio') {
            this._selectRadio(item.id, item.group ?? '');
          } else if (!item.disabled) {
            if (this.closeOnSelect) this.close();
          }
        }
        break;
    }
  }

  // ── Private helpers ───────────────────────────────────────────────────────
  private _toggleCheckbox(id: string): void {
    this.internalItems.update((items) =>
      items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)),
    );
  }

  private _selectRadio(id: string, group: string): void {
    this.internalItems.update((items) =>
      items.map((i) =>
        i.group === group ? { ...i, checked: i.id === id } : i,
      ),
    );
  }

  private _deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private _removeDocListener(): void {
    if (this._docClickHandler) {
      document.removeEventListener('click', this._docClickHandler, true);
      this._docClickHandler = null;
    }
  }

  ngOnDestroy(): void {
    this._removeDocListener();
  }
}

