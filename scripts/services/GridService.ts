module h5.application {

    export class GridService {

        static $inject = ["$filter", "$timeout", "StorageService", "languageService"];
        private baseGrid: IUIGrid;

        constructor(private $filter: h5.application.AppFilter, private $timeout: ng.ITimeoutService, private storageService: h5.application.StorageService, private languageService: h5.application.LanguageService) {
            this.init();
        }

        private init() {
            this.baseGrid = {
                enableGridMenu: true,
                enableRowSelection: true,
                enableFullRowSelection: false,
                modifierKeysToMultiSelect: true,
                modifierKeysToMultiSelectCells: true,
                enableRowHeaderSelection: true,
                enableSelectAll: true,
                showGridFooter: true,
                showColumnFooter: true,
                enableColumnMenus: true,
                enableSorting: true,
                enableFiltering: true,
                flatEntityAccess: true,
                fastWatch: true,
                scrollDebounce: 500,
                wheelScrollThrottle: 500,
                virtualizationThreshold: 10,
                exporterCsvFilename: "grid_data.csv",
                exporterPdfFilename: "grid_data.pdf",
                exporterFieldCallback: (grid: any, row: any, col: any, value: any) => {
                    if (col.name.indexOf('Date') > 0) {
                        value = this.$filter('m3Date')(value, grid.appScope.appConfig.globalDateFormat);
                    }
                    return value;
                },
                exporterPdfCustomFormatter: (docDefinition: any) => {
                    docDefinition.styles.pageHeader = { fontSize: 10, italics: true, alignment: 'left', margin: 10 };
                    docDefinition.styles.pageFooter = { fontSize: 10, italics: true, alignment: 'right', margin: 10 };
                    return docDefinition;
                },
                exporterPdfDefaultStyle: { fontSize: 9 },
                exporterPdfHeader: {
                    columns: [
                        { text: 'H5 Application', style: 'pageHeader' }
                    ]
                },
                exporterPdfFooter: (currentPage: number, pageCount: number) => { return { text: 'Page ' + currentPage + ' of ' + pageCount, style: 'pageFooter' }; },
                exporterPdfTableStyle: { margin: [20, 30, 20, 30] },
                exporterPdfMaxGridWidth: 700,
                columnDefs: [{}],
                data: []
            };
        }

        public getBaseGrid(): IUIGrid {
            return angular.copy(this.baseGrid);
        }

        public adjustGridHeight(gridId: string, noOfRows: number, timeDelay: number) {
            noOfRows = (noOfRows < 1 ? 1 : noOfRows);
            this.$timeout(() => {
                let newHeight = noOfRows > 15 ? 600 : (150 + noOfRows * 30);
                angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
            }, timeDelay);
        }

        public adjustMOGridHeight(gridId: string, noOfRows: number, timeDelay: number) {
            noOfRows = (noOfRows < 1 ? 1 : noOfRows);
            this.$timeout(() => {
                let newHeight = noOfRows > 15 ? 450 : (150 + noOfRows * 30);
                angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
            }, timeDelay);
        }

        public adjustInventoryItemGridHeight(gridId: string, noOfRows: number, timeDelay: number) {
            noOfRows = (noOfRows < 1 ? 1 : noOfRows);
            this.$timeout(() => {
                let newHeight = noOfRows > 15 ? 300 : (150 + noOfRows * 30);
                angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
            }, timeDelay);
        }
        public adjustOpenDeliveryGridHeight(gridId: string, noOfRows: number, timeDelay: number) {
            noOfRows = (noOfRows < 1 ? 1 : noOfRows);
            this.$timeout(() => {
                let newHeight = noOfRows > 15 ? 300 : (150 + noOfRows * 30);
                angular.element(document.getElementById(gridId)).css('height', newHeight + 'px');
            }, timeDelay);
        }
        public saveGridState(gridId: string, gridApi: any) {
            let gridState = gridApi.saveState.save();
            this.storageService.setLocalData('h5.app.appName.gridState.' + gridId, gridState);
        }

        public restoreGridState(gridId: string, gridApi: any) {
            let gridState = this.storageService.getLocalData('h5.app.appName.gridState.' + gridId);
            if (gridState) {
                this.$timeout(() => {
                    gridApi.saveState.restore(undefined, gridState);
                }, 100);
            }
        }

        public clearGridStates() {
            let gridIds = ["sampleGrid1", "MOLabelListGrid", "inventoryLabelListGrid"];
            gridIds.forEach((gridId: string) => {
                this.storageService.removeLocalData('h5.app.appName.gridState.' + gridId);
            });

        }


        public getMOListGrid(): IUIGrid {
            let MOLabelListGrid: IUIGrid = angular.copy(this.baseGrid);
            let footerCellTemplateNumString = "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\">Sum: {{ ( col.getAggregationValue() CUSTOM_FILTERS ) | number:2 }}</div>";//cell template enables the hyperlink
            let gridLinkCellTemplate = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\"><span class=\"h5-link\" ng-click=\"grid.appScope.MOLabelModule.displayMOLabel(col.field, row.entity)\">{{COL_FIELD CUSTOM_FILTERS}}</span></div>";
            MOLabelListGrid.columnDefs = [// numbers, quantity and currency should be right justified - headerCellClass:"text-right", cellClass:"text-right"
                { name: "VHMFNO", displayName: this.languageService.languageConstants.get('MO no'), enableCellEdit: false, cellTemplate: gridLinkCellTemplate },//, cellTemplate: gridLinkCellTemplate },//cell edit false means you cant edit via uigrid
                { name: "VHITNO", displayName: this.languageService.languageConstants.get('Item Number'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }
                { name: "MMITDS", displayName: this.languageService.languageConstants.get('Name'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }    
                { name: "VHORQT", displayName: this.languageService.languageConstants.get('Order Quantity'), enableCellEdit: false } //, cellTemplate: gridLinkCellTemplate }

            ];

            return MOLabelListGrid;
        }

        public getInventoryItemListGrid(): IUIGrid {
            let inventoryItemListGrid: IUIGrid = angular.copy(this.baseGrid);
            let footerCellTemplateNumString = "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\">Sum: {{ ( col.getAggregationValue() CUSTOM_FILTERS ) | number:2 }}</div>";//cell template enables the hyperlink
            let gridLinkCellTemplate = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\"><span class=\"h5-link\" ng-click=\"grid.appScope.inventoryLabelModule.displayInventoryItemLot(col.field, row.entity)\">{{COL_FIELD CUSTOM_FILTERS}}</span></div>";
            inventoryItemListGrid.columnDefs = [// numbers, quantity and currency should be right justified - headerCellClass:"text-right", cellClass:"text-right"
                { name: "MLITNO", displayName: this.languageService.languageConstants.get('Item Number'), enableCellEdit: false, cellTemplate: gridLinkCellTemplate },//, cellTemplate: gridLinkCellTemplate },//cell edit false means you cant edit via uigrid
                { name: "MMITDS", displayName: this.languageService.languageConstants.get('Name'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }
                { name: "MLBANO", displayName: this.languageService.languageConstants.get('Lot'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }    
                { name: "MLWHSL", displayName: this.languageService.languageConstants.get('Location'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }    
                { name: "MLSTQT", displayName: this.languageService.languageConstants.get('Quantity'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }
                { name: "MLSTAS", displayName: this.languageService.languageConstants.get('Status Balance ID'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }
                { name: "MMUNMS", displayName: this.languageService.languageConstants.get('UOM'), enableCellEdit: false } //, cellTemplate: gridLinkCellTemplate }
            ];

            return inventoryItemListGrid;
        }


        public getInventoryItemLotListGrid(): IUIGrid {
            let inventoryItemLotListGrid: IUIGrid = angular.copy(this.baseGrid);
            let footerCellTemplateNumString = "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\">Sum: {{ ( col.getAggregationValue() CUSTOM_FILTERS ) | number:2 }}</div>";//cell template enables the hyperlink
            let gridLinkCellTemplate = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\"><span class=\"h5-link\" ng-click=\"grid.appScope.inventoryLabelModule.displayInventoryItemLabel(col.field, row.entity)\">{{COL_FIELD CUSTOM_FILTERS}}</span></div>";
            inventoryItemLotListGrid.columnDefs = [// numbers, quantity and currency should be right justified - headerCellClass:"text-right", cellClass:"text-right"
                { name: "REDA", displayName: this.languageService.languageConstants.get('Rect Date'), enableCellEdit: false, cellTemplate: gridLinkCellTemplate },//, cellTemplate: gridLinkCellTemplate },//cell edit false means you cant edit via uigrid
                { name: "BREF", displayName: this.languageService.languageConstants.get('Lot ref 1'), enableCellEdit: false },//, cellTemplate: gridLinkCellTemplate },//cell edit false means you cant edit via uigrid
                { name: "BRE2", displayName: this.languageService.languageConstants.get('Lot ref 2'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }
                { name: "RORN", displayName: this.languageService.languageConstants.get('Reference Order'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }    
            ];

            return inventoryItemLotListGrid;
        }
        //Address Label
        public getOpenDeliveryListGrid(): IUIGrid {
            let openDeliveryListGrid: IUIGrid = angular.copy(this.baseGrid);
            let footerCellTemplateNumString = "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\">Sum: {{ ( col.getAggregationValue() CUSTOM_FILTERS ) | number:2 }}</div>";//cell template enables the hyperlink
            let gridLinkCellTemplate = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\"><span class=\"h5-link\" ng-click=\"grid.appScope.addressLabelModule.displayOpenDeliveryLabel(col.field, row.entity)\">{{COL_FIELD CUSTOM_FILTERS}}</span></div>";
            openDeliveryListGrid.columnDefs = [// numbers, quantity and currency should be right justified - headerCellClass:"text-right", cellClass:"text-right"
                { name: "OQRIDN", displayName: this.languageService.languageConstants.get('Order Number'), enableCellEdit: false, cellTemplate: gridLinkCellTemplate },//, cellTemplate: gridLinkCellTemplate },//cell edit false means you cant edit via uigrid
                { name: "OQDLIX", displayName: this.languageService.languageConstants.get('Delivery Number'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }    
                { name: "OQCONA", displayName: this.languageService.languageConstants.get('Consignee'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }
                { name: "OKCUNM", displayName: this.languageService.languageConstants.get('Name'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }
                { name: "OQDSDT", displayName: this.languageService.languageConstants.get('Departure Date'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }    
                { name: "OQPGRS", displayName: this.languageService.languageConstants.get('Delivery Stat'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }
                { name: "OQPIST", displayName: this.languageService.languageConstants.get('Packing Stat'), enableCellEdit: false } //, cellTemplate: gridLinkCellTemplate }

            ];
            return openDeliveryListGrid;
        }


        public getDeliveryLineListGrid(): IUIGrid {
            let deliveryLineListGrid: IUIGrid = angular.copy(this.baseGrid);
            let footerCellTemplateNumString = "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\">Sum: {{ ( col.getAggregationValue() CUSTOM_FILTERS ) | number:2 }}</div>";//cell template enables the hyperlink
            let gridLinkCellTemplate = "<div class=\"ui-grid-cell-contents\" title=\"TOOLTIP\"><span class=\"h5-link\" ng-click=\"grid.appScope.addressLabelModule.displayOpenDeliveryLine(col.field, row.entity)\">{{COL_FIELD CUSTOM_FILTERS}}</span></div>";
            deliveryLineListGrid.columnDefs = [// numbers, quantity and currency should be right justified - headerCellClass:"text-right", cellClass:"text-right"
                { name: "URITNO", displayName: this.languageService.languageConstants.get('Item number'), enableCellEdit: false, cellTemplate: gridLinkCellTemplate },//, cellTemplate: gridLinkCellTemplate },//cell edit false means you cant edit via uigrid
                { name: "MMITDS", displayName: this.languageService.languageConstants.get('Name'), enableCellEdit: false },//, cellTemplate: gridLinkCellTemplate },//cell edit false means you cant edit via uigrid
                { name: "URTRQT", displayName: this.languageService.languageConstants.get('Trans Qty'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }
                { name: "URRIDL", displayName: this.languageService.languageConstants.get('Order Line'), enableCellEdit: false }, //, cellTemplate: gridLinkCellTemplate }

            ];

            return deliveryLineListGrid;
        }
        public getSampleGrid1(): IUIGrid {
            let sampleGrid1: IUIGrid = angular.copy(this.baseGrid);
            sampleGrid1.columnDefs = [
                { name: "division", displayName: this.languageService.languageConstants.get('Division') },
                { name: "payerNo", displayName: this.languageService.languageConstants.get('PayerNo'), headerCellClass: "text-right", cellClass: "text-right" },
                { name: "customerNo", displayName: this.languageService.languageConstants.get('CustomerNo'), headerCellClass: "text-right", cellClass: "text-right" },
                { name: "invoiceNo", displayName: this.languageService.languageConstants.get('InvoiceNo'), headerCellClass: "text-right", cellClass: "text-right" },
                {
                    name: "invoiceDate", displayName: this.languageService.languageConstants.get('InvoiceDate'), cellFilter: "m3Date:grid.appScope.appConfig.globalDateFormat",
                    filters: [{ condition: (searchTerm, cellValue) => { return this.$filter('m3DateFilter')(64, searchTerm, cellValue) }, placeholder: '> =' },
                        { condition: (searchTerm, cellValue) => { return this.$filter('m3DateFilter')(256, searchTerm, cellValue) }, placeholder: '< =' }]
                }];
            sampleGrid1.exporterCsvFilename = "sample_list.csv";
            sampleGrid1.exporterPdfFilename = "sample_list.pdf";
            sampleGrid1.saveSelection = false;
            return sampleGrid1;
        }

    }

}