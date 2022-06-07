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
    id?: Number;
    templateId?: Number;
    eventName?: String;
    eventId?: Number;
    lowLevelLimit?: Number;
    mediumLevelLimit?: Number;
}

export interface Template {
    name?: String;
    id?: Number;
    selectedColumns?: String;
    userId?: Number;
    limits?: LevelLimit[];
}