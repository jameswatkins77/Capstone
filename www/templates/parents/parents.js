'Use Strict';
angular.module('capstone').controller('parentCtrl', function($scope, $rootScope, $firebaseArray, $state, $log, $location, $http, $ionicPopup, $firebaseObject, $localStorage, user, FURL) {
  var uid = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref().child('users');

  $scope.data = {};

  user.getCurrentUserId().then(function(response){
    $scope.data.currentUserId = response;
    ref.child(response).child('children').once("value").then(function(snapshot) {
      let data = snapshot.val();
      $scope.data.info = data;
    })
  });


  $scope.data.logout = function(){
    firebase.auth().signOut().then(function() {
      console.log("user signed out");
      $state.go("login");
    }, function(error) {
      console.log("error logging out");
    });
  }

  $scope.data.showChildRegistration = false;

  $scope.data.addChildFromParentHome = function(){
    $scope.data.showChildRegistration = true;
  }

  $scope.data.registerChild = function(child){
    $scope.data.showChildRegistration = false;
    ref.once('value').then(function(snapshot) {
      let data = snapshot.val();
      for (var id in data) {
        if (uid === data[id].id) {
          $scope.data.currentUserId = id;
          return ref.child(id).child("children").push({child:child.name, username:child.username, password:child.password})
        }
      }
    });
  }
});
