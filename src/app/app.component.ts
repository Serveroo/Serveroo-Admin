import {Component, OnInit} from '@angular/core';
import {User} from "./shared/class/user/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private user: User,
    private router: Router
  ) {
  }

  ngOnInit() {
    console.log(this.user.getUserData());
    if (!this.user.getUserData().name)
      this.router.navigate(['/login']).then();
  }
}
