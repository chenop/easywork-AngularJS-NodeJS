angular.module('easywork')
    .controller('DashboardListCtrl', function ($scope, dataManager, appManager, common, $stateParams, $state) {
        var contentTypeName = $stateParams.contentTypeName;
        var selectedEntityId = $stateParams.selectedEntityId;

        refreshEntities(contentTypeName, selectedEntityId)

        function setSelectedEntity(entity) {
            if ($scope.entities != undefined && $scope.entities.length > 0) {
                if (entity == null) {
                    entity = $scope.entities[0];
                }
                appManager.setSelectedEntity(entity);
                return entity;
            }
            return null;
        }

        function handleSelection(entityId) {
            var contentType = appManager.getCurrentContentType();
            if ($scope.entities.length === 0) {
                $state.go("dashboard.list.empty");
            }
            else if (entityId === '-1') {
                // Just take the first entity
                var entity = $scope.entities[0];
                setSelectedEntity(entity);
                $state.go("dashboard.list." + contentType.name, {entityId: entity._id});
            }
            else {
                // Need to select the entity
                dataManager.getEntity(contentType, entityId)
                    .then(function(result) {
                        setSelectedEntity(result.data);
                        // For some reason entity._id does not work...
                        $state.go("dashboard.list." + contentType.name, {entityId: result.data._id});
                    })
            }
        }

        function refreshEntities(contentTypeName, nextEntityIdToSelect) {
            if (contentTypeName == undefined) {
                contentTypeName = appManager.getCurrentContentType().name;
            }

            switch (contentTypeName) {

                case common.CONTENT_TYPE.JOB.name:
                    getJobs().then(function(result) {
                        $scope.entities = result.data;
                        appManager.setCurrentContentType(common.CONTENT_TYPE.JOB);
                        handleSelection(nextEntityIdToSelect);
                    });
                    break;

                case common.CONTENT_TYPE.COMPANY.name:
                    getCompanies().then(function(result) {
                        $scope.entities = result.data;
                        appManager.setCurrentContentType(common.CONTENT_TYPE.COMPANY);
                        handleSelection(nextEntityIdToSelect);
                    });
                    break;

                case common.CONTENT_TYPE.USER.name:
                    getUsers().then(function(result) {
                        $scope.entities = result.data;
                        appManager.setCurrentContentType(common.CONTENT_TYPE.USER);
                        handleSelection(nextEntityIdToSelect);
                    });
                    break;
            }
        }

        function getCompanies() {
            return dataManager.getCompanies();
        };

        function getJobs() {
            if (appManager.getActiveUser().role == "admin") {
                return dataManager.getAllJobs();
            }
            else {
                var companyId = appManager.getActiveCompanyId();
                return dataManager.getJobs(companyId);
            }
        };

        function getUsers() {
            return dataManager.getUsers();
        };

        $scope.$on('deleteEntityClicked', function (event, entity) {
            var index = appManager.getIndexOf($scope.entities, entity);
            $scope.deleteEntity(entity, index);
        })

        function isLastEntity(index) {
            return index == $scope.entities.length - 1;
        }

        function prepareNextEntityToSelect(index) {
            if (index === undefined)
                return $scope.entities[0];

            if ($scope.entities != undefined) {
                if (!isLastEntity(index)) {
                    index++;
                }
                else if (index != 0) {
                    index--;
                }
                return $scope.entities[index];
            }

            return null;
        }

        $scope.deleteEntity = function (entity, index) {
            var contentType = appManager.getCurrentContentType();
            var nextEntityToSelect = prepareNextEntityToSelect(index);
            dataManager.deleteEntity(contentType, entity._id).
                success(function () {
                    refreshEntities(contentType.name, nextEntityToSelect._id);
                });
        }

        $scope.isSelected = function (entity) {
            var selectedEntity = appManager.getSelectedEntity();
            if (entity == undefined || selectedEntity == undefined)
                return false;
            return selectedEntity._id == entity._id;
        }

        $scope.setSelected = function (entity, $index) {
            handleSelection(entity._id);
        }

        $scope.$on('dataChanged', function (event, entity) {
            refreshEntities(contentTypeName, entity._id);
        })

    });