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
interface CustomAPIRequest {
    apiFilterRequest: FilterRequest[];
    attributeNames: string[];
}
interface FilterRequest {
    filterColumnID: number;
    filterColumnHash: string;
    filterIntegerValue?: number | null;
    filterIntegerOption?: string | null;
    filterWordValue?: string | null;
    filterWorldOption?: string | null;
}

// 필터 Response 타입
interface CustomAPIResponse {
    apiFilterResponse: FilterResponse[];
    attributeNames: string[];
}
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

// ERD 변환
interface ERDiagram {
    node: Node[];
    linkData: Link[];
}

interface Node {
    key: number;
    name: string;
    columns: {
        name: string;
        type: string;
        keyName?: string | null;
        nullLabel: boolean;
    }[];
}

interface Link {
    from: number;
    to: number;
}

// ERD 관계 연결 Request
interface RelationRequest {
    dataBaseID: number;
    parentColumnHash: string;
    childColumnHash: string;
}

// 스탬핑 변경 데이터
interface StampingDiffDTO {
    data: string;
    state: number;
}

type StampingDataMap = Record<string, Record<string, StampingDiffDTO[]>>;

// 스탬핑 히스토리
interface StampingEntity {
    stampingId: number;
    isCurrent: string;
    message: string;
    createTime: string;
    stampingHash: string;
}

// API 보관함
interface UserAPIResponse {
    filterAPIList: UserAPIDTO[];
    basicAPIList: UserAPIDTO[];
}

interface UserAPIDTO {
    id: number;
    userToken: string;
    api: string;
    dataBaseName: string;
    tableName: string;
}

// 작업 공간 페이지 요청
interface WorkspaceRequest {
    connectURL: string; // 연결할 URL
    template: string; // 템플릿 이름
    page: string; // 페이지 이름
    username: string; // 유저 이메일
    columns?: Record<string, string>; // 현재 이름 / 실제 쓰일 컬럼 이름
    bodyHTMLCode?: string; // HTML Body 코드 (nullable)
}

// 작업 공간 페이지 응답
interface WorkspaceResponse {
    connectURL: string; // 연결할 URL
    templateName: string; // 템플릿 이름
    page: string; // 페이지 이름
    buildURL: string; // 페이지 접근 url
    columns: Record<string, string>; // 현재 이름 / 실제 쓰일 컬럼 이름
    htmlCode: string;
}

// 템플릿 데이터 적용 요청 타입
interface WorkspaceRequest {
    connectURL: string; // 연결할 URL
    template: string; // 템플릿 이름
    page: string; // 페이지 이름
    username: string; // 유저 이메일
    columns?: { [key: string]: string }; // 현재 이름 / 실제 쓰일 컬럼 이름 (optional)
    bodyHTMLCode?: string; // HTML Body 코드 (optional)
}

// 함수 자동 생성 요청 타입
interface ApiConnCodeRequest {
    dataBaseId: number;
    tableHash: string;
    title: string;
    description: string;
    programmingLanguage: string;
}

// 함수 저장 요청 타입
interface ApiConnInfoRequest {
    databaseID: number;
    tableHash: string;
    programmingLanguage: string;
    functionTitle: string;
    functionDescription: string;
}

interface ApiConnCodeResponse {
    title : string;
    description : string;
    createCode : string;
}

interface ApiConnInfoResponse {
    id: number;
    databaseID: number;
    tableHash: string;
    programmingLanguage: string;
    functionTitle: string;
    functionDescription: string;
    createUsername: string;
}

// 함수 코드 정보
interface APIConnDetailsResponse {
    functionTitle: string;
    functionDescription: string;
    programingCode: string;
    programmingLanguage: string;
}

// DBMS Connect 요청값 (저장)
interface DBMSDtoRequest {
    connType: string,
    name: string,
    dbmsType: string,
    description: string,
    url: string,
    username: string,
    password: string,
    databaseName: string
}

// DBMS Connect 응답값
interface DBMSInfoResponse {
    id: number,
    createUserToken: string,
    connType: string,
    name: string,
    dbmsType: string,
    description: string,
    url: string,
    username: string,
    password: string,
    databaseName: string,
    createTime: string,
}