'Use Strict';
angular.module('capstone').controller('parentCtrl', function($scope, $stateParams, $rootScope, $firebaseArray, $state, $log, $location, $http, $ionicPopup, $firebaseObject, $localStorage, user, FURL) {
  var ParentUid = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref().child('users');

  $scope.data = {};

  user.getCurrentUserId().then(function(response){
    $scope.data.currentUserId = response;
    ref.child(response).child('children').once("value").then(function(snapshot) {
      let data = snapshot.val();
      $scope.data.info = data;
    })
    var childUID = $stateParams.id;
    ref.child(response).child('children').once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          ref.child(response).child('children').child(id).child('chores').once('value').then(function(snapshot2){
            let data2 = snapshot2.val();
            $scope.data.choreInfo = data2;
          })
        }
      }
    })
    ref.child(response).child('children').once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          ref.child(response).child('children').child(id).child('rewards').once('value').then(function(snapshot3){
            let data3 = snapshot3.val();
            $scope.data.rewardInfo = data3;
          })
        }
      }
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

  $scope.data.showAddChildChore = false;

  $scope.data.addChildChore = function(){
    $scope.data.showAddChildChore = true;
    $scope.data.showChildRewards = false;
    $scope.data.showAddChoreButton = false;
  };

  $scope.data.showAddChildReward = false;
  $scope.data.showChildRewards = true;
  $scope.data.showChildChores = true;
  $scope.data.showAddChoreButton = true;
  $scope.data.showAddRewardButton = true;
  $scope.data.showEditChildChore = false;
  $scope.data.showEditChoreButton = true;

  $scope.data.addChildReward = function(){
    $scope.data.showAddChildReward = true;
    $scope.data.showChildRewards = true;
    $scope.data.showChildChores = false;
    $scope.data.showAddRewardButton = false;
  };

  $scope.data.getChore = function(){
    for (var key in this.choreInfo) {
      $scope.data.editChoreInfo = this.choreInfo[key];
    }
  }

  $scope.data.editChildChore = function(){
    $scope.data.showEditChildChore = true;
    $scope.data.showChildRewards = false;
    $scope.data.showEditChoreButton = false;
    $scope.data.showAddChoreButton = false;
    $scope.data.showChildChores = false;
  }

  $scope.data.test = function(){
    console.log($scope.data.key);
  }

  $scope.data.submitChildChore = function(chore){
    $scope.data.showAddChoreButton = true;
    $scope.data.showAddChildChore = false;
    $scope.data.showChildRewards = true;
    var parentID = $scope.data.currentUserId;
    var childUID = $stateParams.id;
    ref.child(parentID).child('children').once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          ref.child(parentID).child('children').child(id).child('chores').push({choreName:chore.name, choreNotes:chore.notes});
        }
      }
    })
    ref.once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          ref.child(id).child('chores').push({choreName:chore.name, choreNotes:chore.notes});
          $state.go("parentShowChild");
        }
      }
    })
  }

  $scope.data.submitChildReward = function(reward){
    $scope.data.showChildChores = true;
    $scope.data.showAddChoreButton = true;
    $scope.data.showAddRewardButton = true;
    $scope.data.showAddChildReward = false;
    var parentID = $scope.data.currentUserId;
    var childUID = $stateParams.id;
    ref.child(parentID).child('children').once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          ref.child(parentID).child('children').child(id).child('rewards').push({rewardName:reward.name, rewardNotes:reward.notes});
        }
      }
    })
    ref.once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          ref.child(id).child('rewards').push({rewardName:reward.name, rewardNotes:reward.notes});
          $state.go("parentShowChild");
        }
      }
    })
  }

  $scope.data.goParentHome = function(){
    $state.go("parentHome");
  }

  var id = $scope.data.currentUserId;

  $scope.data.registerChild = function(child){
    $scope.data.showChildRegistration = false;
    firebase.auth().createUserWithEmailAndPassword(child.username, child.password).then(function(returnData){
      var uid = firebase.auth().currentUser.uid;
      firebase.database().ref().child('users').push({id:uid, name:child.name, type:'child', rewards:[], chores:[]});
      ref.once('value').then(function(snapshot) {
        let data = snapshot.val();
        for (var id in data) {
          if (ParentUid === data[id].id) {
            ref.child(id).child('children').push({id:uid, name:child.name, username:child.username, password:child.password, rewards:[], chores:[]})
          }
        }
      });
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;;
      console.log(errorCode);
      console.log(errorMessage);
    });
    $state.go("parentHome");
  }
});
