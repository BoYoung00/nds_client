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
    data: string;
    createTime: string;
    columnID: number;
    lineHash: string;
}

interface RealData {
    id?: number;
    data: string;
    createTime: string;
    columnID: number;
    lineHash: string;
}

interface TextData {
    id?: number;
    data: string;
    createTime: string;
    columnID: number;
    lineHash: string;
}

// 테이블 생성 Column 통신 요청용 타입
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

// 테이블, 행, 데이터 Response 타입
interface ColumnData {
    id?: number | null;
    data: string;
    createTime: string;
    columnID: number;
    lineHash: string;
    dataType: string;
}

interface TableInnerStructure {
    [key: string]: ColumnData[];
}

interface TableData {
    id: number ;
    name: string;
    comment: string;
    createTime: string;
    tableHash: string;
    tableInnerStructure: TableInnerStructure;
}

// 데이터 추가, 수정, 삭제 Request 타입
interface DataDTO {
    id?: number | null;
    columnID: number;
    columnHash: string;
    data: string;
    columnLine: number;
    dataType: string;
}

interface DataRequest {
    tableID: number;
    tableHash: string;
    createDataRequests: DataDTO[]; // 생성 데이터
    updateDataRequests: DataDTO[]; // 수정 데이터
    deleteDataRequests: DataDTO[]; // 삭제 데이터
}

// 함수 타입
type ConfirmFunction = () => void;