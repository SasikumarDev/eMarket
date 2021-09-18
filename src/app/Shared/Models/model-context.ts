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
}