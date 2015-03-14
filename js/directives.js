
// Main project directive
// Should be bound to the firebase root /projects/[id]
checkman.directive('project',
  [       '$firebaseObject',
  function($firebaseObject) {
    return {
      restrict: 'E',
      scope: {
        projectId: '=' // Converted to $scope.project below
      },
      link: function($scope, $element, $attrs) {
        console.log("Loading project... ", $scope.projectRef);
        $scope.project = $firebaseObject(FIRE.child('projects').child($scope.projectId)); // TODO: Watch for changes

        $scope.project.$loaded().then(function() {
          // Loaded.
          console.log("Project loaded:", $scope.project);
        });

        $scope.remove = function() {
          if (confirm("Are you sure you want to remove this project?")) {
            $scope.project.$remove().then(function(ref) {
              console.log("Removed ", ref);
            }, function(error) {
              console.log(error);
            });
          };
        };

      },
      templateUrl: 'js/templates/project.html'
    }
  }
]);


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