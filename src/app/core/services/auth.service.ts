import { Injectable } from '@angular/core';
import { IdentityService } from './identity.service';
import {
    IonicAuth,
    IonicAuthOptions,
    AuthResult
} from '@ionic-enterprise/auth';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends IonicAuth {
    private identityService: IdentityService;
    private router: Router;

    constructor(
        identityService: IdentityService,
        platform: Platform,
        router: Router
    ) {
        const host = platform.is('capacitor')
            ? 'com.ionic.actraining://'
            : 'http://localhost:8100/';
        const auth0Config: IonicAuthOptions = {
            authConfig: 'auth0',
            platform: platform.is('capacitor') ? 'capacitor' : 'web',
            clientID: 'pWpIMRnFAbFnc3b95w16p9A7ZSnsFa8G',
            discoveryUrl:
                'https://dev-j3wl8n0b.auth0.com/.well-known/openid-configuration',
            redirectUri: `${host}login`,
            scope: 'openid offline_access email picture profile',
            audience: '',
            logoutUrl: `${host}logout`,
            iosWebView: 'private'
        };
        super(auth0Config);
        this.identityService = identityService;
        this.router = router;
    }

    async onLoginSuccess(result: AuthResult): Promise<void> {
        const tokenData = await this.getIdToken();
        this.identityService.set(
            { username: tokenData.nickname },
            result.accessToken
        );
        this.router.navigateByUrl('/home');
    }

    async onLogout(): Promise<void> {
        await this.identityService.remove();
        this.router.navigateByUrl('/login');
    }
}
