import { ChangeDetectionStrategy, Component, Input, ViewChild, output } from '@angular/core';
import { Dialog } from '../shared/components/ui-components/dialog/dialog';
import { Button } from '../shared/components/ui-components/button/button';

@Component({
  selector: 'app-dialog-content',
  imports: [Dialog, Button],
  templateUrl: './dialog-content.html',
  styleUrl: './dialog-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContent {
  @ViewChild('formDialog') formDialog!: Dialog;
  @Input() layoutType: number = 1;

  readonly closed = output();

  onDialogClose(): void {
    this.formDialog.closeDialog();
  }

  onClosed(): void {
    this.closed.emit();
  }
}
