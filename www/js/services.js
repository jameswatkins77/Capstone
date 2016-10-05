angular.module('services', [])
.factory('user', function(){
  return {
    getCurrentUserId: function(){
      var uid = firebase.auth().currentUser.uid;
      var ref = firebase.database().ref().child('users');
      return ref.once('value').then(function(snapshot) {
        let data = snapshot.val();
        for (var id in data) {
          if (uid === data[id].id) {
            return id;
          }
        }
      });
    }
  }
})
