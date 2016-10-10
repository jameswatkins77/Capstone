'Use Strict';
angular.module('capstone').controller('childCtrl', function($scope, user, $stateParams, $rootScope, $firebaseArray, $state, $log, $location, $http, $ionicPopup, $firebaseObject, FURL) {
  var uid = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref().child('users');
  $scope.data = {};
  $scope.data.id = firebase.auth().currentUser.uid;
  $scope.data.showChoreList = true;
  $scope.data.submitCompleteChore = false;
  $scope.data.showChoreListTitle = true;

  ref.on("value", function(snapshot) {
    let data = snapshot.val();
    for (var id in data) {
      if (uid === data[id].id) {
        $scope.data.childName = data[id].name;
        $scope.data.childChores = data[id].chores;
        $scope.data.childRewards = data[id].rewards;
        $scope.data.childPoints = data[id].points;
      }
    }
  })

  user.getCurrentUserId().then(function(response){
    $scope.data.currentUserId = response;
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
    $scope.data.showChoreList = false;
    $scope.data.submitCompleteChore = true;
    $scope.data.choreInfo = chore;
    $scope.data.showChoreListTitle = false;
  }

  $scope.data.submitComplete = function(completeName, completeDescription){
    var childID = $scope.data.currentUserId;
    var childUID = $stateParams.id;
    ref.child(childID).child('chores').once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (completeName === data[id].choreName) {
          ref.child(childID).child('chores').child(id).update({info:completeDescription, status:"completed"});
        }
      }
    })
    ref.child(childID).child('parent').once('value').then(function(snapshot2){
      let data2 = snapshot2.val();
      ref.child(data2).child('children').once('value').then(function(snapshot3){
        let data3 = snapshot3.val();
        for (var id2 in data3) {
          if (childUID === data3[id2].id) {
            var lob = id2;
            ref.child(data2).child('children').child(id2).child('chores').once('value').then(function(snapshot4){
              let data4 = snapshot4.val();
              for (var id3 in data4) {
                if (completeName === data4[id3].choreName) {
                  console.log("parent id: "+data2);
                  console.log("child id: "+lob);
                  console.log("chore id: "+id3);
                  console.log("name from page: "+completeName);
                  console.log("name from db: "+data4[id3].choreName);
                  ref.child(data2).child('children').child(lob).child('chores').child(id3).update({info:completeDescription, status:"completed"});
                }
              }
            })
          }
        }
      })
    })
  }

});
