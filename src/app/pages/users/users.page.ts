import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {User} from "../../shared/class/user/user";
import {HttpService} from "../../core/http/http.service";
import {lastValueFrom} from "rxjs";
import {Animation, AnimationController} from "@ionic/angular";
import {DisplayUserModel} from "../../shared/model/displayuser.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements AfterViewInit {
  @ViewChild('refreshIcon') private refreshIcon: any;

  private animation: Animation = this.animationCtrl.create();
  public infoUsers: Array<DisplayUserModel> = new Array<DisplayUserModel>();
  private headers: DisplayUserModel = {
    session_id: 'Session ID',
    email: 'Email',
    firstname: 'Prénom',
    name: 'Nom',
  };

  constructor(
    private user: User,
    private httpService: HttpService,
    private animationCtrl: AnimationController,
  ) { }

  ngAfterViewInit() {
    this.animation = this.animationCtrl.create()
      .addElement(this.refreshIcon.el)
      .duration(1000)
      .iterations(Infinity)
      .fromTo('transform', 'rotate(0deg)', 'rotate(360deg)');
    this.animation.play().then();

    this.getData();
  }

  getData() {
    lastValueFrom(this.httpService.getAdminInfoUsers(this.user.getToken()))
      .then((data: any) => {
        console.log(data);

        this.infoUsers = data.users;
        this.infoUsers.unshift(this.headers);

        this.animation.pause();
      })
      .catch((error) => {
        console.error(error);

        this.animation.pause();
      });
  }

  refreshButton() {
    this.animation.play().then();
    this.getData();
  }
}
