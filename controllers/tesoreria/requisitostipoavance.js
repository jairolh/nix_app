// Creación del módulo
//var nixApp = angular.module('nixApp', ['ngRoute']);
var hostRequisitoAvance = host+'/tesoreria/requisitoAvance';
//var idReqFind;
var idTipo;
var idReq;
// Configuración de las rutas


nixApp.controller('RequisitoAvanceController', function($scope, $http, $routeParams) {
  
  $scope.title = 'Tipo de Avance : ';
  $scope.message = 'Listado de Requisitos para Avance';
  idTipo=$routeParams.tipoId;
  //busca datos del tipo de avance
  $http.get(hostTipoAvance+'/'+idTipo)
  .success(function(responseTAV) {
    var datos = { idtipo: responseTAV.IdTipo,
                  referencia: responseTAV.Referencia,
                  nombre: responseTAV.Nombre,
                  descripcion: responseTAV.Descripcion,
                  estado: responseTAV.Estado,
                };
          $scope.tipoAvance = datos;
          $scope.data.exist=1;});  

  //busca listado de requisitos relacionados al tipo de avance
  $http.get(hostRequisitoAvance+'/ls/'+idTipo)
  .then(function(response) {
      $scope.data = response.data;
  });

  $scope.selectIdtipo = function(id){
  //alert('hola'+id);
  idTipo = id;
  }
});


nixApp.controller('addRequisitoAvanceController', function($scope, $http) {
  $scope.title = 'Tipo de Avance : ';
  $scope.message = 'Agregar Nuevo Requisito';
  //busca datos del tipo de avance
  $http.get(hostTipoAvance+'/'+idTipo)
  .success(function(responseTAV) {
    var datos = { idtipo: responseTAV.IdTipo,
                  referencia: responseTAV.Referencia,
                  nombre: responseTAV.Nombre,
                  descripcion: responseTAV.Descripcion,
                  estado: responseTAV.Estado,
                };
          $scope.requisitoAvance = datos;
          $scope.data.exist=1;});  

  $scope.reset = function(){
    $scope.RequisitoAvance = {};
  }

  //busca listado de requisitos no relacionados al tipo de avance
  $http.get(hostRequisitoAvance+'/selreq/'+idTipo)
  .then(function(response) {
      $scope.dataReq = response.data;
  });

  $scope.add = function(){
  //alert(JSON.stringify($scope.requisitoAvance)) //permite ver el arreglo que llega
  $scope.requisitoAvance.idreq=parseInt($scope.requisitoAvance.idreq, 10);
   if($scope.requisitoAvance.idreq == null) {return;}
    var datos = { IdTipo: $scope.requisitoAvance.idtipo,
                   IdReq:  $scope.requisitoAvance.idreq,
                };
    $http.post(hostRequisitoAvance,datos)
    .success(function(info) {
    alert("Se registraron los datos correctamente")})
    .error(function(info) {
    alert("Ha fallado el registro de datos")});  
    //$scope.dataReq  = {};
  };
});


nixApp.controller('updRequisitoAvanceController', function($scope, $http, $routeParams) {
 
  $scope.title = 'Tipo de Avance : ';
  $scope.message = 'Agregar Nuevo Requisito';
  idTipo=$routeParams.tipoId;
  idReq=$routeParams.reqId;
  //alert('edita '+idTipo+' - '+idReq);
 $http.get(hostRequisitoAvance+'/search/'+idTipo+'/'+idReq)
  .success(function(response) {
//  alert(JSON.stringify(response))
    var datos = { idreq: response.IdReq,
                  idtipo: response.IdTipo,
                  estado: response.Estado,
                  referenciaAvn: response.ReferenciaAvn ,
                  nombreAvn: response.NombreAvn,
                  referencia: response.ReferenciaReq,
                  nombre: response.NombreReq,
                  descripcion: response.DescripcionReq,
                  etapa: response.EtapaReq,
                };
          $scope.requisitoAvanceupd = datos;
          $scope.data.exist=1;
        });   

$scope.upd = function(){
    if($scope.requisitoAvanceupd.estado == null){return;}
     var data = { IdReq:      $scope.requisitoAvanceupd.idreq,
                  IdTipo:     $scope.requisitoAvanceupd.idtipo,
                  Estado:     $scope.requisitoAvanceupd.estado,
                };
    $http.put(hostRequisitoAvance ,data) 
    .success(function(info) {
    alert("Se actualizarón los datos correctamente")})
    .error(function(info) {
      alert("Ha fallado la actualización de datos")
  });  
    //$scope.tipoRequisito = {};
  };

});
