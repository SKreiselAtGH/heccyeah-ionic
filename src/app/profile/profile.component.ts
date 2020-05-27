import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../service/firebase.service';
import * as firebase from 'firebase';
import {from, Observable} from 'rxjs';

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
   this.getUser();
   console.log(this.user);
  }
  getUser() {
    const db = firebase.firestore();
    let obs: Observable<any>;
    const signedIn = firebase.auth().currentUser;
    const userRef = db.collection('app').doc('users').collection('user_info').doc(signedIn.email);
    console.log(userRef);
    obs = from(userRef.get().then(doc => {
      if (doc.exists) {
        this.user = doc.data();
        console.log('Document data:', doc.data());
      } else {
        console.log('No such document!');
      }
    }).catch(error => {
      console.log('Error getting document:', error);
    }));
  }



}
