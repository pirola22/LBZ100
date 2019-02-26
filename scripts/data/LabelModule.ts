module h5.application {
    export interface ILabelModule {
        
        reload: boolean;
        transactionStatus: {
            labelDetails: boolean;
            
        };
        labelDetails: any;
    }
}