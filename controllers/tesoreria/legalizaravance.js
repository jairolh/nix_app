// Creación del módulo
//var nixApp = angular.module('nixApp', ['ngRoute']);
var hostLegalizarAvance = host+'/tesoreria/legalizaravance';
var hostTipoAvance = host+'/tesoreria/tipoavance';
//var idReqFind;
var vigencia;
var fecha = new Date();
vigencia=fecha.getFullYear();

var idSolicitud;
// Configuración de las rutas


nixApp.controller('LegalizaAvanceController', function($scope, $http, $routeParams,$filter) {
  
  $scope.title = 'Legalización de Avance';
  $scope.message = 'Listado de Avances';
  
  $scope.hoy=$filter('date')(new Date(), "yyyy-MM-dd");
  //busca datos del tipo de avance
   $http.get(hostLegalizarAvance+'/lista/'+vigencia)
    .then(function(response) {
       //alert(JSON.stringify(response))
        var avance=$filter('filter')(response.data, {"EstadoActual":"Girado"});
        $scope.solicitud=avance;
    });

    $scope.fechaLegalizar = function(fecha){
        //alert(fecha)
        fecha = $filter('date')(fecha, "MM/dd/yyyy");
        var fechaIni=new Date(fecha);
      /*dSem=fecha3.getDay(); //dia semana 0 dom -6 sab
        day=fecha3.getDate();
        month=fecha3.getMonth()+1;
        year=fecha3.getFullYear();*/
     
        var diasAgregar=15
        var tiempo=fechaIni.getTime();
        var milisegundos=parseInt(diasAgregar*24*60*60*1000);
        var total=fechaIni.setTime(tiempo+milisegundos);
        var fechaFin=new Date(total);
        //verifica si el limite es sabado o domingo y suma para lunes
        if ((fechaFin.getDay()==0) || (fechaFin.getDay()==6)) {
            if (fechaFin.getDay()==0) Agregar=1
            if (fechaFin.getDay()==6) Agregar=2
            tiempo=fechaFin.getTime();
            milisegundos=parseInt(Agregar*24*60*60*1000);
            total=fechaFin.setTime(tiempo+milisegundos);
            fechaFin=new Date(total);
          }
        return $filter('date')(fechaFin, "yyyy-MM-dd");   
      };//fechaLegalizar   

    $scope.fechaDiferencia = function(fechaIni, fechaFin){
        fechaIni = $filter('date')(fechaIni, "MM/dd/yyyy");
        fechaIni=new Date(fechaIni);
        fechaFin = $filter('date')(fechaFin, "MM/dd/yyyy");
        fechaFin=new Date(fechaFin);
        var milisegundosDia = 1000 * 60 * 60 * 24;
        var diferencia =Math.floor((fechaIni.getTime() - fechaFin.getTime()) / milisegundosDia);
        return diferencia;
      };//fechaLegalizar   


});

