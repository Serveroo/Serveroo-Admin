import {Injectable} from "@angular/core";
import {HttpService} from "../../../core/http/http.service";
import {UserModel} from "../../model/user.model";

@Injectable({
  providedIn: 'root'
})
export class User {
  public userData: UserModel = new UserModel();
  private token: string = '';

  constructor(
    private httpService: HttpService
  ) {
  }

  getUserData() {
    return this.userData;
  }

  setUserData(userData: UserModel) {
    this.userData = userData;
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
  }
}
