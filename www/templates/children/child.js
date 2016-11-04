'Use Strict';
angular.module('capstone').controller('childCtrl', function($scope, user, $stateParams, $rootScope, $firebaseArray, $state, $log, $location, $http, $ionicPopup, $firebaseObject, FURL) {
  var uid = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref().child('users');
  $scope.data = {};
  $scope.data.id = firebase.auth().currentUser.uid;
  $scope.data.showChoreList = true;
  $scope.data.submitCompleteChore = false;
  $scope.data.showChoreListTitle = true;
  $scope.data.purchaseReward = false;
  $scope.data.showRewards = true;
  $scope.data.showRewardsTitle = true;
  $scope.data.childSavingsPoints = 0;
  $scope.data.childSavingsDays = 0;
  $scope.data.showPointsTransfer = true;

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

  $scope.data.rewardsToChores = function(){
    $scope.data.showChoreList = true;
    $scope.data.showChoreListTitle = true;
    $scope.data.submitCompleteChore = false;
  }

  $scope.data.backChores = function(){
    $scope.data.showChoreList = true;
    $scope.data.submitCompleteChore = false;
    $scope.data.showChoreListTitle = true;
  }

  $scope.data.backRewards = function(){
    $scope.data.purchaseReward = false;
    $scope.data.showRewards = true;
    $scope.data.showRewardsTitle = true;
  }

  $scope.data.goRewardPurchase = function(reward){
    $scope.data.rewardInfo = reward;
    $scope.data.purchaseReward = true;
    $scope.data.showRewards = false;
    $scope.data.showRewardsTitle = false;
  }

  $scope.data.submitPurchaseReward = function(reward){
    var childID = $scope.data.currentUserId;
    var childUID = $stateParams.id;
    ref.child(childID).child('points').once('value').then(function(foo){
      let bar = foo.val();
      if (bar >= reward.rewardPoints) {
        var diff = bar - reward.rewardPoints;
        console.log("this is balance: "+bar);
        console.log("this is reward cost: "+reward.rewardPoints);
        console.log("this is remaining balance: "+diff);
        ref.child(childID).child('rewards').once('value').then(function(snapshot){
          let data = snapshot.val();
          for (var id in data) {
            if (reward.rewardName === data[id].rewardName) {
              ref.child(childID).child('rewards').child(id).update({status:"purchased"});
              ref.child(childID).update({points:diff});
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
                ref.child(data2).child('children').child(id2).child('rewards').once('value').then(function(snapshot4){
                  let data4 = snapshot4.val();
                  for (var id3 in data4) {
                    if (reward.rewardName === data4[id3].rewardName) {
                      ref.child(data2).child('children').child(lob).child('rewards').child(id3).update({status:"purchased"});
                      ref.child(data2).child('children').child(lob).update({points:diff});
                    }
                  }
                })
              }
            }
          })
        })
        alert("Your parents has been notified that "+reward.rewardName+" has been purchased.")
      } else {
        alert("You do not have enough points to purchase this reward.")
      }
    })
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
                  ref.child(data2).child('children').child(lob).child('chores').child(id3).update({info:completeDescription, status:"completed"});
                }
              }
            })
          }
        }
      })
    })
    alert("Your parent has been notified that you completed "+completeName+".")
  }
  $scope.data.transferPoints = function(){
    alert("hello")
  }
});
