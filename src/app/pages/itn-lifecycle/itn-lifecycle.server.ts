export interface Column {
    name: string;
    title: string;
    dataName?: string;
    colSpan: string;
    position: number;
    width?: string;
    eventGroup?: string;
    eventName?: string;
    searchable?: boolean;
    drilldown?: boolean;
}

export interface LevelLimit {
    id?: number;
    templateId?: number;
    eventName?: string;
    eventId?: number;
    lowLevelLimit?: number;
    mediumLevelLimit?: number;
}

export interface Template {
    name?: string;
    id?: number;
    selectedColumns?: string;
    userId?: number;
    limits?: LevelLimit[];
}