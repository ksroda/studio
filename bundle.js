/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	angular.module('myApp', ['ngRoute']).config(function ($routeProvider) {
	  $routeProvider.when("/", {
	    templateUrl: 'views/about.html'
	  }).when('/baza_pytan', {
	    templateUrl: 'views/baza_pytan.html',
	    controller: 'baza_pytan_controller'
	  }).when('/aktualne_pytania', {
	    templateUrl: 'views/aktualne_pytania.html'
	  }).when('/dodaj_pytanie', {
	    templateUrl: 'views/dodaj_pytanie.html'
	  }).when('/profile', {
	    templateUrl: 'views/profile.html'
	  });
	}).controller('myCtrl', ['$scope', function ($scope) {
	  $scope.test = 'hello';
	  // alert('hello')
	}]).service('httpService', function ($http) {
	  this.get = function (url) {
	    return $http.get(url);
	  };
	}).controller('baza_pytan_controller', ['$scope', 'httpService', function ($scope, httpService) {
	  httpService.get('./baza_pytan.json').then(function (response) {
	    $scope.baza_pytan = response.data;
	  });
	}]);

/***/ }
/******/ ]);