module h5.application {
    export interface IAddressLabelModule {

        reload: boolean;
        transactionStatus: {
            warehouseList: boolean;
            AddressList: boolean;
            addressLabel: boolean;
        };
        warehouseList: any;
        warehouse: any;
        orderNumber: any;
        orderLine: any;
        popn: any;
        cuor: any;
        lineSfx: any;
        deliveryNumber: any;
        itemNumber: any;
        openDeliveryList: any;
        selectedOpenDeliveryListRow: any;
        selectedOpenDelivery: any;
        deliveryLineList: any;
        openDeliveryListGrid: IUIGrid;
        deliveryLineListGrid: IUIGrid;
        selectedOpenDeliveryLotListRow: any;
        selectedOpenDeliveryLot: any;
        displayOpenDeliveryLine?(fieldName: string, rowEntity: any): any;
        displayOpenDeliveryLabel?(fieldName: string, rowEntity: any): any;
        printAddressLabel: any;
    }
}