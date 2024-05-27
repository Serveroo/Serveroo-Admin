import {AfterContentInit, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../shared/class/user/user";
import {HttpService} from "../../core/http/http.service";
import {lastValueFrom} from "rxjs";
import {Display} from "../../shared/class/display/display";
import {Animation, AnimationController} from '@ionic/angular';
import {InfopodsModel} from "../../shared/model/infopods.model";
import {DisplayPodModel} from "../../shared/model/displaypods.model";
import {HeaderModel} from "../../shared/model/header.model";
import {StripeAPI} from "../../shared/class/stripe/stripe";
import {environment} from "../../../environments/environment";

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
      id: 'namespace',
      size: '2',
      sort: 0
    },
    {
      title: 'Nom',
      id: 'name',
      size: '2',
      sort: 0
    },
    {
      title: 'CPU',
      id: 'cpu',
      size: '1',
      sort: 0
    },
    {
      title: 'Mémoire',
      id: 'memory',
      size: '1',
      sort: 0
    },
    {
      title: 'Disque',
      id: 'disk',
      size: '1',
      sort: 0
    },
    {
      title: 'Status',
      id: 'status',
      size: '1',
      sort: 0
    },
    {
      title: 'Date de fin',
      id: 'endDate',
      size: '2',
      sort: 0
    },
    {
      title: 'Last Use',
      id: 'lastUse',
      size: '1',
      sort: 0
    }
  ];
  private animation: Animation = this.animationCtrl.create();

  constructor(
    private user: User,
    private httpService: HttpService,
    private display: Display,
    private animationCtrl: AnimationController,
    private stripe: StripeAPI
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
        this.getLastUse();

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
          disk: this.formatBytes(pod.containers[0].pv.use * 1024 * 1024 * 1024),
          status: pod.status,
          date: `${pod.date.day}/${pod.date.month}/${pod.date.year} ${pod.date.hour.toString().padStart(2, '0')}:${pod.date.minute.toString().padStart(2, '0')}:${pod.date.second.toString().padStart(2, '0')}`,
          endDate: pod.endDate ? `${pod.endDate.day}/${pod.endDate.month}/${pod.endDate.year} ${pod.endDate.hour.toString().padStart(2, '0')}:${pod.endDate.minute.toString().padStart(2, '0')}:${pod.endDate.second.toString().padStart(2, '0')}` : '-',
          lastUse: '-',
          openPorts: pod.openPorts,
          displayDetails: false
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

  getLastUse() {
    this.infoPods.forEach((pod) => {
      const nodePorts = pod.openPorts.map((p) => p.nodePort);
      lastValueFrom(this.httpService.getLastUse(nodePorts, this.user.getToken()))
        .then((res: any) => {
          if (res.lastUse === -1)
            pod.lastUse = '-';
          else {
            const date = new Date(res.lastUse * 1000);
            pod.lastUse = date.toLocaleString();
          }
        })
        .catch((err) => {
          console.error(err);
          pod.lastUse = '-';
        });
    });
  }

  refreshButton() {
    this.animation.play().then();
    this.getData();
  }

  handleClickItem(pod: DisplayPodModel) {
    pod.displayDetails = !pod.displayDetails;
  }

  searchEvent() {
    const query = this.searchbar.value.toLowerCase();
    this.displayPods = this.infoPods.filter((d) => Object.values(d).join().toLowerCase().indexOf(query) > -1);
  }

  sortData(header: HeaderModel) {
    this.searchEvent();
    this.headers.forEach((h) => h !== header ? h.sort = 0 : null);
    this.displayPods.sort((a, b) => {
      let tmpA, tmpB;

      if (header.id === 'cpu') {
        tmpA = parseFloat(a[header.id].replace('%', ''));
        tmpB = parseFloat(b[header.id].replace('%', ''));
      } else if (header.id === 'memory' || header.id === 'disk') {
        tmpA = parseFloat(a[header.id].split(' ')[0]);
        tmpB = parseFloat(b[header.id].split(' ')[0]);
      } else {
        // @ts-ignore
        tmpA = a[header.id];
        // @ts-ignore
        tmpB = b[header.id];
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

  onClickDeletePod(event: any,pod: DisplayPodModel) {
    if (event.detail.role !== 'confirm')
      return;

    if (environment.stripe_subscription_enabled) {
      // on récupère d'abord la facture pour en obtenir l'id
      lastValueFrom(this.httpService.getInvoice(pod.name, this.user.getToken()))
        .then((res: any) => {
          const idInvoice = res.invoice.id_invoice;
          // afin de récupérer l'utilisateur stipe, on a besoin de récupérer le mail associé au namespace
          lastValueFrom(this.httpService.getMailFromNamespace(pod.namespace, this.user.getToken()))
            .then((data: any) => {
              // on récupère ensuite le client stripe et notamment son id
              this.stripe.getListCustomersWithMail(data.mail)
                .then((customer) => {
                  const idCustomer = customer.data[0].id;
                  // à partir de cet id, on peut récupérer la facture stripe
                  this.stripe.getInvoice(idInvoice)
                    .then(invoice => {
                      // on vérifie d'abord que le client stripe est bien le propriétaire de la facture
                      // puis si la facture est liée à un abonnement, on l'annule avant de supprimer le pod
                      // sinon on peut supprimer le pod directement
                      if (invoice.customer === idCustomer) {
                        const idSubscription = invoice.subscription?.toString();
                        if (!idSubscription) {
                          this.deletePod(pod);
                        } else {
                          this.display.toast('Un abonnement en cours, suppression pas encore implémenté').then();
                          // TODO : Cancel subscription
                        }
                      }
                    })
                })
                .catch((err) => {
                  console.error(err);
                  this.display.toast('Erreur lors de la récupération du client stripe').then();
                });
            })
            .catch(err => {
              if (err.status === 406)
                this.deletePod(pod);
              if (err.status === 401)
                this.display.toast('Vous ne possédez pas les droits pour supprimer ce pod').then();
            });
        })
        .catch(err => {
          console.error(err);
          this.display.toast('Erreur lors de la récupération de la facture').then();
        });
    } else {
      this.deletePod(pod);
    }
  }

  deletePod(pod: DisplayPodModel) {
    lastValueFrom(this.httpService.deletePod(pod.name, pod.namespace, this.user.getToken()))
      .then((res) => {
        this.display.toast({code: 'Pod supprimé', color: 'success'}).then();
        this.getData();
      })
      .catch((err) => {
        this.display.toast('Erreur lors de la suppression du pod').then();
      });
  }
}
