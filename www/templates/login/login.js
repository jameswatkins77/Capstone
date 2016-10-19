'Use Strict';
angular.module('capstone').controller('loginCtrl', function($scope, $rootScope, $firebaseArray, $firebaseAuth, $state, $log, $location, $http, $ionicPopup, $firebaseObject, user, FURL) {
  $scope.data = {};
  $scope.data.error;

  $scope.data.login = function(user){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      return $scope.data.error = error.message;
    }).then(function(response){
      $scope.data.error;
      if ($scope.data.error) {
        alert("Username and/or password is incorrect.  Please try again.")
      } else {
        var uid = firebase.auth().currentUser.uid;
        var ref = firebase.database().ref().child('users');
        ref.on("value", function(snapshot) {
          let data = snapshot.val();
          for (var id in data) {
            if (uid === data[id].id) {
              if (data[id].type === "parent") {
                console.log("parent logged in");
                $state.go("parentHome")
              } else {
                console.log("child logged in");
                $state.go("childHome")
              }
            }
          }
        })
      }
    });
  }
});
