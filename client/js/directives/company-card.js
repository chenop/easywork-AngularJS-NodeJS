/**
 * Created by Chen on 01/05/2015.
 */
angular.module('easywork')
    .directive('companyCard', function () {
        return {
            restrict: 'E',
            scope: {
                company: '='
            },
            template: '<h3>Company: {{company.name}}</h3>'
            //link: function (scope, element, attrs) {
            //
            //}
        }
    });
