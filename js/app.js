var app = angular.module('fileUpload', ['ngFileUpload'])
    app.controller('MyCtrl',['$scope','Upload','$window',function($scope,Upload,$window){
        
       $scope.submit = function(){ //function to call on form submit
            if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
                $scope.upload($scope.file); //call upload function
            }
        }
        $scope.upload = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    $window.alert('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function (evt) { 
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
    }]);


    // ========================custom directive for file upload=========================

   app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.on('change', function(){
                console.log(element[0].files);
                // scope.$apply(function(){
                //     modelSetter(scope, element[0].files[0]);
                // });
            });
        }
    };
}]);

// ================================service================================

// app.service('fileUpload', ['$http', function ($http) {
//     this.uploadFileToUrl = function(file, uploadUrl){
//         var fd = new FormData();
//         fd.append('file', file);
//         $http.post(uploadUrl, fd, {
//             transformRequest: angular.identity,
//             headers: {'Content-Type': undefined}
//         })
//         .success(function(){
//         })
//         .error(function(){
//         });
//     }
// }]);

// Angular’s default transformRequest function will try to serialize our FormData object, so  override it with the identity function to leave the data intact. Angular’s default Content-Type header for POST and PUT requests is application/json. By setting ‘Content-Type’: undefined, the browser sets the Content-Type to multipart/form-data and fills in the correct boundary