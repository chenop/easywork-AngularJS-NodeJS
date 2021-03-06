'use strict';

angular.module('easywork')
    .controller('LogoGalleryCtrl', function ($scope, company, $uibModalInstance, dataManager) {
        $scope.urlObject = {};
        $scope.urlObject.url = company.logo.url;

        $scope.getImage = function() {
            if ($scope.urlObject.url) {
                return $scope.urlObject.url;
            }
            return "http://placehold.it/150x150.jpg&text=Logo...";
        }

        $scope.selectLogo = function() {
            company.logo.url = $scope.urlObject.url;
            dataManager.updateCompany(company);
            $uibModalInstance.dismiss();
        }

        $scope.hitEnter = function (evt) {
            if (angular.equals(evt.keyCode, 13)) {
                $scope.selectLogo();
            }
        }; // end hitEnter

    })