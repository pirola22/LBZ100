var h5;
(function (h5) {
    var application;
    (function (application) {
        var AppService = (function () {
            function AppService(restService, $filter, $q) {
                this.restService = restService;
                this.$filter = $filter;
                this.$q = $q;
            }
            AppService.prototype.getAuthority = function (company, division, m3User, programName, charAt) {
                var _this = this;
                var request = {
                    DIVI: division,
                    USID: m3User,
                    PGNM: programName
                };
                return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30_arl", request).then(function (val) {
                    if (angular.equals([], val.items)) {
                        request.DIVI = "";
                        return _this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30_arl", request).then(function (val) {
                            if (angular.equals([], val.items)) {
                                return false;
                            }
                            else {
                                var test = val.item.ALO;
                                if (charAt < test.length() && '1' == test.charAt(charAt)) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        });
                    }
                    else {
                        var test = val.item.ALO;
                        if (charAt < test.length() && '1' == test.charAt(charAt)) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                });
            };
            AppService.prototype.getWarehouseList = function (company) {
                var requestData = {
                    CONO: company
                };
                return this.restService.executeM3MIRestService("MMS005MI", "LstWarehouses", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getFacilityList = function (company, division) {
                var requestData = {
                    CONO: company,
                    DIVI: division
                };
                return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getPrinter = function (printer, user, media) {
                var requestData = {
                    PRTF: printer,
                    USID: user,
                    MEDC: media
                };
                return this.restService.executeM3MIRestService("MNS205MI", "Get", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getPrintDescription = function (constant, key) {
                var requestData = {
                    STCO: constant,
                    STKY: key
                };
                return this.restService.executeM3MIRestService("MDBREADMI", "GetCSYTAB00", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getPrinter1 = function (printer, user, media) {
                var requestData = {
                    PRTF: printer,
                    USID: user,
                    MEDC: media
                };
                return this.restService.executeM3MIRestService("MNS205MI", "Get", requestData).then(function (val) { return val; });
            };
            AppService.$inject = ["RestService", "$filter", "$q"];
            return AppService;
        }());
        application.AppService = AppService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
