'Use Strict';
angular.module('capstone').controller('SplashCtrl',['$scope', '$rootScope', '$state', '$log', '$location', '$http', '$ionicPopup', '$firebaseObject', 'FURL',
function($scope, $rootScope, $state, $log, $location, $http, $ionicPopup, $firebaseObject, FURL) {
  $scope.data = {};
  $scope.data.title = "Chore Score";
}]);
