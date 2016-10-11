'Use Strict';
angular.module('capstone').controller('SplashCtrl',['$scope', '$timeout', '$rootScope', '$state', '$log', '$location', '$http', '$ionicPopup', '$firebaseObject', 'FURL',
function($scope, $timeout, $rootScope, $state, $log, $location, $http, $ionicPopup, $firebaseObject, FURL) {
  $scope.data = {};
  $scope.data.title = "Chore Score";
  $timeout( function(){ $state.go("login"); }, 2000);
}]);
