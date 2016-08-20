angular.module('myApp', ['ngRoute'])
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
  })
  .controller('myCtrl', ['$scope', $scope => {
    $scope.test = 'hello'
    // alert('hello')
  }])
  .service('httpService', function($http) {
    this.get = function (url) {
      return $http.get(url)
    }
  })
  .controller('baza_pytan_controller',
    ['$scope', 'httpService', ($scope, httpService) => {
      httpService.get('./baza_pytan.json')
        .then(response => {
          $scope.baza_pytan = response.data
        })
    }])
