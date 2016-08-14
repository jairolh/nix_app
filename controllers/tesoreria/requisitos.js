// Creación del módulo
//var nixApp = angular.module('nixApp', ['ngRoute']);
var hostRequisito = host+'/tesoreria/requisito';
var idReqFind;
// Configuración de las rutas


nixApp.controller('RequisitoController', function($scope, $http) {
  $scope.title = 'REQUISITOS';
  $scope.message = 'Listado de Tipos de Requisitos';

  $http.get(hostRequisito)
  .then(function(response) {
      $scope.data = response.data;
  });

  $scope.selectId = function(id){
  //alert('hola'+id);
  idReqFind = id;
  }
/*
  $scope.deleteTipo = function(id){
    alert('borrar '+id);
     var data = { IdReq: id,
                  Referencia: id,
                  Nombre: id,
                  Descripcion: id,
                  Estado: id,
                  FechaRegistro :''
                };
    $http.delete(hostRequisito+'/'+id) 
          .success(function(info) {
          alert("Se borro el registro correctamente")})
          .error(function(info) {
          alert("Ha fallado el borrado del registro")});  

      $http.get(hostRequisito)
        .then(function(response) {
            $scope.data = response.data;
        });
        }*/

});

nixApp.controller('addRequisitoController', function($scope, $http) {
  $scope.title = 'REQUISITOS';
  $scope.message = 'Agregar Tipo de Requisito';

  $scope.reset = function(){
    $scope.tipoRequisito = {};
  }

  $scope.add = function(){
    
    if($scope.tipoRequisito.referencia == null) {return;}
    if($scope.tipoRequisito.nombre == null)     {return;}
    if($scope.tipoRequisito.descripcion == null){return;}
    if($scope.tipoRequisito.etapa == null){return;}

     var data = { Referencia: $scope.tipoRequisito.referencia,
                  Nombre: $scope.tipoRequisito.nombre,
                  Descripcion: $scope.tipoRequisito.descripcion,
                  Etapa: $scope.tipoRequisito.etapa
                };
    $http.post(hostRequisito,data)
    .success(function(info) {
    alert("Se registraron los datos correctamente")})
    .error(function(info) {
    alert("Ha fallado el registro de datos")});  
    $scope.tipoRequisito = {};
  };
});


nixApp.controller('updRequisitoController', function($scope, $http) {
 
  $scope.title = 'REQUISITOS';
  $scope.message = 'Editar Tipo de Requisito';
  //alert('edita '+idReqFind);
  $http.get(hostRequisito+'/'+idReqFind)
  .success(function(response) {
    var datos = { idreq: response.IdReq,
                  referencia: response.Referencia,
                  nombre: response.Nombre,
                  descripcion: response.Descripcion,
                  estado: response.Estado,
                  etapa: response.Etapa,
                };
          $scope.tipoRequisito = datos;
          $scope.data.exist=1;});   

$scope.upd = function(){
    
    if($scope.tipoRequisito.referencia == null){return;}
    if($scope.tipoRequisito.nombre == null){return;}
    if($scope.tipoRequisito.descripcion == null){return;}
    if($scope.tipoRequisito.estado == null){return;}
    if($scope.tipoRequisito.etapa == null){return;}

     var data = { IdReq:      $scope.tipoRequisito.idreq,
                  Referencia: $scope.tipoRequisito.referencia,
                  Nombre:     $scope.tipoRequisito.nombre,
                  Descripcion:$scope.tipoRequisito.descripcion,
                  Estado:     $scope.tipoRequisito.estado,
                  Etapa:      $scope.tipoRequisito.etapa,
                  FechaRegistro :''
                };
    $http.put(hostRequisito,data) 
    .success(function(info) {
    alert("Se actualizarón los datos correctamente")})
    .error(function(info) {
      alert("Ha fallado la actualización de datos")
  });  
    //$scope.tipoRequisito = {};
  };

});
