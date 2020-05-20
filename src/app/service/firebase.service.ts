import { Injectable, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase';
import 'firebase/auth';

import {User} from 'firebase';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService implements OnInit {

  public ids: string[];
  observe: Observable<any>;
  private fs: any;
  loggedIn = false;
  userRefID: any;
  name = '';
  user: any;
  private auth: any;
  private newUser: any;
  private currentUser: firebase.User;
  signedIn: any;
  constructor(public db: AngularFirestore,
              public http: HttpClient,
              private router: Router) { }

  // tslint:disable-next-line:contextual-lifecycle
  ngOnInit() {
    this.currentUser = firebase.auth().currentUser;
  }

  initDB() {
    let check: Observable<any>;
    check = this.db.collection('users/user_info').valueChanges();
    this.getUsers();
    console.log(this.ids);
    return check;
  }



  date() {
    console.log('changed');
    return this.http.get<any>('https://api.timezonedb.com/v2.1/get-time-zone?key=QSU8HCQU9BBY&format=json&by=zone&zone=CDT');
  }

  // createMessage(value) {
  //   return this.db.collection('messages').add({
  //     msg: value
  //   });
  // }

  deleteMessages() {
    console.log(this.ids);
    this.ids.forEach (function(e) {
      this.observe = this.db.collection('messages').doc(e).delete();
    }, this);
    return this.observe;
  }

  //   Create a new user
  createUser(email, password, firstName, lastName, handle) {
    let newUser: { email: any; password: string; fullName: string; handle: any };
    newUser = {
      handle,
      fullName: firstName + ' ' + lastName,
      password,
      email,
    };
    const fullName = firstName + ' ' + lastName;

    firebase.auth().createUserWithEmailAndPassword(email, password).then(r => {
      console.log(r.user.uid);
      this.loggedIn = true;
      this.writeUserData( fullName, email, handle, firstName, lastName, r.user.uid );

    }, err => {
      console.log('cannot create new user: ', err);
    });

  }

  // write the data to the DB
  writeUserData(name, email, handle, firstName, lastName, uid) {
    const db = firebase.firestore();
    const userRef = db.collection('app/users/user_info');
    // tslint:disable-next-line:no-unused-expression
    userRef.doc(email).set({
      user_handle: handle,
      user_email: email,
      user_fullname: name,
      user_lname: lastName,
      user_fname: firstName,
      UID: uid
    })
        .then(docRef => {
          console.log('Document written with ID: ', docRef);
        })
        .catch(error => {
          console.error('Error adding document: ', error);
        });

    console.log('write user data');
  }


  // // Sign out user
  //   firebase.auth().signOut()
  // .catch(function (err) {
  //     // Handle errors
  //   });


  emailLogin(email, password) {
    let obs: Observable<any>;
    const db = firebase.firestore();
    if (this.loggedIn === true) {
      console.log('You are already logged in');
    } else {
      obs = from(firebase.auth().signInWithEmailAndPassword(email, password)
          .then((credentials) => {
            console.log(credentials);
          }).catch((error) => {
            console.log('error loggin in');
          }));
      this.signedIn = firebase.auth().currentUser;
      if (this.signedIn) {
        this.loggedIn = true;
        console.log('we gucci');
      } else {
        this.loggedIn = false;
        console.log('we not gucci');
      }
    }
    console.log(obs);
    return obs;
  }

  getUser() {
    const db = firebase.firestore();
    // this.signedIn = firebase.auth().currentUser;
    const userRef = db.collection('app').doc('users').collection('user_info').doc(this.signedIn.email);
    console.log(userRef);
    this.user = userRef.get().then(doc => {
      if (doc.exists) {
        console.log('Document data:', doc.data());
      } else {
        console.log('No such document!');
      }
    }).catch(error => {
      console.log('Error getting document:', error);
    });
    console.log(this.user);
    return this.user;
  }

  getUsers() {

  }

  createMessage(userEmail, recipientEmail, dateTime, content) {
    const db = firebase.firestore();
    return this.db.collection('messages').add({
      user_email: userEmail,
      to_user: recipientEmail,
      date_time: dateTime,
      msg_content: content
      });

    console.log('write user data');
  }
}
