// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:4000',
  authUrl: 'http://localhost:6001',
  graphql: 'http://localhost:3000/graphql',
  nestjsGateway: 'http://localhost:6500/graphql',
  GTM_ID: 'GTM-KS8744D',
  changelogurl: 'https://master-electronics.gitbook.io/wms/',
  idleTimeInMinutes: 20,
  productImgSource: `https://www.onlinecomponents.com/images/parts/largeimages/`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
