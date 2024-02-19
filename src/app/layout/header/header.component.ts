import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  cartOutline,
  homeOutline,
  layersOutline,
  starOutline,
} from 'ionicons/icons';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule],
})
export class HeaderComponent implements OnInit {
  _router = inject(Router);
  _platform = inject(Platform);
  currentRoute = '';

  constructor() {
    addIcons({ starOutline, layersOutline, homeOutline, cartOutline });
  }

  getActiveButton() {
    switch (this.currentRoute) {
      case '/dashboard':
        return 'Dashboard';
      case '/wishlist':
        return 'Wishlist';
      case '/checkout':
        return 'Checkout';
      case '/courses':
        return 'Courses';
      default:
        return '';
    }
  }

  buttons: any[] = [
    {
      title: 'Dashboard',
      icon: 'home-outline',
      btnHandler: () => this._router.navigate(['/']),
    },
    {
      title: 'Courses',
      icon: 'layers-outline',
      btnHandler: () => this._router.navigate(['/courses']),
    },
    {
      title: 'Wishlist',
      icon: 'star-outline',
      btnHandler: () => this._router.navigate(['/wishlist']),
    },

    {
      title: 'Checkout',
      icon: 'cart-outline',
      btnHandler: () => this._router.navigate(['/checkout']),
    },
  ];

  get isMobile() {
    return this._platform.is('mobile');
  }

  ngOnInit() {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  handleEvent(event: MouseEvent | TouchEvent, btnHandler: Function) {
    event.preventDefault();
    if (event.type !== 'click' && (event as TouchEvent).touches.length > 1) {
      return;
    }
    btnHandler();
  }
}
