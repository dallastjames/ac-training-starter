import { Injectable } from '@angular/core';
import { IdentityService } from './identity.service';
import {
    IonicAuth,
    IonicAuthOptions,
    AuthResult
} from '@ionic-enterprise/auth';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

const cordovaAzureConfig_v1: IonicAuthOptions = {
    // client or application id for provider
    clientID: '8881d735-31aa-4ee7-ad08-9ca14b64b37f',
    // This is the expected redirectUri from the login page.
    redirectUri: 'msal8881d735-31aa-4ee7-ad08-9ca14b64b37f://callback',
    // requested scopes from provider
    scope: 'openid offline_access email profile',
    // The discovery url for the provider
    discoveryUrl:
        'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    // The audience if applicable
    audience: 'https://api.myapp.com',
    // The expected logout url
    logoutUrl: 'msal8881d735-31aa-4ee7-ad08-9ca14b64b37f://auth',
    // The platform which we are running on
    platform: 'capacitor',
    // The type of iOS webview to use. 'shared' will use a webview that can share session/cookies
    // on iOS to provide SSO across multiple apps but will cause a prompt for the user which asks them
    // to confirm they want to share site data with the app. 'private' uses a webview which will not
    // prompt the user but will not be able to share session/cookie data either for true SSO across
    // multiple apps.
    iosWebView: 'private',
    // The auth provider.
    authConfig: 'azure',
    // This sets the color of the toolbar at the top of the login webview for android.
    //  Red is just to call attention to what is being set (you don't want to use Red)
    androidToolbarColor: 'Green',
    logLevel: 'DEBUG'
};

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
            : 'https://localhost:4200/';
        const auth0Config: IonicAuthOptions = {
            authConfig: 'azure',
            platform: platform.is('capacitor') ? 'capacitor' : 'web',
            clientID: '18de7343-5de3-4cec-ab93-9307c1397a60',
            discoveryUrl:
                'https://login.microsoftonline.com/b68b1c92-01dc-488a-b4f1-2287e9a3fad3/v2.0/.well-known/openid-configuration',
            redirectUri: `msauth://io.ionic.starter/O5m5Gtd2Xt8UNkW3wk7DWyKGfv8%3D`,
            scope:
                // tslint:disable-next-line: max-line-length
                'openid offline_access',
            audience: '',
            // Same result when using msauth://io.ionic.starter/O5m5Gtd2Xt8UNkW3wk7DWyKGfv8%3D as logoutUrl
            logoutUrl: `msauth://logout`,
            iosWebView: 'shared',
            logLevel: 'DEBUG'
        };
        super(auth0Config);
        // super(cordovaAzureConfig_v1);
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
