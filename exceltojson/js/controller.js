var app = angular.module('myApp',[]);

app.controller('myController', function($scope,$http,fileUpload,$document){
    
     $scope.submit = function(){
          console.log("sent");
          console.log($scope.myFile)
           var file = $scope.myFile;
           var uploadUrl = '/upload';
           var field = new Date();
          fileUpload.uploadFileToUrl(file,field, uploadUrl).then(function(response){
            console.log(response);
           $scope.books = response.data;
            }, function(response){
            console.log(response)
          });
           
        }
        
   
});

app.service('fileUpload', ['$http','$q' ,function ($http,$q) {
    this.uploadFileToUrl = function(file,field, uploadUrl){
        var deferred = $q.defer();
        var fd = new FormData();
       
           for (var i = 0; i < file.length; i++) {
            console.log("loop started")
           fd.append(file[i].name, file[i])
           console.log("loop ended")
        }
        // fd.append('file', file[0])
       
        
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

 app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
             console.log("link");
            element.on('change', function(){
                console.log("changes")
                console.log(element[0].files);
                scope.$apply(function(){
                    modelSetter(scope, element[0].files);
                });
             });
        
    }
}
}]);