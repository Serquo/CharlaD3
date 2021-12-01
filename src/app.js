import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import 'animate.css/animate.min.css';
import angular from 'angular';
import index from './components/index';
import ngRoute from 'angular-route';

function config($routeProvider, $httpProvider) {
  $routeProvider
    .when('/index', {
      controller: 'IndexController',
      template: require('component/index/index.html'),
      controllerAs: 'vm',
    })
    .otherwise({redirectTo: '/index'});
  $httpProvider.defaults.headers['Access-Control-Allow-Credentials'] = true;
  
}
config.$inject = ['$routeProvider', '$httpProvider'];

function run() {}
run.$inject = [];

angular.module('app', [
  index,
  ngRoute
]).config(config)
  .run(run);

(function importFiles() {
  //Services
  const IndexController = require('component/index/index.controller.js');
  return {
    IndexController
  };
})();
