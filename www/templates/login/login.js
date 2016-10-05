'Use Strict';
angular.module('capstone').controller('loginCtrl', function($scope, $rootScope, $firebaseArray, $firebaseAuth, $state, $log, $location, $http, $ionicPopup, $firebaseObject, user, FURL) {
  $scope.data = {};
  $scope.data.login = function(user){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    }).then(function(response){
      var uid = firebase.auth().currentUser.uid;
      var ref = firebase.database().ref().child('users');
      ref.on("value", function(snapshot) {
    		let data = snapshot.val();
        for (var id in data) {
          if (uid === data[id].id) {
            if (data[id].type === "parent") {
              $state.go("parentHome")
            } else {
              $state.go("childHome")
            }
          }
        }
    	})
    });
  }
});
