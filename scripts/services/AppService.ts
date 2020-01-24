module h5.application {

    export interface IAppService {
        getAuthority(company: string, division: string, m3User: string, programName: string, charAt: number): ng.IPromise<boolean>;
        getWarehouseList(company: string): ng.IPromise<M3.IMIResponse>;
        getFacilityList(company: string, division: string): ng.IPromise<M3.IMIResponse>;
        getUserPrinter(user: string): ng.IPromise<M3.IMIResponse>;
        getPrinter(printer: string): ng.IPromise<M3.IMIResponse>;
        lstPrinters(): ng.IPromise<M3.IMIResponse>;
        getMOList(facility: string): ng.IPromise<M3.IMIResponse>;
        getInventoryItemList(warehouse: string): ng.IPromise<M3.IMIResponse>;
        getOpenDeliveryList(warehouse: string): ng.IPromise<M3.IMIResponse>;
        getInventoryItemLotList(itemNumber: string): ng.IPromise<M3.IMIResponse>;
        getItem(itemNumber: string): ng.IPromise<M3.IMIResponse>;
        getLine(orderNumber: string, orderLine: string): ng.IPromise<M3.IMIResponse>;
        getAddress(orderNumber: string): ng.IPromise<M3.IMIResponse>;
        addXMLRecord(USD1: string, USD2: string, USD3: string, USD4: string, USD5: string, ITNO: string, USID: string): ng.IPromise<M3.IMIResponse>;
        addAddressXMLRecord(USD1: string, USD2: string, USD3: string, USD4: string, USD5: string, USID: string, tname: string, tcua1: string, tcua2: string, tcua3: string, popn: string, cuor: string): ng.IPromise<M3.IMIResponse>;
        chgAddressXMLRecord(USD1: string, USD2: string, USD3: string, USD4: string, USD5: string, USID: string, tname: string, tcua1: string, tcua2: string, tcua3: string, popn: string, cuor: string): ng.IPromise<M3.IMIResponse>;
        chgXMLRecord(USD1: string, USD2: string, USD3: string, USD4: string, USD5: string, ITNO: string, USID: string): ng.IPromise<M3.IMIResponse>;
        printMOLabel(itemNumber: string, printer: string, labelType: string, facility: string, moNumber: string, boxNumber: string, labelsPerBox: string): ng.IPromise<M3.IMIResponse>;
        printInventoryLabel(itemNumber: string, printer: string, labelType: string, warehouse: string, location: string, lotNumber: string, labelsPerBox: string): ng.IPromise<M3.IMIResponse>;
        addInventoryLabelAlpha(warehouse: string, itemNumber: string, location: string, receiptDate: string, lotNumber: string, referenceOrder: string, lotRef1: string, lotRef2: string, onHandBalance: string): ng.IPromise<M3.IMIResponse>;
        chgInventoryLabelAlpha(warehouse: string, itemNumber: string, location: string, receiptDate: string, lotNumber: string, referenceOrder: string, lotRef1: string, lotRef2: string, onHandBalance: string): ng.IPromise<M3.IMIResponse>;
        getMOLabelFieldsAlpha(facility: string, moNumber: string, itemNumber: string, warehouse: string): ng.IPromise<M3.IMIResponse>;
        getMOLabelFieldsNumeric(facility: string, moNumber: string, itemNumber: string, warehouse: string): ng.IPromise<M3.IMIResponse>;
        addMOLabelFieldsAlpha(facility: string, moNumber: string, itemNumber: string, warehouse: string, description: string, workCenter: string, tradeName: string, UOM: string, labelType: string, compound: string, color: string, MSD: string, info: string, lotNumber: string): ng.IPromise<M3.IMIResponse>;
        addMOLabelFieldsNumeric(facility: string, moNumber: string, itemNumber: string, warehouse: string, startingBox: string): ng.IPromise<M3.IMIResponse>;
        chgMOLabelFieldsAlpha(facility: string, moNumber: string, itemNumber: string, warehouse: string, description: string, workCenter: string, tradeName: string, UOM: string, labelType: string, compound: string, color: string, MSD: string, info: string, lotNumber: string): ng.IPromise<M3.IMIResponse>;
        chgMOLabelFieldsNumeric(facility: string, moNumber: string, itemNumber: string, warehouse: string, startingBox: string): ng.IPromise<M3.IMIResponse>
        addMOLabelSuffixAlpha(facility: string, moNumber: string, itemNumber: string, warehouse: string, boxNumber: string, altUOM: string, lotNumber: string, workCenter: string, labelType: string, responsible: string): ng.IPromise<M3.IMIResponse>;
        addMOLabelSuffixNumeric(facility: string, moNumber: string, itemNumber: string, warehouse: string, boxNumber: string, grossWeight: string, netWeight: string, altNetWeight: string, altGrossWeight: string, startingBox: string, scanQty: string, lastBox: string): ng.IPromise<M3.IMIResponse>;
        chgMOLabelSuffixAlpha(facility: string, moNumber: string, itemNumber: string, warehouse: string, boxNumber: string, altUOM: string, lotNumber: string, workCenter: string, labelType: string, responsible: string): ng.IPromise<M3.IMIResponse>;
        chgMOLabelSuffixNumeric(facility: string, moNumber: string, itemNumber: string, warehouse: string, boxNumber: string, grossWeight: string, netWeight: string, altGrossWeight: string, altNetWeight: string, startingBox: string, scanQty: string, lastBox: string): ng.IPromise<M3.IMIResponse>;
        getItemAltUOM(itemNumber: string, altUOM: string): ng.IPromise<M3.IMIResponse>;
        getTradeNameAlpha(): ng.IPromise<M3.IMIResponse>;
        getWorkCenters(facility: string): ng.IPromise<M3.IMIResponse>;
        getLabelTypeListAlpha(): ng.IPromise<M3.IMIResponse>;
        addPrintFile(user: string, printer: string): ng.IPromise<M3.IMIResponse>;
        updPrintFile(user: string, printer: string): ng.IPromise<M3.IMIResponse>;
        getDeliveryLineList(deliveryNumber: string): ng.IPromise<M3.IMIResponse>;
        printAddressLabel(itemNumber: string, printer: string, ridn: string, ridl: string, dlix: string, ridx: string, labelsPerBox: string): ng.IPromise<M3.IMIResponse>;
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

            return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then((val: M3.IMIResponse) => {
                if (angular.equals([], val.items)) {
                    request.DIVI = "";

                    return this.restService.executeM3MIRestService("MDBREADMI", "SelCMNPUS30", request).then((val: M3.IMIResponse) => {

                        if (angular.equals([], val.items)) {

                            return false;
                        } else {
                            let test = val.item.ALO;
                            if (charAt < test.length && '1' == test.charAt(charAt)) {
                                return true;
                            } else {
                                return false;
                            }

                        }
                    });
                } else {

                    let test = val.item.ALO;
                    if (charAt < test.length && '1' == test.charAt(charAt)) {
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
            return this.restService.executeM3MIRestService("CRS008MI", "ListFacility", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }

        public getUserPrinter(user: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PRTF: "MMS501PF",
                USID: user,
                MEDC: "*PRT",
                SEQN: 1
            }
            return this.restService.executeM3MIRestService("MNS205MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        getPrinter(printer: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                DEV: printer
            }
            return this.restService.executeM3MIRestService("CRS290MI", "GetPrinter", requestData).then((val: M3.IMIResponse) => { return val; });

        }
        public addPrintFile(user: string, printer: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PRTF: "MMS501PF",
                USID: user,
                MEDC: "*PRT",
                SEQN: "1",

                DEV1: printer
            };
            return this.restService.executeM3MIRestService("MNS205MI", "Add", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public updPrintFile(user: string, printer: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                PRTF: "MMS501PF",
                USID: user,
                MEDC: "*PRT",
                SEQN: "1",

                DEV1: printer
            };
            return this.restService.executeM3MIRestService("MNS205MI", "Upd", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public lstPrinters(): ng.IPromise<M3.IMIResponse> {
            let requestData = {

            }
            return this.restService.executeM3MIRestService("CRS290MI", "LstPrinters", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }

        public getMOList(facility: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                VHFACI: facility

            }
            return this.restService.executeM3MIRestService("CMS100MI", "LstMOLabelsTX", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }

        public getInventoryItemList(warehouse: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                MLWHLO: warehouse

            }
            return this.restService.executeM3MIRestService("CMS100MI", "LstInvLabelsTX", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }
        public getOpenDeliveryList(warehouse: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                OQINOU: "1",
                OQWHLO: warehouse
            }
            return this.restService.executeM3MIRestService("CMS100MI", "LstOpenDelivery", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }
        public getAddress(OrderNumber: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                ORNO: OrderNumber,
                ADRT: "02"
            }
            return this.restService.executeM3MIRestService("OIS100MI", "GetAddress", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }
        public getDeliveryLineList(deliveryNumber: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                URDLIX: deliveryNumber

            }
            return this.restService.executeM3MIRestService("CMS100MI", "LstDeliveryLine", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }
        public getInventoryItemLotList(itemNumber: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITNO: itemNumber

            }
            return this.restService.executeM3MIRestService("MDBREADMI", "SelMILOMA00", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }

        public getItem(itemNumber: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITNO: itemNumber
            }
            return this.restService.executeM3MIRestService("MMS001MI", "Get", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public getLine(orderNumber: string, orderLine: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ORNO: orderNumber,
                PONR: orderLine
            }
            return this.restService.executeM3MIRestService("OIS100MI", "GetLine", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        addXMLRecord(USD1: string, USD2: string, USD3: string, USD4: string, USD5: string, ITNO: string, USID: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                FILE: "XMLPRT",
                PK01: USD1,
                PK02: USD2,
                PK03: USD3,
                PK04: USD4,
                PK05: USD5,
                PK06: ITNO,
                PK07: USID

            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });

        }
        addAddressXMLRecord(USD1: string, USD2: string, USD3: string, USD4: string, USD5: string, USID: string, tname: string, tcua1: string, tcua2: string, tcua3: string, popn: string, cuor: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                FILE: "XMLPRT",
                PK01: "T03",
                PK02: USD1,
                PK03: USD2,
                PK04: USD3,
                PK05: USD4,
                PK06: USD5,
                PK07: USID,
                //FIELDS
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

            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });

        }
        chgAddressXMLRecord(USD1: string, USD2: string, USD3: string, USD4: string, USD5: string, USID: string, tname: string, tcua1: string, tcua2: string, tcua3: string, popn: string, cuor: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                FILE: "XMLPRT",
                PK01: "T03",
                PK02: USD1,
                PK03: USD2,
                PK04: USD3,
                PK05: USD4,
                PK06: USD5,
                PK07: USID,
                //FIELDS
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

            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });

        }
        chgXMLRecord(USD1: string, USD2: string, USD3: string, USD4: string, USD5: string, ITNO: string, USID: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                FILE: "XMLPRT",
                PK01: USD1,
                PK02: USD2,
                PK03: USD3,
                PK04: USD4,
                PK05: USD5,
                PK06: ITNO,
                PK07: USID

            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgFieldValue", requestData).then((val: M3.IMIResponse) => { return val; });

        }

        public printInventoryLabel(itemNumber: string, printer: string, labelType: string, warehouse: string, location: string, lotNumber: string, labelsPerBox: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITNO: itemNumber,
                DEV0: printer,
                USD1: labelType,
                USD2: warehouse,
                USD3: location,
                USD4: lotNumber,
                COPY: labelsPerBox
            }
            return this.restService.executeM3MIRestService("MMS200MI", "PrtItemLabel", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }
        public printAddressLabel(itemNumber: string, printer: string, ridn: string, ridl: string, dlix: string, ridx: string, labelsPerBox: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITNO: itemNumber,
                DEV0: printer,
                COPY: labelsPerBox,
                USD1: "T03",
                USD2: ridn,
                USD3: ridl,
                USD4: dlix,
                USD5: ridx
            }
            return this.restService.executeM3MIRestService("MMS200MI", "PrtItemLabel", requestData, 0).then((val: M3.IMIResponse) => { return val; });
        }
        public printMOLabel(itemNumber: string, printer: string, labelType: string, facility: string, moNumber: string, boxNumber: string, labelsPerBox: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITNO: itemNumber,
                DEV0: printer,
                USD1: labelType,
                USD2: facility,
                USD3: moNumber,
                USD4: boxNumber,
                COPY: labelsPerBox
            }
            return this.restService.executeM3MIRestService("MMS200MI", "PrtItemLabel", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public addInventoryLabelAlpha(warehouse: string, itemNumber: string, location: string, receiptDate: string, lotNumber: string, referenceOrder: string, lotRef1: string, lotRef2: string, onHandBalance: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
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

            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public chgInventoryLabelAlpha(warehouse: string, itemNumber: string, location: string, receiptDate: string, lotNumber: string, referenceOrder: string, lotRef1: string, lotRef2: string, onHandBalance: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
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

            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        //------------------ get Label Fields BEGIN
        public getMOLabelFieldsAlpha(facility: string, moNumber: string, itemNumber: string, warehouse: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                KPID: "LBLPRT",
                PK01: facility,
                PK02: moNumber,
                PK03: itemNumber,
                PK04: warehouse
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "GetAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getMOLabelFieldsNumeric(facility: string, moNumber: string, itemNumber: string, warehouse: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                KPID: "LBLPRT",
                PK01: facility,
                PK02: moNumber,
                PK03: itemNumber,
                PK04: warehouse
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "GetNumericKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        //------------------ get MOLabel Fields END        
        //------------------ add MOLabel Fields BEGIN
        public addMOLabelFieldsAlpha(facility: string, moNumber: string, itemNumber: string, warehouse: string, description: string, workCenter: string, tradeName: string, UOM: string, labelType: string, compound: string, color: string, MSD: string, info: string, lotNumber: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
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
                //AL39: lotNumber
                AL39: moNumber
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public addMOLabelFieldsNumeric(facility: string, moNumber: string, itemNumber: string, warehouse: string, startingBox: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                KPID: "LBLPRT",
                PK01: facility,
                PK02: moNumber,
                PK03: itemNumber,
                PK04: warehouse,
                N096: startingBox
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddNumericKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        //------------------ add MOLabel Fields END
        //------------------ change MOLabel Fields BEGIN
        public chgMOLabelFieldsAlpha(facility: string, moNumber: string, itemNumber: string, warehouse: string, description: string, workCenter: string, tradeName: string, UOM: string, labelType: string, compound: string, color: string, MSD: string, info: string, lotNumber: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
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
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public chgMOLabelFieldsNumeric(facility: string, moNumber: string, itemNumber: string, warehouse: string, startingBox: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                KPID: "LBLPRT",
                PK01: facility,
                PK02: moNumber,
                PK03: itemNumber,
                PK04: warehouse,
                N096: startingBox
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgNumericKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        //------------------ change MOLabel Fields END
        public getItemAltUOM(itemNumber: string, altUOM: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                ITNO: itemNumber,
                AUTP: "1",
                ALUN: altUOM,
            }
            return this.restService.executeM3MIRestService("MDBREADMI", "GetMITAUN00", requestData).then((val: M3.IMIResponse) => { return val; });
        }


        //------------------ add MOLabel suffix begin
        public addMOLabelSuffixAlpha(facility: string, moNumber: string, itemNumber: string, warehouse: string, boxNumber: string, altUOM: string, lotNumber: string, workCenter: string, labelType: string, responsible: string): ng.IPromise<M3.IMIResponse> {

            let requestData = {
                KPID: "LBLSFX",
                PK01: facility,
                PK02: warehouse,
                PK03: moNumber,
                PK04: itemNumber,
                PK05: boxNumber,
                AL30: altUOM,
                //A130: scanDate,
                //A230: scanTime,
                AL33: lotNumber,
                //A430: sfxStatus,
                //A530: errorCode,
                AL36: workCenter,
                AL37: labelType,
                AL38: responsible

            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public addMOLabelSuffixNumeric(facility: string, moNumber: string, itemNumber: string, warehouse: string, boxNumber: string, grossWeight: string, netWeight: string, altNetWeight: string, altGrossWeight: string, startingBox: string, scanQty: string, lastBox: string): ng.IPromise<M3.IMIResponse> {
            let REND;
            if (lastBox === "true") {
                REND = 1;
            }
            if (lastBox === "false") {
                REND = 2;
            }

            let requestData = {
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
                //N696: shift,
                N896: REND
            }

            console.log(requestData);
            return this.restService.executeM3MIRestService("CUSEXTMI", "AddNumericKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        //------------------ add MOLabel suffix end
        //------------------ change MOLabel suffix begin

        public chgMOLabelSuffixAlpha(facility: string, moNumber: string, itemNumber: string, warehouse: string, boxNumber: string, altUOM: string, lotNumber: string, workCenter: string, labelType: string, responsible: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                KPID: "LBLSFX",
                PK01: facility,
                PK02: warehouse,
                PK03: moNumber,
                PK04: itemNumber,
                PK05: boxNumber,
                AL30: altUOM,
                //A130: scanDate,
                //A230: scanTime,
                AL33: lotNumber,
                //A430: sfxStatus,
                //A530: errorCode,
                AL36: workCenter,
                A730: labelType,
                AL38: responsible

            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        public chgMOLabelSuffixNumeric(facility: string, moNumber: string, itemNumber: string, warehouse: string, boxNumber: string, grossWeight: string, netWeight: string, altGrossWeight: string, altNetWeight: string, startingBox: string, scanQty: string, lastBox: string): ng.IPromise<M3.IMIResponse> {
            let REND;
            if (lastBox === "true") {
                REND = 1;
            }
            if (lastBox === "false") {
                REND = 2;
            }
            let requestData = {
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
                //N696: shift,
                //N796: palletNumber,
                N896: REND
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "ChgNumericKPI", requestData).then((val: M3.IMIResponse) => { return val; });
        }
        //------------------ add MOLabel suffix end

        public getTradeNameAlpha(): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                KPID: "ZZUDF8"
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "LstAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; })
        }

        public getWorkCenters(facility: string): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                FACI: facility
            }
            return this.restService.executeM3MIRestService("MDBREADMI", "LstMPDWCT00", requestData).then((val: M3.IMIResponse) => { return val; });
        }

        public getLabelTypeListAlpha(): ng.IPromise<M3.IMIResponse> {
            let requestData = {
                KPID: "LBLCUS"
            }
            return this.restService.executeM3MIRestService("CUSEXTMI", "LstAlphaKPI", requestData).then((val: M3.IMIResponse) => { return val; })
        }

    }
}
