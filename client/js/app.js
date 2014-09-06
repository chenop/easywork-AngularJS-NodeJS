'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('easywork',
    [
        , 'ui.bootstrap'
        , 'angular-growl'
//        , 'ngRoute'
        , 'ui.router'
        , 'ngCookies'
        , 'angularFileUpload'
        , 'ui.select2'
        , 'ngAnimate']
);

app.config(
    function($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/home");
        //
        // Now set up the states
        $stateProvider
            .state('home', {
                url: "",
                templateUrl: "/views/home.html"
            })
            .state('test', {
                url: "/content_manager/0"
//                templateUrl: "/views/home.html"
            })
            .state('login', {
                url: "/login",
                templateUrl: "/views/users/login.html"
            })
            .state('my_company', {
                url: "/my_company",
                templateUrl: "/views/companies/company.html",
                isDashboard: false
            })
            .state('job_full', {
                url: "/job_full",
                templateUrl: "/views/jobs/job-full.html"
            })
            .state('content_manager', {
                url: "/content_manager/:contentType",
                templateUrl: "/views/admin/dashboard.html",
                isDashboard: true
            })
            .state('content_manager.jobs', {
                url: "/content_manager/0",
                templateUrl: "/views/jobs/job.html"
            })
            .state('content_manager.companies', {
                url: "/content_manager/1",
                templateUrl: "/views/companies/company.html"
            })
            .state('content_manager.users', {
                url: "/content_manager/2",
                templateUrl: "/views/users/user.html"
            })
            .state('job-board', {
                url: "/job-board",
                templateUrl: "/views/jobs/job-board.html"
            })
            .state('user_details', {
                url: "/user_details",
                templateUrl: "/views/users/user.html",
                isDashboard: false
            })
    }

//    ['$routeProvider', '$locationProvider', '$httpProvider',
//    function ($routeProvider, $locationProvider, $httpProvider) {
//
//        $routeProvider
//            .when('/', { templateUrl: '/views/home.html', access: 'public'})
//            .when('/test', {redirectTo: '/user_details'})
//            .when('/login', { templateUrl: '/views/users/login.html', access: 'public' })
//            .when("/my_company", {templateUrl: '/views/companies/company.html', access: 'jobProvider', isDashboard:false})
//            .when("/job_full", {templateUrl: '/views/jobs/job-full.html', access: 'public'})
//            .when("/content_manager/:contentType?", { templateUrl: '/views/admin/dashboard.html', access: 'jobProvider', isDashboard:true })
//            .when("/job-board", { templateUrl: '/views/jobs/job-board.html', access: 'jobSeeker' })
//            .when('/user_details', { templateUrl: '/views/users/user.html', access: 'jobSeeker', isDashboard:false })
//            .otherwise({ redirectTo: '/' });
//
//        $locationProvider.html5Mode(true);
//
//        //================================================
//        // Add an interceptor for AJAX errors
//        //================================================
//        $httpProvider.responseInterceptors.push(function ($q, $location) {
//            return function (promise) {
//                return promise.then(
//                    // Success: just return the response
//                    function (response) {
//                        return response;
//                    },
//                    // Error: check the error status to get only the 401
//                    function (response) {
//                        if (response.status === 401) {
//                            $location.url('/login');
//                        }
//                        return $q.reject(response);
//                    }
//                );
//            }
//        });
//
//        //================================================
//        // Add an interceptor for handling session time out - redirect to login when access denied
//        //================================================
//        $httpProvider.interceptors.push(function ($rootScope, $q, $location) {
//            return {
//                'responseError': function (response) {
//                    if ((response.status === 401 || response.status === 403) && $location.path() !== '/login') {
//                        $location.path('/login');
//                    }
//                    return $q.reject(response);
//                }
//            };
//        });
//    }
//]
)
    .run(function ($rootScope, $location, authService) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            // We need the path component of `next`. We can either process `next` and
            // spit out its path component, or simply use $location.path(). I go with
            // the latter.
//            var nextPath = $location.path();
//            var nextRoute = $route.routes[nextPath]
//
//            console.log(nextRoute.access); // There you go!

// ---------------------------------------------------------------

            if (!authService.isAuthorize(next.access)) {
                console.log("Seems like you tried accessing a route you don't have access to...");
                event.preventDefault();
                if (!authService.isLoggedIn()) {
                    $location.path("/login");
                }
                else
                    $location.path("/");//go('user.home');
            }
        });
    });

// a Fix for holder
//app.directive('bsHolder', [function () {
//    return {
//        link: function (scope, element, attrs) {
//            Holder.run(element);
//        }
//    };
//}]);

