var h5;
(function (h5) {
    var application;
    (function (application) {
        (function (MessageType) {
            MessageType[MessageType["Information"] = 0] = "Information";
            MessageType[MessageType["Warning"] = 1] = "Warning";
            MessageType[MessageType["Error"] = 2] = "Error";
        })(application.MessageType || (application.MessageType = {}));
        var MessageType = application.MessageType;
        var AppController = (function () {
            function AppController(scope, configService, appService, restService, storageService, gridService, userService, languageService, $uibModal, $interval, $timeout, $filter, $q, $window, formService, $location) {
                this.scope = scope;
                this.configService = configService;
                this.appService = appService;
                this.restService = restService;
                this.storageService = storageService;
                this.gridService = gridService;
                this.userService = userService;
                this.languageService = languageService;
                this.$uibModal = $uibModal;
                this.$interval = $interval;
                this.$timeout = $timeout;
                this.$filter = $filter;
                this.$q = $q;
                this.$window = $window;
                this.formService = formService;
                this.$location = $location;
                this.formatTime = function (statusBarItem) {
                    return statusBarItem.timestamp.getHours() + ':' + Odin.NumUtil.pad(statusBarItem.timestamp.getMinutes(), 2);
                };
                this.removeAt = function (index) {
                    if (index || index == 0) {
                        this.scope.statusBar.splice(this.scope.statusBar.length - 1 - index, 1);
                    }
                    this.scope.statusBarIsCollapsed = this.scope.statusBar.length == 0;
                };
                this.init();
            }
            AppController.prototype.init = function () {
                var _this = this;
                this.scope.appReady = false;
                this.scope.loadingData = false;
                this.scope.statusBar = [];
                this.scope.statusBarIsCollapsed = true;
                this.scope.statusBarVisible = true;
                this.scope.hasValidlicense = false;
                this.languageService.getAppLanguage().then(function (val) {
                    _this.scope.languageConstants = _this.languageService.languageConstants;
                    _this.initApplication();
                }, function (errorResponse) {
                    Odin.Log.error("Error getting language constants " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error getting language constants" + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
                this.scope.showSideNavLabel = false;
            };
            AppController.prototype.initApplication = function () {
                var _this = this;
                this.initGlobalConfig();
                this.initAppScope();
                this.initUIGrids();
                this.initScopeFunctions();
                console.log("-----------------initScopeFunctions ------ends----------");
                this.$timeout(function () { _this.scope.appReady = true; }, 5000);
            };
            AppController.prototype.initGlobalConfig = function () {
                var _this = this;
                this.configService.getGlobalConfig().then(function (configData) {
                    _this.scope.globalConfig = configData;
                    _this.initLanguage();
                    _this.initTheme();
                    _this.getUserContext();
                    if (_this.scope.appConfig.authorizedUser) {
                        _this.scope.showSideNavLabel = false;
                    }
                    _this.initModule();
                }, function (errorResponse) {
                    Odin.Log.error("Error while getting global configuration " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error while getting global configuration " + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.initAppScope = function () {
                this.scope.transactionStatus = {
                    appConfig: false
                };
                this.scope["errorMessages"] = [];
                this.scope.infiniteScroll = {
                    numToAdd: 20,
                    currentItems: 20
                };
                this.scope.themes = [
                    { themeId: 1, themeIcon: 'leanswiftchartreuse.png', themeName: "Theme1Name", panel: "panel-h5-theme-LC", navBar: "navbar-h5-theme-LC", sideNav: "sideNav-h5-theme-LC", button: "h5Button-h5-theme-LC", h5Grid: "h5Grid-h5-theme-LC", h5Dropdown: "h5Dropdown-h5-theme-LC", navTabs: "navtabs-h5-theme-LC", active: false, available: true },
                    { themeId: 2, themeIcon: 'royalinfor.png', themeName: "Theme2Name", panel: "panel-h5-theme-RI", navBar: "navbar-h5-theme-RI", sideNav: "sideNav-h5-theme-RI", button: "h5Button-h5-theme-RI", h5Grid: "h5Grid-h5-theme-RI", h5Dropdown: "h5Dropdown-h5-theme-RI", navTabs: "navtabs-h5-theme-RI", active: false, available: true },
                    { themeId: 3, themeIcon: 'summersmoothe.png', themeName: "Theme3Name", panel: "panel-h5-theme-SS", navBar: "navbar-h5-theme-SS", sideNav: "sideNav-h5-theme-SS", button: "h5Button-h5-theme-SS", h5Grid: "h5Grid-h5-theme-SS", h5Dropdown: "h5Dropdown-h5-theme-SS", navTabs: "navtabs-h5-theme-SS", active: false, available: true },
                    { themeId: 4, themeIcon: 'pumkinspice.png', themeName: "Theme4Name", panel: "panel-h5-theme-PS", navBar: "navbar-h5-theme-PS", sideNav: "sideNav-h5-theme-PS", button: "h5Button-h5-theme-PS", h5Grid: "h5Grid-h5-theme-PS", h5Dropdown: "h5Dropdown-h5-theme-PS", navTabs: "navtabs-h5-theme-PS", active: false, available: true },
                    { themeId: 5, themeIcon: 'visionimpared.png', themeName: "Theme5Name", panel: "panel-h5-theme-VI", navBar: "navbar-h5-theme-VI", sideNav: "sideNav-h5-theme-VI", button: "h5Button-h5-theme-VI", h5Grid: "h5Grid-h5-theme-VI", h5Dropdown: "h5Dropdown-h5-theme-VI", navTabs: "navtabs-h5-theme-VI", active: false, available: true },
                    { themeId: 6, themeIcon: 'lipstickjungle.png', themeName: "Theme6Name", panel: "panel-h5-theme-LJ", navBar: "navbar-h5-theme-LJ", sideNav: "sideNav-h5-theme-LJ", button: "h5Button-h5-theme-LJ", h5Grid: "h5Grid-h5-theme-LJ", h5Dropdown: "h5Dropdown-h5-theme-LJ", navTabs: "navtabs-h5-theme-LJ", active: false, available: true },
                    { themeId: 7, themeIcon: 'silverlining.png', themeName: "Theme7Name", panel: "panel-h5-theme-SL", navBar: "navbar-h5-theme-SL", sideNav: "sideNav-h5-theme-SL", button: "h5Button-h5-theme-SL", h5Grid: "h5Grid-h5-theme-SL", h5Dropdown: "h5Dropdown-h5-theme-SL", navTabs: "navtabs-h5-theme-SL", active: false, available: true },
                    { themeId: 8, themeIcon: 'steelclouds.png', themeName: "Theme8Name", panel: "panel-h5-theme-SC", navBar: "navbar-h5-theme-SC", sideNav: "sideNav-h5-theme-SC", button: "h5Button-h5-theme-SC", h5Grid: "h5Grid-h5-theme-SC", h5Dropdown: "h5Dropdown-h5-theme-SC", navTabs: "navtabs-h5-theme-SC", active: false, available: true }
                ];
                this.scope.textures = [
                    { textureId: 1, textureIcon: 'diamond.png', textureName: "Wallpaper1Name", appBG: "h5-texture-one", active: false, available: true },
                    { textureId: 2, textureIcon: 'grid.png', textureName: "Wallpaper2Name", appBG: "h5-texture-two", active: false, available: true },
                    { textureId: 3, textureIcon: 'linen.png', textureName: "Wallpaper3Name", appBG: "h5-texture-three", active: false, available: true },
                    { textureId: 4, textureIcon: 'tiles.png', textureName: "Wallpaper4Name", appBG: "h5-texture-four", active: false, available: true },
                    { textureId: 5, textureIcon: 'wood.png', textureName: "Wallpaper5Name", appBG: "h5-texture-five", active: false, available: true }
                ];
                this.scope.supportedLanguages = [{ officialTranslations: false, languageCode: "ar-AR", active: false, available: true }, { officialTranslations: false, languageCode: "cs-CZ", active: false, available: true },
                    { officialTranslations: false, languageCode: "da-DK", active: false, available: true }, { officialTranslations: false, languageCode: "de-DE", active: false, available: true },
                    { officialTranslations: false, languageCode: "el-GR", active: false, available: true }, { officialTranslations: true, languageCode: "en-US", active: true, available: true },
                    { officialTranslations: false, languageCode: "es-ES", active: false, available: true }, { officialTranslations: false, languageCode: "fi-FI", active: false, available: true },
                    { officialTranslations: true, languageCode: "fr-FR", active: false, available: true }, { officialTranslations: false, languageCode: "he-IL", active: false, available: true },
                    { officialTranslations: false, languageCode: "hu-HU", active: false, available: true }, { officialTranslations: false, languageCode: "it-IT", active: false, available: true },
                    { officialTranslations: false, languageCode: "ja-JP", active: false, available: true }, { officialTranslations: false, languageCode: "nb-NO", active: false, available: true },
                    { officialTranslations: false, languageCode: "nl-NL", active: false, available: true }, { officialTranslations: false, languageCode: "pl-PL", active: false, available: true },
                    { officialTranslations: false, languageCode: "pt-PT", active: false, available: true }, { officialTranslations: false, languageCode: "ru-RU", active: false, available: true },
                    { officialTranslations: true, languageCode: "sv-SE", active: false, available: true }, { officialTranslations: false, languageCode: "tr-TR", active: false, available: true },
                    { officialTranslations: false, languageCode: "zh-CN", active: false, available: true }, { officialTranslations: false, languageCode: "ta-IN", active: false, available: true }
                ];
                this.scope.views = {
                    h5Application: { url: "views/Application.html" },
                    selection: { url: "views/Selection.html" },
                    MOLabelModule: { url: "views/MOLabelModule.html" },
                    InventoryLabelModule: { url: "views/InventoryLabelModule.html" },
                    AddressLabelModule: { url: "views/AddressLabelModule.html" },
                    errorModule: { url: "views/Error.html" }
                };
                this.scope.modules = [
                    { moduleId: 1, activeIcon: 'SampleModule1.png', inactiveIcon: 'SampleModule1-na.png', heading: 'MO Label Module', content: this.scope.views.MOLabelModule.url, active: true, available: true },
                    { moduleId: 2, activeIcon: 'SampleModule1.png', inactiveIcon: 'SampleModule1-na.png', heading: 'Inventory Label Module', content: this.scope.views.InventoryLabelModule.url, active: true, available: true },
                    { moduleId: 3, activeIcon: 'SampleModule1.png', inactiveIcon: 'SampleModule1-na.png', heading: 'Address Label Module', content: this.scope.views.AddressLabelModule.url, active: true, available: true }
                ];
                this.scope.appConfig = {};
                this.scope.userContext = new M3.UserContext();
                this.scope["dateRef"] = new Date();
                this.initGlobalSelection();
                this.initMOLabelModule();
                this.initInventoryLabelModule();
                this.initAddressLabelModule();
            };
            AppController.prototype.initGlobalSelection = function () {
                this.scope.globalSelection = {
                    reload: true,
                    transactionStatus: {
                        warehouseList: false,
                        printerData: false,
                        printer: false,
                        MOList: false,
                        MOLabel: false,
                        inventoryItemList: false,
                        inventoryItemLotList: false,
                        inventoryLabel: false,
                        openDeliveryList: false,
                        deliveryLineList: false,
                        addressLabel: false,
                        item: false,
                        defaultPrinter: false
                    },
                    warehouseList: [],
                    warehouse: {},
                    printerData: [],
                    printer: {},
                    defaultPrinter: {},
                    MOList: [],
                    MO: {},
                    MOLabel: {},
                    inventoryItemList: {},
                    inventoryItemLotList: {},
                    inventoryItem: {},
                    inventoryLabel: {},
                    openDeliveryList: {},
                    deliveryLineList: {},
                    openDelivery: {},
                    addressLabel: {},
                    item: {},
                    printerExists: false
                };
            };
            AppController.prototype.initMOLabelModule = function () {
                this.scope.MOLabelModule = {
                    reload: true,
                    transactionStatus: {
                        facilityList: false,
                        MOList: false,
                        sfx: false,
                        itemAltWeight: false,
                        tradeNames: false,
                        workCenters: false,
                        labelTypeList: false
                    },
                    facilityList: [],
                    facility: {},
                    MOList: [],
                    MOListGrid: {},
                    selectedMOLabelListRow: {},
                    selectedMOLabelItem: {},
                    labelTypeList: {},
                    labelType: {},
                    tradeNames: {},
                    workCenters: {},
                    workCenter: {},
                    tradeName: {},
                    printMOLabel: {},
                    MOLabelExists: false,
                    suffixExists: false,
                    sfx: {},
                    itemAltWeight: {},
                    netNotLargerThanGross: false
                };
            };
            AppController.prototype.initInventoryLabelModule = function () {
                this.scope.inventoryLabelModule = {
                    reload: true,
                    transactionStatus: {
                        warehouseList: false,
                        InventoryList: false,
                        sfx: false,
                        itemAltWeight: false,
                        inventoryLabel: false
                    },
                    warehouseList: [],
                    warehouse: {},
                    itemNumber: {},
                    location: {},
                    inventoryItemList: [],
                    inventoryItemListGrid: {},
                    selectedInventoryItemListRow: {},
                    selectedInventoryItem: {},
                    inventoryItemLotList: [],
                    inventoryItemLotListGrid: {},
                    selectedInventoryItemLotListRow: {},
                    selectedInventoryItemLot: {},
                    printInventoryLabel: {},
                    inventoryLabelExists: false,
                    suffixExists: false,
                    sfx: {},
                    itemAltWeight: {}
                };
            };
            AppController.prototype.initAddressLabelModule = function () {
                this.scope.addressLabelModule = {
                    reload: true,
                    transactionStatus: {
                        warehouseList: false,
                        AddressList: false,
                        addressLabel: false
                    },
                    warehouseList: [],
                    warehouse: {},
                    deliveryNumber: {},
                    itemNumber: {},
                    orderNumber: {},
                    orderLine: {},
                    lineSfx: {},
                    popn: {},
                    cuor: {},
                    openDeliveryList: [],
                    openDeliveryListGrid: {},
                    selectedOpenDeliveryListRow: {},
                    selectedOpenDelivery: {},
                    deliveryLineList: [],
                    deliveryLineListGrid: {},
                    selectedOpenDeliveryLotListRow: {},
                    selectedOpenDeliveryLot: {},
                    printAddressLabel: {},
                };
            };
            AppController.prototype.initApplicationConstants = function () {
            };
            AppController.prototype.initScopeFunctions = function () {
                var _this = this;
                console.log("-----------------initScopeFunctions----------------");
                this.scope.MOLabelModule.displayMOLabel = function (fieldName, rowEntity) { _this.displayMOLabel(fieldName, rowEntity); };
                this.scope.inventoryLabelModule.displayInventoryItemLot = function (fieldName, rowEntity) { _this.displayInventoryItemLot(fieldName, rowEntity); };
                this.scope.inventoryLabelModule.displayInventoryItemLabel = function (fieldName, rowEntity) { _this.displayInventoryItemLabel(fieldName, rowEntity); };
                this.scope.addressLabelModule.displayOpenDeliveryLabel = function (fieldName, rowEntity) { _this.displayOpenDeliveryLabel(fieldName, rowEntity); };
                this.scope.addressLabelModule.displayOpenDeliveryLine = function (fieldName, rowEntity) { _this.displayOpenDeliveryLine(fieldName, rowEntity); };
            };
            AppController.prototype.initUIGrids = function () {
                this.scope.MOLabelModule.MOListGrid = this.gridService.getMOListGrid();
                this.scope.inventoryLabelModule.inventoryItemListGrid = this.gridService.getInventoryItemListGrid();
                this.scope.inventoryLabelModule.inventoryItemLotListGrid = this.gridService.getInventoryItemLotListGrid();
                this.scope.addressLabelModule.openDeliveryListGrid = this.gridService.getOpenDeliveryListGrid();
                this.scope.addressLabelModule.deliveryLineListGrid = this.gridService.getDeliveryLineListGrid();
                this.initUIGridsOnRegisterApi();
            };
            AppController.prototype.initUIGridsOnRegisterApi = function () {
                var _this = this;
                this.scope.MOLabelModule.MOListGrid.onRegisterApi = function (gridApi) {
                    _this.gridService.adjustMOGridHeight("MOListGrid", _this.scope.MOLabelModule.MOListGrid.data.length, 500);
                    gridApi.core.on.renderingComplete(_this.scope, function (handler) { _this.gridService.restoreGridState("MOListGrid", gridApi); });
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("MOListGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("MOListGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("MOListGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("MOListGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("MOListGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.gridService.saveGridState("MOListGrid", gridApi);
                    });
                    gridApi.selection.on.rowSelectionChangedBatch(_this.scope, function (row) {
                        _this.gridService.saveGridState("MOListGrid", gridApi);
                    });
                };
                this.scope.inventoryLabelModule.inventoryItemListGrid.onRegisterApi = function (gridApi) {
                    _this.gridService.adjustInventoryItemGridHeight("inventoryItemListGrid", _this.scope.inventoryLabelModule.inventoryItemListGrid.data.length, 500);
                    gridApi.core.on.renderingComplete(_this.scope, function (handler) { _this.gridService.restoreGridState("inventoryItemListGrid", gridApi); });
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("inventoryItemListGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("inventoryItemListGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("inventoryItemListGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("inventoryItemListGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("inventoryItemListGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.gridService.saveGridState("inventoryItemListGrid", gridApi);
                    });
                    gridApi.selection.on.rowSelectionChangedBatch(_this.scope, function (row) {
                        _this.gridService.saveGridState("inventoryItemListGrid", gridApi);
                    });
                };
                this.scope.inventoryLabelModule.inventoryItemLotListGrid.onRegisterApi = function (gridApi) {
                    _this.gridService.adjustInventoryItemGridHeight("inventoryItemLotListGrid", _this.scope.inventoryLabelModule.inventoryItemLotListGrid.data.length, 500);
                    gridApi.core.on.renderingComplete(_this.scope, function (handler) { _this.gridService.restoreGridState("inventoryItemLotListGrid", gridApi); });
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("inventoryItemLotListGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("inventoryItemLotListGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("inventoryItemLotListGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("inventoryItemLotListGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("inventoryItemLotListGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.gridService.saveGridState("inventoryItemLotListGrid", gridApi);
                    });
                    gridApi.selection.on.rowSelectionChangedBatch(_this.scope, function (row) {
                        _this.gridService.saveGridState("inventoryItemLotListGrid", gridApi);
                    });
                };
                this.scope.addressLabelModule.openDeliveryListGrid.onRegisterApi = function (gridApi) {
                    _this.gridService.adjustOpenDeliveryGridHeight("openDeliveryListGrid", _this.scope.addressLabelModule.openDeliveryListGrid.data.length, 500);
                    gridApi.core.on.renderingComplete(_this.scope, function (handler) { _this.gridService.restoreGridState("openDeliveryListGrid", gridApi); });
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("openDeliveryListGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("openDeliveryListGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("openDeliveryListGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("openDeliveryListGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("openDeliveryListGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.gridService.saveGridState("openDeliveryListGrid", gridApi);
                    });
                    gridApi.selection.on.rowSelectionChangedBatch(_this.scope, function (row) {
                        _this.gridService.saveGridState("openDeliveryListGrid", gridApi);
                    });
                };
                this.scope.addressLabelModule.deliveryLineListGrid.onRegisterApi = function (gridApi) {
                    _this.gridService.adjustOpenDeliveryGridHeight("deliveryLineListGrid", _this.scope.addressLabelModule.deliveryLineListGrid.data.length, 500);
                    gridApi.core.on.renderingComplete(_this.scope, function (handler) { _this.gridService.restoreGridState("deliveryLineListGrid", gridApi); });
                    gridApi.core.on.sortChanged(_this.scope, function (handler) { _this.gridService.saveGridState("deliveryLineListGrid", gridApi); });
                    gridApi.core.on.columnVisibilityChanged(_this.scope, function (handler) { _this.gridService.saveGridState("deliveryLineListGrid", gridApi); });
                    gridApi.core.on.filterChanged(_this.scope, function (handler) { _this.gridService.saveGridState("deliveryLineListGrid", gridApi); });
                    gridApi.colMovable.on.columnPositionChanged(_this.scope, function (handler) { _this.gridService.saveGridState("deliveryLineListGrid", gridApi); });
                    gridApi.colResizable.on.columnSizeChanged(_this.scope, function (handler) { _this.gridService.saveGridState("deliveryLineListGrid", gridApi); });
                    gridApi.cellNav.on.viewPortKeyDown(_this.scope, function (event) {
                        if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                            var cells = gridApi.cellNav.getCurrentSelection();
                            _this.copyCellContentToClipBoard(cells);
                        }
                    });
                    gridApi.selection.on.rowSelectionChanged(_this.scope, function (row) {
                        _this.gridService.saveGridState("deliveryLineListGrid", gridApi);
                    });
                    gridApi.selection.on.rowSelectionChangedBatch(_this.scope, function (row) {
                        _this.gridService.saveGridState("deliveryLineListGrid", gridApi);
                    });
                };
            };
            AppController.prototype.resetUIGridsColumnDefs = function () {
            };
            AppController.prototype.initTheme = function () {
                var _this = this;
                var themeId = this.storageService.getLocalData('h5.app.appName.theme.selected');
                var textureId = this.storageService.getLocalData('h5.app.appName.texture.selected');
                themeId = angular.isNumber(themeId) ? themeId : angular.isNumber(this.scope.globalConfig.defaultThemeId) ? this.scope.globalConfig.defaultThemeId : 1;
                textureId = angular.isNumber(textureId) ? textureId : angular.isNumber(this.scope.globalConfig.defaultTextureId) ? this.scope.globalConfig.defaultTextureId : 1;
                this.themeSelected(themeId);
                this.textureSelected(textureId);
                this.scope.themes.forEach(function (theme) {
                    if (_this.scope.globalConfig.excludeThemes.indexOf(theme.themeId) > -1) {
                        theme.available = false;
                    }
                    else {
                        theme.available = true;
                    }
                });
                this.scope.textures.forEach(function (texture) {
                    if (_this.scope.globalConfig.excludeWallpapers.indexOf(texture.textureId) > -1) {
                        texture.available = false;
                    }
                    else {
                        texture.available = true;
                    }
                });
            };
            AppController.prototype.initModule = function () {
                var _this = this;
                console.log("initModule------- ->>>>>>>>>>>>>  ");
                var moduleId = this.storageService.getLocalData('h5.app.appName.module.selected');
                moduleId = angular.isNumber(moduleId) ? moduleId : 1;
                this.scope.activeModule = moduleId;
                this.scope.modules.forEach(function (appmodule) {
                    if (angular.equals(moduleId, appmodule.moduleId)) {
                        appmodule.active = true;
                    }
                    else {
                        appmodule.active = false;
                    }
                    if (_this.scope.globalConfig.excludeModules.indexOf(appmodule.moduleId) > -1) {
                        appmodule.available = false;
                    }
                    else {
                        appmodule.available = true;
                    }
                });
            };
            AppController.prototype.initLanguage = function () {
                var _this = this;
                var languageCode = this.storageService.getLocalData('h5.app.appName.language.selected');
                languageCode = angular.isString(languageCode) ? languageCode : angular.isString(this.scope.globalConfig.defaultLanguage) ? this.scope.globalConfig.defaultLanguage : "en-US";
                this.scope.currentLanguage = languageCode;
                if (!angular.equals(this.scope.currentLanguage, "en-US")) {
                    this.languageService.changeAppLanguage(languageCode).then(function (val) {
                        _this.resetUIGridsColumnDefs();
                    }, function (errorResponse) {
                        Odin.Log.error("Error getting language " + errorResponse);
                        _this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                }
                this.scope.supportedLanguages.forEach(function (language) {
                    if (angular.equals(language.languageCode, languageCode)) {
                        language.active = true;
                    }
                    else {
                        language.active = false;
                    }
                    if (_this.scope.globalConfig.excludeLanguages.indexOf(language.languageCode) > -1) {
                        language.available = false;
                    }
                    else {
                        language.available = true;
                    }
                });
            };
            AppController.prototype.themeSelected = function (themeId) {
                var _this = this;
                this.scope.themes.forEach(function (theme) {
                    if (angular.equals(theme.themeId, themeId)) {
                        theme.active = true;
                        _this.scope.theme = theme;
                    }
                    else {
                        theme.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.theme.selected', themeId);
            };
            AppController.prototype.textureSelected = function (textureId) {
                var _this = this;
                this.scope.textures.forEach(function (texture) {
                    if (angular.equals(texture.textureId, textureId)) {
                        texture.active = true;
                        _this.scope.texture = texture;
                    }
                    else {
                        texture.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.texture.selected', textureId);
            };
            AppController.prototype.getUserContext = function () {
                var _this = this;
                Odin.Log.debug("is H5 " + this.userService.isH5() + " is Iframe " + Odin.Util.isIframe());
                this.scope.loadingData = true;
                this.userService.getUserContext().then(function (val) {
                    _this.scope.userContext = val;
                    _this.loadGlobalData();
                }, function (reason) {
                    Odin.Log.error("Can't get user context from h5 due to " + reason.errorMessage);
                    _this.scope.statusBar.push({ message: "Can't get user context from h5 " + [reason.errorMessage], statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    _this.showError("Can't get user context from h5 ", [reason.errorMessage]);
                    _this.loadGlobalData();
                });
            };
            AppController.prototype.launchM3Program = function (link) {
                Odin.Log.debug("H5 link to launch -->" + link);
                this.formService.launch(link);
            };
            AppController.prototype.mapKeyUp = function (event) {
                if (event.keyCode === 115) {
                    this.loadApplicationData();
                }
            };
            AppController.prototype.addMoreItemsToScroll = function () {
                this.scope.infiniteScroll.currentItems += this.scope.infiniteScroll.numToAdd;
            };
            ;
            AppController.prototype.copyCellContentToClipBoard = function (cells) {
                var hiddenTextArea = angular.element(document.getElementById("gridClipboard"));
                hiddenTextArea.val("");
                var textToCopy = '', rowId = cells[0].row.uid;
                cells.forEach(function (cell) {
                    textToCopy = textToCopy == '' ? textToCopy : textToCopy + ",";
                    var cellValue = cell.row.entity[cell.col.name];
                    if (angular.isDefined(cellValue)) {
                        if (cell.row.uid !== rowId) {
                            textToCopy += '\n';
                            rowId = cell.row.uid;
                        }
                        textToCopy += cellValue;
                    }
                });
                hiddenTextArea.val(textToCopy);
                hiddenTextArea.select();
            };
            AppController.prototype.openMOLabelModal = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/MOLabelModal.html",
                    size: "lg",
                    scope: this.scope,
                    backdrop: "static"
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openInventoryLabelModal = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/InventoryLabelModal.html",
                    size: "lg",
                    scope: this.scope,
                    backdrop: "static"
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openAddressLabelModal = function () {
                console.log("openAddressLabelModal");
                var options = {
                    animation: true,
                    templateUrl: "views/AddressLabelModal.html",
                    size: "md",
                    scope: this.scope,
                    backdrop: "static"
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openAboutPage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/About.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeThemePage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeThemeModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeWallpaperPage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeWallpaperModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.openChangeAppLanguagePage = function () {
                var options = {
                    animation: true,
                    templateUrl: "views/ChangeLanguageModal.html",
                    size: "md",
                    scope: this.scope
                };
                this.scope.modalWindow = this.$uibModal.open(options);
            };
            AppController.prototype.changeAppLanguage = function (languageCode) {
                var _this = this;
                this.scope.supportedLanguages.forEach(function (language) {
                    if (angular.equals(language.languageCode, languageCode)) {
                        language.active = true;
                        _this.scope.currentLanguage = languageCode;
                    }
                    else {
                        language.active = false;
                    }
                });
                this.languageService.changeAppLanguage(languageCode).then(function (val) {
                    _this.scope.appReady = false;
                    _this.closeModalWindow();
                    _this.resetUIGridsColumnDefs();
                    _this.$timeout(function () { _this.scope.appReady = true; }, 1000);
                }, function (errorResponse) {
                    Odin.Log.error("Error getting language " + errorResponse);
                    _this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
                this.storageService.setLocalData('h5.app.appName.language.selected', languageCode);
            };
            AppController.prototype.closeModalWindow = function () {
                this.scope.modalWindow.close("close");
            };
            AppController.prototype.statusBarClose = function () {
                this.scope.statusBarIsCollapsed = true;
                this.scope.statusBar = [];
            };
            AppController.prototype.parseError = function (errorResponse) {
                var error = "Error occurred while processing below request(s)";
                var errorMessages = this.scope["errorMessages"];
                var errorMessage = "Request URL: " + errorResponse.config.url + ", Status: " + errorResponse.status +
                    " (" + errorResponse.statusText + ")";
                if (angular.isObject(errorResponse.data) && angular.isObject(errorResponse.data.eLink)) {
                    errorMessage = errorMessage + ", Error : " + errorResponse.data.eLink.code + " (" + errorResponse.data.eLink.message + ") ";
                    if (angular.isString(errorResponse.data.eLink.details)) {
                        errorMessage = errorMessage + errorResponse.data.eLink.details;
                    }
                }
                if (errorMessages.indexOf(errorMessage) == -1) {
                    errorMessages.push(errorMessage);
                }
                this.showError(error, errorMessages);
                this.scope.statusBar.push({ message: error + " " + errorMessages, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
            };
            AppController.prototype.openDatepicker = function () {
                this.scope.globalSelection.inventoryLabel.REDAOpen = true;
            };
            ;
            AppController.prototype.showError = function (error, errorMessages) {
                var _this = this;
                this.scope["hasError"] = true;
                this.scope["error"] = error;
                this.scope["errorMessages"] = errorMessages;
                if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
                }
                this.scope["destroyErrMsgTimer"] = this.$timeout(function () { _this.hideError(); }, 30000);
            };
            AppController.prototype.hideError = function () {
                this.scope["hasError"] = false;
                this.scope["error"] = null;
                this.scope["errorMessages"] = [];
                this.scope["destroyErrMsgTimer"] = undefined;
            };
            AppController.prototype.showWarning = function (warning, warningMessages) {
                var _this = this;
                this.scope["hasWarning"] = true;
                this.scope["warning"] = warning;
                this.scope["warningMessages"] = warningMessages;
                if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
                }
                this.scope["destroyWarnMsgTimer"] = this.$timeout(function () { _this.hideWarning(); }, 10000);
            };
            AppController.prototype.hideWarning = function () {
                this.scope["hasWarning"] = false;
                this.scope["warning"] = null;
                this.scope["warningMessages"] = null;
                this.scope["destroyWarnMsgTimer"] = undefined;
            };
            AppController.prototype.showInfo = function (info, infoMessages) {
                var _this = this;
                this.scope["hasInfo"] = true;
                this.scope["info"] = info;
                this.scope["infoMessages"] = infoMessages;
                if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                    this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
                }
                this.scope["destroyInfoMsgTimer"] = this.$timeout(function () { _this.hideInfo(); }, 10000);
            };
            AppController.prototype.hideInfo = function () {
                this.scope["hasInfo"] = false;
                this.scope["info"] = null;
                this.scope["infoMessages"] = null;
                this.scope["destroyInfoMsgTimer"] = undefined;
            };
            AppController.prototype.loadGlobalData = function () {
                var _this = this;
                var userContext = this.scope.userContext;
                var globalConfig = this.scope.globalConfig;
                this.loadAppConfig(userContext.company, userContext.division, userContext.m3User, globalConfig.environment).then(function (val) {
                    if (_this.scope.appConfig.authorizedUser === true) {
                        console.log("authorized");
                        _this.loadPrinterList();
                        _this.loadWarehouseList(userContext.company);
                        _this.getPrinter(userContext.m3User);
                        _this.loadData(_this.scope.activeModule);
                        _this.loadDefaultFields();
                        _this.hideWarning();
                    }
                    else {
                        console.log("NOT authorized");
                        window.alert("NOT Authorized, Please Contact Security");
                    }
                });
            };
            AppController.prototype.loadDefaultFields = function () {
                var userContext = this.scope.userContext;
                var appConfig = this.scope.appConfig;
                var facility = angular.isString(appConfig.searchQuery.faci) ? appConfig.searchQuery.faci : userContext.FACI;
                this.scope.MOLabelModule.facility = { selected: facility };
                this.loadFacilityList(userContext.company, userContext.division);
                var warehouse = angular.isString(appConfig.searchQuery.whlo) ? appConfig.searchQuery.whlo : userContext.WHLO;
                this.scope.inventoryLabelModule.warehouse = { selected: warehouse };
                this.loadWarehouseList(userContext.company);
                this.scope.addressLabelModule.warehouse = { selected: warehouse };
                this.scope.globalSelection.addressLabel.warehouse = { selected: warehouse };
            };
            AppController.prototype.loadApplicationData = function () {
                console.log("loadApplicationData------- ->>>>>>>>>>>>>  ");
                var categories = ['globalSelection', 'MOLabelModule'];
                this.clearData(categories);
                this.resetReloadStatus();
                this.getPrinter(this.scope.userContext.m3User);
                var userPrinter = this.scope.globalSelection.defaultPrinter;
                var selectedPrinter = this.scope.globalSelection.printer.selected.DEV;
                if ((userPrinter === "")) {
                    console.log("I DO NOT HAVE A PRINTER------------------------------------>>>>>>>>>>>>>  " + selectedPrinter);
                }
                else {
                    console.log("I HAVE A PRINTER------------------------------------>>>>>>>>>>>>>  " + userPrinter);
                }
                console.log("userPrinter ------------------------------------>>>>>>>>>>>>>  " + userPrinter);
                console.log("selectedPrinter ------------------------------------>>>>>>>>>>>>>  " + selectedPrinter);
                this.loadData(this.scope.activeModule);
            };
            AppController.prototype.clearData = function (categories) {
                var _this = this;
                categories.forEach(function (category) {
                    if (category == "globalSelection") {
                    }
                    if (category == "MOLabelModule") {
                        _this.scope.MOLabelModule.MOList = [];
                    }
                    if (category == "inventoryLabelModule") {
                        _this.scope.inventoryLabelModule.inventoryItemList = [];
                    }
                });
            };
            AppController.prototype.resetReloadStatus = function () {
                this.scope.MOLabelModule.reload = true;
                this.scope.inventoryLabelModule.reload = true;
            };
            AppController.prototype.moduleSelected = function (moduleId) {
                this.scope.activeModule = moduleId;
                this.scope.modules.forEach(function (appmodule) {
                    if (angular.equals(moduleId, appmodule.moduleId)) {
                        appmodule.active = true;
                    }
                    else {
                        appmodule.active = false;
                    }
                });
                this.storageService.setLocalData('h5.app.appName.module.selected', moduleId);
                this.loadData(this.scope.activeModule);
            };
            AppController.prototype.loadData = function (activeModule) {
                this.refreshTransactionStatus();
                switch (activeModule) {
                    case 1:
                        this.loadMOLabelModule(this.scope.MOLabelModule.reload);
                        break;
                    case 2:
                        this.loadInventoryLabelModule(this.scope.inventoryLabelModule.reload);
                        break;
                    case 3:
                        this.loadAddressLabelModule(this.scope.addressLabelModule.reload);
                        break;
                    case 4:
                        break;
                }
            };
            AppController.prototype.refreshTransactionStatus = function () {
                console.log("refreshTransactionStatus ");
                var isLoading = false;
                for (var transaction in this.scope.transactionStatus) {
                    var value = this.scope.transactionStatus[transaction];
                    if (value == true) {
                        isLoading = true;
                        break;
                    }
                }
                for (var transaction in this.scope.globalSelection.transactionStatus) {
                    var value = this.scope.globalSelection.transactionStatus[transaction];
                    if (value == true) {
                        isLoading = true;
                        break;
                    }
                }
                this.scope.loadingData = isLoading;
                if (isLoading) {
                    return;
                }
                switch (this.scope.activeModule) {
                    case 1:
                        for (var transaction in this.scope.MOLabelModule.transactionStatus) {
                            var value = this.scope.MOLabelModule.transactionStatus[transaction];
                            if (value == true) {
                                isLoading = true;
                                break;
                            }
                        }
                        this.scope.loadingData = isLoading;
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                }
            };
            AppController.prototype.loadAppConfig = function (company, division, user, environment) {
                var _this = this;
                var deferred = this.$q.defer();
                this.scope.appConfig = this.scope.globalConfig.appConfig;
                this.scope.appConfig.searchQuery = this.$location.search();
                this.scope.appConfig.enableM3Authority = true;
                if (this.scope.appConfig.enableM3Authority) {
                    this.scope.loadingData = true;
                    this.scope.transactionStatus.appConfig = true;
                    var programName = "LBZ100";
                    var promise1 = this.appService.getAuthority(company, division, user, programName, 1).then(function (result) {
                        _this.scope.appConfig.authorizedUser = result;
                    });
                    var promises = [promise1];
                    this.$q.all(promises).finally(function () {
                        deferred.resolve(_this.scope.appConfig);
                        _this.scope.transactionStatus.appConfig = false;
                        _this.refreshTransactionStatus();
                    });
                }
                else {
                    deferred.resolve(this.scope.appConfig);
                }
                return deferred.promise;
            };
            AppController.prototype.filterZSYTAB = function (fileName, val) {
                var filteredValues = [];
                val.items.forEach(function (value) {
                    if (value.KPID === fileName) {
                        filteredValues.push(value);
                    }
                });
                return filteredValues;
            };
            AppController.prototype.filterList = function (filterString, val) {
                console.log("console.log(filteredValues.items);------------------------------------->>>>>>>>>>>>>>" + filterString);
                var filteredValues = [];
                val.items.forEach(function (value) {
                    if (value.ITNO === filterString) {
                        filteredValues.push(value);
                    }
                });
                return filteredValues;
            };
            AppController.prototype.loadPrinterList = function () {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.printerData = true;
                this.appService.lstPrinters().then(function (val) {
                    _this.scope.globalSelection.printerData = val.items;
                    _this.scope.globalSelection.printer.selected = val.items[0];
                    _this.scope.globalSelection.transactionStatus.printerData = false;
                    _this.scope.globalSelection.printerExists = true;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.printerData = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.getPrinter = function (user) {
                var _this = this;
                var printer = "";
                this.appService.getUserPrinter(user).then(function (val1) {
                    _this.scope.globalSelection.defaultPrinter = val1.items[0].DEV + "";
                    _this.scope.globalSelection.printer.selected = val1.items[0].DEV + "";
                    _this.scope.globalSelection.transactionStatus.defaultPrinter = false;
                    _this.refreshTransactionStatus();
                    printer = val1.item.DEV;
                }, function (err) {
                    _this.appService.addPrintFile(user, "").then(function (val) {
                        console.log("------------------------------I ADDED PRINTER " + printer);
                    }, function (err) {
                        var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.refreshTransactionStatus();
                    });
                });
                return printer;
            };
            AppController.prototype.loadMOList = function (facility) {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.globalSelection.MOList = true;
                this.appService.getMOList(facility).then(function (val) {
                    _this.scope.globalSelection.MOList = val.items;
                    _this.scope.MOLabelModule.MOListGrid.data = val.items;
                    _this.gridService.adjustMOGridHeight("MOListGrid", val.items.length, 1000);
                    _this.scope.globalSelection.transactionStatus.MOList = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.MOList = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.loadInventoryItemList = function (warehouse) {
                var _this = this;
                console.log(warehouse);
                this.scope.loadingData = true;
                this.scope.globalSelection.inventoryItemList = true;
                this.appService.getInventoryItemList(warehouse).then(function (val) {
                    _this.scope.globalSelection.inventoryItemList = val.items;
                    console.log(val.items);
                    _this.scope.inventoryLabelModule.inventoryItemListGrid.data = val.items;
                    _this.gridService.adjustInventoryItemGridHeight("inventoryItemListGrid", val.items.length, 500);
                    _this.scope.globalSelection.transactionStatus.inventoryItemList = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.inventoryItemList = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.loadInventoryItemLotList = function (itemNumber) {
                var _this = this;
                console.log(itemNumber);
                this.scope.loadingData = true;
                this.scope.globalSelection.inventoryItemLotList = true;
                this.appService.getInventoryItemLotList(itemNumber).then(function (val) {
                    var filteredValues = _this.filterList(itemNumber, val);
                    _this.scope.globalSelection.inventoryItemLotList = val.items;
                    console.log("console.log(filteredValues.items);------------------------------------->>>>>>>>>>>>>>" + itemNumber);
                    console.log(filteredValues.items);
                    _this.scope.inventoryLabelModule.inventoryItemLotListGrid.data = val.items;
                    _this.gridService.adjustInventoryItemGridHeight("inventoryItemLotListGrid", val.items.length, 500);
                    _this.scope.globalSelection.transactionStatus.inventoryItemLotList = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.inventoryItemLotList = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.loadOpenDeliveryLotList = function (deliveryNumber) {
                var _this = this;
                console.log("loadOpenDeliveryLotList------------------------------------->>>>>>>>>>>>>>");
                this.scope.loadingData = true;
                var trqt = "";
                this.scope.globalSelection.deliveryLineList = true;
                var count = 0;
                this.scope.userContext.dateFormat;
                this.appService.getDeliveryLineList(deliveryNumber).then(function (val) {
                    _this.scope.globalSelection.deliveryLineList = val.items;
                    _this.scope.addressLabelModule.orderLine = val.item.RIDL;
                    val.items.forEach(function (value) {
                        trqt = value.URTRQT;
                        val.items[count].URTRQT = trqt.substring(0, (trqt.length - 4));
                        count++;
                    });
                    _this.scope.addressLabelModule.deliveryLineListGrid.data = val.items;
                    _this.gridService.adjustOpenDeliveryGridHeight("deliveryLineListGrid", val.items.length, 500);
                    _this.scope.globalSelection.transactionStatus.deliveryLineList = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.deliveryLineList = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.loadOpenDeliveryList = function (warehouse) {
                var _this = this;
                console.log("____________________loadOpenDeliveryList______________________");
                var count = 0;
                this.scope.loadingData = true;
                this.scope.globalSelection.openDeliveryList = true;
                this.appService.getOpenDeliveryList(warehouse).then(function (val) {
                    _this.scope.globalSelection.openDeliveryList = val.items;
                    console.log(val);
                    val.items.forEach(function (value) {
                        val.items[count].OQDSDT = _this.formatDatePerUserSetting(value.OQDSDT);
                        if (value.OKCUNM === "") {
                            val.items[count].OKCUNM = value.OACONM;
                        }
                        count++;
                    });
                    _this.scope.addressLabelModule.openDeliveryListGrid.data = val.items;
                    _this.gridService.adjustOpenDeliveryGridHeight("openDeliveryListGrid", val.items.length, 500);
                    _this.scope.globalSelection.transactionStatus.openDeliveryList = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.openDeliveryList = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.loadItem = function (itemNumber) {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.item = true;
                this.appService.getItem(itemNumber).then(function (val) {
                    _this.scope.globalSelection.item = val.items;
                    _this.scope.globalSelection.transactionStatus.item = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.item = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.displayMOLabel = function (fieldName, selectedRow) {
                this.scope.MOLabelModule.selectedMOLabelListRow = selectedRow;
                var MOLabel = selectedRow;
                this.loadMOLabel(this.scope.MOLabelModule.facility.selected, MOLabel.VHMFNO, MOLabel.VHITNO, MOLabel.VHWHLO, MOLabel.MMITDS, MOLabel.VHPLGR, MOLabel.MMSPE5, MOLabel.MMUNMS, "", MOLabel.MMSPE2, MOLabel.MMSPE3, MOLabel.MMEVGR, "", MOLabel.VHBANO, "1", MOLabel.VHORQT, MOLabel.VHMAUN);
                this.loadLabelTypeList();
                this.loadTradeNames();
                this.loadWorkCenters(this.scope.MOLabelModule.facility.selected);
                this.netGrossCheck();
                this.openMOLabelModal();
            };
            AppController.prototype.displayInventoryItemLabel = function (fieldName, selectedRow) {
                this.scope.inventoryLabelModule.selectedInventoryItemLotListRow = selectedRow;
                var itemLot = selectedRow;
                var item = this.scope.inventoryLabelModule.selectedInventoryItemListRow;
                this.loadInventoryLabel(item.MLWHLO, itemLot.ITNO, item.MMITDS, itemLot.BANO, itemLot.REDA, itemLot.RORN, itemLot.BREF, itemLot.BRE2, item.MMUNMS, item.MLSTQT);
                this.openInventoryLabelModal();
            };
            AppController.prototype.formatDatePerUserSetting = function (date) {
                var dateFmnt = this.scope.userContext.dateFormat;
                var formattedDatedformattedDated = "";
                var formattedDated = "";
                var yy = date.substring(0, 4);
                var MM = date.substring(4, 6);
                var dd = date.substring(6);
                switch (dateFmnt) {
                    case "MMddyy": {
                        formattedDated = MM + "/" + dd + "/" + yy;
                        break;
                    }
                    case "yyMMdd": {
                        formattedDated = yy + "/" + MM + "/" + dd;
                        break;
                    }
                    case "ddMMyy": {
                        formattedDated = dd + "/" + MM + "/" + yy;
                        break;
                    }
                    default: {
                        formattedDated = dd + "/" + MM + "/" + yy;
                        break;
                    }
                }
                return formattedDated;
            };
            AppController.prototype.displayOpenDeliveryLabel = function (fieldName, selectedRow) {
                console.log("-----------------displayOpenDeliveryLabel----------------");
                this.scope.addressLabelModule.deliveryNumber = selectedRow.OQDLIX;
                this.scope.addressLabelModule.orderNumber = selectedRow.OQRIDN;
                this.scope.addressLabelModule.selectedOpenDeliveryLotListRow = selectedRow;
                this.loadOpenDeliveryLotList(this.scope.addressLabelModule.deliveryNumber);
            };
            AppController.prototype.displayOpenDeliveryLine = function (fieldName, selectedRow) {
                console.log("-----------------displayOpenDeliveryLine----------------");
                this.scope.addressLabelModule.itemNumber = selectedRow.URITNO;
                this.scope.addressLabelModule.selectedOpenDeliveryLotListRow = selectedRow;
                this.loadAddressLabel(selectedRow.URDLIX, selectedRow.URITNO);
                this.scope.addressLabelModule.lineSfx = selectedRow.URRIDX;
                this.scope.addressLabelModule.orderLine = selectedRow.URRIDL;
                this.loadLine(selectedRow.URRIDN, selectedRow.URRIDL);
                this.openAddressLabelModal();
            };
            AppController.prototype.loadLine = function (orderNumber, orderLine) {
                var _this = this;
                this.scope.globalSelection.addressLabel.RIDN = orderNumber;
                this.scope.globalSelection.addressLabel.orderNumber = orderNumber;
                console.log("loadLine----------------");
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.item = true;
                var orderNum = this.scope.globalSelection.addressLabel.RIDN;
                var itemNumber = this.scope.globalSelection.addressLabel.ITNO;
                var deliveryNumber = this.scope.globalSelection.addressLabel.DLIX;
                this.appService.getLine(orderNumber, orderLine).then(function (val) {
                    _this.scope.addressLabelModule.popn = val.item.POPN;
                    _this.scope.addressLabelModule.cuor = val.item.CUOR;
                    console.log("val----------------");
                    console.log(val.item.POPN);
                    _this.scope.globalSelection.item = val.item;
                    _this.scope.globalSelection.addressLabel = {
                        DLIX: deliveryNumber,
                        ITNO: itemNumber,
                        CUOR: _this.scope.addressLabelModule.cuor,
                        POPN: _this.scope.addressLabelModule.popn,
                        LBPB: 1,
                    };
                    _this.scope.globalSelection.transactionStatus.item = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.globalSelection.addressLabel = {
                        DLIX: deliveryNumber,
                        ITNO: itemNumber,
                        LBPB: 1
                    };
                    _this.scope.globalSelection.transactionStatus.item = false;
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.displayInventoryItemLot = function (fieldName, selectedRow) {
                console.log("-----------------displayInventoryItemLot----------------");
                this.scope.inventoryLabelModule.selectedInventoryItemListRow = selectedRow;
                this.scope.inventoryLabelModule.itemNumber = selectedRow.MLITNO;
                this.scope.inventoryLabelModule.location = selectedRow.MLWHSL;
                this.loadInventoryItemLotList(this.scope.inventoryLabelModule.itemNumber);
            };
            AppController.prototype.loadWarehouseList = function (company) {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.inventoryLabelModule.transactionStatus.warehouseList = true;
                this.appService.getWarehouseList(company).then(function (val) {
                    _this.scope.inventoryLabelModule.warehouseList = val.items;
                    _this.scope.addressLabelModule.warehouseList = val.items;
                    _this.scope.inventoryLabelModule.transactionStatus.warehouseList = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.inventoryLabelModule.transactionStatus.warehouseList = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.loadFacilityList = function (company, division) {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.MOLabelModule.transactionStatus.facilityList = true;
                this.appService.getFacilityList(company, division).then(function (val) {
                    _this.scope.MOLabelModule.facilityList = val.items;
                    _this.scope.MOLabelModule.transactionStatus.facilityList = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.MOLabelModule.transactionStatus.facilityList = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.loadLabelTypeList = function () {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.MOLabelModule.transactionStatus.labelTypeList = true;
                this.appService.getLabelTypeListAlpha().then(function (val) {
                    var fileName = "LBLCUS";
                    _this.scope.MOLabelModule.labelTypeList = _this.filterZSYTAB(fileName, val);
                    _this.scope.MOLabelModule.transactionStatus.labelTypeList = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.MOLabelModule.transactionStatus.labelTypeList = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.loadTradeNames = function () {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.MOLabelModule.transactionStatus.tradeNames = true;
                this.appService.getTradeNameAlpha().then(function (val) {
                    var fileName = "ZZUDF8";
                    _this.scope.MOLabelModule.tradeNames = _this.filterZSYTAB(fileName, val);
                    _this.scope.MOLabelModule.transactionStatus.tradeNames = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.MOLabelModule.transactionStatus.tradeNames = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.loadWorkCenters = function (facility) {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.MOLabelModule.transactionStatus.workCenters = true;
                this.appService.getWorkCenters(facility).then(function (val) {
                    _this.scope.MOLabelModule.workCenters = val.items;
                    _this.scope.MOLabelModule.transactionStatus.workCenters = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.MOLabelModule.transactionStatus.workCenters = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.loadInventoryLabel = function (warehouse, itemNumber, itemDescription, lotNumber, receiptDate, referenceOrder, lotRef1, lotRef2, UOM, quantity) {
                console.log(receiptDate);
                var year = receiptDate.slice(0, 4);
                var month = receiptDate.slice(4, 6);
                var day = receiptDate.slice(6, 8);
                var dateFMT = new Date(month + "/" + day + "/" + year);
                this.scope.globalSelection.inventoryLabel = {
                    WHLO: warehouse,
                    ITNO: itemNumber,
                    ITDS: itemDescription,
                    BANO: lotNumber,
                    REDA: dateFMT,
                    RORN: referenceOrder,
                    BREF: lotRef1,
                    BRE2: lotRef2,
                    UNMS: UOM,
                    STQT: 0,
                    BXNO: 1,
                    LBPB: 1,
                    MULT: false
                };
            };
            AppController.prototype.loadAddressLabel = function (deliveryNumber, itemNumber) {
                console.log("loadAddressLabel");
                this.scope.globalSelection.addressLabel = {
                    DLIX: deliveryNumber,
                    ITNO: itemNumber,
                };
            };
            AppController.prototype.chgInventoryLabelAlpha = function (warehouse, itemNumber, location, receiptDate, lotNumber, referenceOrder, lotRef1, lotRef2, onHandBalance, labelType, userID, printer, labelsPerBox) {
                var _this = this;
                console.log("iN chgInventoryLabelAlpha");
                this.scope.loadingData = true;
                this.scope.inventoryLabelModule.transactionStatus.inventoryLabel = true;
                this.appService.chgInventoryLabelAlpha(warehouse, itemNumber, location, receiptDate, lotNumber, referenceOrder, lotRef1, lotRef2, onHandBalance).then(function (val) {
                    _this.scope.inventoryLabelModule.transactionStatus.inventoryLabel = false;
                    _this.printInventoryLabel(labelType, warehouse, location, lotNumber, itemNumber, userID, printer, labelsPerBox);
                }, function (err) {
                    _this.scope.inventoryLabelModule.transactionStatus.inventoryLabel = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    _this.appService.addInventoryLabelAlpha(warehouse, itemNumber, location, receiptDate, lotNumber, referenceOrder, lotRef1, lotRef2, onHandBalance).then(function (val) {
                        _this.scope.inventoryLabelModule.transactionStatus.inventoryLabel = false;
                        _this.printInventoryLabel(labelType, warehouse, location, lotNumber, itemNumber, userID, printer, labelsPerBox);
                    }, function (err) {
                        _this.scope.inventoryLabelModule.transactionStatus.inventoryLabel = false;
                        _this.refreshTransactionStatus();
                        var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                }).finally(function () {
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.loadMOLabel = function (facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber, startingBox, orderQty, altUOM) {
                var _this = this;
                console.log("LOADING MO LABEL");
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.MOLabel = true;
                this.appService.getMOLabelFieldsAlpha(facility, moNumber, itemNumber, warehouse).then(function (valAlpha) {
                    console.log("LOADING getMOLabelFieldsAlpha");
                    _this.scope.MOLabelModule.MOLabelExists = true;
                    _this.appService.getMOLabelFieldsNumeric(facility, moNumber, itemNumber, warehouse).then(function (valNumeric) {
                        console.log("LOADING getMOLabelFieldsNumeric");
                        _this.scope.globalSelection.MOLabel = {
                            FACI: valAlpha.items[0].PK01,
                            MFNO: valAlpha.items[0].PK02,
                            ITNO: valAlpha.items[0].PK03,
                            WHLO: valAlpha.items[0].PK04,
                            ITDS: valAlpha.items[0].AL30,
                            PLGR: valAlpha.items[0].AL31,
                            SPE5: valAlpha.items[0].AL32,
                            UNMS: valAlpha.items[0].AL33,
                            FMTN: valAlpha.items[0].AL34,
                            SPE2: valAlpha.items[0].AL35,
                            SPE3: valAlpha.items[0].AL36,
                            EVGR: parseInt(valAlpha.items[0].AL37),
                            ADTL: valAlpha.items[0].AL38,
                            BANO: valAlpha.items[0].AL39,
                            BOXN: parseInt(valNumeric.items[0].N096),
                            ORQG: 0.0,
                            ORQN: 0.0,
                            BXNO: 1,
                            LBPB: 2,
                            REND: false,
                            ORQT: orderQty,
                            MAUN: altUOM
                        };
                        var appConfig = _this.scope.appConfig;
                        var workCenter = angular.isString(appConfig.searchQuery.workCenter) ? appConfig.searchQuery.workCenter : _this.scope.globalSelection.MOLabel.PLGR;
                        var tradeName = angular.isString(appConfig.searchQuery.tradeName) ? appConfig.searchQuery.tradeName : _this.scope.globalSelection.MOLabel.SPE5;
                        var labelType = angular.isString(appConfig.searchQuery.labelType) ? appConfig.searchQuery.labelType : _this.scope.globalSelection.MOLabel.FMTN;
                        _this.scope.MOLabelModule.workCenter = { selected: workCenter };
                        _this.scope.MOLabelModule.tradeName = { selected: tradeName };
                        _this.scope.MOLabelModule.labelType = { selected: labelType };
                    }, function (err) {
                        console.log("FAIL getMOLabelFieldsNumeric");
                        _this.scope.globalSelection.transactionStatus.MOLabel = false;
                        _this.refreshTransactionStatus();
                        var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                    _this.scope.globalSelection.transactionStatus.MOLabel = false;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    console.log("FAIL getMOLabelFieldsALPHA");
                    _this.scope.MOLabelModule.MOLabelExists = false;
                    _this.scope.globalSelection.transactionStatus.MOLabel = false;
                    _this.refreshTransactionStatus();
                    _this.appService.addMOLabelFieldsAlpha(facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber).then(function (val) {
                        _this.appService.addMOLabelFieldsNumeric(facility, moNumber, itemNumber, warehouse, "1").then(function (valAlpha) {
                            _this.scope.MOLabelModule.MOLabelExists = true;
                            _this.appService.getMOLabelFieldsAlpha(facility, moNumber, itemNumber, warehouse).then(function (valAlpha) {
                                _this.scope.MOLabelModule.MOLabelExists = true;
                                _this.appService.getMOLabelFieldsNumeric(facility, moNumber, itemNumber, warehouse).then(function (valNumeric) {
                                    _this.scope.globalSelection.MOLabel = {
                                        FACI: valAlpha.items[0].PK01,
                                        MFNO: valAlpha.items[0].PK02,
                                        ITNO: valAlpha.items[0].PK03,
                                        WHLO: valAlpha.items[0].PK04,
                                        ITDS: valAlpha.items[0].AL30,
                                        PLGR: valAlpha.items[0].AL31,
                                        SPE5: valAlpha.items[0].AL32,
                                        UNMS: valAlpha.items[0].AL33,
                                        FMTN: valAlpha.items[0].AL34,
                                        SPE2: valAlpha.items[0].AL35,
                                        SPE3: valAlpha.items[0].AL36,
                                        EVGR: parseInt(valAlpha.items[0].AL37),
                                        ADTL: valAlpha.items[0].AL38,
                                        BANO: valAlpha.items[0].AL39,
                                        BOXN: parseInt(valNumeric.items[0].N096),
                                        ORQG: 0.0,
                                        ORQN: 0.0,
                                        BXNO: 1,
                                        LBPB: 2,
                                        REND: false,
                                        ORQT: orderQty,
                                        MAUN: altUOM
                                    };
                                    var appConfig = _this.scope.appConfig;
                                    var workCenter = angular.isString(appConfig.searchQuery.workCenter) ? appConfig.searchQuery.workCenter : _this.scope.globalSelection.MOLabel.PLGR;
                                    var tradeName = angular.isString(appConfig.searchQuery.tradeName) ? appConfig.searchQuery.tradeName : _this.scope.globalSelection.MOLabel.SPE5;
                                    var labelType = angular.isString(appConfig.searchQuery.labelType) ? appConfig.searchQuery.labelType : _this.scope.globalSelection.MOLabel.FMTN;
                                    _this.scope.MOLabelModule.workCenter = { selected: workCenter };
                                    _this.scope.MOLabelModule.tradeName = { selected: tradeName };
                                    _this.scope.MOLabelModule.labelType = { selected: labelType };
                                }, function (err) {
                                    _this.scope.globalSelection.transactionStatus.MOLabel = false;
                                    _this.refreshTransactionStatus();
                                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                                    _this.showError(error, [err.errorMessage]);
                                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                                });
                                _this.scope.globalSelection.transactionStatus.MOLabel = false;
                                _this.refreshTransactionStatus();
                            }, function (err) {
                                _this.scope.globalSelection.transactionStatus.MOLabel = false;
                                _this.refreshTransactionStatus();
                                var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                                _this.showError(error, [err.errorMessage]);
                                _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                            });
                            _this.scope.globalSelection.transactionStatus.MOLabel = false;
                            _this.refreshTransactionStatus();
                        }, function (err) {
                            _this.scope.globalSelection.transactionStatus.MOLabel = false;
                            _this.refreshTransactionStatus();
                            var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                            _this.showError(error, [err.errorMessage]);
                            _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                        });
                    }, function (err) {
                        _this.scope.globalSelection.transactionStatus.MOLabel = false;
                        _this.refreshTransactionStatus();
                        var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                });
            };
            AppController.prototype.updMOLabel = function (facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber, startingBox) {
                var _this = this;
                console.log("IN updMOLabel METHOD");
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.MOLabel = true;
                this.appService.chgMOLabelFieldsAlpha(facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber).then(function (val) {
                    _this.appService.chgMOLabelFieldsNumeric(facility, moNumber, itemNumber, warehouse, startingBox).then(function (val) {
                        _this.scope.globalSelection.transactionStatus.MOLabel = false;
                        _this.loadMOList(facility);
                    }, function (err) {
                        console.log("ERROR IN  chgMOLabelFieldsNumeric METHOD");
                        _this.scope.globalSelection.transactionStatus.MOLabel = false;
                        var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                }, function (err) {
                    console.log("ERROR IN  chgMOLabelFieldsAlpha METHOD");
                    _this.scope.globalSelection.transactionStatus.MOLabel = false;
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                }).finally(function () {
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.updSuffix = function (facility, moNumber, itemNumber, warehouse, boxNumber, labelType, responsible, altUOM, lotNumber, workCenter, grossWeight, netWeight, altGrossWeight, altNetWeight, startingBox, scanQty, lastBox, labelsPerBox) {
                var _this = this;
                var ret = true;
                grossWeight = this.scope.globalSelection.MOLabel.ORQG;
                netWeight = this.scope.globalSelection.MOLabel.ORQN;
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.MOLabel = true;
                this.appService.chgMOLabelSuffixAlpha(facility, moNumber, itemNumber, warehouse, boxNumber, altUOM, lotNumber, workCenter, labelType, responsible).then(function (val) {
                    console.log("sucess change 1");
                    _this.appService.chgMOLabelSuffixNumeric(facility, moNumber, itemNumber, warehouse, boxNumber, grossWeight, netWeight, altGrossWeight, altNetWeight, startingBox, scanQty, lastBox).then(function (val) {
                        _this.scope.globalSelection.transactionStatus.MOLabel = false;
                        _this.refreshTransactionStatus();
                        console.log("sucess change 2");
                        _this.printMOLabel(labelType, facility, moNumber, boxNumber.toString(), itemNumber, _this.scope.userContext.m3User, _this.scope.globalSelection.printer.selected.DEV, labelsPerBox);
                    }, function (err) {
                        _this.scope.globalSelection.transactionStatus.MOLabel = false;
                        _this.refreshTransactionStatus();
                        var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                }, function (err) {
                    _this.scope.MOLabelModule.suffixExists = false;
                    _this.scope.globalSelection.transactionStatus.MOLabel = false;
                    _this.refreshTransactionStatus();
                    _this.appService.addMOLabelSuffixAlpha(facility, moNumber, itemNumber, warehouse, boxNumber, altUOM, lotNumber, workCenter, labelType, responsible).then(function (val) {
                        console.log("sucess change 3");
                        _this.appService.addMOLabelSuffixNumeric(facility, moNumber, itemNumber, warehouse, boxNumber, grossWeight, netWeight, altGrossWeight, altNetWeight, startingBox, scanQty, lastBox).then(function (val) {
                            _this.scope.globalSelection.transactionStatus.MOLabel = false;
                            _this.refreshTransactionStatus();
                            console.log("sucess change 4");
                            _this.printMOLabel(labelType, facility, moNumber, boxNumber.toString(), itemNumber, _this.scope.userContext.m3User, _this.scope.globalSelection.printer.selected.DEV, labelsPerBox);
                        }, function (err) {
                            _this.scope.globalSelection.transactionStatus.MOLabel = false;
                            _this.refreshTransactionStatus();
                            var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                            _this.showError(error, [err.errorMessage]);
                            _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                        });
                    }, function (err) {
                        _this.scope.globalSelection.transactionStatus.MOLabel = false;
                        _this.refreshTransactionStatus();
                        var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                }).finally(function () {
                    console.log("in finally");
                    _this.refreshTransactionStatus();
                });
                return ret;
            };
            AppController.prototype.printInventoryLabel = function (labelType, warehouse, location, lotNumber, itemNumber, userID, printer, labelsPerBox) {
                var _this = this;
                this.scope.loadingData = true;
                this.appService.addXMLRecord(labelType, warehouse, location, lotNumber, null, itemNumber, userID).then(function (val) {
                    console.log("XML record saved 1681 ");
                    console.log(labelsPerBox);
                    for (var y = 1; y <= labelsPerBox; y++) {
                        _this.callInventoryLabelPrint(itemNumber, printer, labelType, warehouse, location, lotNumber, labelsPerBox);
                    }
                }, function (err) {
                    _this.appService.chgXMLRecord(labelType, warehouse, location, lotNumber, null, itemNumber, userID).then(function (val) {
                        console.log("XML record saved 1688");
                        console.log(labelsPerBox);
                        for (var y = 1; y <= labelsPerBox; y++) {
                            _this.callInventoryLabelPrint(itemNumber, printer, labelType, warehouse, location, lotNumber, labelsPerBox);
                        }
                    }, function (err) {
                        console.log("Fail");
                        var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                }).finally(function () {
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.callInventoryLabelPrint = function (itemNumber, printer, labelType, warehouse, location, lotNumber, labelsPerBox) {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.MOLabel = true;
                this.appService.printInventoryLabel(itemNumber, printer, labelType, warehouse, location, lotNumber, labelsPerBox).then(function (val) {
                    console.log("Inventory Label Successfully Printed");
                    _this.showInfo("Inventory Label Successfully Printed", ["Inventory Label Printed"]);
                    _this.scope.globalSelection.transactionStatus.MOLabel = false;
                    _this.loadMOList(warehouse);
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.MOLabel = false;
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                }).finally(function () {
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.printMOLabel = function (labelType, facility, moNumber, boxNumber, itemNumber, userID, printer, labelsPerBox) {
                var _this = this;
                this.scope.loadingData = true;
                this.appService.addXMLRecord(labelType, facility, moNumber, boxNumber, null, itemNumber, userID).then(function (val) {
                    console.log("XML record ADDED 17344");
                    console.log(labelsPerBox);
                    for (var y = 1; y <= labelsPerBox; y++) {
                        _this.callMOLabelPrint(itemNumber, printer, labelType, facility, moNumber, boxNumber, labelsPerBox);
                    }
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.appService.chgXMLRecord(labelType, facility, moNumber, boxNumber, null, itemNumber, userID).then(function (val) {
                        console.log("ADD Fail XML INSTEAD XML record SAVED 1747");
                        for (var y = 1; y <= labelsPerBox; y++) {
                            _this.callMOLabelPrint(itemNumber, printer, labelType, facility, moNumber, boxNumber, labelsPerBox);
                        }
                        _this.refreshTransactionStatus();
                    }, function (err) {
                        console.log("CHANGED Fail XML");
                        var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        _this.showError(error, [err.errorMessage]);
                        _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                }).finally(function () {
                });
            };
            AppController.prototype.callMOLabelPrint = function (itemNumber, printer, labelType, facility, moNumber, boxNumber, labelsPerBox) {
                var _this = this;
                var user = this.scope.userContext.m3User;
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.MOLabel = true;
                this.appService.printMOLabel(itemNumber, printer, labelType, facility, moNumber, boxNumber, labelsPerBox).then(function (val) {
                    console.log("Mo Label Successfully Printed");
                    _this.showInfo("Mo Label Successfully Printed", ["MO Label Printed"]);
                    _this.scope.globalSelection.transactionStatus.MOLabel = false;
                    _this.loadMOList(facility);
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.MOLabel = false;
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                }).finally(function () {
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.getConversionFactor = function (itemNumber, UOM, altUOM, netWeight, grossWeight) {
                var _this = this;
                this.scope.loadingData = true;
                this.scope.MOLabelModule.transactionStatus.itemAltWeight = true;
                this.appService.getItemAltUOM(itemNumber, altUOM).then(function (val) {
                    _this.scope.MOLabelModule.transactionStatus.itemAltWeight = false;
                    var MUALUN = val.items[0];
                    var net;
                    var gross;
                    MUALUN.COFA = parseInt(MUALUN.COFA);
                    if (MUALUN.COFA === 0) {
                        MUALUN.COFA = 1;
                    }
                    if (MUALUN.DMCF === "1") {
                        net = netWeight * MUALUN.COFA;
                        net = net.toFixed(3);
                        gross = grossWeight * MUALUN.COFA;
                        gross = gross.toFixed(3);
                    }
                    if (MUALUN.DMCF === "2") {
                        net = netWeight / MUALUN.COFA;
                        net = net.toFixed(3);
                        gross = grossWeight / MUALUN.COFA;
                        gross = gross.toFixed(3);
                    }
                    _this.scope.MOLabelModule.itemAltWeight.netWeight = net;
                    _this.refreshTransactionStatus();
                }, function (err) {
                    _this.scope.MOLabelModule.transactionStatus.itemAltWeight = false;
                    _this.refreshTransactionStatus();
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            };
            AppController.prototype.loadMOLabelModule = function (reLoad) {
                var userContext = this.scope.userContext;
                if (reLoad) {
                    this.clearData(["MOLabelModule"]);
                    var selectedFacility = this.scope.MOLabelModule.facility;
                    if (selectedFacility.selected) {
                        this.loadMOList(selectedFacility.selected);
                    }
                }
                this.scope.MOLabelModule.reload = false;
            };
            AppController.prototype.loadInventoryLabelModule = function (reLoad) {
                var userContext = this.scope.userContext;
                this.scope.inventoryLabelModule.itemNumber = "";
                if (reLoad) {
                    this.clearData(["inventoryLabelModule"]);
                    var selectedWarehouse = this.scope.inventoryLabelModule.warehouse;
                    if (selectedWarehouse.selected) {
                        this.loadInventoryItemList(selectedWarehouse.selected);
                    }
                }
                this.scope.inventoryLabelModule.reload = false;
            };
            AppController.prototype.loadAddressLabelModule = function (reLoad) {
                var userContext = this.scope.userContext;
                this.scope.addressLabelModule.deliveryNumber = "";
                if (reLoad) {
                    this.clearData(["addressLabelModule"]);
                    var selectedWarehouse = this.scope.addressLabelModule.warehouse;
                    if (selectedWarehouse.selected) {
                        this.loadOpenDeliveryList(selectedWarehouse.selected);
                    }
                }
                this.scope.inventoryLabelModule.reload = false;
            };
            AppController.prototype.submitMOForm = function (isValid) {
                if (isValid) {
                    this.onMOPrint();
                }
                else {
                    console.log("not printed");
                }
            };
            AppController.prototype.submitInventoryForm = function (isValid) {
                if (isValid) {
                    this.onInventoryPrint();
                }
                else {
                    console.log("not printed");
                }
            };
            AppController.prototype.submitAddressForm = function (isValid) {
                if (isValid) {
                    console.log("submitAddressForm");
                    this.onAddressPrint();
                }
                else {
                    console.log("not printed");
                }
            };
            AppController.prototype.onAddressPrint = function () {
                console.log("onAddressPrint");
                var userContext = this.scope.userContext;
                var warehouse = this.scope.addressLabelModule.warehouse.selected;
                var itemNumber = this.scope.globalSelection.addressLabel.ITNO;
                var ridn = this.scope.addressLabelModule.orderNumber;
                var ridl = this.scope.addressLabelModule.orderLine;
                var dlix = this.scope.globalSelection.addressLabel.DLIX;
                var ridx = this.scope.addressLabelModule.lineSfx;
                var labelsPerBox = this.scope.globalSelection.addressLabel.LBPB;
                var userID = this.scope.userContext.m3User;
                var printer = this.scope.globalSelection.printer.selected.DEV;
                this.saveAddressLabelXML(warehouse, ridn, ridl, dlix, ridx, userID, printer, labelsPerBox);
                this.closeModalWindow();
            };
            AppController.prototype.saveAddressLabelXML = function (warehouse, ridn, ridl, dlix, ridx, userID, printer, labelsPerBox) {
                var _this = this;
                console.log("------------------------saveAddressLabelXML---------------------- " + dlix);
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.addressLabel = true;
                var fname = "";
                var fcua1 = "";
                var fcua2 = "";
                var fcua3 = "";
                var tname = "";
                var tcua1 = "";
                var tcua2 = "";
                var tcua3 = "";
                var itemNumber = this.scope.addressLabelModule.itemNumber;
                this.appService.getAddress(ridn).then(function (val) {
                    console.log("------------------------val.item--Address-------------------- ");
                    console.log(val);
                    tname = val.item.CUNM.substring(0, 30);
                    tcua1 = val.item.CUA1.substring(0, 30);
                    tcua2 = val.item.CUA2.substring(0, 30);
                    tcua3 = val.item.CUA3.substring(0, 30);
                    console.log(tname + "  " + tcua1 + "  " + tcua2 + "  " + tcua3);
                    var popn = _this.scope.globalSelection.addressLabel.POPN;
                    var cuor = _this.scope.globalSelection.addressLabel.CUOR;
                    console.log(popn + "<  popn" + cuor + "<  cuor");
                    _this.appService.addAddressXMLRecord(itemNumber, ridn, ridl, dlix, ridx, userID, tname, tcua1, tcua2, tcua3, popn, cuor).then(function (val) {
                        for (var y = 1; y <= labelsPerBox; y++) {
                            _this.callAddressLabelPrint(itemNumber, printer, ridn, ridl, dlix, ridx, labelsPerBox);
                        }
                    }, function (err) {
                        _this.scope.globalSelection.transactionStatus.addressLabel = false;
                        _this.appService.chgAddressXMLRecord(itemNumber, ridn, ridl, dlix, ridx, userID, tname, tcua1, tcua2, tcua3, popn, cuor).then(function (val) {
                            console.log("XML record SAVED  ");
                            for (var y = 1; y <= labelsPerBox; y++) {
                                _this.callAddressLabelPrint(itemNumber, printer, ridn, ridl, dlix, ridx, labelsPerBox);
                            }
                        }, function (err) {
                            _this.scope.globalSelection.transactionStatus.addressLabel = false;
                            console.log("Failed to add and save XMLPRT");
                            var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                            _this.showError(error, [err.errorMessage]);
                            _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                        });
                    }).finally(function () {
                        _this.refreshTransactionStatus();
                    });
                    _this.scope.globalSelection.transactionStatus.addressLabel = false;
                    _this.loadMOList(warehouse);
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.addressLabel = false;
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                }).finally(function () {
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.callAddressLabelPrint = function (itemNumber, printer, labelType, warehouse, location, lotNumber, labelsPerBox) {
                var _this = this;
                console.log("callAddressLabelPrint");
                this.scope.loadingData = true;
                this.scope.globalSelection.transactionStatus.addressLabel = true;
                this.appService.printAddressLabel(itemNumber, printer, labelType, warehouse, location, lotNumber, labelsPerBox).then(function (val) {
                    _this.showInfo("Address Label Successfully Printed", ["Address Label Printed"]);
                    _this.scope.globalSelection.transactionStatus.addressLabel = false;
                }, function (err) {
                    _this.scope.globalSelection.transactionStatus.addressLabel = false;
                    var error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                }).finally(function () {
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.onInventoryPrint = function () {
                var userContext = this.scope.userContext;
                var warehouse = this.scope.globalSelection.inventoryLabel.WHLO;
                var location = this.scope.inventoryLabelModule.location;
                var itemNumber = this.scope.globalSelection.inventoryLabel.ITNO;
                var itemDescription = this.scope.globalSelection.inventoryLabel.ITDS;
                var lotNumber = this.scope.globalSelection.inventoryLabel.BANO;
                var receiptDate = new Date(this.scope.globalSelection.inventoryLabel.REDA).toLocaleDateString('en-US');
                var receiptDate2 = new Date(this.scope.globalSelection.inventoryLabel.REDA);
                var referenceOrder = this.scope.globalSelection.inventoryLabel.RORN;
                var lotRef1 = this.scope.globalSelection.inventoryLabel.BREF;
                var lotRef2 = this.scope.globalSelection.inventoryLabel.BRE2;
                var UOM = this.scope.globalSelection.inventoryLabel.UNMS;
                var quantity = this.scope.globalSelection.inventoryLabel.STQT;
                var numOfBoxes = this.scope.globalSelection.inventoryLabel.BXNO;
                var labelsPerBox = this.scope.globalSelection.inventoryLabel.LBPB;
                var multipleLabels = this.scope.globalSelection.inventoryLabel.MULT;
                var labelType = "P95";
                var userID = this.scope.userContext.m3User;
                var printer = this.scope.globalSelection.printer.selected.DEV;
                2;
                receiptDate = new Date(receiptDate).toLocaleDateString('en-US');
                var dateYear = receiptDate2.getFullYear();
                var dateMonth = receiptDate2.getMonth() + 1;
                var dateDay = receiptDate2.getDate();
                console.log("  receiptDate2getDate= " + receiptDate2.getDate());
                console.log("  dateYear = " + dateYear);
                console.log("  dateMonth) = " + dateMonth);
                console.log("  dateDay) = " + dateDay);
                var dateFMT = (dateMonth + "/" + dateDay + "/" + dateYear);
                receiptDate = dateFMT;
                console.log("onInventoryPrint  receiptDate = " + receiptDate);
                console.log("new Date(this.scope.globalSelection.inventoryLabel.REDA )= " + new Date(this.scope.globalSelection.inventoryLabel.REDA).toDateString());
                this.chgInventoryLabelAlpha(warehouse, itemNumber, location, receiptDate, lotNumber, referenceOrder, lotRef1, lotRef2, quantity, labelType, userID, printer, labelsPerBox);
                if (multipleLabels === false) {
                    this.closeModalWindow();
                }
            };
            AppController.prototype.onMOPrint = function () {
                console.log("MO label print start");
                var userContext = this.scope.userContext;
                var facility = this.scope.globalSelection.MOLabel.FACI;
                var moNumber = this.scope.globalSelection.MOLabel.MFNO;
                var itemNumber = this.scope.globalSelection.MOLabel.ITNO;
                var warehouse = this.scope.globalSelection.MOLabel.WHLO;
                var description = this.scope.globalSelection.MOLabel.ITDS;
                var workCenter = this.scope.MOLabelModule.workCenter.selected;
                var tradeName = this.scope.MOLabelModule.tradeName.selected;
                var UOM = this.scope.globalSelection.MOLabel.UNMS;
                var labelType = this.scope.MOLabelModule.labelType.selected;
                var compound = this.scope.globalSelection.MOLabel.SPE2;
                var color = this.scope.globalSelection.MOLabel.SPE3;
                var MSD = this.scope.globalSelection.MOLabel.EVGR;
                var info = this.scope.globalSelection.MOLabel.ADTL;
                var lotNumber = this.scope.globalSelection.MOLabel.BANO;
                var startingBox = this.scope.globalSelection.MOLabel.BOXN;
                var grossWeight = this.scope.globalSelection.MOLabel.ORQG;
                var netWeight = this.scope.globalSelection.MOLabel.ORQN;
                var numOfBoxes = this.scope.globalSelection.MOLabel.BXNO;
                var labelsPerBox = this.scope.globalSelection.MOLabel.LBPB;
                var lastBox = this.scope.globalSelection.MOLabel.REND;
                var scanQty = this.scope.globalSelection.MOLabel.ORQT;
                var responsible = userContext.m3User;
                var altUOM = this.scope.globalSelection.MOLabel.MAUN;
                var altGrossWeight = grossWeight;
                var altNetWeight = netWeight;
                var selectedPrinter = this.scope.globalSelection.printer.selected.DEV + "";
                var boxNum = startingBox;
                var sfxBANO;
                if (this.isLBSFacility()) {
                    this.getConversionFactor(itemNumber, UOM, altUOM, netWeight, grossWeight);
                    var itemAltWeight = this.scope.MOLabelModule.itemAltWeight;
                    altGrossWeight = itemAltWeight.grossWeight;
                    altNetWeight = itemAltWeight.netWeight;
                }
                for (var x = 1; x <= numOfBoxes; x++) {
                    sfxBANO = lotNumber + this.padBoxNumber(boxNum.toString());
                    console.log("IN UPDSFX LOOP ");
                    if (this.updSuffix(facility, moNumber, itemNumber, warehouse, boxNum, labelType, responsible, altUOM, sfxBANO, workCenter, grossWeight, netWeight, altGrossWeight, altNetWeight, startingBox, scanQty, lastBox, labelsPerBox)) {
                        if (x === numOfBoxes) {
                            this.updMOLabel(facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber, boxNum);
                            console.log(" updMOLabel---------------------------------> ");
                        }
                        console.log(grossWeight + " grossWeight ********                 UPDATEDLBLSFX count = " + x);
                    }
                    boxNum++;
                }
                this.closeModalWindow();
            };
            AppController.prototype.updPrinterFile = function () {
                var _this = this;
                var user = this.scope.userContext.m3User;
                var userPrinter = this.scope.globalSelection.printer.selected;
                console.log("userPrinter " + userPrinter);
                this.appService.updPrintFile(user, userPrinter).then(function (val) {
                }, function (err) {
                    var error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    _this.showError(error, [err.errorMessage]);
                    _this.refreshTransactionStatus();
                });
            };
            AppController.prototype.padBoxNumber = function (boxNumber) {
                var paddedBoxNumber = "";
                if (boxNumber.length === 1) {
                    paddedBoxNumber = "00" + boxNumber;
                }
                else if (boxNumber.length === 2) {
                    paddedBoxNumber = "0" + boxNumber;
                }
                else if (boxNumber.length === 3) {
                }
                return paddedBoxNumber;
            };
            AppController.prototype.isLBSFacility = function () {
                return false;
            };
            AppController.prototype.printCheck = function () {
                var workCenter = this.scope.globalSelection.MOLabel.PLGR;
                var tradeName = this.scope.globalSelection.MOLabel.SPE5;
                var labelType = this.scope.globalSelection.MOLabel.FMTN;
                var compound = this.scope.globalSelection.MOLabel.SPE2;
                var color = this.scope.globalSelection.MOLabel.SPE3;
                var MSD = this.scope.globalSelection.MOLabel.EVGR;
                var info = this.scope.globalSelection.MOLabel.ADTL;
                var lotNumber = this.scope.globalSelection.MOLabel.BANO;
                var startingBox = this.scope.globalSelection.MOLabel.BOXN;
                var grossWeight = this.scope.globalSelection.MOLabel.ORQG;
                var netWeight = this.scope.globalSelection.MOLabel.ORQN;
                var numOfBoxes = this.scope.globalSelection.MOLabel.BXNO;
                var labelsPerBox = this.scope.globalSelection.MOLabel.LBPB;
                return true;
            };
            AppController.prototype.netGrossCheck = function () {
                if (this.scope.globalSelection.MOLabel.ORQN > this.scope.globalSelection.MOLabel.ORQG) {
                    this.scope.MOLabelModule.netNotLargerThanGross = false;
                }
                else {
                    this.scope.MOLabelModule.netNotLargerThanGross = true;
                }
            };
            AppController.$inject = ["$scope", "configService", "AppService", "RestService", "StorageService", "GridService", "m3UserService", "languageService", "$uibModal", "$interval", "$timeout", "$filter", "$q", "$window", "m3FormService", "$location"];
            return AppController;
        }());
        application.AppController = AppController;
    })(application = h5.application || (h5.application = {}));
})(h5 || (h5 = {}));
