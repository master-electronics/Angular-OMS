import { LevelLimit } from "./LevelLimit";

export interface Template {
    name?: string;
    id?: number;
    selectedColumns?: string;
    userId?: number;
    limits?: LevelLimit[];
}