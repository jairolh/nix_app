// Creación del módulo
//var nixApp = angular.module('nixApp', ['ngRoute']);
var hostSolicitudAvance = host+'/tesoreria/solicitudavance';
//var idReqFind;
var vigencia;
var idSolicitud;
// Configuración de las rutas


nixApp.controller('SolicitudAvanceController', function($scope, $http, $routeParams) {
  
  $scope.title = 'Solicitud de Avance';
  $scope.message = 'Listado de Solicitudes de Avance';
  vigencia=2016

//alert(vigencia)

  //idTipo=$routeParams.tipoId;
  //busca datos del tipo de avance
 $http.get(hostSolicitudAvance+'/'+vigencia)
  .then(function(response) {
     //alert(JSON.stringify(response))
      $scope.data = response.data;
  });

});
