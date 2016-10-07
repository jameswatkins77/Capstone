'Use Strict';
angular.module('capstone', ['ionic','firebase','ngStorage','services'])

.config(function($stateProvider, $urlRouterProvider) {
 $stateProvider
   .state('splash', {
     url: '/splash',
     templateUrl: 'templates/splash/splash.html',
     controller: 'SplashCtrl'
   })
   .state('login', {
     url: '/login',
     templateUrl: 'templates/login/login.html',
     controller: 'loginCtrl'
   })
   .state('registration', {
     url: '/registration',
     templateUrl: 'templates/registration/registration.html',
     controller: 'registrationCtrl'
   })
   .state('parentHome', {
     url: '/parents/home',
     templateUrl: 'templates/parents/parentHome.html',
     controller: 'parentCtrl'
   })
   .state('childHome', {
     url: '/child/home',
     templateUrl: 'templates/children/childHome.html',
     controller: 'childCtrl'
   })
   .state('childChores', {
     url: '/child/:id/chores',
     templateUrl: 'templates/children/childChores.html',
     controller: 'childCtrl'
   })
   .state('childRewards', {
     url: '/child/:id/rewards',
     templateUrl: 'templates/children/childRewards.html',
     controller: 'childCtrl'
   })
   .state('parentShowChild', {
     url: '/parent/children/show/:id',
     templateUrl: 'templates/parents/children/show.html',
     controller: 'parentCtrl'
   })
   .state('parentEditChore', {
     url: '/parent/children/edit/',
     templateUrl: 'templates/parents/children/editChore.html',
     controller: 'parentCtrl'
   })
 $urlRouterProvider.otherwise("/splash");
})

.constant('FURL', {
   apiKey: "AIzaSyArnFTl4mh9mVKoQRuxfk84bUqwzffVUt0",
   authDomain: "capstone-bfc2e.firebaseapp.com",
   databaseURL: "https://capstone-bfc2e.firebaseio.com",
   storageBucket: "capstone-bfc2e.appspot.com"
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
