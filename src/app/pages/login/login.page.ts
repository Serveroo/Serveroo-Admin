import {Component} from '@angular/core';
import {LoginModel} from "../../shared/model/login.model";
import {HttpService} from "../../core/http/http.service";
import {jwtDecode} from "jwt-decode"
import {User} from "../../shared/class/user/user";
import {UserModel} from "../../shared/model/user.model";
import {Router} from "@angular/router";
import {Display} from "../../shared/class/display/display";
import {lastValueFrom} from "rxjs";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  public loginData: LoginModel = new LoginModel();

  constructor(
    private httpService: HttpService,
    private user: User,
    private router: Router,
    private display: Display,
  ) {
    this.loginData.mail = environment.mail;
    this.loginData.password = environment.password;
    if (this.loginData.mail != '' && this.loginData.password != '')
      this.login();
  }

  login() {
    if (!this.loginData.mail || !this.loginData.password) {
      this.display.toast('Veuillez renseigner tous les champs').then();
      return;
    }
    lastValueFrom(this.httpService.login(this.loginData))
      .then((response: any) => {
        const token = response.token;
        lastValueFrom(this.httpService.isUserAdmin({mail: this.loginData.mail}, response.token))
          .then((response: any) => {
            const decodedToken: UserModel = jwtDecode(token);
            this.user.setUserData(decodedToken);
            this.user.setToken(token);
            this.router.navigate(['/home']).then();
          })
          .catch((error) => {
            console.log(error);
            if (error.status === 401)
              this.display.toast('Vous n\avez pas les droits pour accéder à cette interface').then();
            else if (error.status === 500)
              this.display.toast('Une erreur est survenue').then();
          });
      })
      .catch((error) => {
        console.log(error);
        this.display.toast('Mauvais mail ou mot de passe').then();
      });
  }
}
