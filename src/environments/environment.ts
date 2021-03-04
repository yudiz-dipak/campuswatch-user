// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BaseURL: 'http://localhost:8080',
  // BaseURL: "http://3.7.98.19:8080",
  ApiURL: "",
  firebaseConfig: {
    apiKey: "AIzaSyAtD6dQhU4BtzKKKcZUq3tUvWMW2rizX_o",
    authDomain: "campuswatch-c7e0c.firebaseapp.com",
    projectId: "campuswatch-c7e0c",
    storageBucket: "campuswatch-c7e0c.appspot.com",
    messagingSenderId: "972920901938",
    appId: "1:972920901938:web:c7ba34f11fc42359e7072b",
  }
};
environment.ApiURL = environment.BaseURL + "/api/v1/";

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
