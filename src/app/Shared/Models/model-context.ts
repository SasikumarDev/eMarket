export interface ModelContext {
}

export interface Login {
    email: string;
    Password: string;
}

export interface Category {
    CID: string;
    CDesc: string;
    CImgpath: string;
    CStatus: string;
}

export interface ListingRouteParams {
    Menu: string;
    Redirect: string;
    FormMode: string;
    Keys: string;
}

export interface ListingColDef {
    field: string;
    header: string;
    dataType: string;
    subField?: string;
    cssClass?:string;
}

export interface UOM {
UOMUID: string;
UOMDesc: string;
}

export interface Product {
    PrdId: string;
    PrdName: string;
    PrdCat: string;
    PrdPrice: number;
    PrdStock: boolean;
    PrdUOM: string;
    PrdIsCustomisable: boolean;
    PrdImg: string;
}
