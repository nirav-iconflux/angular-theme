import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from './shared/components/ui-components/button/button';
import { Accordion } from './shared/components/ui-components/accordion/accordion';
import { DialogContent } from './dialog-content/dialog-content';
import { Alert } from './shared/components/ui-components/alert/alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button, Accordion, DialogContent, Alert],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('angular-theme');
  public isDialogOpen = signal(false);
  public dialogLayoutType = signal(1);

  openDialog() {
    this.dialogLayoutType.set(1);
    this.isDialogOpen.set(true);
  }

  openDialogRight() {
    this.dialogLayoutType.set(2);
    this.isDialogOpen.set(true);
  }
}
