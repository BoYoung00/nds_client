interface VcsFileEntity {
    id?: number;
    path: string;
    checkSum: string;
    createTime: string;
    isCurrent: string;
    databaseID: number;
}

interface ApiInfoEntity {
    id?: number;
    path: string;
    filterOption: string;
    tableHash: string;
}

interface MediaEntity {
    id?: number;
    name: string;
    updateTime: string;
    createUserToken: string;
    tableID: number;
}

interface VideoEntity {
    id?: number;
    name: string;
    updateTime: string;
    createUserToken: string;
    tableID: number;
}

interface DataBaseEntity {
    id?: number;
    name: string;
    comment: string;
    currentUserToken: string;
}

interface TableEntity {
    id?: number;
    tableHash: string;
    name: string;
    comment: string;
    crateTime: string;
    updateTime: string;
    currentUserToken: string;
    dataBaseID: number;
}

interface ColumnEntity {
    id?: number;
    type: string;
    name: string;
    tableID: number;
    columnHash: string;
    joinTableHash?: string | null;
    joinColumn?: string | null;
    isNotNull: number;
    isPrimaryKey: number;
    isForeignKey: number;
    isUniqueKey: number;
}

interface IntData {
    id?: number;
    data: number;
    createTime: number;
    columnID: number;
    lineHash: string;
}

interface RealData {
    id?: number;
    data: number;
    createTime: number;
    columnID: number;
    lineHash: string;
}

interface TextData {
    id?: number;
    data: number;
    createTime: number;
    columnID: number;
    lineHash: string;
}

// New Column 통신 요청용 타입
interface RowState {
    columnName: string;
    dataType: string;
    pk: boolean;
    fk: boolean;
    uk: boolean;
    isNotNull: boolean;
    joinTable: string | null;
    joinColumn : string | null;
    [key: string]: any;
}