export interface Column {
    name: string;
    title: string;
    colSpan: string;
    position: number;
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