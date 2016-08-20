import angular from 'angular'
import angularRoute from 'angular-route'

import API from './api'

import { runCamera, stopCamera, captureImage } from './camera'

angular.module('myApp', [angularRoute])
  .config(function($routeProvider) {
    $routeProvider
      .when("/", {
          templateUrl : 'views/about.html'
      })
      .when('/baza_pytan', {
          templateUrl : 'views/baza_pytan.html',
          controller: 'baza_pytan_controller'
      })
      .when('/aktualne_pytania', {
          templateUrl : 'views/aktualne_pytania.html'
      })
      .when('/dodaj_pytanie', {
          templateUrl : 'views/dodaj_pytanie.html'
      })
      .when('/profile', {
          templateUrl : 'views/profile.html'
      })
      .when('/webcam', {
          templateUrl : 'views/webcam.html',
          controller: 'webcam_controller'
      })
  })
  .controller('myCtrl', ['$scope', $scope => {
    $scope.test = 'hello'
  }])
  .controller('baza_pytan_controller', ['$scope', $scope => {
    API.questions.get()
      .then(response => {
        $scope.$apply(function () {
          $scope.baza_pytan = response.data
        })
      })
    }])
  .controller('webcam_controller', ['$scope', $scope => {
    const video = runCamera()
    $scope.captureImage = () => {
      video.captureImage()
    }
    $scope.$on("$destroy", function() {
      stopCamera()
    })
  }])
