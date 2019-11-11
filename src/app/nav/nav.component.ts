import {Component, Input} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, share} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FormBuilder} from '@angular/forms';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );
  items: any[] = [
    /*  {
        displayName: 'Utilisateur',
        iconName: 'recent_actors',
        route: 'user/index',
        children: []
       },
      /*    {
            displayName: 'Restaurant',
            iconName: 'recent_actors',
            route: 'resto/index'
          },
      {
        displayName: 'livre',
        iconName: 'recent_actors',
        children: [{
          displayName: 'listes des livres',
          iconName: 'recent_actors',
          route: 'livre/index',
        },
          {
            displayName: 'listes des Empruntes',
            iconName: 'recent_actors',
            route: 'emprunte/index',
          }
        ]
      },*/
    {
      displayName: 'Livres',
      iconName: 'menu_book',
      route: 'livre/index'
    },
    {
      displayName: 'Categories',
      iconName: 'account_box',
      route: 'category/index'
    },
    {
      displayName: 'Empruntes',
      iconName: 'add_shopping_cart',
      route: 'emprunte/index'
    },
    {
      displayName: 'Etudiants',
      iconName: 'account_box',
      route: 'etudiant/list'
    }
  ];

  constructor(private breakpointObserver: BreakpointObserver,
              private fb: FormBuilder,
              private auth: AuthService,
              private router: Router) {
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
