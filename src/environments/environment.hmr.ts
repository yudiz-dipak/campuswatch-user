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
  },
  hmr: true,
  S3_BUCKET_URL: 'https://campus-watch-panel.s3.ap-south-1.amazonaws.com/'
};
environment.ApiURL = environment.BaseURL + "/api/v1/";