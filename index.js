import _ from 'lodash'
import angular from 'angular'
import angularRoute from 'angular-route'
import angularTranslate from 'angular-translate'

import API from './api'

import { runCamera, stopCamera, captureImage } from './camera'

angular.module('myApp', [angularRoute, angularTranslate])
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
          templateUrl : 'views/dodaj_pytanie.html',
          controller : 'add_question_controller'
      })
      .when('/profile', {
          templateUrl : 'views/profile.html',
          controller : 'profile_controller'
      })
      .when('/webcam', {
          templateUrl : 'views/webcam.html',
          controller: 'webcam_controller'
      })
      .when('/login', {
        templateUrl : 'views/login.html',
        controller : 'login_controller'
      })
      .when('/moje_pytania', {
        templateUrl : 'views/moje_pytania.html',
        controller : 'moje_pytania_controller'
      })
    })

  .controller('myCtrl', ['$scope', '$translate', function ($scope, $translate) {
    $scope.visibleMenu = true
    $scope.language = 'pl'
    $scope.languages = ['en', 'pl']
    $scope.updateLanguage = () => {
      $translate.use($scope.language)
    }
  }])

  .controller('login_controller', ['$scope', ($scope) => {
    $scope.visibleMenu = false
  }])

  .controller('baza_pytan_controller', ['$scope', $scope => {
    API.questions.get()
      .then(response => {
        $scope.$apply(function () {
          // console.log(response)
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

  .controller('profile_controller',
    ['$scope', $scope => {
      API.profile.get()
        .then(response => {
          $scope.$apply(function () {
            $scope.person = response.data
          })
        })
      $scope.pswd_change = false
      $scope.show = () => {
        $scope.pswd_change = true
      }
      $scope.reset = () => {
        $scope.pswd_change = false
        $scope.old_pswd = ""
        $scope.new_pswd1 = ""
        $scope.new_pswd2 = ""
      }
      $scope.changePassword = function(old_pswd, new_pswd1, new_pswd2){
        if (new_pswd1 === new_pswd2) {
          const pswd_json = {
            "pswd" : old_pswd,
            "new_pswd" : new_pswd1
          }
          API.profile.post(pswd_json)
        }
      }
    }])

    .controller('add_question_controller',
      ['$scope', ($scope) => {
          $scope.addQuestion = (question, answerA, answerB, answerC, answerD) => {
            const question_json = {
              "question" : question,
              "answerA" : answerA,
              "answerB" : answerB,
              "answerC" : answerC,
              "answerD" : answerD
            }
            API.questions.post(question_json)
          }
      }])

    .controller('moje_pytania_controller',
      ['$scope', $scope => {
        // API.questions.getByAuthor()
        //   .then(response => {
        //     $scope.$apply(function () {
        //       $scope.baza_pytan = response.data.data
        //       $scope.totalNumberOfEntries = response.data.totalNumberOfEntries
        //       $scope.totalNumberOfPages = _
        //         .range(1, Math.ceil(response.data.totalNumberOfEntries/25) + 1)
        //     })
        //   })
        $scope.baza_pytan = []

        $scope.turnPage = page => {

          const cachedPages = $scope.baza_pytan.slice((page - 1) * 25, page * 25).filter(page => page !== null)
          const cachedPagesLength = cachedPages.length

          console.log(cachedPagesLength)

          if (cachedPagesLength < 25) {
            console.log('nowa strona')
            API.questions.getByPage(page)
              .then(response => {
                const nowa_baza_pytan = _.range((page - 1) * 25).map((page, index) =>
                  $scope.baza_pytan[index] || null
                )

                const super_nowa_baza_pytan = nowa_baza_pytan.concat(response.data.data).concat($scope.baza_pytan.slice((page + 1) * 25))
                $scope.$apply(function () {
                  $scope.baza_pytan = super_nowa_baza_pytan
                  $scope.cachedPages = response.data.data
                  $scope.totalNumberOfEntries = response.data.totalNumberOfEntries
                  $scope.totalNumberOfPages = _
                    .range(1, Math.ceil(response.data.totalNumberOfEntries/25) + 1)
                })
                console.log(super_nowa_baza_pytan)
              })
          } else {
            // $scope.$apply(function () {
              $scope.cachedPages = cachedPages
            // })
          }


        }



        $scope.turnPage(1)
      }]
    )

    .directive("passwordVerify", function() {
      return {
        require: "ngModel",
        scope: {
          passwordVerify: '='
        },
              link: function(scope, element, attrs, ctrl) {
                scope.$watch(function() {
                    var combined;
                      if (scope.passwordVerify || ctrl.$viewValue) {
                       combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                    }
                    return combined;
                }, function(value) {
                    if (value) {
                        ctrl.$parsers.unshift(function(viewValue) {
                            var origin = scope.passwordVerify;
                            if (origin !== viewValue) {
                                ctrl.$setValidity("passwordVerify", false);
                                return undefined;
                            } else {
                                ctrl.$setValidity("passwordVerify", true);
                                return viewValue;
                            }
                        });
                    }
                });
             }
           };
        })

      .config(function($translateProvider) {
            $translateProvider.translations('en', {
              WELCOME: 'Welcome!',
              MESSAGE: 'This app supports your lanaguage!'
            })
            .translations('pl', {
              WELCOME: 'Witamy!',
              MESSAGE: 'Ta strona obsługuje twój język!'
            });
            $translateProvider.preferredLanguage('pl');
            $translateProvider.useSanitizeValueStrategy('escapeParameters')
        }
      )
