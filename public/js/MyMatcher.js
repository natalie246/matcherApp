var app = angular.module('MyMatcher',[]);

var model = {};
var boys = {};
var girls = {};

	app.run(function ($http){
		
		$http.get("http://localhost:3000/girls").success(function (data){
			girls.items = data;
			console.log(girls);
		});

		$http.get("http://localhost:3000/boys").success(function (data){
			boys.items = data;
			console.log(boys);
		});

		
});


 		app.controller('MyMatcherController', function ($scope, $http) {

 		$scope.test = boys;
 		$scope.testGirls = girls;


		});

 	