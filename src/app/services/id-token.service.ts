import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable()
export class IdTokenService {

  authJwtToken:string;

  constructor(private afAuth: AngularFireAuth) {

    afAuth.idToken.subscribe(jwt => this.authJwtToken = jwt);

  }

}
