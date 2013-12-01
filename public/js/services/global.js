/**
 * @file Global service for global variables
 * @module services/global
 */
angular.module('mean.system').factory("Global", [
    function() {
        var _this = this;
        _this._data = {
            user: window.user,
            authenticated: !! window.user
        };

        return _this._data;
    }
]);

