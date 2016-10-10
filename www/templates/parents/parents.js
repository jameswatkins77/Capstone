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
  var id = $scope.data.currentUserId;

  $scope.data.logout = function(){
    firebase.auth().signOut().then(function() {
      console.log("user signed out");
      $state.go("login");
    }, function(error) {
      console.log("error logging out");
    });
  }
  $scope.data.showChildRegistration = false;
  $scope.data.showAddChildReward = false;
  $scope.data.showChildRewards = true;
  $scope.data.showChildChores = true;
  $scope.data.showAddChoreButton = true;
  $scope.data.showAddRewardButton = true;
  $scope.data.showEditChildChore = false;
  $scope.data.showEditChoreButton = true;
  $scope.data.showDeleteChildButton = true;
  $scope.data.showAddChildChore = false;

  $scope.data.goParentHome = function(){
    $state.go("parentHome");
  };

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

  $scope.data.addChildFromParentHome = function(){
    $scope.data.showChildRegistration = true;
  }

  $scope.data.addChildChore = function(){
    $scope.data.showAddChildChore = true;
    $scope.data.showChildRewards = false;
    $scope.data.showAddChoreButton = false;
    $scope.data.showDeleteChildButton = false;
  };

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
          ref.child(parentID).child('children').child(id).child('chores').push({choreName:chore.name, choreNotes:chore.notes, chorePoints:chore.points, status:"incomplete"});
        }
      }
    })
    ref.once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          ref.child(id).child('chores').push({choreName:chore.name, choreNotes:chore.notes, chorePoints:chore.points, status:"incomplete"});
          $state.go("parentShowChild");
        }
      }
    })
  };

  $scope.data.editChore = function(chore){
    $scope.data.showEditChildChore = true;
    $scope.data.showChildRewards = false;
    $scope.data.showEditChoreButton = false;
    $scope.data.showAddChoreButton = false;
    $scope.data.showChildChores = false;
    $scope.data.showDeleteChildButton = false;
    $scope.data.editChoreInfo = chore;
  };

  $scope.data.submitEditChildChore = function(oldChore, chore){
    var parentID = $scope.data.currentUserId;
    var childUID = $stateParams.id;
    ref.child(parentID).child('children').once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          var foo = id;
          ref.child(parentID).child('children').child(id).child('chores').once('value').then(function(snapshot2){
            let data2 = snapshot2.val();
            for (var id2 in data2) {
              if (oldChore.choreName === data2[id2].choreName) {
                ref.child(parentID).child('children').child(foo).child('chores').child(id2).update({choreName:chore.choreName});
                ref.child(parentID).child('children').child(foo).child('chores').child(id2).update({choreNotes:chore.choreNotes});
                ref.child(parentID).child('children').child(foo).child('chores').child(id2).update({chorePoints:chore.chorePoints});
              }
            }
          })
        }
      }
    })
    ref.once('value').then(function(snapshot3){
      let data3 = snapshot3.val();
      for (var id3 in data3) {
        if (childUID === data3[id3].id) {
          var bar = id3;
          ref.child(id3).child('chores').once('value').then(function(snapshot4){
            let data4 = snapshot4.val();
            for (var id4 in data4) {
              if (oldChore.choreName === data4[id4].choreName) {
                ref.child(bar).child('chores').child(id4).update({choreName:chore.choreName});
                ref.child(bar).child('chores').child(id4).update({choreNotes:chore.choreNotes});
                ref.child(bar).child('chores').child(id4).update({chorePoints:chore.chorePoints});
              }
            }
          })
        }
      }
    })
  };

  $scope.data.deleteChildChore = function(oldChore){
    var parentID = $scope.data.currentUserId;
    var childUID = $stateParams.id;
    ref.child(parentID).child('children').once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          var foo = id;
          ref.child(parentID).child('children').child(id).child('chores').once('value').then(function(snapshot2){
            let data2 = snapshot2.val();
            for (var id2 in data2) {
              if (oldChore.choreName === data2[id2].choreName) {
                ref.child(parentID).child('children').child(foo).child('chores').child(id2).remove();
              }
            }
          })
        }
      }
    })
    ref.once('value').then(function(snapshot3){
      let data3 = snapshot3.val();
      for (var id3 in data3) {
        if (childUID === data3[id3].id) {
          var bar = id3;
          ref.child(id3).child('chores').once('value').then(function(snapshot4){
            let data4 = snapshot4.val();
            for (var id4 in data4) {
              ref.child(bar).child('chores').child(id4).remove();
            }
          })
        }
      }
    })
  };

  $scope.data.addChildReward = function(){
    $scope.data.showAddChildReward = true;
    $scope.data.showChildRewards = true;
    $scope.data.showChildChores = false;
    $scope.data.showAddRewardButton = false;
    $scope.data.showDeleteChildButton = false;
  };

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
          ref.child(parentID).child('children').child(id).child('rewards').push({rewardName:reward.name, rewardNotes:reward.notes, rewardPoints:reward.points, status:"not received"});
        }
      }
    })
    ref.once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          ref.child(id).child('rewards').push({rewardName:reward.name, rewardNotes:reward.notes, rewardPoints:reward.points, status:"not received"});
          $state.go("parentShowChild");
        }
      }
    })
  };

  $scope.data.editReward = function(reward){
    $scope.data.showEditChildReward = true;
    $scope.data.showChildRewards = false;
    $scope.data.showEditChoreButton = false;
    $scope.data.showAddChoreButton = false;
    $scope.data.showChildChores = false;
    $scope.data.showDeleteChildButton = false;
    $scope.data.editRewardInfo = reward;
  };

  $scope.data.submitEditChildReward = function(oldReward, reward){
    var parentID = $scope.data.currentUserId;
    var childUID = $stateParams.id;
    ref.child(parentID).child('children').once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          var foo = id;
          ref.child(parentID).child('children').child(id).child('rewards').once('value').then(function(snapshot2){
            let data2 = snapshot2.val();
            for (var id2 in data2) {
              if (oldReward.rewardName === data2[id2].rewardName) {
                ref.child(parentID).child('children').child(foo).child('rewards').child(id2).update({rewardName:reward.rewardName});
                ref.child(parentID).child('children').child(foo).child('rewards').child(id2).update({rewardNotes:reward.rewardNotes});
                ref.child(parentID).child('children').child(foo).child('rewards').child(id2).update({rewardPoints:reward.rewardPoints});
              }
            }
          })
        }
      }
    })
    ref.once('value').then(function(snapshot3){
      let data3 = snapshot3.val();
      for (var id3 in data3) {
        if (childUID === data3[id3].id) {
          var bar = id3;
          ref.child(id3).child('rewards').once('value').then(function(snapshot4){
            let data4 = snapshot4.val();
            for (var id4 in data4) {
              if (oldReward.rewardName === data4[id4].rewardName) {
                ref.child(bar).child('rewards').child(id4).update({rewardName:reward.rewardName});
                ref.child(bar).child('rewards').child(id4).update({rewardNotes:reward.rewardNotes});
                ref.child(bar).child('rewards').child(id4).update({rewardPoints:reward.rewardPoints});
              }
            }
          })
        }
      }
    })
  };

  $scope.data.deleteChildReward = function(oldReward){
    console.log("reward deleted");
    var parentID = $scope.data.currentUserId;
    var childUID = $stateParams.id;
    ref.child(parentID).child('children').once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          var foo = id;
          ref.child(parentID).child('children').child(id).child('rewards').once('value').then(function(snapshot2){
            let data2 = snapshot2.val();
            for (var id2 in data2) {
              if (oldReward.rewardName === data2[id2].rewardName) {
                ref.child(parentID).child('children').child(foo).child('rewards').child(id2).remove();
              }
            }
          })
        }
      }
    })
    ref.once('value').then(function(snapshot3){
      let data3 = snapshot3.val();
      for (var id3 in data3) {
        if (childUID === data3[id3].id) {
          var bar = id3;
          ref.child(id3).child('rewards').once('value').then(function(snapshot4){
            let data4 = snapshot4.val();
            for (var id4 in data4) {
                ref.child(bar).child('rewards').child(id4).remove();
            }
          })
        }
      }
    })
  };

  $scope.data.deleteChild = function(){
    var parentID = $scope.data.currentUserId;
    var childUID = $stateParams.id;
    ref.child(parentID).child('children').once('value').then(function(snapshot){
      let data = snapshot.val();
      for (var id in data) {
        if (childUID === data[id].id) {
          ref.child(parentID).child('children').child(id).remove();
        }
      }
    })
    ref.once('value').then(function(snapshot3){
      let data3 = snapshot3.val();
      for (var id3 in data3) {
        if (childUID === data3[id3].id) {
          ref.child(id3).remove();
        }
      }
    })
  }
});
