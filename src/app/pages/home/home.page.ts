import {AfterContentInit, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../shared/class/user/user";
import {HttpService} from "../../core/http/http.service";
import {lastValueFrom} from "rxjs";
import {Display} from "../../shared/class/display/display";
import {Animation, AnimationController} from '@ionic/angular';
import {InfopodsModel} from "../../shared/model/infopods.model";
import {DisplayPodModel} from "../../shared/model/displaypods.model";
import {HeaderModel} from "../../shared/model/header.model";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('refreshIcon') private refreshIcon: any;
  @ViewChild('searchbar') private searchbar: any;

  public infoPods: Array<DisplayPodModel> = new Array<DisplayPodModel>();
  public displayPods: Array<DisplayPodModel> = new Array<DisplayPodModel>();
  public headers: Array<HeaderModel> = [
    {
      title: 'Namespace',
      size: '2',
      sort: 0
    },
    {
      title: 'Name',
      size: '2',
      sort: 0
    },
    {
      title: 'CPU',
      size: '1',
      sort: 0
    },
    {
      title: 'Memory',
      size: '1',
      sort: 0
    },
    {
      title: 'Disk',
      size: '1',
      sort: 0
    },
    {
      title: 'Status',
      size: '1',
      sort: 0
    },
    {
      title: 'Date',
      size: '2',
      sort: 0
    },
    {
      title: 'End Date',
      size: '2',
      sort: 0
    }
  ];
  private animation: Animation = this.animationCtrl.create();

  constructor(
    private user: User,
    private httpService: HttpService,
    private display: Display,
    private animationCtrl: AnimationController,
  ) {
  }

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
    lastValueFrom(this.httpService.getAdminInfoPods(this.user.getToken()))
      .then(async (data: any) => {
        this.headers.forEach((h) => h.sort = 0);
        this.formatData(data);

        this.animation.pause();
      })
      .catch((error) => {
        console.error(error);

        this.animation.pause();
      });
  }

  formatData(data: Array<InfopodsModel>) {
    this.infoPods = [];
    for (let namespace of data) {
      for (let pod of namespace.pods) {
        this.infoPods.push({
          namespace: namespace.namespace,
          name: pod.name,
          cpu: (pod.containers[0].resourceUsage.cpu.usage * 100).toFixed(2) + '%',
          memory: this.formatBytes(pod.containers[0].resourceUsage.memory.usage),
          disk: this.formatBytes(pod.containers[0].pv.use),
          status: pod.status,
          date: `${pod.date.day}/${pod.date.month}/${pod.date.year} ${pod.date.hour.toString().padStart(2, '0')}:${pod.date.minute.toString().padStart(2, '0')}:${pod.date.second.toString().padStart(2, '0')}`,
          endDate: pod.endDate ? `${pod.endDate.day}/${pod.endDate.month}/${pod.endDate.year} ${pod.endDate.hour.toString().padStart(2, '0')}:${pod.endDate.minute.toString().padStart(2, '0')}:${pod.endDate.second.toString().padStart(2, '0')}` : '-'
        });
      }
    }

    this.displayPods = [...this.infoPods];
  }

  formatBytes(valeurRAMoctets: number) {
    const ko = valeurRAMoctets / 1024;
    const mo = ko / 1024;
    const go = mo / 1024;
    const to = go / 1024;

    if (to >= 1)
      return to.toFixed(2) + " To";
    else if (go >= 1)
      return go.toFixed(2) + " Go";
    else if (mo >= 1)
      return mo.toFixed(2) + " Mo";
    else
      return ko.toFixed(0) + " Ko";
  }

  refreshButton() {
    this.animation.play().then();
    this.getData();
  }

  sortData(header: HeaderModel) {
    const title = header.title.toLowerCase();

    this.searchEvent();
    this.headers.forEach((h) => h !== header ? h.sort = 0 : null);
    this.displayPods.sort((a, b) => {
      let tmpA, tmpB;

      if (title === 'cpu') {
        tmpA = parseFloat(a[title].replace('%', ''));
        tmpB = parseFloat(b[title].replace('%', ''));
      } else if (title === 'memory' || title === 'disk') {
        tmpA = parseFloat(a[title].split(' ')[0]);
        tmpB = parseFloat(b[title].split(' ')[0]);
      } else {
        // @ts-ignore
        tmpA = a[title];
        // @ts-ignore
        tmpB = b[title];
      }

      if (tmpA === tmpB) return 0;

      if (header.sort === 0) {
        return tmpA > tmpB ? 1 : -1;
      } else {
        return tmpA < tmpB ? header.sort : -header.sort;
      }
    });
    header.sort = header.sort === 0 ? 1 : -header.sort;
  }

  searchEvent() {
      const query = this.searchbar.value.toLowerCase();
      this.displayPods = this.infoPods.filter((d) => Object.values(d).join().toLowerCase().indexOf(query) > -1);
  }
}
