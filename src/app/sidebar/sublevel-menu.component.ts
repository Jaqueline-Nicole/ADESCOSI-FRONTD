import { Component, OnInit, Input } from '@angular/core';
import { INavbarData, fadeInOut } from './helper';
import { animate, state, style, transition, trigger, } from '@angular/animations';

@Component({
  selector: 'app-sublevel-menu',
  template: `
    <ul
      *ngIf="collapsed && data.items && data.items.length > 0"
      [@submenu]="expanded ? 

      {value:'visible', params:{transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height:'*'}}
      :
      {value:'hidden', params:{transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)',  height:'0'}}"
      class="sublevel-nav"
    >
      <li *ngFor="let item of data.items" class="sublevel-nav-item">
        <a
          class="sublevel-nav-link"
          (click)="handleClick(item)"
          *ngIf="item.items && item.items.length > 0"
        >
          <mat-icon class="sidenav-link-icon" fontIcon="fiber_manual_record"></mat-icon> 
          <!-- <i class="sublevel-link-icon fa fa-circle"></i> -->
          <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">{{item.label}}</span>
          <mat-icon *ngIf="item.items && collapsed" class="menu-collapse-icon">
            {{ data.expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
          </mat-icon>
        </a>
        <a
          class="sublevel-nav-link"
          *ngIf="!item.items || (item.items && item.items.length === 0)"
          [routerLink]="[item.routeLink]"
          routerLinkActive="active-sublevel"
          [routerLinkActiveOptions]="{exact: true }"
        >
          <!-- <i class="sublevel-link-icon fa fa-circle"></i> -->
          <mat-icon class="sidenav-link-icon" fontIcon={{item.icon}}></mat-icon> 
          <span class="sublevel-link-text"  @fadeInOut *ngIf="collapsed">{{item.label}}</span>
        </a>
        <div *ngIf="item.items && item.items.length > 0">
          <app-sublevel-menu
            [data]="item"
            [collapsed]="collapsed"
            [multiple]="multiple"
            [expanded]="item.expanded"
          ></app-sublevel-menu>
        </div>
      </li>
    </ul>
  `,
  styleUrls: ['./sidebar.component.css'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden',style({
          height: '0',
          overflow: 'hidden',
        })),
      state(
        'visible',
        style({
          height: '*',
        })
      ),
      transition('visible <=> hidden', [
        style({ overflow: 'hidden' }),
        animate('{{transitionParams}}')]),
      transition('void => *', animate(0)),
    ]),
  ],
})
export class SublevelMenuComponent implements OnInit {

  @Input() data: INavbarData = {
    routeLink: '',
    icon: '',
    label: '',
    items: [],
  };
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  handleClick(item: any): void {
    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let modelItem of this.data.items) {
          if (item !==modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;
  }
}
