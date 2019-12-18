/**
 * Application controller which will have the global scope functions and models and can be accessed through out the application. 
 * Functions and models shared across one or more modules should be implemented here. 
 * For independent modules create module specific controllers and declare it as a nested controller, i.e under the module specific page.
 */


module h5.application {

    export enum MessageType {
        Information = 0,
        Warning = 1,
        Error = 2,
    }

    export class AppController {

        static $inject = ["$scope", "configService", "AppService", "RestService", "StorageService", "GridService", "m3UserService", "languageService", "$uibModal", "$interval", "$timeout", "$filter", "$q", "$window", "m3FormService", "$location"];

        constructor(private scope: IAppScope, private configService: h5.application.ConfigService, private appService: h5.application.IAppService, private restService: h5.application.RestService, private storageService: h5.application.StorageService, private gridService: h5.application.GridService, private userService: M3.IUserService, private languageService: h5.application.LanguageService, private $uibModal: ng.ui.bootstrap.IModalService, private $interval: ng.IIntervalService, private $timeout: ng.ITimeoutService, private $filter: h5.application.AppFilter, private $q: ng.IQService, private $window: ng.IWindowService, private formService: M3.FormService, private $location: ng.ILocationService) {
            this.init();
        }

        /**
        * The initialize function which will be called when the controller is created
        */
        private init() {
            this.scope.appReady = false;
            this.scope.loadingData = false;
            this.scope.statusBar = [];
            this.scope.statusBarIsCollapsed = true;
            this.scope.statusBarVisible = true;
            this.scope.hasValidlicense = false;

            this.languageService.getAppLanguage().then((val: Odin.ILanguage) => {
                this.scope.languageConstants = this.languageService.languageConstants;
                this.initApplication();
            }, (errorResponse: any) => {
                Odin.Log.error("Error getting language constants " + errorResponse);
                this.scope.statusBar.push({ message: "Error getting language constants" + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
            });
            if (this.$window.innerWidth < 768) {
                this.scope.showSideNavLabel = false;
            } else {
                this.scope.showSideNavLabel = false;
            }
        }

        /**
        * This function will have any application specific initialization functions
        */
        private initApplication() {

            this.initGlobalConfig();
            this.initAppScope();
            this.initUIGrids();
            this.initScopeFunctions();
            this.$timeout(() => { this.scope.appReady = true; }, 5000);
        }

        /**
        * This function will call the config service and set the global configuration model object with the configured settings 
        */
        private initGlobalConfig() {
            this.configService.getGlobalConfig().then((configData: any) => {
                this.scope.globalConfig = configData;
                this.initLanguage();
                this.initTheme();
                this.getUserContext();
                if (this.scope.appConfig.authorizedUser) { //added for security
                    this.scope.showSideNavLabel = false;
                }
                this.initModule();
            }, (errorResponse: any) => {
                Odin.Log.error("Error while getting global configuration " + errorResponse);
                this.scope.statusBar.push({ message: "Error while getting global configuration " + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
            });
        }

        /**
        * Codes and function calls to initialize Application Scope model
        */
        private initAppScope() {
            //Initialize data objects
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
                errorModule: { url: "views/Error.html" }
            };

            this.scope.modules = [
                { moduleId: 1, activeIcon: 'SampleModule1.png', inactiveIcon: 'SampleModule1-na.png', heading: 'MO Label Module', content: this.scope.views.MOLabelModule.url, active: true, available: true },
                { moduleId: 2, activeIcon: 'SampleModule1.png', inactiveIcon: 'SampleModule1-na.png', heading: 'Inventory Label Module', content: this.scope.views.InventoryLabelModule.url, active: true, available: true }
            ];

            this.scope.appConfig = {};
            this.scope.userContext = new M3.UserContext();
            this.scope["dateRef"] = new Date();

            //Function calls which initialize module specific data objects
            this.initGlobalSelection();
            this.initMOLabelModule();
            this.initInventoryLabelModule();
        }

        /**
        * Initialize Global Selection model
        */
        private initGlobalSelection() {
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


                item: {},
                printerExists: false

            };
        }

        /**
        * Initialize the MOLabel module
        */
        private initMOLabelModule() {
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
        }

        /**
       * Initialize the MOLabel module
       */
        private initInventoryLabelModule() {
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
        }

        /**
        * Initialize the application constants/MOLabels
        */
        private initApplicationConstants() {
        }

        /**
        * Initialize the binding of controller function mapping with the module scope
        */
        private initScopeFunctions() {
            //Add function binding to the scope models which are required to access from grid scope
            //this.scope.sampleModule1.computeFunction1() = () => { this.computeFunction1(); }

            this.scope.MOLabelModule.displayMOLabel = (fieldName, rowEntity) => { this.displayMOLabel(fieldName, rowEntity); };
            this.scope.inventoryLabelModule.displayInventoryItemLot = (fieldName, rowEntity) => { this.displayInventoryItemLot(fieldName, rowEntity); };
            this.scope.inventoryLabelModule.displayInventoryItemLabel = (fieldName, rowEntity) => { this.displayInventoryItemLabel(fieldName, rowEntity); }
        }

        /**
        * Initialize UI grids objects defined in all modules
        */
        private initUIGrids() {
            //Initialize the grid objects via gridService
            //this.scope.sampleModule.sampleGrid1 = this.gridService.getSampleGrid1();
            this.scope.MOLabelModule.MOListGrid = this.gridService.getMOListGrid();
            this.scope.inventoryLabelModule.inventoryItemListGrid = this.gridService.getInventoryItemListGrid();
            this.scope.inventoryLabelModule.inventoryItemLotListGrid = this.gridService.getInventoryItemLotListGrid();
            this.initUIGridsOnRegisterApi();
        }

        /**
        * Initialize UI Grid On Register API if required
        */
        private initUIGridsOnRegisterApi() {

            this.scope.MOLabelModule.MOListGrid.onRegisterApi = (gridApi) => {
                this.gridService.adjustMOGridHeight("MOListGrid", this.scope.MOLabelModule.MOListGrid.data.length, 500);
                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("MOListGrid", gridApi); });
                gridApi.core.on.sortChanged(this.scope, (handler: any) => { this.gridService.saveGridState("MOListGrid", gridApi); });
                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("MOListGrid", gridApi); });
                gridApi.core.on.filterChanged(this.scope, (handler: any) => { this.gridService.saveGridState("MOListGrid", gridApi); });
                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("MOListGrid", gridApi); });
                gridApi.colResizable.on.columnSizeChanged(this.scope, (handler: any) => { this.gridService.saveGridState("MOListGrid", gridApi); });
                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });
                gridApi.selection.on.rowSelectionChanged(this.scope, (row: any) => {
                    this.gridService.saveGridState("MOListGrid", gridApi);

                    //this.MOListRowSelected(row);
                });

                gridApi.selection.on.rowSelectionChangedBatch(this.scope, (row: any) => {
                    this.gridService.saveGridState("MOListGrid", gridApi);
                    //this.itemMasterListRowSelected(gridApi.selection.getSelectedRows());
                });
            }

            this.scope.inventoryLabelModule.inventoryItemListGrid.onRegisterApi = (gridApi) => {
                this.gridService.adjustInventoryItemGridHeight("inventoryItemListGrid", this.scope.inventoryLabelModule.inventoryItemListGrid.data.length, 500);
                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("inventoryItemListGrid", gridApi); });
                gridApi.core.on.sortChanged(this.scope, (handler: any) => { this.gridService.saveGridState("inventoryItemListGrid", gridApi); });
                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("inventoryItemListGrid", gridApi); });
                gridApi.core.on.filterChanged(this.scope, (handler: any) => { this.gridService.saveGridState("inventoryItemListGrid", gridApi); });
                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("inventoryItemListGrid", gridApi); });
                gridApi.colResizable.on.columnSizeChanged(this.scope, (handler: any) => { this.gridService.saveGridState("inventoryItemListGrid", gridApi); });
                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });
                gridApi.selection.on.rowSelectionChanged(this.scope, (row: any) => {
                    this.gridService.saveGridState("inventoryItemListGrid", gridApi);
                    //this.MOListRowSelected(row);
                });
                gridApi.selection.on.rowSelectionChangedBatch(this.scope, (row: any) => {
                    this.gridService.saveGridState("inventoryItemListGrid", gridApi);
                    //this.itemMasterListRowSelected(gridApi.selection.getSelectedRows());
                });
            }

            this.scope.inventoryLabelModule.inventoryItemLotListGrid.onRegisterApi = (gridApi) => {
                this.gridService.adjustInventoryItemGridHeight("inventoryItemLotListGrid", this.scope.inventoryLabelModule.inventoryItemLotListGrid.data.length, 500);
                gridApi.core.on.renderingComplete(this.scope, (handler: any) => { this.gridService.restoreGridState("inventoryItemLotListGrid", gridApi); });
                gridApi.core.on.sortChanged(this.scope, (handler: any) => { this.gridService.saveGridState("inventoryItemLotListGrid", gridApi); });
                gridApi.core.on.columnVisibilityChanged(this.scope, (handler: any) => { this.gridService.saveGridState("inventoryItemLotListGrid", gridApi); });
                gridApi.core.on.filterChanged(this.scope, (handler: any) => { this.gridService.saveGridState("inventoryItemLotListGrid", gridApi); });
                gridApi.colMovable.on.columnPositionChanged(this.scope, (handler: any) => { this.gridService.saveGridState("inventoryItemLotListGrid", gridApi); });
                gridApi.colResizable.on.columnSizeChanged(this.scope, (handler: any) => { this.gridService.saveGridState("inventoryItemLotListGrid", gridApi); });
                gridApi.cellNav.on.viewPortKeyDown(this.scope, (event: any) => {
                    if ((event.keyCode === 67) && (event.ctrlKey || event.metaKey)) {
                        let cells = gridApi.cellNav.getCurrentSelection();
                        this.copyCellContentToClipBoard(cells);
                    }
                });
                gridApi.selection.on.rowSelectionChanged(this.scope, (row: any) => {
                    this.gridService.saveGridState("inventoryItemLotListGrid", gridApi);
                    //this.MOListRowSelected(row);
                });
                gridApi.selection.on.rowSelectionChangedBatch(this.scope, (row: any) => {
                    this.gridService.saveGridState("inventoryItemLotListGrid", gridApi);
                    //this.itemMasterListRowSelected(gridApi.selection.getSelectedRows());
                });
            }

        }

        /**
        * Reset UI Grid Column Definitions (Required to reflect if the user changed the application language)
        */
        private resetUIGridsColumnDefs() {
            //Reset UI grids columnDefs
        }

        /**
        * Initialize theme on application start
        */
        private initTheme() {
            let themeId = this.storageService.getLocalData('h5.app.appName.theme.selected');
            let textureId = this.storageService.getLocalData('h5.app.appName.texture.selected');
            themeId = angular.isNumber(themeId) ? themeId : angular.isNumber(this.scope.globalConfig.defaultThemeId) ? this.scope.globalConfig.defaultThemeId : 1;
            textureId = angular.isNumber(textureId) ? textureId : angular.isNumber(this.scope.globalConfig.defaultTextureId) ? this.scope.globalConfig.defaultTextureId : 1;
            this.themeSelected(themeId);
            this.textureSelected(textureId);

            this.scope.themes.forEach((theme) => {
                if (this.scope.globalConfig.excludeThemes.indexOf(theme.themeId) > -1) {
                    theme.available = false;
                } else {
                    theme.available = true;
                }
            });
            this.scope.textures.forEach((texture) => {
                if (this.scope.globalConfig.excludeWallpapers.indexOf(texture.textureId) > -1) {
                    texture.available = false;
                } else {
                    texture.available = true;
                }
            });
        }

        /**
        * Initialize module on application start
        */
        private initModule() {

            let moduleId = this.storageService.getLocalData('h5.app.appName.module.selected');
            moduleId = angular.isNumber(moduleId) ? moduleId : 1;
            this.scope.activeModule = moduleId;
            this.scope.modules.forEach((appmodule) => {
                if (angular.equals(moduleId, appmodule.moduleId)) {
                    appmodule.active = true;
                } else {
                    appmodule.active = false;
                }
                if (this.scope.globalConfig.excludeModules.indexOf(appmodule.moduleId) > -1) {
                    appmodule.available = false;
                } else {
                    appmodule.available = true;
                }
            });
        }

        /**
        *  Initialize language on application start
        */
        private initLanguage() {
            let languageCode = this.storageService.getLocalData('h5.app.appName.language.selected');
            languageCode = angular.isString(languageCode) ? languageCode : angular.isString(this.scope.globalConfig.defaultLanguage) ? this.scope.globalConfig.defaultLanguage : "en-US";
            this.scope.currentLanguage = languageCode;
            if (!angular.equals(this.scope.currentLanguage, "en-US")) {
                this.languageService.changeAppLanguage(languageCode).then((val: Odin.ILanguage) => {
                    this.resetUIGridsColumnDefs();
                }, (errorResponse: any) => {
                    Odin.Log.error("Error getting language " + errorResponse);
                    this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

                });
            }
            this.scope.supportedLanguages.forEach((language) => {
                if (angular.equals(language.languageCode, languageCode)) {
                    language.active = true;
                } else {
                    language.active = false;
                }
                if (this.scope.globalConfig.excludeLanguages.indexOf(language.languageCode) > -1) {
                    language.available = false;
                } else {
                    language.available = true;
                }
            });
        }

        /**
        * Set the application theme
        * @param themeId the theme id
        */
        private themeSelected(themeId: number) {
            this.scope.themes.forEach((theme) => {
                if (angular.equals(theme.themeId, themeId)) {
                    theme.active = true;
                    this.scope.theme = theme;
                } else {
                    theme.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.theme.selected', themeId);
        }

        /**
        * Set the application background
        * @param textureId the texture id
        */
        private textureSelected(textureId: number) {
            this.scope.textures.forEach((texture) => {
                if (angular.equals(texture.textureId, textureId)) {
                    texture.active = true;
                    this.scope.texture = texture;
                } else {
                    texture.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.texture.selected', textureId);
        }

        /**
        * Get User Context for the logged in H5 user
        */
        private getUserContext() {
            Odin.Log.debug("is H5 " + this.userService.isH5() + " is Iframe " + Odin.Util.isIframe());
            this.scope.loadingData = true;

            this.userService.getUserContext().then((val: M3.IUserContext) => {
                this.scope.userContext = val;
                this.loadGlobalData();
            }, (reason: any) => {
                Odin.Log.error("Can't get user context from h5 due to " + reason.errorMessage);
                this.scope.statusBar.push({ message: "Can't get user context from h5 " + [reason.errorMessage], statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

                this.showError("Can't get user context from h5 ", [reason.errorMessage]);
                this.loadGlobalData();
            });
        }

        /**
        * Launch the H5 program or H5 link when the app runs inside the H5 client
        */
        private launchM3Program(link: string): void {
            Odin.Log.debug("H5 link to launch -->" + link);
            this.formService.launch(link);
        }

        /**
        * Trigger load application data when the user hit a specific key
        */
        private mapKeyUp(event: any) {
            //F4 : 115, ENTER : 13
            if (event.keyCode === 115) {
                this.loadApplicationData();
            }
        }

        /**
        * Used by infinite scroll functionality in the ui-select dropdown with large number of records
        */
        private addMoreItemsToScroll() {
            this.scope.infiniteScroll.currentItems += this.scope.infiniteScroll.numToAdd;
        };

        /**
        * Hack function to facilitate copy paste shortcut in ui grid cells
        */
        private copyCellContentToClipBoard(cells: any) {
            let hiddenTextArea = angular.element(document.getElementById("gridClipboard"));
            hiddenTextArea.val("");
            let textToCopy = '', rowId = cells[0].row.uid;
            cells.forEach((cell: any) => {
                textToCopy = textToCopy == '' ? textToCopy : textToCopy + ",";
                let cellValue = cell.row.entity[cell.col.name];
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
        }

        /**
        * Opens About Page in a modal window
        */
        private openMOLabelModal() {
            let options: any = {
                animation: true,
                templateUrl: "views/MOLabelModal.html",
                size: "lg",
                scope: this.scope,
                backdrop: "static"

            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
       * Opens About Page in a modal window
       */
        private openInventoryLabelModal() {
            let options: any = {
                animation: true,
                templateUrl: "views/InventoryLabelModal.html",
                size: "lg",
                scope: this.scope,
                backdrop: "static"

            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens About Page in a modal window
        */
        private openAboutPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/About.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the module window where user can change the application theme
        */
        private openChangeThemePage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeThemeModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the module window where user can change the application wallpaper
        */
        private openChangeWallpaperPage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeWallpaperModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }

        /**
        * Opens the module window where user can change the application language
        */
        private openChangeAppLanguagePage() {
            let options: any = {
                animation: true,
                templateUrl: "views/ChangeLanguageModal.html",
                size: "md",
                scope: this.scope
            }
            this.scope.modalWindow = this.$uibModal.open(options);
        }



        /**
        * Change the application language
        * @param languageCode the language code to change
        */
        private changeAppLanguage(languageCode: string) {
            this.scope.supportedLanguages.forEach((language) => {
                if (angular.equals(language.languageCode, languageCode)) {
                    language.active = true;
                    this.scope.currentLanguage = languageCode;
                } else {
                    language.active = false;
                }
            });
            this.languageService.changeAppLanguage(languageCode).then((val: Odin.ILanguage) => {
                this.scope.appReady = false;
                this.closeModalWindow();
                this.resetUIGridsColumnDefs();
                this.$timeout(() => { this.scope.appReady = true; }, 1000);
            }, (errorResponse: any) => {
                Odin.Log.error("Error getting language " + errorResponse);
                this.scope.statusBar.push({ message: "Error getting language " + errorResponse, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
            });
            this.storageService.setLocalData('h5.app.appName.language.selected', languageCode);
        }

        /**
        * Close the modal window if any opened
        */
        private closeModalWindow() {
            this.scope.modalWindow.close("close");
        }

        private statusBarClose() {
            this.scope.statusBarIsCollapsed = true;
            this.scope.statusBar = [];
        }

        private formatTime = function(statusBarItem: IStatusBarObj) {
            return statusBarItem.timestamp.getHours() + ':' + Odin.NumUtil.pad(statusBarItem.timestamp.getMinutes(), 2);
        };

        private removeAt = function(index) {
            if (index || index == 0) {
                this.scope.statusBar.splice(this.scope.statusBar.length - 1 - index, 1);
            }
            this.scope.statusBarIsCollapsed = this.scope.statusBar.length == 0;
        };

        /**
        * Function to parse the error response and display the error message in application error panel
        * @param errorResponse the error response of type ng.IHttpPromiseCallbackArg<any>
        */
        private parseError(errorResponse: ng.IHttpPromiseCallbackArg<any>) {
            let error = "Error occurred while processing below request(s)";
            let errorMessages: string[] = this.scope["errorMessages"];
            let errorMessage = "Request URL: " + errorResponse.config.url + ", Status: " + errorResponse.status +
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
        }
    private openDatepicker() {
        //this.scope.status.opened = true;
        this.scope.globalSelection.inventoryLabel.REDAOpen = true;
    };
        /**
        * Show the error message in application error panel
        * @param error the error prefix/description to show
        * @param errorMessages array of error messages to display
        */
        private showError(error: string, errorMessages: string[]) {
            this.scope["hasError"] = true;
            this.scope["error"] = error;
            this.scope["errorMessages"] = errorMessages;
            if (angular.isObject(this.scope["destroyErrMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyErrMsgTimer"]);
            }
            this.scope["destroyErrMsgTimer"] = this.$timeout(() => { this.hideError(); }, 30000);
        }

        /**
        * Function to hide/clear the error messages
        */
        private hideError() {
            this.scope["hasError"] = false;
            this.scope["error"] = null;
            this.scope["errorMessages"] = [];
            this.scope["destroyErrMsgTimer"] = undefined;
        }

        /**
         * Show the warning message in application error panel
         * @param warning the warning prefix/description to show
         * @param warningMessages array of warning messages to display
         */
        private showWarning(warning: string, warningMessages: string[]) {
            this.scope["hasWarning"] = true;
            this.scope["warning"] = warning;
            this.scope["warningMessages"] = warningMessages;
            if (angular.isObject(this.scope["destroyWarnMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyWarnMsgTimer"]);
            }
            this.scope["destroyWarnMsgTimer"] = this.$timeout(() => { this.hideWarning(); }, 10000);
        }

        /**
        * Function to hide/clear the warning messages
        */
        private hideWarning() {
            this.scope["hasWarning"] = false;
            this.scope["warning"] = null;
            this.scope["warningMessages"] = null;
            this.scope["destroyWarnMsgTimer"] = undefined;
        }

        /**
        * Show the info message in application error panel
        * @param info the warning prefix/description to show
        * @param infoMessages array of info messages to display
        */
        private showInfo(info: string, infoMessages: string[]) {
            this.scope["hasInfo"] = true;
            this.scope["info"] = info;
            this.scope["infoMessages"] = infoMessages;
            if (angular.isObject(this.scope["destroyInfoMsgTimer"])) {
                this.$timeout.cancel(this.scope["destroyInfoMsgTimer"]);
            }
            this.scope["destroyInfoMsgTimer"] = this.$timeout(() => { this.hideInfo(); }, 10000);
        }

        /**
        * Function to hide/clear the info messages
        */
        private hideInfo() {
            this.scope["hasInfo"] = false;
            this.scope["info"] = null;
            this.scope["infoMessages"] = null;
            this.scope["destroyInfoMsgTimer"] = undefined;
        }

        /**
        * Add function calls which are required to be called during application load data for the first time 
        */
        private loadGlobalData() {
            let userContext = this.scope.userContext;
            let globalConfig = this.scope.globalConfig;

            this.loadAppConfig(userContext.company, userContext.division, userContext.m3User, globalConfig.environment).then((val: any) => {
                if (this.scope.appConfig.authorizedUser === true) { // added for security
                    console.log("authorized");
                    // this.loadPrinter(userContext.m3User);
                    this.loadPrinterList();
                    this.loadWarehouseList(userContext.company);
                    this.getPrinter(userContext.m3User);
                    this.loadData(this.scope.activeModule);
                    this.loadDefaultFields();
                    this.hideWarning();
                } else {// added for security
                    console.log("NOT authorized");// added for security
                    window.alert("NOT Authorized, Please Contact Security"); // added for security

                }


            });
        }

        /**
        * Auto selecting an option based on the query parameters or logged in user's details
        */
        private loadDefaultFields() {
            let userContext = this.scope.userContext;
            let appConfig = this.scope.appConfig;
            // this.getPrinter(userContext.m3User); 
            console.log(" loadDefaultFields this.scope.globalSelection.defaultPrinter >>>>>>>>>>>>>user " + this.scope.globalSelection.defaultPrinter);

            // this.scope.globalSelection.defaultPrinter = { selected: this.scope.globalSelection.defaultPrinter };            
            let facility = angular.isString(appConfig.searchQuery.faci) ? appConfig.searchQuery.faci : userContext.FACI; //added
            this.scope.MOLabelModule.facility = { selected: facility }; //added
            this.loadFacilityList(userContext.company, userContext.division); //added                        
            let warehouse = angular.isString(appConfig.searchQuery.whlo) ? appConfig.searchQuery.whlo : userContext.WHLO;
            this.scope.inventoryLabelModule.warehouse = { selected: warehouse };
            this.loadWarehouseList(userContext.company); //added


        }

        /**
        * Upon calling this function will reset the application data for all modules/tabs and load the application data for the active module/tab
        */
        private loadApplicationData() {
            console.log("loadApplicationData------- ->>>>>>>>>>>>>  ");
            let categories = ['globalSelection', 'MOLabelModule'];
            this.clearData(categories);
            this.resetReloadStatus();
            this.getPrinter(this.scope.userContext.m3User);
            //check printer selecteded
            let userPrinter = this.scope.globalSelection.defaultPrinter;
            let selectedPrinter = this.scope.globalSelection.printer.selected.DEV;
            if ((userPrinter === "")) {
                console.log("I DO NOT HAVE A PRINTER------------------------------------>>>>>>>>>>>>>  " + selectedPrinter);
            } else {
                console.log("I HAVE A PRINTER------------------------------------>>>>>>>>>>>>>  " + userPrinter);
            }

            console.log("userPrinter ------------------------------------>>>>>>>>>>>>>  " + userPrinter);
            console.log("selectedPrinter ------------------------------------>>>>>>>>>>>>>  " + selectedPrinter);
            this.loadData(this.scope.activeModule);

        }

        /**
        * Re-initializing or clearing the data based on modules or categories/business logic should be implemented here
        * @param categories the categories to clear data
        */
        private clearData(categories: string[]) {
            categories.forEach((category) => {
                if (category == "globalSelection") {
                    //Reset data from the global selection object
                }
                if (category == "MOLabelModule") {
                    //Reset data from the specific module or category
                    this.scope.MOLabelModule.MOList = [];
                }
                if (category == "inventoryLabelModule") {
                    //Reset data from the specific module or category
                    this.scope.inventoryLabelModule.inventoryItemList = [];
                }
            });
        }

        /**
        * Code for resetting reload status of all module's to stop showing loading indicator should be implemented here
        */
        private resetReloadStatus() {
            this.scope.MOLabelModule.reload = true;
            this.scope.inventoryLabelModule.reload = true;
        }

        /**
        * Call this function from the view when a tab/module is selected to load
        * @param moduleId the selected module id
        */
        private moduleSelected(moduleId: number) {
            this.scope.activeModule = moduleId;
            this.scope.modules.forEach((appmodule) => {
                if (angular.equals(moduleId, appmodule.moduleId)) {
                    appmodule.active = true;
                } else {
                    appmodule.active = false;
                }
            });
            this.storageService.setLocalData('h5.app.appName.module.selected', moduleId);
            this.loadData(this.scope.activeModule);
        }

        /**
        * This function will be called whenever the tab is selected, so add the functions calls with respect to the tab id
        * @param activeModule the module to activate/load
        */
        private loadData(activeModule: number) {
            this.refreshTransactionStatus();
            switch (activeModule) {
                case 1:
                    this.loadMOLabelModule(this.scope.MOLabelModule.reload);
                    break;
                case 2:
                    this.loadInventoryLabelModule(this.scope.inventoryLabelModule.reload);
                    break;
                case 3:
                    break;
                case 4:
                    break;
            }

        }

        /**
        * This function will be called to iterate over the transactions states of a tab and set the loading indicator to true if there any running transactions
        */
        private refreshTransactionStatus() {
            console.log("refreshTransactionStatus ");
            //Global Status
            let isLoading = false;
            for (let transaction in this.scope.transactionStatus) {
                let value = this.scope.transactionStatus[transaction];
                if (value == true) {
                    isLoading = true;
                    break;
                }
            }

            for (let transaction in this.scope.globalSelection.transactionStatus) {
                let value = this.scope.globalSelection.transactionStatus[transaction];
                if (value == true) {
                    isLoading = true;
                    break;
                }
            }
            this.scope.loadingData = isLoading;
            if (isLoading) { return; }

            switch (this.scope.activeModule) {
                case 1:
                    for (let transaction in this.scope.MOLabelModule.transactionStatus) {
                        let value = this.scope.MOLabelModule.transactionStatus[transaction];
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
        }

        //************************************************Application specific functions starts************************************************

        /**
         * Load Application Configurations
         */
        private loadAppConfig(company: string, division: string, user: string, environment: string): ng.IPromise<any> {
            let deferred = this.$q.defer();
            this.scope.appConfig = this.scope.globalConfig.appConfig;
            this.scope.appConfig.searchQuery = this.$location.search();
            this.scope.appConfig.enableM3Authority = true //added for security

            if (this.scope.appConfig.enableM3Authority) {
                this.scope.loadingData = true;
                this.scope.transactionStatus.appConfig = true;

                let programName = "LBZ100";
                let promise1 = this.appService.getAuthority(company, division, user, programName, 1).then((result: boolean) => {
                    this.scope.appConfig.authorizedUser = result;// added for security 
                });
                let promises = [promise1];
                this.$q.all(promises).finally(() => {
                    deferred.resolve(this.scope.appConfig);
                    this.scope.transactionStatus.appConfig = false;
                    this.refreshTransactionStatus();
                });
            } else {
                deferred.resolve(this.scope.appConfig);
            }
            return deferred.promise;
        }

        private filterZSYTAB(fileName: string, val: M3.IMIResponse): any {

            let filteredValues: Array<Object> = [];
            val.items.forEach(function(value) {
                if (value.KPID === fileName) {
                    filteredValues.push(value);
                }
            });

            return filteredValues;

        }
        private filterList(filterString: string, val: M3.IMIResponse): any {
            console.log("console.log(filteredValues.items);------------------------------------->>>>>>>>>>>>>>" + filterString);
            let filteredValues: Array<Object> = [];
            val.items.forEach(function(value) {
                if (value.ITNO === filterString) {
                    filteredValues.push(value);
                }
            });

            return filteredValues;

        }
        private loadPrinterList(): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.printerData = true;
            this.appService.lstPrinters().then((val: M3.IMIResponse) => {
                this.scope.globalSelection.printerData = val.items;
                this.scope.globalSelection.printer.selected = val.items[0];
                this.scope.globalSelection.transactionStatus.printerData = false;
                this.scope.globalSelection.printerExists = true;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.globalSelection.transactionStatus.printerData = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
            });
        }
        /**
        * Load the Printer 
        * 
        * @param user the company
        * @param user the m3 user
        */


        /**
               * Get Users Printer 
               * 
               * @param user the company
               * @param user the m3 user
               */
        private getPrinter(user: string): string {
            //this.scope.loadingData = true;
            //   this.scope.globalSelection.transactionStatus.defaultPrinter = true;
            let printer = ""
            //this.scope.globalSelection.transactionStatus.printer = true;
            this.appService.getUserPrinter(user).then((val1: M3.IMIResponse) => {
                this.scope.globalSelection.defaultPrinter = val1.items[0].DEV + "";
                this.scope.globalSelection.printer.selected = val1.items[0].DEV + "";
                this.scope.globalSelection.transactionStatus.defaultPrinter = false;
                this.refreshTransactionStatus();
                printer = val1.item.DEV;
            }, (err: M3.IMIResponse) => {
                this.appService.addPrintFile(user, "").then((val: any) => {
                    console.log("------------------------------I ADDED PRINTER " + printer);
                }, (err: any) => {
                    let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.refreshTransactionStatus();
                });
            });

            return printer;
        }
        /**
        * Load the MO List 
        * @param user the company
        * @param user the m3 user
        */
        private loadMOList(facility: string): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.MOList = true;
            this.appService.getMOList(facility).then((val: M3.IMIResponse) => {
                // added to joing Multiple Lists E.G. list of MOs and their Items + the Item's description
                //for (let item of val.items){
                //this.loadItemDescription(item.ITNO);                
                //  item.ITDS = "test"; //adds and sets item description
                //}
                this.scope.globalSelection.MOList = val.items;

                this.scope.MOLabelModule.MOListGrid.data = val.items; //added after adding the list
                this.gridService.adjustMOGridHeight("MOListGrid", val.items.length, 1000) //added to adjust grid height
                this.scope.globalSelection.transactionStatus.MOList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.globalSelection.transactionStatus.MOList = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
            });
        }

        /**
        * Load the Inventroy List 
        * @param user the company
        * @param user the m3 user
        */
        private loadInventoryItemList(warehouse: string): void {
            console.log(warehouse);
            this.scope.loadingData = true;
            this.scope.globalSelection.inventoryItemList = true;
            this.appService.getInventoryItemList(warehouse).then((val: M3.IMIResponse) => {

                this.scope.globalSelection.inventoryItemList = val.items;
                console.log(val.items);
                this.scope.inventoryLabelModule.inventoryItemListGrid.data = val.items; //added after adding the list
                this.gridService.adjustInventoryItemGridHeight("inventoryItemListGrid", val.items.length, 500) //added to adjust grid height
                this.scope.globalSelection.transactionStatus.inventoryItemList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.globalSelection.transactionStatus.inventoryItemList = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
            });
        }

        /**
        * Load the Inventroy List 
        * @param user the company
        * @param user the m3 user
        */
        private loadInventoryItemLotList(itemNumber: string): void {
            console.log(itemNumber);
            this.scope.loadingData = true;
            this.scope.globalSelection.inventoryItemLotList = true;
            this.appService.getInventoryItemLotList(itemNumber).then((val: M3.IMIResponse) => {
                let filteredValues: M3.IMIResponse = this.filterList(itemNumber, val);
                // this.scope.globalSelection.inventoryItemLotList = val.items;
                this.scope.globalSelection.inventoryItemLotList = val.items;
                console.log("console.log(filteredValues.items);------------------------------------->>>>>>>>>>>>>>" + itemNumber);
                console.log(filteredValues.items);
                this.scope.inventoryLabelModule.inventoryItemLotListGrid.data = val.items; //added after adding the list
                this.gridService.adjustInventoryItemGridHeight("inventoryItemLotListGrid", val.items.length, 500) //added to adjust grid height
                this.scope.globalSelection.transactionStatus.inventoryItemLotList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.globalSelection.transactionStatus.inventoryItemLotList = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
            });
        }

        /** 
        * Load the item (item)
        * @param company the company
        */
        private loadItem(itemNumber: string): void {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.item = true;
            this.appService.getItem(itemNumber).then((val: M3.IMIResponse) => {
                this.scope.globalSelection.item = val.items;
                this.scope.globalSelection.transactionStatus.item = false;
                this.refreshTransactionStatus();

            }, (err: M3.IMIResponse) => {
                this.scope.globalSelection.transactionStatus.item = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

            })

        }




        private displayMOLabel(fieldName: string, selectedRow: any): void { //POPUP

            this.scope.MOLabelModule.selectedMOLabelListRow = selectedRow;
            //  console.log(selectedRow);
            let MOLabel = selectedRow;

            this.loadMOLabel(this.scope.MOLabelModule.facility.selected, MOLabel.VHMFNO, MOLabel.VHITNO, MOLabel.VHWHLO, MOLabel.MMITDS, MOLabel.VHPLGR, MOLabel.MMSPE5, MOLabel.MMUNMS, "", MOLabel.MMSPE2, MOLabel.MMSPE3, MOLabel.MMEVGR, "", MOLabel.VHBANO, "1", MOLabel.VHORQT, MOLabel.VHMAUN);

            this.loadLabelTypeList();
            this.loadTradeNames();
            this.loadWorkCenters(this.scope.MOLabelModule.facility.selected);
            this.netGrossCheck();

            this.openMOLabelModal();
        }

        private displayInventoryItemLabel(fieldName: string, selectedRow: any) {
            this.scope.inventoryLabelModule.selectedInventoryItemLotListRow = selectedRow;
            //  console.log(selectedRow);
            let itemLot = selectedRow;
            let item = this.scope.inventoryLabelModule.selectedInventoryItemListRow;
            //  console.log(item);
            this.loadInventoryLabel(item.MLWHLO, itemLot.ITNO, item.MMITDS, itemLot.BANO, itemLot.REDA, itemLot.RORN, itemLot.BREF, itemLot.BRE2, item.MMUNMS, item.MLSTQT);

            this.openInventoryLabelModal();
        }


        private displayInventoryItemLot(fieldName: string, selectedRow: any): void { //POPUP

            this.scope.inventoryLabelModule.selectedInventoryItemListRow = selectedRow;
            this.scope.inventoryLabelModule.itemNumber = selectedRow.MLITNO;
            this.scope.inventoryLabelModule.location = selectedRow.MLWHSL;
            // console.log(selectedRow);               

            this.loadInventoryItemLotList(this.scope.inventoryLabelModule.itemNumber);
        }


        /**
        * Load the Warehouse (warehouses)
        * @param company the company
        */
        private loadWarehouseList(company: string): void {
            this.scope.loadingData = true;
            this.scope.inventoryLabelModule.transactionStatus.warehouseList = true;
            this.appService.getWarehouseList(company).then((val: M3.IMIResponse) => {
                this.scope.inventoryLabelModule.warehouseList = val.items;
                //  console.log(val.items);
                this.scope.inventoryLabelModule.transactionStatus.warehouseList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.inventoryLabelModule.transactionStatus.warehouseList = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
            });
        }

        /** //added
        * Load the facility (facility)
        * @param company the company
        */
        private loadFacilityList(company: string, division: string): void {
            this.scope.loadingData = true;
            this.scope.MOLabelModule.transactionStatus.facilityList = true;
            this.appService.getFacilityList(company, division).then((val: M3.IMIResponse) => {
                this.scope.MOLabelModule.facilityList = val.items;
                this.scope.MOLabelModule.transactionStatus.facilityList = false;
                //console.log(this.scope.globalSelection.facilityList);
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.MOLabelModule.transactionStatus.facilityList = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                this.refreshTransactionStatus();
            });

        }
        private loadLabelTypeList(): void {
            this.scope.loadingData = true;
            this.scope.MOLabelModule.transactionStatus.labelTypeList = true;
            this.appService.getLabelTypeListAlpha().then((val: M3.IMIResponse) => {
                let fileName = "LBLCUS"
                this.scope.MOLabelModule.labelTypeList = this.filterZSYTAB(fileName, val);
                this.scope.MOLabelModule.transactionStatus.labelTypeList = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.MOLabelModule.transactionStatus.labelTypeList = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                this.refreshTransactionStatus();
            });

        }

        private loadTradeNames(): void {
            this.scope.loadingData = true;
            this.scope.MOLabelModule.transactionStatus.tradeNames = true;
            this.appService.getTradeNameAlpha().then((val: M3.IMIResponse) => {
                let fileName = "ZZUDF8";
                this.scope.MOLabelModule.tradeNames = this.filterZSYTAB(fileName, val);
                //console.log(this.scope.MOLabelModule.tradeNames);
                this.scope.MOLabelModule.transactionStatus.tradeNames = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.MOLabelModule.transactionStatus.tradeNames = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                this.refreshTransactionStatus();
            });

        }

        private loadWorkCenters(facility: string): void {
            this.scope.loadingData = true;
            this.scope.MOLabelModule.transactionStatus.workCenters = true;
            this.appService.getWorkCenters(facility).then((val: M3.IMIResponse) => {
                this.scope.MOLabelModule.workCenters = val.items;
                this.scope.MOLabelModule.transactionStatus.workCenters = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.MOLabelModule.transactionStatus.workCenters = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                this.refreshTransactionStatus();
            });

        }

        private loadInventoryLabel(warehouse: string, itemNumber: string, itemDescription: string, lotNumber: string, receiptDate: string, referenceOrder: string, lotRef1: string, lotRef2: string, UOM: string, quantity: string): void {
            console.log(receiptDate);
            
            let year = receiptDate.slice(0, 4);
            let month = receiptDate.slice(4, 6);
            let day = receiptDate.slice(6, 8);

            let dateFMT = new Date(month + "/" + day + "/" + year);
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
        }

        private chgInventoryLabelAlpha(warehouse: string, itemNumber: string, location: string, receiptDate: string, lotNumber: string, referenceOrder: string, lotRef1: string, lotRef2: string, onHandBalance: string, labelType: string, userID: string, printer: string, labelsPerBox: string): void {
  console.log("iN chgInventoryLabelAlpha");
            this.scope.loadingData = true;
            this.scope.inventoryLabelModule.transactionStatus.inventoryLabel = true;
            this.appService.chgInventoryLabelAlpha(warehouse, itemNumber, location, receiptDate, lotNumber, referenceOrder, lotRef1, lotRef2, onHandBalance).then((val: M3.IMIResponse) => {
                this.scope.inventoryLabelModule.transactionStatus.inventoryLabel = false;
                  this.printInventoryLabel(labelType, warehouse, location, lotNumber, itemNumber, userID, printer, labelsPerBox);

            }, (err: M3.IMIResponse) => {
                this.scope.inventoryLabelModule.transactionStatus.inventoryLabel = false;
                    this.refreshTransactionStatus();
                    let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

             this.appService.addInventoryLabelAlpha(warehouse, itemNumber, location, receiptDate, lotNumber, referenceOrder, lotRef1, lotRef2, onHandBalance).then((val: M3.IMIResponse) => {
                    this.scope.inventoryLabelModule.transactionStatus.inventoryLabel = false;
  this.printInventoryLabel(labelType, warehouse, location, lotNumber, itemNumber, userID, printer, labelsPerBox);
                }, (err: M3.IMIResponse) => {
                    this.scope.inventoryLabelModule.transactionStatus.inventoryLabel = false;
                    this.refreshTransactionStatus();
                    let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

                })
            }).finally(() => {
              //  this.printInventoryLabel(labelType, warehouse, location, lotNumber, itemNumber, userID, printer, labelsPerBox);
                this.refreshTransactionStatus();//must be in both statements IF NOT IN FINALLY

            });
        }

        private loadMOLabel(facility: string, moNumber: string, itemNumber: string, warehouse: string, description: string, workCenter: string, tradeName: string, UOM: string, labelType: string, compound: string, color: string, MSD: string, info: string, lotNumber: string, startingBox: string, orderQty: string, altUOM: string): void {
            console.log("LOADING MO LABEL");
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.MOLabel = true;
            this.appService.getMOLabelFieldsAlpha(facility, moNumber, itemNumber, warehouse).then((valAlpha: M3.IMIResponse) => {
                console.log("LOADING getMOLabelFieldsAlpha");
                this.scope.MOLabelModule.MOLabelExists = true;


                this.appService.getMOLabelFieldsNumeric(facility, moNumber, itemNumber, warehouse).then((valNumeric: M3.IMIResponse) => {
                    console.log("LOADING getMOLabelFieldsNumeric");
                    this.scope.globalSelection.MOLabel = {
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

                    }

                    let appConfig = this.scope.appConfig;
                    let workCenter = angular.isString(appConfig.searchQuery.workCenter) ? appConfig.searchQuery.workCenter : this.scope.globalSelection.MOLabel.PLGR;
                    let tradeName = angular.isString(appConfig.searchQuery.tradeName) ? appConfig.searchQuery.tradeName : this.scope.globalSelection.MOLabel.SPE5;
                    let labelType = angular.isString(appConfig.searchQuery.labelType) ? appConfig.searchQuery.labelType : this.scope.globalSelection.MOLabel.FMTN;

                    this.scope.MOLabelModule.workCenter = { selected: workCenter };
                    this.scope.MOLabelModule.tradeName = { selected: tradeName };
                    this.scope.MOLabelModule.labelType = { selected: labelType };

                }, (err: M3.IMIResponse) => {
                    console.log("FAIL getMOLabelFieldsNumeric");
                    this.scope.globalSelection.transactionStatus.MOLabel = false;
                    this.refreshTransactionStatus();
                    let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

                });

                this.scope.globalSelection.transactionStatus.MOLabel = false;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                console.log("FAIL getMOLabelFieldsALPHA");
                this.scope.MOLabelModule.MOLabelExists = false;
                this.scope.globalSelection.transactionStatus.MOLabel = false;
                this.refreshTransactionStatus();

                this.appService.addMOLabelFieldsAlpha(facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber).then((val: M3.IMIResponse) => {
                    //creates MOLabel in cugex then calls again
                    this.appService.addMOLabelFieldsNumeric(facility, moNumber, itemNumber, warehouse, "1").then((valAlpha: M3.IMIResponse) => {
                        //creates MOLabel in cugex then calls again

                        this.scope.MOLabelModule.MOLabelExists = true;

                        this.appService.getMOLabelFieldsAlpha(facility, moNumber, itemNumber, warehouse).then((valAlpha: M3.IMIResponse) => {
                            this.scope.MOLabelModule.MOLabelExists = true;

                            this.appService.getMOLabelFieldsNumeric(facility, moNumber, itemNumber, warehouse).then((valNumeric: M3.IMIResponse) => {
                                this.scope.globalSelection.MOLabel = {
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

                                }

                                let appConfig = this.scope.appConfig;
                                let workCenter = angular.isString(appConfig.searchQuery.workCenter) ? appConfig.searchQuery.workCenter : this.scope.globalSelection.MOLabel.PLGR;
                                let tradeName = angular.isString(appConfig.searchQuery.tradeName) ? appConfig.searchQuery.tradeName : this.scope.globalSelection.MOLabel.SPE5;
                                let labelType = angular.isString(appConfig.searchQuery.labelType) ? appConfig.searchQuery.labelType : this.scope.globalSelection.MOLabel.FMTN;

                                this.scope.MOLabelModule.workCenter = { selected: workCenter };
                                this.scope.MOLabelModule.tradeName = { selected: tradeName };
                                this.scope.MOLabelModule.labelType = { selected: labelType };

                            }, (err: M3.IMIResponse) => {
                                this.scope.globalSelection.transactionStatus.MOLabel = false;
                                this.refreshTransactionStatus();
                                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                                this.showError(error, [err.errorMessage]);
                                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

                            });

                            this.scope.globalSelection.transactionStatus.MOLabel = false;
                            this.refreshTransactionStatus();
                        }, (err: M3.IMIResponse) => {
                            this.scope.globalSelection.transactionStatus.MOLabel = false;
                            this.refreshTransactionStatus();
                            let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                            this.showError(error, [err.errorMessage]);
                            this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                        });


                        this.scope.globalSelection.transactionStatus.MOLabel = false;
                        this.refreshTransactionStatus();
                    }, (err: M3.IMIResponse) => {
                        this.scope.globalSelection.transactionStatus.MOLabel = false;
                        this.refreshTransactionStatus();
                        let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        this.showError(error, [err.errorMessage]);
                        this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

                    });
                }, (err: M3.IMIResponse) => {
                    this.scope.globalSelection.transactionStatus.MOLabel = false;
                    this.refreshTransactionStatus();
                    let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            });
        }

        private updMOLabel(facility: string, moNumber: string, itemNumber: string, warehouse: string, description: string, workCenter: string, tradeName: string, UOM: string, labelType: string, compound: string, color: string, MSD: string, info: string, lotNumber: string, startingBox: string): void {
            console.log("IN updMOLabel METHOD");
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.MOLabel = true;
            this.appService.chgMOLabelFieldsAlpha(facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber).then((val: M3.IMIResponse) => {

                this.appService.chgMOLabelFieldsNumeric(facility, moNumber, itemNumber, warehouse, startingBox).then((val: M3.IMIResponse) => {

                    this.scope.globalSelection.transactionStatus.MOLabel = false;
                    this.loadMOList(facility); //reload

                }, (err: M3.IMIResponse) => {
                    console.log("ERROR IN  chgMOLabelFieldsNumeric METHOD");
                    this.scope.globalSelection.transactionStatus.MOLabel = false;
                    let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

                })


            }, (err: M3.IMIResponse) => {
                console.log("ERROR IN  chgMOLabelFieldsAlpha METHOD");
                this.scope.globalSelection.transactionStatus.MOLabel = false;
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

            }).finally(() => {
                this.refreshTransactionStatus();//must be in both statements IF NOT IN FINALLY

            });

        }

        private updSuffix(facility: string, moNumber: string, itemNumber: string, warehouse: string, boxNumber: string, labelType: string, responsible: string, altUOM: string, lotNumber: string,
            workCenter: string, grossWeight: string, netWeight: string, altGrossWeight: string, altNetWeight: string, startingBox: string, scanQty: string, lastBox: string, labelsPerBox: any): boolean {
            let ret = false;
            console.log("in updSuffix");
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.MOLabel = true;

            this.appService.chgMOLabelSuffixAlpha(facility, moNumber, itemNumber, warehouse, boxNumber, altUOM, lotNumber, workCenter, labelType, responsible).then((val: M3.IMIResponse) => {
                console.log("ALPHA CHANGED");
                this.appService.chgMOLabelSuffixNumeric(facility, moNumber, itemNumber, warehouse, boxNumber, grossWeight, netWeight, altGrossWeight, altNetWeight, startingBox, scanQty, lastBox).then((val: M3.IMIResponse) => {
                    this.scope.globalSelection.transactionStatus.MOLabel = false;
                    // this.refreshTransactionStatus();
                    console.log("NUMERIC CHANGED");
                }, (err: M3.IMIResponse) => {
                    console.log("****" + err.errorField);
                    console.log("****" + err.errorMessage + " now in  chgMOLabelSuffixNumeric");
                    this.scope.globalSelection.transactionStatus.MOLabel = false;
                    // this.refreshTransactionStatus();
                    let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });

            }, (err: M3.IMIResponse) => {
                console.log("****" + err.errorMessage + " now in  add");
                this.scope.MOLabelModule.suffixExists = false;
                this.scope.globalSelection.transactionStatus.MOLabel = false;
                // this.refreshTransactionStatus();
                console.log(facility, moNumber, itemNumber, warehouse, boxNumber, altUOM, lotNumber, workCenter, labelType, responsible);
                this.appService.addMOLabelSuffixAlpha(facility, moNumber, itemNumber, warehouse, boxNumber, altUOM, lotNumber, workCenter, labelType, responsible).then((val: M3.IMIResponse) => {
                    console.log("in addMOLabelSuffixAlpha");
                    this.appService.addMOLabelSuffixNumeric(facility, moNumber, itemNumber, warehouse, boxNumber, grossWeight, netWeight, altGrossWeight, altNetWeight, startingBox, scanQty, lastBox).then((val: M3.IMIResponse) => {
                        console.log("in addMOLabelSuffixNumeric");
                        this.scope.globalSelection.transactionStatus.MOLabel = false;
                        //  this.refreshTransactionStatus();
                    }, (err: M3.IMIResponse) => {
                        console.log("1598 " + err.errorMessage);
                        this.scope.globalSelection.transactionStatus.MOLabel = false;
                        ///  this.refreshTransactionStatus();
                        let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                        this.showError(error, [err.errorMessage]);
                        this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                    });
                }, (err: M3.IMIResponse) => {
                    console.log("1606 " + err.errorMessage);
                    this.scope.globalSelection.transactionStatus.MOLabel = false;
                    // this.refreshTransactionStatus();
                    let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });
                });
            }).finally(() => {
                // console.log(labelsPerBox);
                  this.printMOLabel(labelType, facility, moNumber, boxNumber.toString(), itemNumber, this.scope.userContext.m3User, this.scope.globalSelection.printer.selected.DEV, labelsPerBox);                         
                this.refreshTransactionStatus();//must be in both statements IF NOT IN FINALLY
            });
            return ret;
        }


        private printInventoryLabel(labelType: string, warehouse: string, location: string, lotNumber: string, itemNumber: string, userID: string, printer: string, labelsPerBox: any) {

            this.scope.loadingData = true
            this.appService.addXMLRecord(labelType, warehouse, location, lotNumber, null, itemNumber, userID).then((val: M3.IMIResponse) => {
                console.log("XML record saved 1681 ");
                console.log(labelsPerBox);
                for (let y = 1; y <= labelsPerBox; y++) {
                    this.callInventoryLabelPrint(itemNumber, printer, labelType, warehouse, location, lotNumber, labelsPerBox);
                }
            }, (err: M3.IMIResponse) => {
                this.appService.chgXMLRecord(labelType, warehouse, location, lotNumber, null, itemNumber, userID).then((val: M3.IMIResponse) => {
                    console.log("XML record saved 1688");
                    console.log(labelsPerBox);
                    for (let y = 1; y <= labelsPerBox; y++) {
                        this.callInventoryLabelPrint(itemNumber, printer, labelType, warehouse, location, lotNumber, labelsPerBox);
                    }
                }, (err: M3.IMIResponse) => {
                    console.log("Fail");
                    let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

                })
            }).finally(() => {
                this.refreshTransactionStatus();//must be in both statements IF NOT IN FINALLY

            });

        }

        private callInventoryLabelPrint(itemNumber: string, printer: string, labelType: string, warehouse: string, location: string, lotNumber: string, labelsPerBox: any) {
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.MOLabel = true;
            this.appService.printInventoryLabel(itemNumber, printer, labelType, warehouse, location, lotNumber, labelsPerBox).then((val: M3.IMIResponse) => {

                console.log("Inventory Label Successfully Printed");
                this.showInfo("Inventory Label Successfully Printed", ["Inventory Label Printed"]);
                this.scope.globalSelection.transactionStatus.MOLabel = false;
                this.loadMOList(warehouse); //reload
            }, (err: M3.IMIResponse) => {
                this.scope.globalSelection.transactionStatus.MOLabel = false;
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

            }).finally(() => {
                this.refreshTransactionStatus();//must be in both statements IF NOT IN FINALLY

            });

        }

        private printMOLabel(labelType: string, facility: string, moNumber: string, boxNumber: string, itemNumber: string, userID: string, printer: string, labelsPerBox: any) {
            this.scope.loadingData = true
            this.appService.addXMLRecord(labelType, facility, moNumber, boxNumber, null, itemNumber, userID).then((val: M3.IMIResponse) => {
                console.log("XML record ADDED 17344");
                console.log(labelsPerBox);
                for (let y = 1; y <= labelsPerBox; y++) {
                    this.callMOLabelPrint(itemNumber, printer, labelType, facility, moNumber, boxNumber, labelsPerBox);
                }
                this.refreshTransactionStatus();//must be in both statements IF NOT IN FINALLY
            }, (err: M3.IMIResponse) => {
                this.appService.chgXMLRecord(labelType, facility, moNumber, boxNumber, null, itemNumber, userID).then((val: M3.IMIResponse) => {
                    console.log("ADD Fail XML INSTEAD XML record SAVED 1747");
                    for (let y = 1; y <= labelsPerBox; y++) {
                        this.callMOLabelPrint(itemNumber, printer, labelType, facility, moNumber, boxNumber, labelsPerBox);
                    }
                    this.refreshTransactionStatus();//must be in both statements IF NOT IN FINALLY
                }, (err: M3.IMIResponse) => {
                    console.log("CHANGED Fail XML");
                    let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                    this.showError(error, [err.errorMessage]);
                    this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

                })

            }).finally(() => {
                //  this.refreshTransactionStatus();//must be in both statements IF NOT IN FINALL  
            });

        }
        //PRINTER GETS ADDED
        private callMOLabelPrint(itemNumber: string, printer: string, labelType: string, facility: string, moNumber: string, boxNumber: string, labelsPerBox: string): void {
            let user = this.scope.userContext.m3User;
            this.scope.loadingData = true;
            this.scope.globalSelection.transactionStatus.MOLabel = true;
            //user has printer
            //no printer add selected printer
            this.appService.printMOLabel(itemNumber, printer, labelType, facility, moNumber, boxNumber, labelsPerBox).then((val: M3.IMIResponse) => {

                console.log("Mo Label Successfully Printed");
                this.showInfo("Mo Label Successfully Printed", ["MO Label Printed"]);
                this.scope.globalSelection.transactionStatus.MOLabel = false;
                this.loadMOList(facility); //reload

            }, (err: M3.IMIResponse) => {
                this.scope.globalSelection.transactionStatus.MOLabel = false;
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

            }).finally(() => {
                this.refreshTransactionStatus();//must be in both statements IF NOT IN FINALLY

            });


        }
        private getConversionFactor(itemNumber: string, UOM: string, altUOM: string, netWeight, grossWeight) {
            this.scope.loadingData = true;
            this.scope.MOLabelModule.transactionStatus.itemAltWeight = true;
            this.appService.getItemAltUOM(itemNumber, altUOM).then((val: M3.IMIResponse) => {
                this.scope.MOLabelModule.transactionStatus.itemAltWeight = false;
                //this.scope.globalSelection.itemAltUOM;

                let MUALUN = val.items[0];
                let net;
                let gross;
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
                this.scope.MOLabelModule.itemAltWeight.netWeight = net;
                this.refreshTransactionStatus();
            }, (err: M3.IMIResponse) => {
                this.scope.MOLabelModule.transactionStatus.itemAltWeight = false;
                this.refreshTransactionStatus();
                let error = "API: " + err.program + "." + err.transaction + ", Input: " + JSON.stringify(err.requestData) + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.scope.statusBar.push({ message: error + " " + err.errorMessage, statusBarMessageType: h5.application.MessageType.Error, timestamp: new Date() });

            });
        }

        /**
        * Load the Item MO
        * @param reLoad the reLoad flag reference
        */
        private loadMOLabelModule(reLoad: boolean): void {
            let userContext = this.scope.userContext;

            if (reLoad) {
                this.clearData(["MOLabelModule"]);
                let selectedFacility = this.scope.MOLabelModule.facility;
                if (selectedFacility.selected) {
                    this.loadMOList(selectedFacility.selected);
                }
            }

            //Add functions calls / business logics below which are required when this module is requested to load by an user


            //console.log(userContext.company);
            //console.log(JSON.stringify(selectedWarehouse));

            this.scope.MOLabelModule.reload = false;
        }

        /**
        * Load the Inventory
        * @param reLoad the reLoad flag reference
        */
        private loadInventoryLabelModule(reLoad: boolean): void {
            let userContext = this.scope.userContext;
            this.scope.inventoryLabelModule.itemNumber = "";
            if (reLoad) {
                this.clearData(["inventoryLabelModule"]);
                let selectedWarehouse = this.scope.inventoryLabelModule.warehouse;
                if (selectedWarehouse.selected) {
                    this.loadInventoryItemList(selectedWarehouse.selected);
                }
            }



            this.scope.inventoryLabelModule.reload = false;
        }

        private submitMOForm(isValid: boolean): void {
            if (isValid) {
                this.onMOPrint();
            } else {
                console.log("not printed");
            }
        }

        private submitInventoryForm(isValid: boolean): void {
            if (isValid) {
                this.onInventoryPrint();
            } else {
                console.log("not printed");
            }
        }

        private onInventoryPrint(): void {
            let userContext = this.scope.userContext;
            let warehouse = this.scope.globalSelection.inventoryLabel.WHLO;
            let location = this.scope.inventoryLabelModule.location;
            let itemNumber = this.scope.globalSelection.inventoryLabel.ITNO;
            let itemDescription = this.scope.globalSelection.inventoryLabel.ITDS;
            let lotNumber = this.scope.globalSelection.inventoryLabel.BANO;
            let receiptDate = new Date(this.scope.globalSelection.inventoryLabel.REDA).toLocaleDateString('en-US');
            let receiptDate2: Date = new Date(this.scope.globalSelection.inventoryLabel.REDA );
            let referenceOrder = this.scope.globalSelection.inventoryLabel.RORN;
            let lotRef1 = this.scope.globalSelection.inventoryLabel.BREF;
            let lotRef2 = this.scope.globalSelection.inventoryLabel.BRE2;
            let UOM = this.scope.globalSelection.inventoryLabel.UNMS;
            let quantity = this.scope.globalSelection.inventoryLabel.STQT;
            let numOfBoxes = this.scope.globalSelection.inventoryLabel.BXNO;
            let labelsPerBox = this.scope.globalSelection.inventoryLabel.LBPB;
            let multipleLabels = this.scope.globalSelection.inventoryLabel.MULT;
            let labelType = "P95";
            let userID = this.scope.userContext.m3User;
            let printer = this.scope.globalSelection.printer.selected.DEV; 2
            receiptDate =  new Date(receiptDate).toLocaleDateString('en-US');
       
            let dateYear = receiptDate2.getFullYear();
            let dateMonth = receiptDate2.getMonth()+1;
            let dateDay = receiptDate2.getDate();
            console.log("  receiptDate2getDate= " + receiptDate2.getDate());
            console.log("  dateYear = " + dateYear);
            console.log("  dateMonth) = " + dateMonth);
            console.log("  dateDay) = " + dateDay);
            let dateFMT = (dateMonth + "/" + dateDay + "/" + dateYear);
            receiptDate = dateFMT;
            console.log("onInventoryPrint  receiptDate = " + receiptDate);
            console.log("new Date(this.scope.globalSelection.inventoryLabel.REDA )= " +new Date(this.scope.globalSelection.inventoryLabel.REDA ).toDateString());
            this.chgInventoryLabelAlpha(warehouse, itemNumber, location, receiptDate, lotNumber, referenceOrder, lotRef1, lotRef2, quantity, labelType, userID, printer, labelsPerBox);            if (multipleLabels === false) {
                this.closeModalWindow();
            }
        }

        private onMOPrint(): void {
            //get data
            console.log("MO label print start");
            let userContext = this.scope.userContext;
            let facility = this.scope.globalSelection.MOLabel.FACI;
            let moNumber = this.scope.globalSelection.MOLabel.MFNO;
            let itemNumber = this.scope.globalSelection.MOLabel.ITNO;
            let warehouse = this.scope.globalSelection.MOLabel.WHLO;
            let description = this.scope.globalSelection.MOLabel.ITDS;
            let workCenter = this.scope.MOLabelModule.workCenter.selected;
            let tradeName = this.scope.MOLabelModule.tradeName.selected;
            let UOM = this.scope.globalSelection.MOLabel.UNMS;
            let labelType = this.scope.MOLabelModule.labelType.selected;
            let compound = this.scope.globalSelection.MOLabel.SPE2;
            let color = this.scope.globalSelection.MOLabel.SPE3;
            let MSD = this.scope.globalSelection.MOLabel.EVGR;
            let info = this.scope.globalSelection.MOLabel.ADTL;
            let lotNumber = this.scope.globalSelection.MOLabel.BANO;
            let startingBox = this.scope.globalSelection.MOLabel.BOXN;
            let grossWeight = this.scope.globalSelection.MOLabel.ORQG;
            let netWeight = this.scope.globalSelection.MOLabel.ORQN;
            let numOfBoxes = this.scope.globalSelection.MOLabel.BXNO;
            let labelsPerBox = this.scope.globalSelection.MOLabel.LBPB;
            let lastBox = this.scope.globalSelection.MOLabel.REND;
            let scanQty = this.scope.globalSelection.MOLabel.ORQT;
            let responsible = userContext.m3User;
            let altUOM = this.scope.globalSelection.MOLabel.MAUN;
            let altGrossWeight = grossWeight;
            let altNetWeight = netWeight;
            let selectedPrinter = this.scope.globalSelection.printer.selected.DEV + "";




            // CHECK SELECTED PRINTER 
            // CHECK USER PRINTER
            //this.updPrinterFile(selectedPrinter,this.scope.globalSelection.defaultPrinter);/*
            //IF BOTH BLANK h
            //STOP SEND ERROR TO CHOOSE PRINTER
            let boxNum = startingBox;
            let sfxBANO;
            //Convert data                            
            if (this.isLBSFacility()) {
                this.getConversionFactor(itemNumber, UOM, altUOM, netWeight, grossWeight);
                let itemAltWeight = this.scope.MOLabelModule.itemAltWeight;
                altGrossWeight = itemAltWeight.grossWeight;
                altNetWeight = itemAltWeight.netWeight;
            }
            //outer loop
            for (let x = 1; x <= numOfBoxes; x++) {
                // inner loop prints the MOLabels per side   
                sfxBANO = lotNumber + this.padBoxNumber(boxNum.toString());
                //console.log("sfx bano = " + sfxBANO);
                this.updMOLabel(facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber, startingBox);
                // this.printMOLabel(labelType, facility, moNumber, boxNumber.toString(), itemNumber, this.scope.userContext.m3User, this.scope.globalSelection.printer.selected.DEV, labelsPerBox);
                //this.printMOLabel(labelType, facility, moNumber, startingBox.toString(), itemNumber, this.scope.userContext.m3User, this.scope.globalSelection.printer.selected.DEV, labelsPerBox);
                console.log("PRINTED MOLABEL ");
                if (this.updSuffix(facility, moNumber, itemNumber, warehouse, boxNum, labelType, responsible, altUOM, sfxBANO,
                    workCenter, grossWeight, netWeight, altGrossWeight, altNetWeight, startingBox, scanQty, lastBox, labelsPerBox)) {
                    console.log("********                 UPDATEDLBLSFX ");
                }
                boxNum++;
            }
            console.log("AFTER LOOP UPDATE MOLABEL NEXT");
            this.updMOLabel(facility, moNumber, itemNumber, warehouse, description, workCenter, tradeName, UOM, labelType, compound, color, MSD, info, lotNumber, boxNum);


            this.closeModalWindow();

        }
        private updPrinterFile() {
            let user = this.scope.userContext.m3User;
            let userPrinter = this.scope.globalSelection.printer.selected;
            //add printer
             // check printer 
            console.log("userPrinter " + userPrinter);
            //update to selected printer
            this.appService.updPrintFile(user, userPrinter).then((val: any) => {
            }, (err: any) => {
                let error = "API: " + err.program + "." + err.transaction + ", Error Code: " + err.errorCode;
                this.showError(error, [err.errorMessage]);
                this.refreshTransactionStatus();
            });

        }
        // VALIDACTION SECTION
        private padBoxNumber(boxNumber: string): string {
            let paddedBoxNumber = "";

            if (boxNumber.length === 1) {
                paddedBoxNumber = "00" + boxNumber;
            } else if (boxNumber.length === 2) {
                paddedBoxNumber = "0" + boxNumber;
            } else if (boxNumber.length === 3) {
                //do nothing   
            }

            return paddedBoxNumber

        }
        //eventually check if facility is a pounds facility.... with zzblc file
        public isLBSFacility(): boolean {
            return false;
        }

        public printCheck(): boolean {

            let workCenter = this.scope.globalSelection.MOLabel.PLGR;
            let tradeName = this.scope.globalSelection.MOLabel.SPE5;
            let labelType = this.scope.globalSelection.MOLabel.FMTN;
            let compound = this.scope.globalSelection.MOLabel.SPE2;
            let color = this.scope.globalSelection.MOLabel.SPE3;
            let MSD = this.scope.globalSelection.MOLabel.EVGR;
            let info = this.scope.globalSelection.MOLabel.ADTL;
            let lotNumber = this.scope.globalSelection.MOLabel.BANO;
            let startingBox = this.scope.globalSelection.MOLabel.BOXN;
            let grossWeight = this.scope.globalSelection.MOLabel.ORQG;
            let netWeight = this.scope.globalSelection.MOLabel.ORQN;
            let numOfBoxes = this.scope.globalSelection.MOLabel.BXNO;
            let labelsPerBox = this.scope.globalSelection.MOLabel.LBPB;

            return true
        }

        public netGrossCheck(): void {
            if (this.scope.globalSelection.MOLabel.ORQN > this.scope.globalSelection.MOLabel.ORQG) {
                this.scope.MOLabelModule.netNotLargerThanGross = false;
            } else {
                this.scope.MOLabelModule.netNotLargerThanGross = true;
            }
        }


        //*************************************************Application specific functions ends*************************************************/

    }
}