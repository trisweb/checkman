
// Main project directive
// Should be bound to the firebase root /projects/[id]
checkman.directive('project', function($firebaseObject) {
  return {
    restrict: 'E',
    scope: {
      projectId: '=' // Converted to $scope.project below
    },
    link: function($scope, $element, $attrs) {
      console.log("Loading project... ", $scope.projectId);
      $scope.project = $firebaseObject(FIRE.child('projects').child($scope.projectId)); // TODO: Watch for changes

      $scope.project.$loaded().then(function() {
        console.log("Project loaded:", $scope.project);
      });

      $scope.addStage = function() {
        if (!$scope.project.stages) {
          $scope.project.stages = {};
        }
        $scope.project.stages[guid()] = {
          name: "Test add"
        };
        $scope.project.$save();
      };

      $scope.addTask = function(stage) {
        if (!stage.tasks) {
          stage.tasks = {};
        }
        stage.tasks[guid()] = {
          name: "Task test",
          complete: false
        };
        $scope.project.$save();
      };

      $scope.taskChanged = function() {
        $scope.project.$save();
      };

      $scope.remove = function() {
        if (confirm("Are you sure you want to remove this project?")) {
          $scope.project.$remove().then(function(ref) {
            console.log("Removed ", ref);
          }, function(error) {
            console.log(error);
          });
        };
      };

      $scope.rename = function() {
        var newName = prompt("Update the project's name:", $scope.project.name);
        if (newName === null) {
          return;
        } else if (!newName) {
          alert("A name is required!");
        } else if (newName != $scope.project.name) {
          $scope.project.name = newName;
          $scope.project.$save();
        }
      };

    },
    templateUrl: 'js/templates/project.html'
  }
});

checkman.directive('colorpicker', function($firebaseObject) {
  var COLORS = [
    // TODO: Should we use a class=i or a style=#color directly? Hmm.
    1,2,3,4,5,6,7,8,9,10
  ]
  return {
    restrict: 'EA',
    scope: { project: '=' },
    link: function($scope, $element, $attrs) {

    },
    template: '<div class="colorpicker"></div>'
  };
});

// From https://docs.angularjs.org/api/ng/type/ngModel.NgModelController
// -- allow contenteditable to basically be a text field w.r.t. ng-model.
//
checkman.directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A',
    require: 'ngModel',
    priority: 2,
    link: function(scope, element, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$apply(read);
      });
      read();

      var htmlRegex = /(<([^>]+)>)/ig;

      // Write data to the model
      function read() {
        var html = element.html();
        // Strip all HTML -- we want text-only

        html = html.replace(htmlRegex, "");
        ngModel.$setViewValue(html);
      }
    }
  };
}]);