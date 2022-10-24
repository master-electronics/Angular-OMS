export interface Datacolumn {
  Name: string;
  Nullable: boolean;
  DataType: string;
  MaxLength: number;
  PrimaryKey: boolean;
  SearchVisible: boolean;
  SearchActive: boolean;
  sortFn: (a: [], b: []) => number;
}
