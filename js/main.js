var FIREBASE_ROOT = "https://checkman.firebaseio.com/dev_test_1"
var FIRE = new Firebase(FIREBASE_ROOT);

var checkman = angular.module("checkman", ["firebase", "ngCookies", "ngRoute", "ngAnimate"]);

checkman.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'MainController',
      templateUrl:'js/views/main.html'
    })
    .when('/settings', {
      controller: 'SettingsController',
      templateUrl: 'js/views/settings.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})

// Common factory for shared data
.factory('common', function($firebaseArray) {
  return {
    templates: $firebaseArray(FIRE.child('projectTemplates'))
  }
})

// View Main
.controller('MainController',
function($scope, $firebase, $firebaseObject, $firebaseArray, common) {
  $scope.pageClass = 'main';

  console.log("Loading settings...");
  $firebaseObject(FIRE.child('settings')).$bindTo($scope, 'settings');
  console.log("Loading project templates...", common.templates);

  // Anonymous Client ID for tracking individuals (no reason really, keeping
  // it around in case we need it later)
  if (!localStorage.getItem("clientId")) {
    localStorage.setItem("clientId", guid());
  }

  var clientId = localStorage.getItem("clientId");
  console.log("Your anonymous client ID is: "+clientId);
})

// Projects List Subcontroller
.controller('ProjectsController',
function($scope, $firebase, $firebaseObject, $firebaseArray, $cookies, common) {
  $scope.projects = $firebaseArray(FIRE.child('projects'));

  $scope.addProject = function() {
    var template = {
      id: guid(),
      name: "New Project"
    };
    $scope.projects.$add($.extend({}, template));
  };
})

// View Settings
.controller('SettingsController',
function($scope, $firebase, $firebaseObject, $firebaseArray, common) {
  $scope.pageClass = 'settings';
});



