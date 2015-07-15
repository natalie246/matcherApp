var app = angular.module('MyMatcher',[]);

var model = {};
var boys = {};
var girls = {};

	app.run(function ($http){
		
		$http.get("http://matcher.herokuapp.com/girls").success(function (data){
			girls.items = data;
			console.log(girls);
		});

		$http.get("http://matcher.herokuapp.com/boys").success(function (data){
			boys.items = data;
			console.log(boys);
		});

		
});


 		app.controller('MyMatcherController', function ($scope, $http) {

 		$scope.testBoys = boys;
 		$scope.testGirls = girls;
		$scope.func = function(){
	 	 		window.location.assign("age.html")
	      		}
 			

		});

