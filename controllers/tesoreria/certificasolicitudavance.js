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

/******Funcion consultar solicitud****/
nixApp.controller('selCertificaNecesidadAvanceController', function($scope, $http, $routeParams, $filter) {
  
  $scope.title = 'Solicitud de Avance';
  $scope.message = 'Certificar Solicitud de Necesidad';
  
  idsolicitud=$routeParams.IdSol;
  vigencia=$routeParams.vig;
  
 /******busca datos de solicitud y asigna al array principal el tipo de avance*******/
 $http.get(hostSolicitudAvance+'/solicitud/'+vigencia+'/'+idsolicitud+'/0')
  .then(function(response) {
     //alert(JSON.stringify(response))
     //alert(response.data[0].Vigencia);

    $scope.solicitudAvance= {Solicitud:   { Vigencia: response.data[0].Vigencia,
                                            Consecutivo: response.data[0].Consecutivo,
                                            Objetivo: response.data[0].Objetivo,
                                            Justificacion: response.data[0].Justificacion,
                                            ValorTotal: response.data[0].ValorTotal,
                                            CodigoDependencia: response.data[0].CodigoDependencia,
                                            Dependencia: response.data[0].Dependencia,
                                            CodigoFacultad: response.data[0].CodigoFacultad,
                                            Facultad: response.data[0].Facultad,
                                            CodigoProyectoCur: response.data[0].CodigoProyectoCur,
                                            ProyectoCurricular: response.data[0].ProyectoCur,
                                            CodigoConvenio: response.data[0].CodigoConvenio,
                                            Convenio: response.data[0].Convenio,
                                            CodigoProyectoInv: response.data[0].CodigoProyectoInv,
                                            ProyectoInv: response.data[0].ProyectoInv,
                                            EstadoActual: response.data[0].EstadoActual},
                             Beneficiario: { 
                                            IdBeneficiario: response.data[0].IdBeneficiario,
                                            Nombre: response.data[0].Nombre,
                                            Apellido: response.data[0].Apellido,
                                            TipoDocumento: response.data[0].TipoDocumento,
                                            Documento: response.data[0].Documento,
                                            LugarDocumento: response.data[0].LugarDocumento,
                                            Direccion: response.data[0].Direccion,
                                            Correo: response.data[0].Correo,
                                            Telefono: response.data[0].Telefono,
                                            Celular: response.data[0].Celular
                                           } ,
                              Estadosolicitud: {Usuario : 'system'},             
                            };

      //busca las solicitudes de avance del beneficiario
       $http.get(hostSolicitudAvance+'/solicitudAvanceBeneficiario/'+vigencia+'/'+response.data[0].IdSolicitud+'/'+response.data[0].IdBeneficiario)
        .then(function(responseBen) {
           //alert(JSON.stringify(responseBen));
           var solicitudes=$filter('filter')(responseBen.data, {"NombreEstado":"!Legalizado"});
           solicitudes=$filter('filter')(solicitudes, {"NombreEstado":"!Cancelado"});
           var count = Object.keys(solicitudes).length;
           $scope.solicitudAvance.Beneficiario.Pendientes=count;
        });                            

  
    /******busca datos y asigna al array principal el tipo de avance*******/
     var idsolicitud=parseInt(response.data[0].IdSolicitud); 
     $http.get(hostSolicitudAvance+'/tiposAvance/'+vigencia+'/'+idsolicitud+'/0')
      .then(function(responseTipo) {
         //alert(JSON.stringify(responseTipo))
          /*Variable auxiliar ayuda a la asignacion al array*/
          var aux=0;
          $scope.solicitudAvance.TipoAvance=responseTipo.data;
           /******busca datos de requisitos y asigna al array principal el tipo de avance*******/
          angular.forEach($scope.solicitudAvance.TipoAvance, function(tipoAvance, aux) {
              var idtipo=parseInt(tipoAvance.IdTipo); 
              $scope.solicitudAvance.TipoAvance[aux].Requisitos=[];
              $http.get(hostSolicitudAvance+'/requisitosSolicitudAvance/'+vigencia+'/'+idsolicitud+'/'+idtipo)
                  .then(function(responseReq) {
                     //alert(aux+JSON.stringify(responseReq))
                     $scope.solicitudAvance.TipoAvance[aux].Requisitos=$filter('filter')(responseReq.data,{"EtapaReq" : "solicitar"});
                     //$scope.solicitudAvance.TipoAvance[aux].Requisitos=responseReq.data;
                     aux++;
                  });    
                  
            });

      });                        
  });

/*
$scope.addVerifica = function(){
//  alert(JSON.stringify($scope.solicitudAvance)) //permite ver el arreglo que llega
          verificaAvance=[];
          var reg=0;
          angular.forEach($scope.solicitudAvance.TipoAvance, function(tipoAvance, aux) {
              var idtipo=parseInt(tipoAvance.IdTipo); 
              var idsolicitud=parseInt(tipoAvance.IdSolicitud); 
              angular.forEach($scope.solicitudAvance.TipoAvance[aux].Requisitos, function(requisitoAvance, aux2) {
                    var idreq=parseInt(requisitoAvance.IdReq); 
                    verificaAvance[reg]= {IdTipo : idtipo,
                                          IdReq : idreq,
                                          IdSolicitud:idsolicitud,
                                          Estado: $scope.solicitudAvance.TipoAvance[aux].Estado,
                                          FechaRegistro:$scope.solicitudAvance.TipoAvance[aux].FechaRegistro ,
                                          ReferenciaAvn:$scope.solicitudAvance.TipoAvance[aux].Referencia ,
                                          NombreAvn:$scope.solicitudAvance.TipoAvance[aux].Nombre ,
                                          ReferenciaReq:$scope.solicitudAvance.TipoAvance[aux].ReferenciaReq ,
                                          NombreReq:$scope.solicitudAvance.TipoAvance[aux].NombreReq ,
                                          DescripcionReq:$scope.solicitudAvance.TipoAvance[aux].DescripcionReq ,
                                          EtapaReq:$scope.solicitudAvance.TipoAvance[aux].EtapaReq ,
                                          Valido :requisitoAvance.Valido ,
                                          Observaciones:requisitoAvance.Observaciones ,
                                          FechaRegistroReq: '',
                                          Documento:requisitoAvance.documento,
                                          EstadoReq: '',
                                          UbicacionDoc: '',
                                          Usuario:$scope.solicitudAvance.Estadosolicitud.Usuario
                                          };
                      reg++;    
                    });
            });
          //alert(JSON.stringify(verificaAvance)) 
          $http.post(hostSolicitudAvance+'/verificaavance',verificaAvance)
                        .then(function(info) {
                          alert("Se registró la verificación de la solicitud")
                        });
          $scope.solicitudAvance  = {};
          window.location = "#/listarVerificarAvance";  
  };//fin aadVerifica
*/

});
