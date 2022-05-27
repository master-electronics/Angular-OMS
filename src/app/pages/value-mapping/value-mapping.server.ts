export interface EntityTable {
    label: string;
    value: number;
    //_id: number;
    //TableName: string;
}

export interface EntityColumn {
    _id: number;
    ColumnName: string;
    EntityID: number;
}