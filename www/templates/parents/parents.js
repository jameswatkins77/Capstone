'Use Strict';
angular.module('capstone').controller('parentCtrl', function($scope, $rootScope, $firebaseArray, $state, $log, $location, $http, $ionicPopup, $firebaseObject, FURL) {
  var ref = firebase.database().ref();
  var groupsRef = ref.child('Parents');

  $scope.data = {};

  groupsRef.on("value", function(snapshot) {
		$scope.groups = [];
		let data = snapshot.val();
    $scope.data.info = data;
	})

  $scope.data.logout = function(){
    firebase.auth().signOut().then(function() {
      console.log("user signed out");
      $state.go("login");
    }, function(error) {
      console.log("error logging out");
    });
  }

  $scope.data.addChildFromParentHome = function(){
    $state.go("registration");
  }
});
