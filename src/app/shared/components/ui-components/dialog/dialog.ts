import {
  Component,
  ViewChild,
  inject,
  ChangeDetectorRef,
  ApplicationRef,
  Injector,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';

import { DOCUMENT, CommonModule } from '@angular/common';
import { CdkPortal, PortalModule, DomPortalOutlet } from '@angular/cdk/portal';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';

@Component({
  selector: 'app-dialog',
  imports: [CommonModule, PortalModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog {
  @ViewChild(CdkPortal) portalContent!: CdkPortal;
  @ViewChild('dialogContainer') dialogContainer!: ElementRef<HTMLDivElement>;

  private appRef = inject(ApplicationRef);
  private injector = inject(Injector);
  private document = inject(DOCUMENT);

  private sso = inject(ScrollStrategyOptions);
  private scrollStrategy: ScrollStrategy = this.sso.block();

  private portalOutlet!: DomPortalOutlet;
  public isVisible = false;
  private cdr = inject(ChangeDetectorRef);
  @Input() layoutType: number = 1;
  @Input() widthClass: string = 'w-full max-w-md';
  @Input() footerVisible: boolean = true;
  @Input() positionMode: 'fixed' | 'absolute' = 'fixed';
  @Input() portalTarget: HTMLElement | null = null;
  @Output() closed = new EventEmitter<void>();

  ngOnInit(): void {
    const target = this.portalTarget || this.document.getElementById('form-dialog-root-wrapper');
    if (!target) {
      throw new Error('Dialog root wrapper element not found');
    }

    // Create a DomPortalOutlet targeting <body> or specific element
    this.portalOutlet = new DomPortalOutlet(
      target,
      this.appRef,
      this.injector
    );
  }

  ngAfterViewInit(): void {
    this.open();
  }

  open(): void {
    if (this.portalContent && !this.portalOutlet.hasAttached()) {
      this.portalOutlet.attach(this.portalContent);
      document.body.classList.add('!overflow-hidden');
      this.scrollStrategy.enable();

      // Use requestAnimationFrame to ensure the DOM is updated before adding the visible class
      requestAnimationFrame(() => {
        this.isVisible = true;
        this.cdr.detectChanges();
      });
    }
  }

  closeDialog(): void {
    this.isVisible = false;
    this.cdr.detectChanges();
  }

  onTransitionEnd(event: Event) {
    // Ensure we only detach when the dialog is closing (isVisible is false)
    // and the transition is on the transform property (or opacity) of the dialog panel
    if (!this.isVisible && this.portalOutlet?.hasAttached()) {
      this.portalOutlet.detach();
      document.body.classList.remove('!overflow-hidden');
      this.scrollStrategy.disable();
      this.closed.emit();
    }
  }

  ngOnDestroy(): void {
    if (this.portalOutlet?.hasAttached()) {
      this.portalOutlet.detach();
      document.body.classList.remove('!overflow-hidden');
    }
    this.scrollStrategy.disable();
  }
}
