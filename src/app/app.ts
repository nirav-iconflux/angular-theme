import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from './shared/components/ui-components/button/button';
import { Accordion } from './shared/components/ui-components/accordion/accordion';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Button, Accordion],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-theme');
}
