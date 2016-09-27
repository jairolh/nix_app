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


nixApp.controller('SolicitudAvanceController', function($scope, $http, $routeParams) {
  
  $scope.title = 'Solicitud de Avance';
  $scope.message = 'Listado de Solicitudes de Avance';
 
//busca datos del tipo de avance
 $http.get(hostSolicitudAvance+'/solicitud/'+vigencia)
  .then(function(response) {
     //alert(JSON.stringify(response))
      $scope.data = response.data;
  });

});

nixApp.controller('addSolicitudAvanceController', function($scope, $http,$filter) {
  $scope.title = 'Solicitud de Avance';
  $scope.message = 'Registrar Solicitud de Avance';

$http.get('models/terceros.json')
       .then(function(response){
        //alert(JSON.stringify(response))
        $scope.terceros = response.data;
        });

//busca los datos de tercero 
$scope.selectBeneficiario = function(idBen) {  
  beneficiario=$filter('filter')($scope.terceros, {"id" : idBen})[0];
  $scope.solicitudAvance.Beneficiario = { 
              IdBeneficiario: beneficiario.id,
              Documento :beneficiario.documento,
              TipoDocumento :beneficiario.tipodocumento,
              LugarDocumento :beneficiario.lugardocumento,
              Nombre: beneficiario.nombres,
              Apellido: beneficiario.apellidos,
              Direccion: beneficiario.direccion,
              Correo: beneficiario.correo,
              Telefono: beneficiario.telefono,
              Celular: beneficiario.celular,
            };
  $scope.solicitudAvance.Solicitud= {Vigencia : vigencia};   
  $scope.solicitudAvance.Estadosolicitud= {Usuario : 'system'};

  };

$http.get('models/municipios.json')
  .then(function(responseMun){
  //  alert(JSON.stringify(responseMun))
  $scope.municipios = responseMun.data;
  });

$http.get('models/dependencias.json')
  .then(function(responseDep){
  //alert(JSON.stringify(responseDep))
  $scope.dependencias = responseDep.data;
  });
$scope.selectDependencia = function(idDep) {     
        dependencia=$filter('filter')($scope.dependencias, {"CodigoDependencia" : idDep})[0];
        if (idDep>0) { $scope.solicitudAvance.Solicitud.Dependencia=dependencia.Dependencia; }
        else          { $scope.solicitudAvance.Solicitud.Dependencia="No Aplica";}
  };    

$http.get('models/facultad.json')
  .then(function(responseFac){
  //alert(JSON.stringify(responseFac))
  $scope.facultades = responseFac.data;
  });

$scope.selectProyectosFac = function(idFac) {     
        $http.get('models/proyectoscurricular.json')
             .then(function(responsePr){
                  facultad=$filter('filter')($scope.facultades, {"CodigoFacultad" : idFac})[0];
                  if (idFac>0) { $scope.solicitudAvance.Solicitud.Facultad=facultad.Facultad; }
                  else         {$scope.solicitudAvance.Solicitud.Facultad="No Aplica";}
                  $scope.proyectoscurr = $filter('filter')(responsePr.data, {"CodigoFacultad" : idFac});
              });
  };

$scope.selectProyectoCurr = function(idProy) {     
        proyecto=$filter('filter')($scope.proyectoscurr, {"CodigoProyectoCurricular" : idProy})[0];
        if (idProy>0) { $scope.solicitudAvance.Solicitud.ProyectoCur=proyecto.ProyectoCurricular; }
        else          { $scope.solicitudAvance.Solicitud.ProyectoCur="No Aplica";}
  };  

$http.get(hostTipoAvance)
  .then(function(responseTAV) {
    $scope.tipoAvance=$filter('filter')(responseTAV.data, {"Estado" : "A"});
 });  

 $scope.reset = function(){
    $scope.solicitudAvance = {};
  }

  $scope.add = function(){
 // alert(JSON.stringify($scope.solicitudAvance)) //permite ver el arreglo que llega
  var secuencia=[];
  $http.get(hostSolicitudAvance+'/secuencia/'+vigencia)
    .then(function(response) {
      secuencia = response.data[0];
      $scope.solicitudAvance.Solicitud.Consecutivo=String(parseInt(secuencia.Consecutivo)+1);
      var data = {Solicitud :  { IdBeneficiario: parseInt($scope.solicitudAvance.Beneficiario.IdBeneficiario),
                                  Vigencia: String($scope.solicitudAvance.Solicitud.Vigencia),
                                  Consecutivo: $scope.solicitudAvance.Solicitud.Consecutivo,
                                  Objetivo: $scope.solicitudAvance.Solicitud.Objetivo,
                                  Justificacion: $scope.solicitudAvance.Solicitud.Justificacion,
                                  ValorTotal: parseFloat($scope.solicitudAvance.Solicitud.ValorTotal),
                                  CodigoDependencia: $scope.solicitudAvance.Solicitud.CodigoDependencia,
                                  Dependencia: $scope.solicitudAvance.Solicitud.Dependencia,
                                  CodigoFacultad: $scope.solicitudAvance.Solicitud.CodigoFacultad,
                                  Facultad: $scope.solicitudAvance.Solicitud.Facultad,
                                  CodigoProyectoCur: $scope.solicitudAvance.Solicitud.CodigoProyectoCur,
                                  ProyectoCurricular: $scope.solicitudAvance.Solicitud.ProyectoCur,
                                  CodigoConvenio: $scope.solicitudAvance.Solicitud.CodigoConvenio,
                                  Convenio: $scope.solicitudAvance.Solicitud.Convenio,
                                  CodigoProyectoInv: $scope.solicitudAvance.Solicitud.CodigoProyectoInv,
                                  ProyectoInv: $scope.solicitudAvance.Solicitud.ProyectoInv
                                },
                   Beneficiario:{ 
                                  IdBeneficiario: parseInt($scope.solicitudAvance.Beneficiario.IdBeneficiario),
                                  Nombre: $scope.solicitudAvance.Beneficiario.Nombre,
                                  Apellido: $scope.solicitudAvance.Beneficiario.Apellido,
                                  TipoDocumento: $scope.solicitudAvance.Beneficiario.TipoDocumento,
                                  Documento: $scope.solicitudAvance.Beneficiario.Documento,
                                  LugarDocumento: $scope.solicitudAvance.Beneficiario.LugarDocumento,
                                  Direccion: $scope.solicitudAvance.Beneficiario.Direccion,
                                  Correo: $scope.solicitudAvance.Beneficiario.Correo,
                                  Telefono: $scope.solicitudAvance.Beneficiario.Telefono,
                                  Celular: $scope.solicitudAvance.Beneficiario.Celular} ,
                  Tipoavance  :  {IdTipo: parseInt($scope.solicitudAvance.Tipoavance.IdTipo),
                                  Descripcion: $scope.solicitudAvance.Tipoavance.Descripcion,
                                  Valor: parseFloat($scope.solicitudAvance.Tipoavance.Valor)
                                 },
                  Estadosolicitud  :  {Usuario: $scope.solicitudAvance.Estadosolicitud.Usuario }          
                 };
          
          $http.post(hostSolicitudAvance,data)
            .then(function(info) {
              alert("Se registró La solicitud")});
          $scope.solicitudAvance  = {};
          window.location = "#/listarSolicitudAvance";
    });
  };
});
