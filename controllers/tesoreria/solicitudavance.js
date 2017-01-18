// Creación del módulo
//var nixApp = angular.module('nixApp', ['ngRoute']);
var hostSolicitudAvance = host+'/tesoreria/solicitudavance';
var hostTipoAvance = host+'/tesoreria/tipoavance';
//var idReqFind;
var vigencia;
var vigenciaActual;
var fecha = new Date();
vigenciaActual=fecha.getFullYear();

var idSolicitud;
// Configuración de las rutas


nixApp.controller('SolicitudAvanceController', function($scope, $http, $routeParams) {
  
  $scope.title = 'Solicitud de Avance';
  $scope.message = 'Listado de Solicitudes de Avance';
 
  vigencia=vigenciaActual;
  $scope.vigencias=[{vig:(vigencia-1)},{vig:vigencia}];

//busca datos del tipo de avance
 $http.get(hostSolicitudAvance+'/lista/'+vigencia)
  .then(function(response) {
     //alert(JSON.stringify(response))
      $scope.data = response.data;
  });

  $scope.selectVigencia = function(vige){
  //alert('hola'+vige);
      $scope.solicitud='';
      $http.get(hostSolicitudAvance+'/lista/'+vige)
        .then(function(response) {
           //alert(JSON.stringify(response))
            $scope.data = response.data;
        });
  }


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
        dependencia=$filter('filter')($scope.dependencias, {"CodigoDependencia" : idDep}, true)[0];
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
                  facultad=$filter('filter')($scope.facultades, {"CodigoFacultad" : idFac}, true)[0];
                  if (idFac>0) { $scope.solicitudAvance.Solicitud.Facultad=facultad.Facultad; }
                  else         {$scope.solicitudAvance.Solicitud.Facultad="No Aplica";}
                  $scope.proyectoscurr = $filter('filter')(responsePr.data, {"CodigoFacultad" : idFac}, true);
              });
  };

$scope.selectProyectoCurr = function(idProy) {     
        proyecto=$filter('filter')($scope.proyectoscurr, {"CodigoProyectoCurricular" : idProy}, true)[0];
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
          /*24/10/2016 se adiciona la opcion solicitud, para poder registrar diferentes tipos de registros*/
          $http.post(hostSolicitudAvance+'/solicitud',data)
            .success(function(info) {
              alert("Se registró La solicitud");
          });
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

/*********Funcion consultar solicitud***********/
nixApp.controller('addTipoSolicitudAvanceController', function($scope, $http, $routeParams,$filter) {
  
  $scope.title = 'Solicitud de Avance';
  $scope.message = 'Registro nuevo tipo de avance';
  
  idsolicitud=$routeParams.IdSol;
  vigencia=$routeParams.vig;
  
  $http.get(hostTipoAvance)
    .then(function(responseTAV) {
      $scope.tipoAvance=$filter('filter')(responseTAV.data, {"Estado" : "A"});
      }); 

 /******busca datos de solicitud y asigna al array principal el tipo de avance*******/
 $http.get(hostSolicitudAvance+'/solicitud/'+vigencia+'/'+idsolicitud+'/0')
  .then(function(response) {
     //alert(JSON.stringify(response))
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
                            };
    /******busca datos y asigna al array principal el tipo de avance*******/
     idSolicitud=response.data[0].IdSolicitud; 
                      
  });

  $scope.addTipo = function(){
 // alert(JSON.stringify($scope.solicitudAvance)) //permite ver el arreglo que llega
      var data = {Solicitud :  {  IdSolicitud:idSolicitud,
                                  Vigencia: String($scope.solicitudAvance.Solicitud.Vigencia),
                                  Consecutivo: $scope.solicitudAvance.Solicitud.Consecutivo,
                                  Objetivo: $scope.solicitudAvance.Solicitud.Objetivo
                                },
                  Tipoavance  :  {IdTipo: parseInt($scope.solicitudAvance.Tipoavance.IdTipo),
                                  Descripcion: $scope.solicitudAvance.Tipoavance.Descripcion,
                                  Valor: parseFloat($scope.solicitudAvance.Tipoavance.Valor)
                                 }
                 };
      $http.post(hostSolicitudAvance+'/tipoavance',data)
        .success(function(info) {
              alert("Se registró el tipo de avance a la solicitud, correctamente! ")
              window.location = "#/consultarSolicitudAvance/"+data.Solicitud.Vigencia+"/"+data.Solicitud.Consecutivo;
            })
            .error(function(info) {
              alert("Ha fallado el registro del tipo de avance")
            }); 
  };
});

/*******Funcion cancelar solicitud******/
nixApp.controller('cancelSolicitudAvanceController', function($scope, $http, $routeParams) {
  
  $scope.title = 'Solicitud de Avance';
  $scope.message = 'Cancelar Solicitud';

  $scope.opcion = $routeParams.opc;
   
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
                              Estadosolicitud: {Usuario : 'system',
                                                IdSolicitud: response.data[0].IdSolicitud}, 
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

  $scope.Cancela = function(){
      //alert(JSON.stringify($scope.solicitudAvance)) //permite ver el arreglo que llega
      var consecutivo=$scope.solicitudAvance.Solicitud.Consecutivo;
      var data = {IdSolicitud:$scope.solicitudAvance.Estadosolicitud.IdSolicitud,
                  Observaciones: $scope.solicitudAvance.Estadosolicitud.Observacion,
                  Usuario: $scope.solicitudAvance.Estadosolicitud.Usuario,
                  };

      $http.post(hostSolicitudAvance+'/cancelavance',data)
          .then(function(info) {
            alert("Se registró la cancelación de la solicitud !")
          });
          //$scope.solicitudAvance  = {};
          //window.location = "#/cancelarSolicitudAvance/"+$scope.opcion+"/"+vigencia+"/"+consecutivo;
          window.location = "#/"+$scope.opcion+"Avance";
 
  };

});