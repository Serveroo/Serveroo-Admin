import { Component } from '@angular/core';
import {User} from "../../shared/class/user/user";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private user: User) {
  }

  ionViewWillEnter() {
    console.log(this.user.getUserData());
  }
}
