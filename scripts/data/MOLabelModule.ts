module h5.application {
    export interface IMOLabelModule {
        
        reload: boolean;
        transactionStatus: {
            facilityList: boolean; 
            
            MOList: boolean;     
            tradeNames: boolean;
            workCenters: boolean; 
            labelTypeList: boolean;
            sfx: boolean;
            itemAltWeight: boolean;
        };
        
        facilityList: any; 
        facility: any; 
        
        MOList: any;
        MOListGrid: IUIGrid;
        selectedMOLabelListRow: any;
        selectedMOLabelItem: any;
        
        tradeNames: any;
        tradeName: any;
        workCenters: any;
        workCenter: any;
        
        labelTypeList: any;
        labelType: any;
        
        printMOLabel: any;
        displayMOLabel?(fieldName: string, rowEntity: any): any;
        MOLabelExists: boolean;
        suffixExists: boolean;
        
        sfx: any;
        itemAltWeight: any;
        
        netNotLargerThanGross: boolean;
    }
}