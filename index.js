import _ from 'lodash'
import angular from 'angular'
import angularRoute from 'angular-route'
import angularTranslate from 'angular-translate'
import angularContenteditable from 'angular-contenteditable'

import API from './api'

import { runCamera, stopCamera, captureImage } from './camera'

angular.module('myApp', [angularRoute, angularTranslate, angularContenteditable])
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

  .factory('authService', function($location) {

    const checkStorage = storage => {
      const login = storage.getItem('studioLogin')
      const token = storage.getItem('studioToken')
      // console.log('storage', storage)

      return new Promise((resolve, reject) => {
        if (login && token) {
          API.auth.post({ login, token })
            .then(resolve)
            .catch(reject)
        } else {
          reject()
        }
      })
    }

    const authorization = () => {
      checkStorage(sessionStorage)
        .catch(error => {
          checkStorage(localStorage)
            .catch(error => {
              $location.path('/login').replace()
            })
        })
    }

    const authentication = (login, password, rememberMe, callback) => {
      API.login.post({ 'Login': '', 'Email': login, 'Password': password })
        .then(response => {
          console.log(response)
          $location.path(response.data ? '/' : '/login').replace()
          const storage = rememberMe ? localStorage : sessionStorage

          switch (storage) {
            case localStorage:
              sessionStorage.removeItem('studioLogin')
              sessionStorage.removeItem('studioToken')
              break
            case sessionStorage:
              localStorage.removeItem('studioToken')
              localStorage.removeItem('studioLogin')
              break
          }

          storage.setItem('studioLogin', login)
          storage.setItem('studioToken', response.data)
          callback('')
        })
        .catch(error => {
          $location.path('/login').replace()
          callback('Login lub hasło są nieprawidłowe')
        })
    }

    return {
      authorization,
      authentication
    }
  })

  // .run(['$rootScope', '$location', 'authService', function ($rootScope, $location, authService) {
  //   $rootScope.$on('$routeChangeStart', function (event) {
  //     authService.authorization()
  //   })
  // }])

  .controller('myCtrl', ['$scope', '$translate', 'authService', '$location', function ($scope, $translate, authService, $location) {
    $scope.visibleMenu = true
    $scope.language = 'pl'
    $scope.languages = ['en', 'pl']
    $scope.updateLanguage = () => {
      $translate.use($scope.language)
    }

    $scope.logout = () => {
      sessionStorage.removeItem('studioLogin')
      sessionStorage.removeItem('studioToken')

      localStorage.removeItem('studioToken')
      localStorage.removeItem('studioLogin')

      $location.path('/login').replace()
      // $scope.$apply()
    }

    $scope.menuTree = [
      {
        name: 'Strona główna',
        path: '#/',
        icon: 'fa-home',
        active: true
      },
      {
        name: 'Baza pytań',
        target: 'baza',
        submenu: [
          {
            name: 'Przeglądaj bazę pytań',
            path: '#/baza_pytan'
          },
          {
            name: 'Przeglądaj swoje pytania',
            path: '#/moje_pytania'
          },
          {
            name: 'Dodaj pytanie',
            path: '#/dodaj_pytanie'
          }
        ]
      },
      {
        name: 'Egzamin',
        target: 'egzamin',
        submenu: [
          {
            name: 'Aktualny egzamin',
            path: '#/aktualne_pytania'
          },
          {
            name: 'Generuj nowy egzamin',
            path: '#/generuj_egzamin'
          },
          {
            name: 'Generuj raporty',
            path: '#/generuj_raporty'
          }
        ]
      },
      {
        name: 'Webcam',
        icon: 'fa-video-camera',
        path: '#/webcam'
      }
    ]
  }])

  .controller('login_controller', ['$scope', 'authService',
    ($scope, authService) => {
      $scope.visibleMenu = false
      $scope.login = () => {
        authService.authentication(
          $scope.username,
          $scope.password,
          $scope.rememberMe,
          error => {
            $scope.$apply(function () {
              $scope.error = error
            })
          }
        )
      }

    }
  ])

  .controller('baza_pytan_controller', ['$scope', 'authService',
    ($scope, authService) => {
      // authService.authorization()
      API.questions.get()
        .then(response => {
          $scope.$apply(function () {
            // console.log(response)
            $scope.baza_pytan = response.data
          })
        })
    }
  ])

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
      ['$scope', '$location', ($scope, $location) => {
        $scope.baza_pytan = []
        $scope.numberOfEntriesOnPage = 25

        $scope.resetCachedPages = () => {
          $scope.baza_pytan = []
          $scope.turnPage(1)
        }

        $scope.alert = () => {
          API.questions.put({ question: $scope.questiontToEdit })
            .then(response => {
              console.log('response', response)
            })
            .catch(error => {
              console.log('error', error)
            })
            .then(() => {
              console.log('reset cache')
              $scope.baza_pytan = []
              $scope.turnPage($scope.currentPage)
            })
        }

        $scope.fetchQuestion = (id) => {
          API.questions.get({ id })
            .then(response => {
              $scope.$apply(function () {
                $scope.questiontToEdit = response.data
              })
            })
        }

        $scope.turnPage = (page) => {
          const numberOfEntriesOnPage = $scope.numberOfEntriesOnPage
          const cachedPages = $scope.baza_pytan.slice(
            (page - 1) * numberOfEntriesOnPage,
            page * numberOfEntriesOnPage
          ).filter(page => page !== null)
          const cachedPagesLength = cachedPages.length

          if (cachedPagesLength === 0 || cachedPagesLength < numberOfEntriesOnPage && page !== $scope.totalNumberOfPages) {
            console.log('nowa strona')
            API.questions.getByPage({ page, numberOfEntriesOnPage })
              .then(response => {
                const nowa_baza_pytan = _.range((page - 1) * numberOfEntriesOnPage).map((page, index) =>
                  $scope.baza_pytan[index] || null
                )

                const super_nowa_baza_pytan = nowa_baza_pytan
                  .concat(response.data.data)
                  .concat($scope.baza_pytan.slice((page + 1) * numberOfEntriesOnPage))

                $scope.$apply(function () {
                  $scope.baza_pytan = super_nowa_baza_pytan
                  $scope.cachedPages = response.data.data
                  $scope.totalNumberOfEntries = response.data.totalNumberOfEntries
                  const allPages = _
                    .range(1, Math.ceil(response.data.totalNumberOfEntries/numberOfEntriesOnPage) + 1)
                  $scope.allPages = allPages
                  $scope.totalNumberOfPages = _.max(allPages)
                })
              })
              .catch(error => {
                $location.path('/login').replace()
                $scope.$apply()
              })
          } else {
            $scope.cachedPages = cachedPages
          }
          $scope.currentPage = page
        }
        $scope.turnPage(1)
      }]
    )

    .directive("passwordVerify", function() {
      // czajnik
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
