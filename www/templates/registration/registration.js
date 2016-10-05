'Use Strict';
angular.module('capstone').controller('registrationCtrl', function($scope, $rootScope, $state, $log, $location, $http, $ionicPopup, $firebaseObject, $firebaseAuth, FURL) {
  $scope.data = {};

  $scope.data.register = function(parent){
    var ref = firebase.database().ref();
    firebase.auth().createUserWithEmailAndPassword(parent.email, parent.password).then(function(returnData){
      var uid = firebase.auth().currentUser.uid;
      ref.child("users").push({id: uid, name: parent.name, type: "parent", children: []});
      $state.go("parentHome");
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;;
      console.log(errorCode);
      console.log(errorMessage);
    });
  }
});
