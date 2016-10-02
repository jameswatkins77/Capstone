'Use Strict';
angular.module('capstone').controller('registrationCtrl', function($scope, $rootScope, $state, $log, $location, $http, $ionicPopup, $firebaseObject, $firebaseAuth, FURL) {
  $scope.data = {};
  $scope.data.registerMore = true;
  $scope.data.registerMore2 = false;
  $scope.data.registerMore3 = false;
  $scope.data.registerMore4 = false;
  $scope.data.registerMore5 = false;

  $scope.data.registerMoreChildren = function(){
    $scope.data.registerMore = false;
    $scope.data.registerMore2 = true;
  }

  $scope.data.registerMoreChildren2 = function(){
    $scope.data.registerMore3 = true;
  }

  $scope.data.registerMoreChildren3 = function(){
    $scope.data.registerMore4 = true;
  }

  $scope.data.registerMoreChildren4 = function(){
    $scope.data.registerMore5 = true;
  }



  $scope.data.register = function(parent, child){
    var ref = firebase.database().ref();
    firebase.auth().createUserWithEmailAndPassword(child.username, child.password).then(function(returnData){
      ref.child("users").push({id: returnData.uid, name: child.name, type: "child", chores:['example1'], rewards:['example1']});
      $state.go("parentHome");
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
    firebase.auth().createUserWithEmailAndPassword(parent.email, parent.password).then(function(returnData){
      ref.child("users").push({id: returnData.uid, name: parent.name, type: "parent", children: ['example1']});
      $state.go("parentHome");
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;;
      console.log(errorCode);
      console.log(errorMessage);
    });
    var uid = firebase.auth().currentUser.uid;
    var ref2 = firebase.database().ref().child('users');
    ref2.on("value", function(snapshot) {
      let data = snapshot.val();
      for (var id in data) {
        if (uid === data[id].id) {
          ref.child("users").child(id).child("children").push({child:child.name})
        }
      }
    })
    // if ($scope.data.registerMore2 === true) {
    //   firebase.auth().createUserWithEmailAndPassword(child2.username, child2.password).catch(function(error) {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log(errorCode);
    //   console.log(errorMessage);
    // });
    // }
    // if ($scope.data.registerMore3 === true) {
    //   firebase.auth().createUserWithEmailAndPassword(child3.username, child3.password).catch(function(error) {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log(errorCode);
    //   console.log(errorMessage);
    // });
    // }
    // if ($scope.data.registerMore4 === true) {
    //   firebase.auth().createUserWithEmailAndPassword(child4.username, child4.password).catch(function(error) {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log(errorCode);
    //   console.log(errorMessage);
    // });
    // }
    // if ($scope.data.registerMore5 === true) {
    //   firebase.auth().createUserWithEmailAndPassword(child5.username, child5.password).catch(function(error) {
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   console.log(errorCode);
    //   console.log(errorMessage);
    // });
    // }
  }
});
