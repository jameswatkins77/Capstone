'Use Strict';
angular.module('capstone').controller('childCtrl', function($scope, $rootScope, $firebaseArray, $state, $log, $location, $http, $ionicPopup, $firebaseObject, FURL) {
  var uid = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref().child('users');
  $scope.data = {};
  $scope.data.id = firebase.auth().currentUser.uid;
  $scope.data.showChoreList === true;

  ref.on("value", function(snapshot) {
    let data = snapshot.val();
    for (var id in data) {
      if (uid === data[id].id) {
        $scope.data.childName = data[id].name;
        $scope.data.childChores = data[id].chores;
        $scope.data.childRewards = data[id].rewards;
      }
    }
  })

  $scope.data.logout = function(){
    firebase.auth().signOut().then(function() {
      console.log("user signed out");
      $state.go("login");
    }, function(error) {
      console.log("error logging out");
    });
  }

  $scope.data.goChoreComplete = function(chore){
    $scope.data.showChoreList === true;
    $scope.data.choreInfo = chore;
  }
});
