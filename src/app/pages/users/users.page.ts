import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {User} from "../../shared/class/user/user";
import {HttpService} from "../../core/http/http.service";
import {lastValueFrom} from "rxjs";
import {Animation, AnimationController} from "@ionic/angular";
import {DisplayUserModel} from "../../shared/model/displayuser.model";
import {HeaderModel} from "../../shared/model/header.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements AfterViewInit {
  @ViewChild('refreshIcon') private refreshIcon: any;
  @ViewChild('searchbar') private searchbar: any;

  private animation: Animation = this.animationCtrl.create();
  public infoUsers: Array<DisplayUserModel> = new Array<DisplayUserModel>();
  public displayUsers: Array<DisplayUserModel> = new Array<DisplayUserModel>();
  public headers: Array<HeaderModel> = [
    {
      title: 'Namespace',
      id: 'session_id',
      size: '3',
      sort: 0
    },
    {
      title: 'Nom',
      id: 'name',
      size: '2',
      sort: 0
    },
    {
      title: 'Prénom',
      id: 'firstname',
      size: '2',
      sort: 0
    },
    {
      title: 'Mail',
      id: 'email',
      size: '5',
      sort: 0
    },
  ];

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
        this.infoUsers = data.users;

        this.displayUsers = [...this.infoUsers];

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

  searchEvent() {
    const query = this.searchbar.value.toLowerCase();
    this.displayUsers = this.infoUsers.filter((d) => Object.values(d).join().toLowerCase().indexOf(query) > -1);
  }

  sortData(header: HeaderModel) {
    this.searchEvent();
    this.headers.forEach((h) => h !== header ? h.sort = 0 : null);
    this.displayUsers.sort((a, b) => {
      let tmpA, tmpB;

      // @ts-ignore
      tmpA = a[header.id];
      // @ts-ignore
      tmpB = b[header.id];

      if (tmpA === tmpB) return 0;

      if (header.sort === 0) {
        return tmpA > tmpB ? 1 : -1;
      } else {
        return tmpA < tmpB ? header.sort : -header.sort;
      }
    });
    header.sort = header.sort === 0 ? 1 : -header.sort;
  }
}
