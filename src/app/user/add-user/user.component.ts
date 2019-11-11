import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UserService} from '../../service/user.service';
import Swal from 'sweetalert2';
import {timeout} from 'q';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements AfterViewInit, OnDestroy {
  UserForm = this.fb.group({
    name: [null, [Validators.required, Validators.minLength(6)]],
    email: [null, [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    address: [null, [Validators.required, Validators.minLength(6)]],
    ville: null
  });

  constructor(private fb: FormBuilder,
              private userService: UserService,
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

  onSubmit() {
    this.userService.StoreUser(this.UserForm.value).subscribe((res) => {
      if (res.done) {
        Swal.fire({
          position: 'center',
          type: 'success',
          title: 'vous avez réussi à vous inscrire',
          showConfirmButton: false,
          timer: 2000
        });
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 1000);
      } else {
        Swal.fire(
          'Alert',
          res.message,
          'warning'
        );
      }
    }, e => {
      Swal.fire(
        'Alert',
        e.error,
        'warning'
      );
    });
  }
}
