import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {MatButtonModule, MatNativeDateModule, MatSelectModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {FileSelectDirective} from 'ng2-file-upload';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {JwtModule} from '@auth0/angular-jwt';


import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material';
import {MatChipsModule} from '@angular/material/chips';


import {AppComponent} from './app.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MainDashboardComponent} from './main-dashboard/main-dashboard.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {NavComponent} from './nav/nav.component';
import {AddressComponent} from './address/address.component';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {ReactiveFormsModule} from '@angular/forms';
import {UserComponent} from './user/add-user/user.component';
import {RouterModule, Routes} from '@angular/router';
import {UserIndexComponent} from './user/user-index/user-index.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {HttpClientModule} from '@angular/common/http';
import {RestaurantIndexComponent} from './restaurant/restaurant-index/restaurant-index.component';
import {RestaurantCreateComponent} from './restaurant/restaurant-create/restaurant-create.component';
import {PlatCreateComponent} from './plat/plat-create/plat-create.component';
import {PlatIndexComponent} from './plat/plat-index/plat-index.component';
import {LivreIndexComponent} from './livre/livre-index/livre-index.component';
import {CategoryCreateComponent} from './category/category-create/category-create.component';
import {EmprunteIndexComponent} from './emprunte/emprunte-index/emprunte-index.component';
import {OWL_DATE_TIME_LOCALE, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {EmprunteurIndexComponent} from './emprunteur/emprunteur-index/emprunteur-index.component';
import {AblisFormComponent} from './etablis/ablis-form/ablis-form.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './auth.guard';
import {EtudiantListComponent} from './emprunteur/etudiant-list/etudiant-list.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CategoryIndexComponent} from './category/category-index/category-index.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: UserComponent,
  },
  {
    path: 'admin', component: NavComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'livre/index', pathMatch: 'full'},
      {path: 'user/index', component: UserIndexComponent},
      {
        path: 'user/index',
        component: UserIndexComponent
      },
      {
        path: 'resto/index',
        component: RestaurantIndexComponent
      },
      {
        path: 'resto/add',
        component: RestaurantCreateComponent
      },
      {
        path: 'plat/create/:id',
        component: PlatCreateComponent
      },
      {
        path: 'plat/index/:id',
        component: PlatIndexComponent
      },
      {
        path: 'livre/index',
        component: LivreIndexComponent,
      },
      {
        path: 'emprunte/index',
        component: EmprunteIndexComponent,
      },
      {
        path: 'emprunte/index/:id',
        component: EmprunteIndexComponent,
      },
      {
        path: 'emprunteur/index',
        component: EmprunteurIndexComponent,
      },
      {
        path: 'etudiant/list',
        component: EtudiantListComponent,
      },
      {
        path: 'category/index',
        component: CategoryIndexComponent,
      },
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MainDashboardComponent,
    NavComponent,
    AddressComponent,
    UserComponent,
    UserIndexComponent,
    RestaurantIndexComponent,
    RestaurantCreateComponent,
    PlatCreateComponent,
    PlatIndexComponent,
    FileSelectDirective,
    LivreIndexComponent,
    CategoryCreateComponent,
    EmprunteIndexComponent,
    EmprunteurIndexComponent,
    AblisFormComponent,
    LoginComponent,
    LoginComponent,
    EtudiantListComponent,
    CategoryIndexComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    FormsModule,
    MatCheckboxModule,
    NgbModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatExpansionModule,
    MatTooltipModule,
    // Add this import here
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: ['localhost:3000/api/login', 'localhost:3000/api/register']
      }
    })
  ],
  providers: [MatDatepickerModule, {
    provide: OWL_DATE_TIME_LOCALE,
    useValue: 'fr'
  },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
  entryComponents: [CategoryCreateComponent, AblisFormComponent, EmprunteurIndexComponent],
})
export class AppModule {
}
