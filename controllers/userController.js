angular.module('nixApp', ['userService']);

nixApp.controller('userController', ['$scope','userRequest',userController]);
function userController($scope, userRequest) {
	$scope.message = 'Usuarios de la aplicación';
	$scope.users={};
	$scope.user={};
	$scope.getAllUsers = function(){
		userRequest.users().success(function (data){
			$scope.users=data; // Asignaremos los datos de todos
			$scope.users.exist=1;
			$scope.user.exist=0;
		});
	}
	$scope.getUser = function(){
		userRequest.user($scope.user_id).success(function (data){
			$scope.user=data; // Asignaremos los datos
			$scope.user.exist=1;
			$scope.users.exist=1;
		});
	}
	$scope.selectId = function(id){
		$scope.user_id = id;
		$scope.getUser();
	}
	$scope.deleteUser = function(){
		userRequest.del($scope.user_id).success(function (data){
			alert("user deleted");
			$scope.user.exist=0;
			$scope.getAllUsers();

		});
	}
	$scope.editUser = function() {
		var firstname = $scope.user.firstname;
		if(firstname == null){
			return;
		}
		var lastname = $scope.user.lastname;
		if(lastname == null){
			return;
		}
		userRequest.edit($scope.user_id,firstname,lastname).success(function (){
			$scope.getAllUsers();
		});
	};
	$scope.add = function() {
		var firstname = $scope.user.firstname;
		if(firstname == null){
			return;
		}
		var lastname = $scope.user.lastname;
		if(lastname == null){
			return;
		}
		userRequest.add(firstname,lastname).success(function (){
			$scope.getAllUsers();
		});
	};
}
