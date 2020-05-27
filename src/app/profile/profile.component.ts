import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../service/firebase.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userEmail = '';
  user: any;
  constructor( private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.getUser();
    console.log(this.user);
  }


}
