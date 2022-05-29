import {Injectable} from '@angular/core';
import {User} from "../api/generated";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private storageItemName;
  private RESOURCES_URL;
  private currentUser: User | null = null;
  private token: string | null = null;
  private errorMessage: string | null = null;

  constructor(private http: HttpClient) {
    this.RESOURCES_URL = environment.apiUrl + "/auth";
    this.storageItemName = environment.storageItemName;
    this.getTokenFromBrowserStorage();
  }

  async refreshToken(): Promise<String> {
    // @ts-ignore
    let response0 = this.http.post<HttpResponse<User>>(`${this.RESOURCES_URL}/refresh-token`,
      {}, {
        headers: new HttpHeaders({Authorization: `Bearer ${this.token}`}),
        observe: 'response'
      }).pipe(shareReplay(1));

    let response = await response0.toPromise().catch((e: HttpErrorResponse) => {
      this.errorMessage = e.error.message;
      this.signOut();
      return null;
    });
    let user = (response?.body as unknown as User);
    let refreshToken = response?.headers.get('Authorization');
    if (refreshToken == null) {
      throw new Error('No token');
    }
    refreshToken = refreshToken.replace('Bearer ', '')
    this.saveTokenIntoBrowserStorage(refreshToken, user);
    console.log("logged in")
    return refreshToken;
  }

  async asyncSignIn(username: string, password: string): Promise<User> {
    let response0 = this.http.post<HttpResponse<User>>(`${this.RESOURCES_URL}/login`,
      {username: username, password: password},
      {observe: "response"}).pipe(shareReplay(1));

    let response = await response0.toPromise().catch((e: HttpErrorResponse) => {
      this.errorMessage = e.error.message;
      this.signOut();
      return null;
    });
    let user = (response?.body as unknown as User);
    let token = response?.headers.get('Authorization');
    if (token == null) {
      throw new Error('No token');
    }

    token = token.replace('Bearer', '')
    this.saveTokenIntoBrowserStorage(token, user);
    console.log("logged in")
    return user;
  }

  async asyncRegister(username: string, password: string): Promise<User> {
    let response0 = this.http.post<HttpResponse<User>>(`${this.RESOURCES_URL}/create`,
      {username: username, password: password}, {observe: 'response'}).pipe(shareReplay(1));
    let response = await response0.toPromise().catch((e: HttpErrorResponse) => {
      if (e.status == 500) {
        console.log(e);
        this.errorMessage = "Error is not known";
      } else {
        this.errorMessage = e.error.message;
      }
      return null;
    });
    return (response?.body as unknown as User);
  }

  signOut(): void {
    sessionStorage.removeItem('tetris-token');
    localStorage.removeItem('tetris-token');
    this.token = null;
    this.currentUser = null;
  }

  saveTokenIntoBrowserStorage(token: string, user: User) {
    let newValue = JSON.stringify({token: token, user: user});
    window.sessionStorage.setItem(this.storageItemName, newValue);
    window.localStorage.setItem(this.storageItemName, newValue);
  }

  getTokenFromBrowserStorage(): string | null {
    let session = sessionStorage.getItem(this.storageItemName);
    let local = localStorage.getItem(this.storageItemName);

    if (session != null) {
      let json = JSON.parse(session);
      this.token = json.token;
      this.currentUser = json.user;
      return session;
    } else if (local != null) {
      window.sessionStorage.setItem(this.storageItemName, local);
      let json = JSON.parse(local);
      this.token = json.token;
      this.currentUser = json.user;
      return local;
    } else {
      this.signOut();
    }
    return null;
  }

  getCurrentUserName(): String | null {
    this.getTokenFromBrowserStorage();
    return this.currentUser != null ? this.currentUser.username : null;
  }

  getErrorMessage(): String | null {
    return this.errorMessage;
  }

  getToken(): String | null {
    this.getTokenFromBrowserStorage();
    return this.token;
  }

  setErrorMessage(error: string | null): void {
    this.errorMessage = error;
  }

  public isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  public getUserId(): number {
    return <number>(this.currentUser != null ? this.currentUser.id : null);
  }
}
