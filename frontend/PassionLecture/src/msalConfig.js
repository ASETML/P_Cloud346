import { PublicClientApplication } from '@azure/msal-browser'

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: 'CLIENT_ID', // from App Registration
    authority: 'https://login.microsoftonline.com/common', //or precise tenant
    redirectUri: window.location.origin, // http://localhost:5173
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
})
