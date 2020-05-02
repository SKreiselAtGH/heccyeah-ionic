import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FirebaseService} from '../service/firebase.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
  signUp = false;
  pswChecked = false;
  confChecked = false;
  password = '';
  newPassword = '';
  email = '';
  firstName = '';
  lastName = '';
  username = '';
  userEmail = '';
  userPassword = '';
  confirmPassword = '';
  passwordValid = true;
  passQualValid = true;
  usernameValid = true;
  emailValid = true;
  firstNValid = true;
  lastNValid = true;
  constructor( private firebaseService: FirebaseService,
               private router: Router) { }

  ngOnInit() {}

  toggleSignUp() {
    this.signUp = !this.signUp;
  }

  logIn() {
    this.firebaseService.emailLogin(this.email, this.password).subscribe(r => {
      console.log(r);
      this.router.navigateByUrl('/profile');

    });
  }

  signUpCall() {
    if (this.isValidSignUp()) {
      this.firebaseService.createUser(this.email, this.newPassword, this.firstName, this.lastName, this.username);
      this.router.navigateByUrl('/main-feed');
    } else {
      console.log('Invalid sign up');
    }
  }

  isValidSignUp() {
    this.testPassword();
    this.emailValid = (this.email.length > 0);
    this.usernameValid = (this.username.length > 0);
    this.firstNValid = (this.firstName.length > 0);
    this.lastNValid = (this.lastName.length > 0);
    return this.emailValid && this.usernameValid && this.firstNValid && this.lastNValid;
  }

  testPassword() {
    const pattern = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
    if (this.newPassword === this.confirmPassword) {
      this.passwordValid = true;
    } else {
      this.passwordValid = false;
    }
    if (pattern.test(this.newPassword)) {
      this.passQualValid = true;
    } else {
      this.passQualValid = false;
    }
  }

}
