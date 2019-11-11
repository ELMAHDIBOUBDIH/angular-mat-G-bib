import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../service/auth.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  Form = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) {
  }

  ngAfterViewInit() {
    document.querySelector('body').classList.remove('body');
    document.querySelector('body').classList.add('login-body');
  }

  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('login-body');
    document.querySelector('body').classList.add('body');
  }

  ngOnInit() {
    if (this.loggedIn()) {
      this.router.navigate(['admin/livre/index']);
    }
  }

  signin() {
    if (this.Form.invalid) {
      return;
    }

    this.authService.login(
      this.Form.value)
      .subscribe(
        (result: any) => {
          console.log(result);
          if (result.done) {
            Swal.fire({
              position: 'center',
              type: 'success',
              title: 'bienvenue !',
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigate(['admin/livre/index']);
          } else {
            Swal.fire(
              'Alert',
              result.msg,
              'warning'
            );
          }
        },
        error => {
          Swal.fire(
            'Alert',
            error.message,
            'warning'
          );
        }
      );
  }

  loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }
}
