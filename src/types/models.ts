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
    joinTable?: string | null;
    name: string;
    comment: string;
    crateTime: string;
    updateTime: string;
    currentUserToken: string;
}

interface ColumnEntity {
    id?: number;
    type: string;
    tableID: number;
    columnHash: string;
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

// 클라이언트 용
interface MenuItem {
    path: string;
    text: string;
}