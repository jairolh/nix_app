// Creación del módulo
//var nixApp = angular.module('nixApp', ['ngRoute']);
var hostSolicitudAvance = host+'/tesoreria/solicitudavance';
var hostTipoAvance = host+'/tesoreria/tipoavance';
var hostServiceSic = hostSicapital+'/sicws/ws/sicapitalAPI.php/?'
//var idReqFind;
var vigencia;
var vigenciaActual;
var fecha = new Date();
vigenciaActual=fecha.getFullYear();

var idSolicitud;
// Configuración de las rutas


nixApp.controller('CertificaAvanceController', function($scope, $http, $routeParams,$filter) {
  
  $scope.title = 'Certificación Solicitud de Avance';
  $scope.message = 'Listado de Solicitudes de Avance';
  vigencia=vigenciaActual;
  $scope.vigencias=[{vig:(vigencia-1)},{vig:vigencia}]; 
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

  $scope.selectVigencia = function(vige){
  //alert('hola'+vige);
      $scope.solicitud='';
      $http.get(hostSolicitudAvance+'/lista/'+vige)
        .then(function(response) {
           //alert(JSON.stringify(response))
          solicitudes=$filter('filter')(response.data, {"EstadoActual":"!Registrado"});
          solicitudes=$filter('filter')(solicitudes, {"EstadoActual":"!Cancelado"});
          solicitudes=$filter('filter')(solicitudes, {"EstadoActual":"!Legalizado"});
          solicitudes=$filter('filter')(solicitudes, {"EstadoActual":"!Girado"});
          $scope.solicitud=solicitudes;
        });
  }

});

/******Funcion certificar necesidad de solicitud****/
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

      /*****busca los datos de financiacion del avance*******/
       $http.get(hostSolicitudAvance+'/financiaAvance/'+vigencia+'/'+response.data[0].IdSolicitud+'/0')
        .then(function(responseFin) {
           //alert(JSON.stringify(responseFin));
           if (responseFin.data[0]) {
              $scope.solicitudAvance.Presupuesto=responseFin.data[0];
              $scope.solicitudAvance.Presupuesto.Guardado='S';
            }else{
              $scope.solicitudAvance.Presupuesto.Guardado='N';   
            }
        });   

       /***** Consulta las solicitudes de necesidad****/ 
       $scope.necesidad = function(nec){
          $http.get(hostServiceSic+'/necesidad/sol/'+$scope.solicitudAvance.Solicitud.Vigencia+'/'+nec)
           .then(function(responseNec){
            if (!Array.isArray(responseNec.data)){
                  $scope.solicitudAvance.Presupuesto='';
                  alert("No existe la Necesidad !")}
            else{ $scope.solicitudAvance.Presupuesto.NumeroNecesidad=responseNec.data[0].NUMERONECESIDAD;
                  $scope.solicitudAvance.Presupuesto.Vigencia=responseNec.data[0].VIGENCIA;
                  $scope.solicitudAvance.Presupuesto.UnidadEjecutora=responseNec.data[0].UNIDADEJECUTORA;
                  $scope.solicitudAvance.Presupuesto.InternoRubro=responseNec.data[0].INTERNORUBRO;
                  $scope.solicitudAvance.Presupuesto.NombreRubro=responseNec.data[0].CODIGORUBRO+" "+responseNec.data[0].NOMBRERUBRO;;
                  $scope.solicitudAvance.Presupuesto.Objeto=responseNec.data[0].OBJETO;
                  $scope.solicitudAvance.Presupuesto.ValorNecesidad=responseNec.data[0].VALORNECESIDAD;
                  $scope.solicitudAvance.Presupuesto.FechaNecesidad=responseNec.data[0].FECHANECESIDAD;
                }  

          });
          /*
          $http.get('models/necesidad.json')
           .then(function(responseNec){
            alert(JSON.stringify(response))
            $scope.solicitudAvance.Presupuesto = $filter('filter')(responseNec.data, {"Vigencia" : $scope.solicitudAvance.Solicitud.Vigencia,"NumeroNecesidad":$scope.solicitudAvance.Presupuesto.NumeroNecesidad}, true)[0];
            if (!$scope.solicitudAvance.Presupuesto) {alert("No existe la Necesidad !")}
          });*/
        } 
  });


  $scope.addNecesidad = function(){
   //  alert(JSON.stringify($scope.solicitudAvance)) //permite ver el arreglo que llega
          presupuestoAvance= {IdSolicitud:parseInt($scope.solicitudAvance.TipoAvance[0].IdSolicitud),
                              Vigencia:$scope.solicitudAvance.Presupuesto.Vigencia,
                              UnidadEjecutora:$scope.solicitudAvance.Presupuesto.UnidadEjecutora,
                              InternoRubro:parseInt($scope.solicitudAvance.Presupuesto.InternoRubro),
                              NombreRubro:$scope.solicitudAvance.Presupuesto.NombreRubro,
                              NumeroNecesidad:parseInt($scope.solicitudAvance.Presupuesto.NumeroNecesidad),
                              Objeto:$scope.solicitudAvance.Presupuesto.Objeto,
                              ValorNecesidad:parseFloat($scope.solicitudAvance.Presupuesto.ValorNecesidad),
                              FechaNecesidad:$scope.solicitudAvance.Presupuesto.FechaNecesidad,
                              };
          //alert(JSON.stringify(presupuestoAvance)) 
          $http.post(hostSolicitudAvance+'/necesidadavance',presupuestoAvance)
            .success(function(info) {
              alert("Se registraron los datos correctamente")
              window.location = "#/listarCertificarAvance";
            })
            .error(function(info) {
              alert("Ha fallado el registro de datos")
            });  
  };//fin aadVerifica

});

/******Funcion certificar la aprobacion de solicitud****/
nixApp.controller('selCertificaApruebaAvanceController', function($scope, $http, $routeParams, $filter) {
  
  $scope.title = 'Solicitud de Avance';
  $scope.message = 'Certificar Aprobación';
  
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
      
      /*****busca los datos de financiacion del avance*******/
       $http.get(hostSolicitudAvance+'/financiaAvance/'+vigencia+'/'+response.data[0].IdSolicitud+'/0')
        .then(function(responseFin) {
           //alert(JSON.stringify(responseFin));
           if (responseFin.data[0]) {
              $scope.solicitudAvance.Presupuesto=responseFin.data[0];
              /******Busca el certificado de disponibilidad relacionado a la necesidad******/
              $http.get(hostServiceSic+'/disponibilidad/cdpnec/'+$scope.solicitudAvance.Solicitud.Vigencia+'/'+$scope.solicitudAvance.Presupuesto.NumeroNecesidad.toString())
               .then(function(responseCDP){
                $scope.disponibilidad=responseCDP.data[0];
                if (!$scope.disponibilidad) {
                    $scope.solicitudAvance.Presupuesto.Disponibilidad="";
                  }else{
                    $scope.solicitudAvance.Presupuesto.Disponibilidad=$scope.disponibilidad.DISPONIBILIDAD;
                    $scope.solicitudAvance.Presupuesto.ValorDisp=$scope.disponibilidad.VALOR_DISP;
                    $scope.solicitudAvance.Presupuesto.FechaDisp=$scope.disponibilidad.FECHADISP;
                  }
                });
            }
        });   
  });
  
  $scope.addAprueba = function(){
     //alert(JSON.stringify($scope.solicitudAvance)) //permite ver el arreglo que llega
      var data = { Presupuesto: {IdSolicitud:parseInt($scope.solicitudAvance.TipoAvance[0].IdSolicitud),
                                    Vigencia:$scope.solicitudAvance.Presupuesto.Vigencia,
                                    UnidadEjecutora:$scope.solicitudAvance.Presupuesto.UnidadEjecutora,
                                    InternoRubro:parseInt($scope.solicitudAvance.Presupuesto.InternoRubro),
                                    NombreRubro:$scope.solicitudAvance.Presupuesto.NombreRubro,
                                    NumeroNecesidad:parseInt($scope.solicitudAvance.Presupuesto.NumeroNecesidad),
                                    Objeto:$scope.solicitudAvance.Presupuesto.Objeto,
                                    ValorNecesidad:parseFloat($scope.solicitudAvance.Presupuesto.ValorNecesidad),
                                    FechaNecesidad:$scope.solicitudAvance.Presupuesto.FechaNecesidad,
                                    Disponibilidad:parseInt($scope.solicitudAvance.Presupuesto.Disponibilidad),
                                    FechaDisp: $scope.solicitudAvance.Presupuesto.FechaDisp,
                                    ValorDisp: parseFloat($scope.solicitudAvance.Presupuesto.ValorDisp),
                                    Registro : 0,
                                    FechaRegistro: '',
                                    ValorRegistro : 0,
                                    Compromiso :  0,
                                    OrdenPago   : 0,
                                    FechaOrden   : '',
                                    ValorOrden   :  0
                                },

                  Estadosolicitud: {IdSolicitud:parseInt($scope.solicitudAvance.TipoAvance[0].IdSolicitud),
                                    Observaciones: $scope.solicitudAvance.Estadosolicitud.Observacion,
                                    Usuario: $scope.solicitudAvance.Estadosolicitud.Usuario,}, 
                };
          //alert(JSON.stringify(presupuestoAvance)) 
          $http.post(hostSolicitudAvance+'/apruebaavance',data)
            .success(function(info) {
              //alert(JSON.stringify(info)) 
              alert("Se registraron los datos correctamente")
              window.location = "#/listarCertificarAvance";
            })
            .error(function(info) {
              alert("Ha fallado el registro de datos")
            });  
  };//fin addAprueba
  
});

/******Funcion certificar la aprobacion de solicitud****/
nixApp.controller('selCertificaGiroAvanceController', function($scope, $http, $routeParams, $filter) {
  
  $scope.title = 'Solicitud de Avance';
  $scope.message = 'Certificar Giro';
  
    /*****Funcion para mostrar el calendario******/
    $('#datepicker').datepicker().on('changeDate', function(ev){
            var element = angular.element($('#datepicker'));
            var controller = element.controller();
            var scope = element.scope();
            var datetime = $filter('date')(ev.date,'yyyy-MM-dd')
            scope.$apply(function(){
              scope.asignarFecha(datetime);
            });
          });

    $scope.asignarFecha = function (fecha){
         $scope.solicitudAvance.Presupuesto.FechaCertificacion=fecha;
        };



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

      /*****busca los datos de financiacion del avance*******/
       $http.get(hostSolicitudAvance+'/financiaAvance/'+vigencia+'/'+response.data[0].IdSolicitud+'/0')
        .then(function(responseFin) {
           //alert(JSON.stringify(responseFin));
           if (responseFin.data[0]) {
              $scope.solicitudAvance.Presupuesto=responseFin.data[0];
              /******Busca el certificado de disponibilidad relacionado a la necesidad******/
              $http.get(hostServiceSic+'/ordenpago/opcdp/'+$scope.solicitudAvance.Solicitud.Vigencia+'/'+$scope.solicitudAvance.Presupuesto.Disponibilidad.toString())
               .then(function(responseOP){
                //alert(JSON.stringify(responseOP.data[0]));
                $scope.disponibilidad=responseOP.data[0];
                if (!$scope.disponibilidad) {
                      $scope.solicitudAvance.Presupuesto.Registro="";
                      $scope.solicitudAvance.Presupuesto.OrdenPago="";
                    }else{
                      $scope.solicitudAvance.Presupuesto.Registro=$scope.disponibilidad.REGISTROPRESUPUESTAL;
                      $scope.solicitudAvance.Presupuesto.ValorRegistro=$scope.disponibilidad.VALOR_CRP;
                      $scope.solicitudAvance.Presupuesto.FechaRegistro=$scope.disponibilidad.FECHAREGISTRO;
                      $scope.solicitudAvance.Presupuesto.Compromiso=$scope.disponibilidad.NUMEROCOMPROMISO;              
                      $scope.solicitudAvance.Presupuesto.OrdenPago=$scope.disponibilidad.ORDENPAGO;
                      $scope.solicitudAvance.Presupuesto.ValorOrden=$scope.disponibilidad.VALORORDEN;
                      $scope.solicitudAvance.Presupuesto.FechaOrden=$scope.disponibilidad.FECHAORDEN;
                      $scope.solicitudAvance.Estadosolicitud.FechaCertificacion=$scope.disponibilidad.FECHAPAGO;
                    }
                });




            }
        });   
  });

  
  $scope.addGiro = function(){
     //alert(JSON.stringify($scope.solicitudAvance)) //permite ver el arreglo que llega
      var data = { Presupuesto: {IdSolicitud:parseInt($scope.solicitudAvance.TipoAvance[0].IdSolicitud),
                                    Vigencia:$scope.solicitudAvance.Presupuesto.Vigencia,
                                    UnidadEjecutora:$scope.solicitudAvance.Presupuesto.UnidadEjecutora,
                                    InternoRubro:parseInt($scope.solicitudAvance.Presupuesto.InternoRubro),
                                    NombreRubro:$scope.solicitudAvance.Presupuesto.NombreRubro,
                                    NumeroNecesidad:parseInt($scope.solicitudAvance.Presupuesto.NumeroNecesidad),
                                    Objeto:$scope.solicitudAvance.Presupuesto.Objeto,
                                    ValorNecesidad:parseFloat($scope.solicitudAvance.Presupuesto.ValorNecesidad),
                                    FechaNecesidad:$scope.solicitudAvance.Presupuesto.FechaNecesidad,
                                    Disponibilidad:parseInt($scope.solicitudAvance.Presupuesto.Disponibilidad),
                                    FechaDisp: $scope.solicitudAvance.Presupuesto.FechaDisp,
                                    ValorDisp: parseFloat($scope.solicitudAvance.Presupuesto.ValorDisp),
                                    Registro : parseInt($scope.solicitudAvance.Presupuesto.Registro),
                                    FechaRegistro: $scope.solicitudAvance.Presupuesto.FechaRegistro,
                                    ValorRegistro : parseFloat($scope.solicitudAvance.Presupuesto.ValorRegistro),
                                    Compromiso :  parseInt($scope.solicitudAvance.Presupuesto.Compromiso),
                                    OrdenPago   : parseInt($scope.solicitudAvance.Presupuesto.OrdenPago),
                                    FechaOrden   : $scope.solicitudAvance.Presupuesto.FechaOrden,
                                    ValorOrden   :  parseFloat($scope.solicitudAvance.Presupuesto.ValorOrden),
                                    FechaCertificacion: $scope.solicitudAvance.Presupuesto.FechaCertificacion

                                },
                  Estadosolicitud: {IdSolicitud:parseInt($scope.solicitudAvance.TipoAvance[0].IdSolicitud),
                                    Observaciones: $scope.solicitudAvance.Estadosolicitud.Observacion,
                                    Usuario: $scope.solicitudAvance.Estadosolicitud.Usuario
                                  }, 
                };
          //alert(JSON.stringify(data)) 
          $http.post(hostSolicitudAvance+'/giroavance',data)
            .success(function(info) {
              //alert(JSON.stringify(info)) 
              alert("Se registraron los datos correctamente")
              window.location = "#/listarCertificarAvance";
            })
            .error(function(info) {
              alert("Ha fallado el registro de datos")
            }); 
  };//fin addGiro
  
});

