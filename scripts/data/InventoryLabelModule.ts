module h5.application {
    export interface IInventoryLabelModule {

        reload: boolean;
        transactionStatus: {
            warehouseList: boolean;
            InventoryList: boolean;

            sfx: boolean;
            itemAltWeight: boolean;
            
            inventoryLabel: boolean;
        };

        warehouseList: any;
        warehouse: any;
        
        itemNumber: any;
        location: any;

        inventoryItemList: any;
        inventoryItemListGrid: IUIGrid;
        selectedInventoryItemListRow: any;
        selectedInventoryItem: any;
        
        displayInventoryItemLot?(fieldName: string, rowEntity: any): any;

        inventoryItemLotList: any;
        inventoryItemLotListGrid: IUIGrid;
        selectedInventoryItemLotListRow: any;
        selectedInventoryItemLot: any;
        
        displayInventoryItemLabel?(fieldName: string, rowEntity: any): any;

        printInventoryLabel: any;
        inventoryLabelExists: boolean;
        suffixExists: boolean;

        sfx: any;
        itemAltWeight: any;
    }
}