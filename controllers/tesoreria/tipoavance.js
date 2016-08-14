// Creación del módulo
//var nixApp = angular.module('nixApp', ['ngRoute']);
var hostTipoAvance = host+'/tesoreria/tipoavance';
var idFind;
// Configuración de las rutas




nixApp.controller('tiposAvanceController', function($scope, $http) {
  $scope.title = 'AVANCES';
  $scope.message = 'Listado de Tipos de Avances';

  $http.get(hostTipoAvance)
  .then(function(response) {
      $scope.data = response.data;


  });

  $scope.selectId = function(id){
  //alert('hola'+id);
  idFind = id;
  }


});

nixApp.controller('addTiposAvanceController', function($scope, $http) {
  $scope.title = 'AVANCES';
  $scope.message = 'Agregar Tipo de Avance';

  $scope.reset = function(){
    $scope.tipoAvance = {};
  }

  $scope.add = function(){
    
    if($scope.tipoAvance.referencia == null){
      return;
    }
    if($scope.tipoAvance.nombre == null){
      return;
    }
    if($scope.tipoAvance.descripcion == null){
      return;
    }
     var data = { Referencia: $scope.tipoAvance.referencia,
                  Nombre: $scope.tipoAvance.nombre,
                  Descripcion: $scope.tipoAvance.descripcion
                };
    $http.post(hostTipoAvance,data)
    .success(function(info) {
    alert("Se registraron los datos correctamente")})
    .error(function(info) {
    alert("Ha fallado el registro de datos")});  
    $scope.tipoAvance = {};
  };
});


nixApp.controller('updTiposAvanceController', function($scope, $http) {
 
  $scope.title = 'AVANCES';
  $scope.message = 'Editar Tipo de Avance';
  //alert('edita '+idFind);
  $http.get(hostTipoAvance+'/'+idFind)
  .success(function(response) {
    var datos = { idtipo: response.IdTipo,
                  referencia: response.Referencia,
                  nombre: response.Nombre,
                  descripcion: response.Descripcion,
                  estado: response.Estado,
                };
          $scope.tipoAvance = datos;
          $scope.data.exist=1;});   

$scope.upd = function(){
    
    if($scope.tipoAvance.referencia == null){return;}
    if($scope.tipoAvance.nombre == null){return;}
    if($scope.tipoAvance.descripcion == null){return;}
    if($scope.tipoAvance.estado == null){return;}

     var data = { IdTipo: $scope.tipoAvance.idtipo,
                  Referencia: $scope.tipoAvance.referencia,
                  Nombre: $scope.tipoAvance.nombre,
                  Descripcion: $scope.tipoAvance.descripcion,
                  Estado: $scope.tipoAvance.estado,
                  FechaRegistro :''
                };
    $http.put(hostTipoAvance,data) 
    .success(function(info) {
    alert("Se actualizarón los datos correctamente")})
    .error(function(info) {
      alert("Ha fallado la actualización de datos")
  });  
    //$scope.tipoAvance = {};
  };

});
