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

// 함수 타입
type ConfirmFunction = () => void;

// 데이터베이스 요청 타입
interface DataBaseEntity {
    id?: number | null;
    name: string;
    comment: string;
}

// 테이블 생성 조인 테이블
interface JoinTable {
    id: number;
    name: string;
    tableHash: string;
    pkColumn: ColumnResponse;
}
interface ColumnResponse {
    id: number;
    name: string;
    type: string;
    columnHash: string;
    tableID: number;
    isPk: boolean;
    isUk: boolean;
    isFk: boolean;
    isNotNull: boolean;
    joinTableHash?: string;
}

// 테이블 생성
interface TableRequest {
    dataBaseID: number;
    name: string;
    comment: string;
    columns: RowState[];
    tableHash: string | null;
}
interface RowState {
    name: string;
    dataType: string;
    isPkActive: boolean;
    isFkActive: boolean;
    isUkActive: boolean;
    isNotNullActive: boolean;
    isJoinTableHash: string | null;
    [key: string]: any;
}

// 테이블, 행, 데이터 Response 타입
interface TableData {
    id: number ;
    name: string;
    comment: string;
    createTime: string;
    tableHash: string;
    tableInnerStructure: TableInnerStructure;
}
interface TableInnerStructure {
    [key: string]: ColumnData[];
}
interface ColumnData {
    id?: number | null;
    data: string;
    createTime: string;
    columnID: number;
    lineHash: string;
    dataType: string;
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

// 이미지 경로 리스트 Response 타입
interface MediaFile {
    id: number;
    fileName: string;
    path: string;
}

// 필터 Request 타입
interface FilterRequest {
    filterColumnID: number;
    filterColumnHash: string;
    filterIntegerValue?: number | null;
    filterIntegerOption?: string | null;
    filterWordValue?: string | null;
    filterWorldOption?: string | null;
}