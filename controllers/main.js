// Creación del módulo
var nixApp = angular.module('nixApp', ['ngRoute']);
var host = 'http://localhost:8088';
var hostSicapital = 'http://localhost';
// Configuración de las rutas
nixApp.config(function($routeProvider) {

    $routeProvider
        .when('/listarRequisitos', {templateUrl : 'views/tesoreria/avances/requisitos/listarRequisitos.html',   controller  : 'RequisitoController'})
        .when('/agregarRequisito', {templateUrl : 'views/tesoreria/avances/requisitos/agregarRequisito.html',   controller  : 'addRequisitoController'})
        .when('/editarRequisito',  {templateUrl : 'views/tesoreria/avances/requisitos/editarRequisito.html',    controller  : 'updRequisitoController'})
        .when('/listarTiposAvance', {templateUrl : 'views/tesoreria/avances/tiposAvance/listarTiposAvance.html', controller  : 'tiposAvanceController'})
        .when('/agregarTiposAvance',{templateUrl : 'views/tesoreria/avances/tiposAvance/agregarTipoAvance.html', controller  : 'addTiposAvanceController'})
        .when('/editarTiposAvance', {templateUrl : 'views/tesoreria/avances/tiposAvance/editarTipoAvance.html',  controller  : 'updTiposAvanceController'})
        .when('/listarRequisitosAvance/:tipoId',        {templateUrl : 'views/tesoreria/avances/requisitosTipoAvance/listarRequisitosAvance.html', controller  : 'RequisitoAvanceController'})
        .when('/agregarRequisitoAvance',                {templateUrl : 'views/tesoreria/avances/requisitosTipoAvance/agregarRequisitoAvance.html', controller  : 'addRequisitoAvanceController'})
        .when('/editarRequisitoAvance/:tipoId/:reqId',  {templateUrl : 'views/tesoreria/avances/requisitosTipoAvance/editarRequisitoAvance.html',  controller  : 'updRequisitoAvanceController'})
        .when('/listarSolicitudAvance',                    {templateUrl : 'views/tesoreria/avances/solicitudAvance/listarSolicitudAvance.html',    controller : 'SolicitudAvanceController'})
        .when('/agregarSolicitudAvance',                   {templateUrl : 'views/tesoreria/avances/solicitudAvance/agregarSolicitudAvance.html',   controller : 'addSolicitudAvanceController'})
        .when('/consultarSolicitudAvance/:vig/:IdSol',     {templateUrl : 'views/tesoreria/avances/solicitudAvance/consultarSolicitudAvance.html', controller : 'selSolicitudAvanceController'})
        .when('/agregarTipoAvanceSolicitud/:vig/:IdSol',   {templateUrl : 'views/tesoreria/avances/solicitudAvance/agregarTipoAvanceSolicitud.html', controller : 'addTipoSolicitudAvanceController'})
        .when('/cancelarSolicitudAvance/:opc/:vig/:IdSol', {templateUrl : 'views/tesoreria/avances/solicitudAvance/cancelarSolicitudAvance.html',  controller : 'cancelSolicitudAvanceController'})
        .when('/listarVerificarAvance',                    {templateUrl : 'views/tesoreria/avances/solicitudAvance/listarVerificaAvance.html',     controller : 'VerificaAvanceController'})
        .when('/verificarSolicitudAvance/:vig/:IdSol',     {templateUrl : 'views/tesoreria/avances/solicitudAvance/verificarSolicitudAvance.html', controller : 'selVerificaSolicitudAvanceController'})
        .when('/listarCertificarAvance',                   {templateUrl : 'views/tesoreria/avances/solicitudAvance/listarCertificaAvance.html',    controller : 'CertificaAvanceController'})
        .when('/certificarNecesidadAvance/:vig/:IdSol',    {templateUrl : 'views/tesoreria/avances/solicitudAvance/certificaNecesidadAvance.html', controller : 'selCertificaNecesidadAvanceController'})
        .when('/certificarApruebaAvance/:vig/:IdSol',      {templateUrl : 'views/tesoreria/avances/solicitudAvance/certificaApruebaAvance.html',   controller : 'selCertificaApruebaAvanceController'})
        .when('/certificarGiroAvance/:vig/:IdSol',         {templateUrl : 'views/tesoreria/avances/solicitudAvance/certificaGiroAvance.html',      controller : 'selCertificaGiroAvanceController'})        
        .when('/listarLegalizarAvance',                    {templateUrl : 'views/tesoreria/avances/legalizarAvance/listarLegalizarAvance.html',    controller : 'LegalizaAvanceController'})
        .when('/verificarSoportesAvance/:vig/:IdSol',                  {templateUrl : 'views/tesoreria/avances/legalizarAvance/verificaSoportesAvance.html',    controller : 'verificarSoporteAvanceController'})
        .when('/about',              {templateUrl : 'views/about.html',controller  : 'aboutController'  })
        .when('/home',               {templateUrl : 'views/home.html',  controller  : 'homeController' })
        .otherwise({redirectTo: '/home' });
});

nixApp.controller('homeController', function($scope) {
  $scope.title = 'Sistema de Gestión Financiero';
  $scope.message = 'Versión 0.0.1';
});

nixApp.controller('aboutController', function($scope) {
  $scope.title = 'Avances';
  $scope.message = 'Esta es la página "Acerca de"';
});

nixApp.controller('parserMenu', function($scope, $http) {
  $http.get('models/menu.json')
       .then(function(res){
          $scope.menu = res.data.menu;
        });
});