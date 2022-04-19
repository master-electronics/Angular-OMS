import { LevelLimit } from "./LevelLimit";

export interface Template {
    name?: String;
    id?: Number;
    selectedColumns?: String;
    userId?: Number;
    limits?: LevelLimit[];
}