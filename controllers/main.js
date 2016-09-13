// Creación del módulo
var nixApp = angular.module('nixApp', ['ngRoute']);
var host = 'http://localhost:8088';
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
        .when('/listarSolicitudAvance',       {templateUrl : 'views/tesoreria/avances/solicitudAvance/listarSolicitudAvance.html', controller  : 'SolicitudAvanceController'})
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