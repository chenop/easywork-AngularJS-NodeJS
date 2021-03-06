'use strict';


angular.module('easywork')
    .controller('CompanyCtrl', function ($scope, Upload, $http, appManager, dataManager, $timeout, $state, $stateParams, $uibModal, debounce, common, utils) {
        $scope.publish = false;
		$scope.isLoading = true;

        var companyId = appManager.getRelevantEntityId($state.current.isDashboard, $stateParams.entityId, common.CONTENT_TYPE.COMPANY.name);

		if (companyId) {
			appManager.getRelevantEntity($state.current.isDashboard, companyId, common.CONTENT_TYPE.COMPANY.name)
				.then(function (company) {
					refreshCompany(company);
					$scope.isLoading = false;
				})
		}
		else {
			$scope.isLoading = false;
		}

        function refreshCompany(selectedEntity) {
            if (selectedEntity == null)
                return;
            $scope.company = selectedEntity;

            $timeout(function () {
                $('#companyName').select();
            }, 100);
        }

        $scope.displayedImage = "holder.js/100%x100%";

        $scope.onImageSelect = function ($files) {
            var file = $files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file); // Reading the image as base64
            fileReader.onload = function (e) {
                $scope.upload = Upload.upload({
                    url: './api/company/logo-upload/' + $scope.company._id,
                    method: 'POST',
                    data: e.target.result // Image as base64
                }).progress(function (evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data) {
                    // If file is undefined init it
                    if ($scope.company.logo === undefined) {
                        $scope.company.logo = {};
                    }
                    $scope.company.logo.data = data;
                    $scope.logo = data;

                    return data;
                }).error(function (err) {
                    console.log("Error:" + err.message);
                })
            }
        }

        var printCompany = function () {
            console.log("company")
            console.log("----------")
            console.log("Name: " + $scope.company.name);
            console.log("street: " + $scope.company.address.street);
            console.log("city: " + $scope.company.address.city);
            console.log("email: " + $scope.company.email);
            console.log("logoUrl: " + $scope.company.logo);
        };


        var debounceUpdateCompany = debounce(function() {
            if (!$scope.form.$valid)
                return;

            return dataManager.updateCompany($scope.company)
                .then(function (result) {
                    $scope.$emit('dataChanged', result);
                    $scope.company = result.data;
                })
        }, 500, false);

        $scope.updateCompany = function () {
            debounceUpdateCompany();
        }

        $scope.deleteCompany = function () {
            $scope.$emit('deleteEntityClicked', appManager.getSelectedEntity());
        }

        $scope.addLocation = function() {
            $scope.company.locations.push({street: "", city: ""});
        }

        $scope.removeLocation = function($index) {
            $scope.company.locations.splice($index, 1);
            dataManager.updateCompany($scope.company);
        }

        $scope.showLogoGallery = function(company) {
            var modalInstance = $uibModal.open({
                templateUrl: '/views/companies/logo-gallery.html',
                controller: 'LogoGalleryCtrl',
                resolve: {
                    company: function() {
                        return company;
                    }
                }

            });
        }

		$scope.isCompanyExist = function() {
			return utils.isDefined($scope.company);
		}

		$scope.createCompany = function() {
			appManager.createEmptyCompanyForActiveUser()
				.then(function(emptyCompany) {
					$scope.company = emptyCompany;
				})
		}
    }
);
