import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewChild, ElementRef, ApplicationRef, Injector, Renderer2, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DOCUMENT, CommonModule } from '@angular/common';
import { CdkPortal, PortalModule, DomPortalOutlet } from '@angular/cdk/portal';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, PortalModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {

}
