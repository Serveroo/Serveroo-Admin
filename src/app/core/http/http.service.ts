import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {LoginModel} from "../../shared/model/login.model";
import {OpenPortModel} from "../../shared/model/infopods.model";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseLink = environment.base;

  constructor(
    private readonly http: HttpClient
  ) {
  }

  public login(data: LoginModel) {
    return this.http.post(`${this.baseLink}/api/connect`, data);
  }

  public isUserAdmin(data: {mail: string}, token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    }
    return this.http.post(`${this.baseLink}/admin/isUserAdmin`, data, {headers});
  }

  public getAdminInfoPods(token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get(`${this.baseLink}/admin/getAdminInfoPods`, {headers});
  }

  public getAdminInfoUsers(token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get(`${this.baseLink}/admin/getAdminInfoUsers`, {headers});
  }

  public getInvoice(podName: string, token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post(`${this.baseLink}/api/getInvoice`, podName, {headers});
  }

  public getMailFromNamespace(namespace: string, token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post(`${this.baseLink}/admin/getMailFromNamespace`, namespace, {headers});
  }

  public deletePod(podName: string, namespace: string, token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post(`${this.baseLink}/k8s/deleteCollection`, {appName: podName, namespace}, {headers});
  }

  public getLastUse(openPorts: Array<number>, token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.post(`${this.baseLink}/admin/getLastUseOfPod`, openPorts, {headers});
  }
}
