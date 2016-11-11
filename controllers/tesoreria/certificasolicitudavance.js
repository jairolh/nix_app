// Creación del módulo
//var nixApp = angular.module('nixApp', ['ngRoute']);
var hostSolicitudAvance = host+'/tesoreria/solicitudavance';
var hostTipoAvance = host+'/tesoreria/tipoavance';
//var idReqFind;
var vigencia;
var fecha = new Date();
vigencia=fecha.getFullYear();

var idSolicitud;
// Configuración de las rutas


nixApp.controller('CertificaAvanceController', function($scope, $http, $routeParams,$filter) {
  
  $scope.title = 'Certificación Solicitud de Avance';
  $scope.message = 'Listado de Solicitudes de Avance';
 
//busca datos del tipo de avance
 $http.get(hostSolicitudAvance+'/lista/'+vigencia)
  .then(function(response) {
     //alert(JSON.stringify(response))
      var solicitudes=$filter('filter')(response.data, {"EstadoActual":"!Registrado"});
      solicitudes=$filter('filter')(solicitudes, {"EstadoActual":"!Cancelado"});
      solicitudes=$filter('filter')(solicitudes, {"EstadoActual":"!Legalizado"});
      solicitudes=$filter('filter')(solicitudes, {"EstadoActual":"!Girado"});
      $scope.solicitud=solicitudes;
  });
});
