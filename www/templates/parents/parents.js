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

  $scope.data.logout = function(user){
    firebase.auth().signOut().then(function() {
      console.log("user signed out");
      console.log(firebase.auth());
      $state.go("parentLogin");
    }, function(error) {
      console.log("error logging out");
    });
  }

  $scope.data.getUser = function(){
    console.log("hello world");
    var user = firebase.auth().currentUser;
    console.log(user);
    user.updateProfile({
      displayName: "Jane Q. User",
      photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(function() {
      console.log("profile updated");
    }, function(error) {
      console.log("error");
    });
    console.log(user);
    console.log(user.displayName);
  }
});
