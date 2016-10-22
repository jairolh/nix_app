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
 $http.get(hostSolicitudAvance+'/lista/'+vigencia)
  .then(function(response) {
     //alert(JSON.stringify(response))
      $scope.data = response.data;
  });

});
/*******Funcion registrar solicitud********/
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
          window.location = "#/consultarSolicitudAvance/"+vigencia+"/"+data.Solicitud.Consecutivo;
    });
  };
});

/*Funcion consultar solicitud*/
nixApp.controller('selSolicitudAvanceController', function($scope, $http, $routeParams) {
  
  $scope.title = 'Solicitud de Avance';
  $scope.message = 'Consulta';
  
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
                                            Estado: response.data[0].Estado},
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
                            };
    /******busca datos y asigna al array principal el tipo de avance*******/
     var idsolicitud=response.data[0].IdSolicitud; 
     $http.get(hostSolicitudAvance+'/tiposAvance/'+vigencia+'/'+idsolicitud+'/0')
      .then(function(responseTipo) {
         //alert(JSON.stringify(responseTipo))
          /*Variable auxiliar ayuda a la asignacion al array*/
          var aux=0;
          $scope.solicitudAvance.TipoAvance=responseTipo.data;
           /******busca datos de requisitos y asigna al array principal el tipo de avance*******/
          angular.forEach($scope.solicitudAvance.TipoAvance, function(tipoAvance, aux) {
              var idtipo=tipoAvance.IdTipo; 
              $scope.solicitudAvance.TipoAvance[aux].Requisitos=[];
              $http.get(hostSolicitudAvance+'/requisitosTiposAvance/'+vigencia+'/'+idsolicitud+'/'+idtipo)
                  .then(function(responseReq) {
                     //alert(aux+JSON.stringify(responseReq))
                     $scope.solicitudAvance.TipoAvance[aux].Requisitos=responseReq.data;
                     aux++;
                  });    
                  
            });
      });                        
  });

});