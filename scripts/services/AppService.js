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
                return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then(function (val) {
                    if (angular.equals([], val.items)) {
                        request.DIVI = "";
                        return _this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then(function (val) {
                            if (angular.equals([], val.items)) {
                                return false;
                            }
                            else {
                                var test = val.item.ALO;
                                if (charAt < test.length && '1' == test.charAt(charAt)) {
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
                        if (charAt < test.length && '1' == test.charAt(charAt)) {
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
                return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getUserPrinter = function (user) {
                var requestData = {
                    PRTF: "MMS501PF",
                    USID: user,
                    MEDC: "*PRT",
                    SEQN: 1
                };
                return this.restService.executeM3MIRestService("MNS205MI", "Get", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getPrinter = function (printer) {
                var requestData = {
                    DEV: printer
                };
                return this.restService.executeM3MIRestService("CRS290MI", "GetPrinter", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addPrintFile = function (user, printer) {
                var requestData = {
                    PRTF: "MMS501PF",
                    USID: user,
                    MEDC: "*PRT",
                    SEQN: "1",
                    DEV1: printer
                };
                return this.restService.executeM3MIRestService("MNS205MI", "Add", requestData).then(function (val) { return val; });
            };
            AppService.prototype.updPrintFile = function (user, printer) {
                var requestData = {
                    PRTF: "MMS501PF",
                    USID: user,
                    MEDC: "*PRT",
                    SEQN: "1",
                    DEV1: printer
                };
                return this.restService.executeM3MIRestService("MNS205MI", "Upd", requestData).then(function (val) { return val; });
            };
            AppService.prototype.lstPrinters = function () {
                var requestData = {};
                return this.restService.executeM3MIRestService("CRS290MI", "LstPrinters", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getMOList = function (facility) {
                var requestData = {
                    VHFACI: facility
                };
                return this.restService.executeM3MIRestService("CMS100MI", "LstMOLabelsTX", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getInventoryItemList = function (warehouse) {
                var requestData = {
                    MLWHLO: warehouse
                };
                return this.restService.executeM3MIRestService("CMS100MI", "LstInvLabelsTX", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getOpenDeliveryList = function (warehouse) {
                var requestData = {
                    OQINOU: "1",
                    OQWHLO: warehouse
                };
                return this.restService.executeM3MIRestService("CMS100MI", "LstOpenDelivery", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getAddress = function (OrderNumber) {
                var requestData = {
                    ORNO: OrderNumber,
                    ADRT: "02"
                };
                return this.restService.executeM3MIRestService("OIS100MI", "GetAddress", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getDeliveryLineList = function (deliveryNumber) {
                var requestData = {
                    URDLIX: deliveryNumber
                };
                return this.restService.executeM3MIRestService("CMS100MI", "LstDeliveryLine", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getInventoryItemLotList = function (itemNumber) {
                var requestData = {
                    ITNO: itemNumber
                };
                return this.restService.executeM3MIRestService("MDBREADMI", "SelMILOMA00", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.getItem = function (itemNumber) {
                var requestData = {
                    ITNO: itemNumber
                };
                return this.restService.executeM3MIRestService("MMS001MI", "Get", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getLine = function (orderNumber, orderLine) {
                var requestData = {
                    ORNO: orderNumber,
                    PONR: orderLine
                };
                return this.restService.executeM3MIRestService("OIS100MI", "GetLine", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addXMLRecord = function (USD1, USD2, USD3, USD4, USD5, ITNO, USID) {
                var requestData = {
                    FILE: "XMLPRT",
                    PK01: USD1,
                    PK02: USD2,
                    PK03: USD3,
                    PK04: USD4,
                    PK05: USD5,
                    PK06: ITNO,
                    PK07: USID
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "AddFieldValue", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addAddressXMLRecord = function (USD1, USD2, USD3, USD4, USD5, USID, tname, tcua1, tcua2, tcua3, popn, cuor) {
                var requestData = {
                    FILE: "XMLPRT",
                    PK01: "T03",
                    PK02: USD1,
                    PK03: USD2,
                    PK04: USD3,
                    PK05: USD4,
                    PK06: USD5,
                    PK07: USID,
                    A030: "",
                    A130: "",
                    A230: "",
                    A330: "",
                    A430: tname,
                    A530: tcua1,
                    A630: tcua2,
                    A730: tcua3,
                    A830: popn,
                    A930: cuor
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "AddFieldValue", requestData).then(function (val) { return val; });
            };
            AppService.prototype.chgAddressXMLRecord = function (USD1, USD2, USD3, USD4, USD5, USID, tname, tcua1, tcua2, tcua3, popn, cuor) {
                var requestData = {
                    FILE: "XMLPRT",
                    PK01: "T03",
                    PK02: USD1,
                    PK03: USD2,
                    PK04: USD3,
                    PK05: USD4,
                    PK06: USD5,
                    PK07: USID,
                    A030: "",
                    A130: "",
                    A230: "",
                    A330: "",
                    A430: tname,
                    A530: tcua1,
                    A630: tcua2,
                    A730: tcua3,
                    A830: popn,
                    A930: cuor
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValue", requestData).then(function (val) { return val; });
            };
            AppService.prototype.chgXMLRecord = function (USD1, USD2, USD3, USD4, USD5, ITNO, USID) {
                var requestData = {
                    FILE: "XMLPRT",
                    PK01: USD1,
                    PK02: USD2,
                    PK03: USD3,
                    PK04: USD4,
                    PK05: USD5,
                    PK06: ITNO,
                    PK07: USID
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValue", requestData).then(function (val) { return val; });
            };
            AppService.prototype.printInventoryLabel = function (itemNumber, printer, labelType, warehouse, location, lotNumber, labelsPerBox) {
                var requestData = {
                    ITNO: itemNumber,
                    DEV0: printer,
                    USD1: labelType,
                    USD2: warehouse,
                    USD3: location,
                    USD4: lotNumber,
                    COPY: labelsPerBox
                };
                return this.restService.executeM3MIRestService("MMS200MI", "PrtItemLabel", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.printAddressLabel = function (itemNumber, printer, ridn, ridl, dlix, ridx, labelsPerBox) {
                var requestData = {
                    ITNO: itemNumber,
                    DEV0: printer,
                    COPY: labelsPerBox,
                    USD1: "T03",
                    USD2: ridn,
                    USD3: ridl,
                    USD4: dlix,
                    USD5: ridx
                };
                return this.restService.executeM3MIRestService("MMS200MI", "PrtItemLabel", requestData, 0).then(function (val) { return val; });
            };
            AppService.prototype.printMOLabel = function (itemNumber, printer, labelType, facility, moNumber, boxNumber, labelsPerBox) {
                var requestData = {
                    ITNO: itemNumber,
                    DEV0: printer,
                    USD1: labelType,
                    USD2: facility,
                    USD3: moNumber,
                    USD4: boxNumber,
                    COPY: labelsPerBox
                };
                return this.restService.executeM3MIRestService("MMS200MI", "PrtItemLabel", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addInventoryLabelAlpha = function (warehouse, itemNumber, location, receiptDate, lotNumber, referenceOrder, lotRef1, lotRef2, onHandBalance) {
                var requestData = {
                    KPID: "LBLINV",
                    PK01: warehouse,
                    PK02: itemNumber,
                    PK03: location,
                    PK04: lotNumber,
                    AL30: receiptDate,
                    AL31: referenceOrder,
                    AL32: lotRef1,
                    AL33: lotRef2,
                    AL34: onHandBalance
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "AddAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.chgInventoryLabelAlpha = function (warehouse, itemNumber, location, receiptDate, lotNumber, referenceOrder, lotRef1, lotRef2, onHandBalance) {
                var requestData = {
                    KPID: "LBLINV",
                    PK01: warehouse,
                    PK02: itemNumber,
                    PK03: location,
                    PK04: lotNumber,
                    AL30: receiptDate,
                    AL31: referenceOrder,
                    AL32: lotRef1,
                    AL33: lotRef2,
                    AL34: onHandBalance
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "ChgAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getMOLabelFieldsAlpha = function (facility, moNumber, itemNumber, warehouse) {
                var requestData = {
                    KPID: "LBLPRT",
                    PK01: facility,
                    PK02: moNumber,
                    PK03: itemNumber,
                    PK04: warehouse
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "GetAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getMOLabelFieldsNumeric = function (facility, moNumber, itemNumber, warehouse) {
                var requestData = {
                    KPID: "LBLPRT",
                    PK01: facility,
                    PK02: moNumber,
                    PK03: itemNumber,
                    PK04: warehouse
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "GetNumericKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addMOLabelFieldsAlpha = function (facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber) {
                var requestData = {
                    KPID: "LBLPRT",
                    PK01: facility,
                    PK02: moNumber,
                    PK03: itemNumber,
                    PK04: warehouse,
                    AL30: description,
                    AL31: workCenter,
                    AL32: tradeName,
                    AL33: UOM,
                    AL34: labelType,
                    AL35: compound,
                    AL36: color,
                    AL37: MSD,
                    AL38: info,
                    AL39: moNumber
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "AddAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addMOLabelFieldsNumeric = function (facility, moNumber, itemNumber, warehouse, startingBox) {
                var requestData = {
                    KPID: "LBLPRT",
                    PK01: facility,
                    PK02: moNumber,
                    PK03: itemNumber,
                    PK04: warehouse,
                    N096: startingBox
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "AddNumericKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.chgMOLabelFieldsAlpha = function (facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber) {
                var requestData = {
                    KPID: "LBLPRT",
                    PK01: facility,
                    PK02: moNumber,
                    PK03: itemNumber,
                    PK04: warehouse,
                    AL30: description,
                    AL31: workCenter,
                    AL32: tradeName,
                    AL33: UOM,
                    AL34: labelType,
                    AL35: compound,
                    AL36: color,
                    AL37: MSD,
                    AL38: info,
                    AL39: lotNumber
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "ChgAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.chgMOLabelFieldsNumeric = function (facility, moNumber, itemNumber, warehouse, startingBox) {
                var requestData = {
                    KPID: "LBLPRT",
                    PK01: facility,
                    PK02: moNumber,
                    PK03: itemNumber,
                    PK04: warehouse,
                    N096: startingBox
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "ChgNumericKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getItemAltUOM = function (itemNumber, altUOM) {
                var requestData = {
                    ITNO: itemNumber,
                    AUTP: "1",
                    ALUN: altUOM,
                };
                return this.restService.executeM3MIRestService("MDBREADMI", "GetMITAUN00", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addMOLabelSuffixAlpha = function (facility, moNumber, itemNumber, warehouse, boxNumber, altUOM, lotNumber, workCenter, labelType, responsible) {
                var requestData = {
                    KPID: "LBLSFX",
                    PK01: facility,
                    PK02: warehouse,
                    PK03: moNumber,
                    PK04: itemNumber,
                    PK05: boxNumber,
                    AL30: altUOM,
                    AL33: lotNumber,
                    AL36: workCenter,
                    AL37: labelType,
                    AL38: responsible
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "AddAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.addMOLabelSuffixNumeric = function (facility, moNumber, itemNumber, warehouse, boxNumber, grossWeight, netWeight, altNetWeight, altGrossWeight, startingBox, scanQty, lastBox) {
                var REND;
                if (lastBox === "true") {
                    REND = 1;
                }
                if (lastBox === "false") {
                    REND = 2;
                }
                var requestData = {
                    KPID: "LBLSFX",
                    PK01: facility,
                    PK02: warehouse,
                    PK03: moNumber,
                    PK04: itemNumber,
                    PK05: boxNumber,
                    N096: grossWeight,
                    N196: netWeight,
                    N296: altGrossWeight,
                    N396: altNetWeight,
                    N496: startingBox,
                    N596: scanQty,
                    N896: REND
                };
                console.log(requestData);
                return this.restService.executeM3MIRestService("CUSEXTMI", "AddNumericKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.chgMOLabelSuffixAlpha = function (facility, moNumber, itemNumber, warehouse, boxNumber, altUOM, lotNumber, workCenter, labelType, responsible) {
                var requestData = {
                    KPID: "LBLSFX",
                    PK01: facility,
                    PK02: warehouse,
                    PK03: moNumber,
                    PK04: itemNumber,
                    PK05: boxNumber,
                    AL30: altUOM,
                    AL33: lotNumber,
                    AL36: workCenter,
                    A730: labelType,
                    AL38: responsible
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "ChgAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.chgMOLabelSuffixNumeric = function (facility, moNumber, itemNumber, warehouse, boxNumber, grossWeight, netWeight, altGrossWeight, altNetWeight, startingBox, scanQty, lastBox) {
                var REND;
                if (lastBox === "true") {
                    REND = 1;
                }
                if (lastBox === "false") {
                    REND = 2;
                }
                var requestData = {
                    KPID: "LBLSFX",
                    PK01: facility,
                    PK02: warehouse,
                    PK03: moNumber,
                    PK04: itemNumber,
                    PK05: boxNumber,
                    N096: parseInt(grossWeight),
                    N196: parseInt(netWeight),
                    N296: parseInt(altGrossWeight),
                    N396: parseInt(altNetWeight),
                    N496: parseInt(startingBox),
                    N596: parseInt(scanQty),
                    N896: REND
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "ChgNumericKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getTradeNameAlpha = function () {
                var requestData = {
                    KPID: "ZZUDF8"
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "LstAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getWorkCenters = function (facility) {
                var requestData = {
                    FACI: facility
                };
                return this.restService.executeM3MIRestService("MDBREADMI", "LstMPDWCT00", requestData).then(function (val) { return val; });
            };
            AppService.prototype.getLabelTypeListAlpha = function () {
                var requestData = {
                    KPID: "LBLCUS"
                };
                return this.restService.executeM3MIRestService("CUSEXTMI", "LstAlphaKPI", requestData).then(function (val) { return val; });
            };
            AppService.$inject = ["RestService", "$filter", "$q"];
            return AppService;
        }());
        application.AppService = AppService;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
