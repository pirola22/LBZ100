module h5.application {

    export interface IGlobalSelection {

        reload: boolean;
        transactionStatus: {
            warehouseList: boolean;
            facilityList: boolean; 
            printerData: boolean;
            printDescriptionData: boolean;

        };
        warehouseList: any;
        warehouse: any;
        facilityList: any; 
        facility: any; 
        printerData: any;
        printer: any;
        printDescriptionData: any;
        printDescription: any;

    }
}