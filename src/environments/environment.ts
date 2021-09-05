// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  GTM_ID: 'GTM-KS8744D',
  changelogurl: 'https://rarm18.gitbook.io/wms/changelog',
  DistributionCenter: 'PH',
  //WMS Status table
  pickComplete_ID: 10,
  droppedQC_ID: 20,
  warehouseHold_ID: 30,
  qcComplete_ID: 60,
  agInComplete_ID: 63,
  agOutComplete_ID: 65,
  //WMS ContainerType table
  shelfType_ID: 2,
  toteType_ID: 3,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
