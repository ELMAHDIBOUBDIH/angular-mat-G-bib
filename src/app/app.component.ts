import {Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AuthService} from './service/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Restaurant-Panel';
}
