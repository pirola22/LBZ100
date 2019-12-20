module h5.application {

    export interface IGlobalSelection {

        reload: boolean;
        transactionStatus: {
            warehouseList: boolean;

            printerData: boolean;
            printer: boolean;

            MOList: boolean;
            MOLabel: boolean;

            inventoryItemList: boolean;
            inventoryItemLotList: boolean;
            inventoryLabel: boolean;
            
            //Address label
            openDeliveryList: boolean;
            deliveryLineList: boolean;
            addressLabel: boolean;

            item: boolean;
            defaultPrinter: any;

        };
        warehouseList: any;
        warehouse: any;
        printerData: any;
        printer: any;
        defaultPrinter: any;
        MOList: any;
        MO: any;
        MOLabel: any;
        inventoryItemList: any;
        inventoryItemLotList: any;
        inventoryItem: any
        inventoryLabel: any;
        
        //address label
        openDeliveryList: any;
        deliveryLineList: any;
        openDelivery: any
        addressLabel: any;
        item: any;
        printerExists: boolean;



    }
}