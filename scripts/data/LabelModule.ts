module h5.application {
    export interface ILabelModule {
        
        reload: boolean;
        transactionStatus: {
            labelList: boolean;
            addLabel: boolean;
            
        };
        labelList: any;
        labelListGrid: IUIGrid;
        selectedLabelListRow: any;
        addLabel: any;
    }
}