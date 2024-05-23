import {AfterContentInit, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../shared/class/user/user";
import {HttpService} from "../../core/http/http.service";
import {lastValueFrom} from "rxjs";
import {Display} from "../../shared/class/display/display";
import {Animation, AnimationController} from '@ionic/angular';
import {InfopodsModel} from "../../shared/model/infopods.model";
import {DisplayPodModel} from "../../shared/model/displaypods.model";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChild('refreshIcon') private refreshIcon: any;

  public infoPods: Array<DisplayPodModel> = new Array<DisplayPodModel>();
  private headers: DisplayPodModel = {
    namespace: 'Namespace',
    name: 'Name',
    cpu: 'CPU',
    memory: 'Memory',
    disk: 'Disk',
    status: 'Status',
    date: 'Date',
    endDate: 'End Date'
  };
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
        console.log(data);
        this.formatData(data);

        this.animation.pause();
      })
      .catch((error) => {
        console.error(error);

        this.animation.pause();
      });
  }

  formatData(data: Array<InfopodsModel>) {
    this.infoPods = [this.headers];
    for (let namespace of data) {
      for (let pod of namespace.pods) {
        const valeurRAMoctets = pod.containers[0].resourceUsage.memory.usage;
        const ko = valeurRAMoctets / 1024;
        const mo = ko / 1024;
        const go = mo / 1024;
        const to = go / 1024;

        if (to >= 1) {
          console.log(to.toFixed(2) + " To");
        } else if (go >= 1) {
          console.log(go.toFixed(2) + " Go");
        } else if (mo >= 1) {
          console.log(mo.toFixed(2) + " Mo");
        } else {
          console.log(ko.toFixed(2) + " Ko");
        }

        this.infoPods.push({
          namespace: namespace.namespace,
          name: pod.name,
          cpu: (pod.containers[0].resourceUsage.cpu.usage * 100).toFixed(2) + '%',
          memory: this.formatBytes(pod.containers[0].resourceUsage.memory.usage),
          disk: this.formatBytes(0),
          status: pod.status,
          date: `${pod.date.day}/${pod.date.month}/${pod.date.year} ${pod.date.hour}:${pod.date.minute}:${pod.date.second}`,
          endDate: `${pod.endDate.day}/${pod.endDate.month}/${pod.endDate.year} ${pod.endDate.hour}:${pod.endDate.minute}:${pod.endDate.second}`
        });
      }
    }

    console.log(this.infoPods);
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
      return ko.toFixed(2) + " Ko";
  }

  // refreshButton() {
  //   this.getData();
  //   this.launchRefreshAnimation();
  // }

  refreshButton() {
    this.animation.play().then();
    this.getData();
  }
}
