// Creación del módulo
//var nixApp = angular.module('nixApp', ['ngRoute']);
var hostLegalizarAvance = host+'/tesoreria/legalizaravance';
var hostTipoAvance = host+'/tesoreria/tipoavance';
//var idReqFind;
var vigencia;
var vigenciaActual;
var fecha = new Date();
vigenciaActual=fecha.getFullYear();

var idSolicitud;
// Configuración de las rutas


nixApp.controller('LegalizaAvanceController', function($scope, $http, $routeParams,$filter) {
  
  $scope.title = 'Legalización de Avance';
  $scope.message = 'Listado de Avances';
  
  vigencia=vigenciaActual;
  $scope.vigencias=[{vig:(vigencia-1)},{vig:vigencia}]; 

  $scope.hoy=$filter('date')(new Date(), "yyyy-MM-dd");
  //busca datos del tipo de avance
   $http.get(hostLegalizarAvance+'/lista/'+vigencia)
    .then(function(response) {
       //alert(JSON.stringify(response))
        var avance=$filter('filter')(response.data, {"EstadoActual":"Girado"});
        $scope.solicitud=avance;
    });

  $scope.selectVigencia = function(vige){
  //alert('hola'+vige);
      $scope.solicitud='';
      $http.get(hostLegalizarAvance+'/lista/'+vige)
        .then(function(response) {
           //alert(JSON.stringify(response))
          var avance=$filter('filter')(response.data, {"EstadoActual":"Girado"});
          $scope.solicitud=avance;
        });
  }

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

/******Funcion certificar la aprobacion de solicitud****/
nixApp.controller('verificarSoporteAvanceController', function($scope, $http, $routeParams, $filter) {
  
  $scope.title = 'Legalización de Avance';
  $scope.message = 'Verificar Soportes';
  
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
                       $scope.solicitudAvance.TipoAvance[aux].Requisitos=$filter('filter')(responseReq.data,{"EtapaReq" : "legalizar"});
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
            }
        });   

  });

  $scope.addSoporte = function(){
          soporteAvance=[];
          var reg=0;
          angular.forEach($scope.solicitudAvance.TipoAvance, function(tipoAvance, aux) {
              var idtipo=parseInt(tipoAvance.IdTipo); 
              var idsolicitud=parseInt(tipoAvance.IdSolicitud); 
              angular.forEach($scope.solicitudAvance.TipoAvance[aux].Requisitos, function(requisitoAvance, aux2) {
                    var idreq=parseInt(requisitoAvance.IdReq); 
                    soporteAvance[reg]= {IdTipo : idtipo,
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
          $http.post(hostLegalizarAvance+'/verificasoporte',soporteAvance)
                        .then(function(info) {
                          alert("Se registró la verificación del soporte")
                        });
          $scope.solicitudAvance  = {};
          window.location = "#/listarLegalizarAvance";  
  };//fin addGiro
  
});