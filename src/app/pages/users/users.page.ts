import { Component } from '@angular/core';
import {User} from "../../shared/class/user/user";
import {UserModel} from "../../shared/model/user.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage {

  constructor(
    private user: User
  ) { }

  ionViewWillEnter() {
    console.log(this.user.getUserData());
  }
}
