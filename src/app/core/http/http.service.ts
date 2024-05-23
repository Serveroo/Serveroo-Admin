import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {LoginModel} from "../../shared/model/login.model";

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
    return this.http.post(`${this.baseLink}/api/isUserAdmin`, data, {headers});
  }

  public getNamespaces() {
    return this.http.get(`${this.baseLink}/k8s/getNamespaces`);
  }

  public getAdminInfoPods(token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get(`${this.baseLink}/k8s/getAdminInfoPods`, {headers});
  }

  public getAdminInfoUsers(token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get(`${this.baseLink}/k8s/getAdminInfoUsers`, {headers});
  }
}
