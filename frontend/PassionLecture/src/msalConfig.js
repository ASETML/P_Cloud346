import { PublicClientApplication } from '@azure/msal-browser'

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: '2cce9efa-0b90-4413-931d-279166fada18', // from App Registration
    authority: 'https://login.microsoftonline.com/common', //or precise tenant
    redirectUri: window.location.origin, // http://localhost:5173
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
})
