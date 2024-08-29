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
    id: number;
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

// 필터 Response 타입
interface FilterResponse {
    filterTableHash: string;
    filterType: number;
    filterColumnID: number;
    filterColumnName: string;
    filterColumnHash: string;
    option: string;
    filterValue: string;
}

// CSV 엑셀 데이터 Request 타입
interface CsvDataRequest {
    tableID: number;
    tableHash: string;
    dataSet: { [key: string]: string[] };
}

// .nds 파일 파싱용
interface FileColumnSet {
    name: string;
    dataType: string;
    columnHash: string;
    isJoinTableHash: string | null;
    isPkActive: boolean;
    isFkActive: boolean;
    isUkActive: boolean;
    isNotNullActive: boolean;
}

interface FileTableSet {
    name: string;
    comment: string;
    tableHash: string;
    columnList: FileColumnSet[];
}

interface FileDataBaseSet {
    name: string;
    comment: string;
    tableList: FileTableSet[];
}

// 테이블 병합 확인 요청
interface TableMergeConfirmRequest {
    parentTableID: number | null;
    childTableID: number | null;
}

// 테이블 병합 확인 반환
interface TableMergeConfirmResponse {
    tableMergeCode: number;
    tableConfirmMessage: string;
    tableConfirmResult: boolean;
    tableMergeImprovement: TableInnerStructure;
}

// 테이블 병합 저장 요청
interface TableMergeSaveRequest {
    newTableName: string;
    newTableComment: string;
    parentTableID: number;
    childTableID: number;
}

// 커밋
interface VcsFileEntity {
    id: number;
    path: string;
    checkSum: string;
    createTime: string;
    isCurrent: string;
    databaseID: number;
}

// ERD 변환
interface ERDiagram {
    node: Node[];
    linkData: Link[];
}

interface Node {
    key: number;
    name: string;
    columns: NodeColumn[];
}

interface NodeColumn {
    name: string;
    type: string;
    keyName?: string; // 선택적 속성 (nullable)
    nullLabel: boolean;
}

interface Link {
    from: number;
    to: number;
}