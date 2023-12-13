import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { navbarData,  } from './nav-data';
import { MatIconModule } from '@angular/material/icon';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { INavbarData, fadeInOut } from './helper';
import { Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    fadeInOut,
    trigger('rotate',[
      transition(':enter',[
        animate('1500ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(2turn)', offset: '1'}),
          ])
        )
      ])
    ])

  ]
})
export class SidebarComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(private router:Router, public authService: AuthService){}


  ngOnInit(): void {
    this.screenWidth = window.innerWidth;

  }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  multiple: boolean = false;

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });

  }

  handleClick(item: INavbarData): void{
    if(!this.multiple){
      for(let modelItem of this.navData){
        if(item!== modelItem && modelItem.expanded){
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded;
  }

  logout(): void {
    this.authService.logout(); 
    this.router.navigate(['/login'])
  }


}
