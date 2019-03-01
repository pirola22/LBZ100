module h5.application {

    export interface IAppService {
        getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean>;
        getWarehouseList(company: string): ng.IPromise<M3.IMIResponse>;
        getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        getPrinter(printer: string, user: string, media: string): ng.IPromise<M3.IMIResponse>;
        getPrintDescription(constant: string, key: string): ng.IPromise<M3.IMIResponse>;
        getPrinter1(printer: string, user: string, media: string): ng.IPromise<M3.IMIResponse>;

    }

    export class AppService implements IAppService {

        static $inject = ["RestService", "$filter", "$q"];

        constructor(private restService: h5.application.IRestService, private $filter: h5.application.AppFilter, private $q: ng.IQService) {
        }

        public getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean> {
            let request = {
                DIVI: division,
                USID: m3User,
                PGNM: programName
            };
            return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30_arl", request).then((val: M3.IMIResponse) => {
                if (angular.equals([], val.items)) {
                    request.DIVI = "";
                    return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30_arl", request).then((val: M3.IMIResponse) => {
                        if (angular.equals([], val.items)) {
                            return false;
                        } else {
                            let test = val.item.ALO;
                            if (charAt < test.length() && '1' == test.charAt(charAt)) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    });
                } else {
                    let test = val.item.ALO;
                    if (charAt < test.length() && '1' == test.charAt(charAt)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        }

        public getWarehouseList(company: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company
            };
            return this.restService.executeM3MIRestService("MMS005MI", "LstWarehouses", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }

        public getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                CONO: company,
                DIVI: division
            };
            return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getPrinter(printer: string, user: string, media: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PRTF: printer,
                USID: user,
                MEDC: media
            }
            return this.restService.executeM3MIRestService("MNS205MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        
        public getPrintDescription(constant: string, key: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                DIVI: "",
                STCO: constant,
                STKY: key,
                LNCD: ""
            }
            return this.restService.executeM3MIRestService("MDBREADMI", "GetCSYTAB00", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getPrinter1(printer: string, user: string, media: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PRTF: printer,
                USID: user,
                MEDC: media
            }
            return this.restService.executeM3MIRestService("MNS205MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }

    }
}
