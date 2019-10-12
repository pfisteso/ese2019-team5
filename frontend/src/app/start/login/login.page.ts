import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from "../../AuthService/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
/**
 * LoginPage
 * Asks an (existing) user for his authentication data (e-mail, password)
 * Does entire Authentication-stuff...
 * To be implemented
 */
export class LoginPage implements OnInit {

  authService: AuthService;
  mail: string;
  pw: string;


  constructor(private formBuilder: FormBuilder) { }

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });


  ngOnInit() {
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  // ToDo: Implement verification etc.
  logIn() {
    this.authService(mail, pw);

  }
}
