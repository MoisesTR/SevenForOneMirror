// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiEndpoint: 'http://localhost:3000/api/',
  socket: 'ws://localhost:3000',
  apiEndpointAuth: 'http://localhost:3000/api/auth/',
  paypalClienttId: 'AZhi6Hy8TF46gXXeLiUZmtFIPhQRQx1-x9M4T1jDMUtHqHNO5iahzV6kzL6SBJxHgudgYafDeBoSECs8',
  googleClientId: '380320064033-bs2uivmdsj2fs5v68h2kg57p5k9kgtv7.apps.googleusercontent.com'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
