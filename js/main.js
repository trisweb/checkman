var checkMan = angular.module("checkMan", ["firebase", "ngCookies"]);

checkMan.filter('object2Array', function() {
  return function(input) {
    var out = [];
    for (i in input) {
      if (input[i] && typeof(input[i]) == "object") {
        out.push(input[i]);
      }
    }
    return out;
  }
});

function guid() {
  var u='',i=0;
  while(i++<36) {
    var c='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'[i-1],r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);
    u+=(c=='-'||c=='4')?c:v.toString(16)
  }
  return u;
}

checkMan.controller('ItemController', function($scope, $firebase, $firebaseArray, $cookies) {
  // Anonymous Client ID for tracking votes

  if (!localStorage.getItem("clientId")) {
    localStorage.setItem("clientId", guid());
  }
  var clientId = localStorage.getItem("clientId");
  console.log("Your anonymous client ID is: "+clientId);

  var itemRef = new Firebase("https://glaring-fire-4509.firebaseio.com/culture1");
  // Automatically syncs everywhere in realtime
  $scope.items = $firebaseArray(itemRef);

  function getId(item) {
    for (var key in $scope.items) {
      if ($scope.items[key] == item) {
        return key;
      }
    }
    return null;
  }

  $scope.resetItem = function() {
    $scope.newItem = {name: "", score: 1, votes: [ clientId ], owner: clientId};
  }
  $scope.resetItem();

  $scope.addItem = function() {
    // Limit to 200 chars.
    if (!$scope.newItem.name) {
      alert("You have to type something");
      return;
    } else if ($scope.newItem.name.length > 200) {
      alert("Concise is better than long (Under 200 characters please)");
      return;
    }

    // Check for dups
    for (var key in $scope.items) {
      if ($scope.items[key] && $scope.items[key].name == $scope.newItem.name) {
        $scope.vote($scope.items[key]);
        alert("That item already exists, your vote has been counted.");
        return;
      }
    }

    // AngularFire $add method
    $scope.items.$add($scope.newItem);
    $scope.resetItem();
  }

  $scope.vote = function(item) {
    if ($scope.votable(item)) {
      item.score += 1;
      if (item.votes == null) {
        item.votes = [];
      }
      item.votes.push(clientId);
    }
    $scope.items.$save();
  }

  $scope.unvote = function(item) {
    if (!$scope.votable(item)) {
      item.score -= 1;
      if (item.votes == null) {
        item.votes = [];
      }
      var i = item.votes.indexOf(clientId);
      if (i > -1) {
        item.votes.splice(i, 1);
      }
      $scope.items.$save();
    }
  }

  $scope.votable = function(item) {
    return item.votes == null || item.votes.indexOf(clientId) < 0;
  }

  $scope.delete = function(item) {
    if (confirm("Are you sure you want to remove your line?")) {
      if ($scope.deletable(item)) {
        $scope.items.$remove(item);
      }
    }
  }

  $scope.deletable = function(item) {
    return item && item.owner == clientId;
  }
});
