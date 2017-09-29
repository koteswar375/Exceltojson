var app = angular.module('fileUpload', [])
    app.controller('MyCtrl',['$scope','$window','fileUpload','$document',function($scope,$window,fileUpload,$document){
        $scope.submit = function(){
           var file = $scope.myFile;
           var uploadUrl = '/upload';
           var field = $scope.form;
          fileUpload.uploadFileToUrl(file,field, uploadUrl).then(function(response){
            console.log(response);
            $scope.form='';
            angular.element($document[0].querySelector('#fileinput')).val('');
          }, function(response){
            console.log(response)
          });
           
        }
    //    $scope.submit = function(){ //function to call on form submit
    //         if ($scope.upload_form.file.$valid && $scope.file) { //check if from is valid
    //             $scope.upload($scope.file); //call upload function
    //         }
    //     }
    //     $scope.upload = function (file) {
    //         Upload.upload({
    //             url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
    //             data:{file:file} //pass file as data, should be user ng-model
    //         }).then(function (resp) { //upload function returns a promise
    //             if(resp.data.error_code === 0){ //validate success
    //                 $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
    //             } else {
    //                 $window.alert('an error occured');
    //             }
    //         }, function (resp) { //catch error
    //             console.log('Error status: ' + resp.status);
    //             $window.alert('Error status: ' + resp.status);
    //         }, function (evt) { 
    //             console.log(evt);
    //             var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //             console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    //             $scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
    //         });
    //     };
    // }]);

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
                scope.$apply(function(){
                    modelSetter(scope, element[0].files);
                });
             });
        
    }
}
}]);



// ================================service================================

app.service('fileUpload', ['$http','$q' ,function ($http,$q) {
    this.uploadFileToUrl = function(file,field, uploadUrl){
        var deferred = $q.defer();
        var fd = new FormData();
        for (var i = 0; i < file.length; i++) {
           fd.append(file[i].name, file[i])
        }
        
        fd.append('field', JSON.stringify(field));
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response){
            deferred.resolve(response.data);
            for(var x of fd.entries()) {
            fd.delete(x[0]);
         }
        }, function(response){
           deferred.reject(response.data)
        })
        return deferred.promise;
    }
}]);

// Angular’s default transformRequest function will try to serialize our FormData object, so  override it with the identity function to leave the data intact. Angular’s default Content-Type header for POST and PUT requests is application/json. By setting ‘Content-Type’: undefined, the browser sets the Content-Type to multipart/form-data and fills in the correct boundary