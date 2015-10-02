'use strict';

angular.module('easywork')
	.factory('appManager', function (authService, common, $modal, $rootScope, toaster) {

        var selectedCompanies = [];
        var selectedTechnologies = [];
        var selectedAreas = [];
        var disableSend = false;
		var displaySearchBarInHeader = true;
        var _selectedEntity;
        var currentContentType = common.CONTENT_TYPE.COMPANY;
        var default_message = 'Hi,\nI am interested in open positions in your company.\nContact information can be found in my CV which is attached.\n\nBest Regards,\n';

        $rootScope.$on('dataChanged', function (event, entity) {
            handleActiveUser(entity);
        })

        var handleActiveUser = function(entity) {
            var activeUser = getActiveUser();
            if (activeUser._id === entity._id) {
                setActiveUser(entity);
            }
        }

        var getSelectedCompaniesCount = function() {
            return selectedCompanies.length;
        }

        var getSelectedCompanies = function() {
            return selectedCompanies;
        }

        var setSelectedCompanies = function(pSelectedCompanies) {
            selectedCompanies = pSelectedCompanies;
        }

		var setDisplaySearchBarInHeader = function(disp1) {
			displaySearchBarInHeader = disp1;
		}

		var shouldDisplaySearchBarInHeader = function() {
			return displaySearchBarInHeader;
		}

        var getActiveUserId = function() {
            var activeUser = getActiveUser();
            if (activeUser !== undefined) {
                return activeUser._id;
            }
        }

        var getActiveUser = function() {
            return authService.getActiveUser();
        }

        var setActiveUser = function(user) {
            return authService.setActiveUser(user);
        }

        var getActiveCompanyId = function() {
            var activeUser = authService.getActiveUser();
            if (activeUser == undefined)
                return;
//            return JSON.parse(activeUser.company);
            return activeUser.company;
        }

        var getIndexOf = function(entities, entity) {
            for (var index = 0; index < entities.length; ++index) {
                if (entities[index]._id === entity._id) {
                    return index;
                }
            }
        }


        var setSelectedEntity = function(selectedEntity) {
            _selectedEntity = selectedEntity;
        }

		var getSelectedEntity = function() {
            return _selectedEntity;
        }

        function getCurrentContentType() {
            return currentContentType;
        }

        function setCurrentContentType(contentType) {
            currentContentType = contentType;
        }

        function isUserDetailsCompleted() {
            var user = getActiveUser();
            return (user.name && user.email && user.fileName);
        }

        function sendCVDialog(callBack) {
            var modalInstance = $modal.open({
                templateUrl: '/views/users/sendCvDialog.html',
                controller: 'SendCvDialogCtrl',
                resolve: {
                    selectedCompanies: function () {
                        return getSelectedCompanies();
                    },
                    userId: function() {
                        return getActiveUserId()
                    }
                }

            });

            modalInstance.result.then(function () {
                if (callBack !== undefined)
                    callBack();
            });
        }

        function send() {
            sendCVDialog(function () {
                toaster.pop('success', "קו\"ח נשלחו בהצלחה!");
            })
        }

        function openLoginDialog (callBack) {

            var modalInstance = $modal.open({
                templateUrl: '/views/users/loginRegister.html',
                controller: 'LoginRegisterCtrl',
                resolve: {
                    selectedTab: function () {
                        return 0;
                    }
                }
            });

            modalInstance.result.then(function (username) {
                if (username != undefined)
                    console.log('User: ' + username + ' has logged in');
                if (callBack !== undefined)
                    callBack();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        return {
			shouldDisplaySearchBarInHeader: shouldDisplaySearchBarInHeader
			, setDisplaySearchBarInHeader: setDisplaySearchBarInHeader
            , getSelectedCompaniesCount: getSelectedCompaniesCount
            , selectedTechnologies: selectedTechnologies
            , selectedAreas: selectedAreas
            , getSelectedCompanies: getSelectedCompanies
            , setSelectedCompanies: setSelectedCompanies
            , disableSend: disableSend
            , getActiveCompanyId: getActiveCompanyId
            , getActiveUserId: getActiveUserId
            , getActiveUser: getActiveUser
            , setActiveUser: setActiveUser
            , setSelectedEntity: setSelectedEntity
            , selectedEntity: _selectedEntity
            , getSelectedEntity: getSelectedEntity
            , defaultMessage: default_message
            , getIndexOf: getIndexOf
            , getCurrentContentType: getCurrentContentType
            , setCurrentContentType: setCurrentContentType
            , isUserDetailsCompleted : isUserDetailsCompleted
            , send: send
        }
	}
);
