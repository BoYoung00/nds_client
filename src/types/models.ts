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

interface pageType {
    template: 'Board' | 'Shop'; // 더 추가될 수 있음
    page: BoardPageType | ShopPageType;
}

type ShopPageType = 'main' | 'cart' | 'order' | 'order-list';
type BoardPageType = 'login' | 'sign-up' | 'main-notice' | 'main-list' | 'view-notice' | 'view-list' | 'after_login-notice' | 'after_login-list' | 'write-user' | 'write-admin';

// 만약 InputData 타입의 template: 'Shop' 이라면
interface ShopPage {
    page: ShopPageType;
}

// 만약 BoardPage 타입의 page : 'main' 이라면
interface ShopPageMain {
    connectURL: string;
    inputs: {
        'shopName': string;
        'shopComment': string;
        'mainImgUrl': string;
    }
    columns: {
        'itemImg': string;
        'itemName': string;
        'itemPrice': string;
    }
}

// 만약 BoardPage 타입의 page : 'cart' 이라면
interface ShopPageCart {
    connectURL: string;
    columns: {
        'itemImg': string;
        'itemName': string;
        'itemPrice': string;
        'itemCount': string;
    }
}

// 만약 BoardPage 타입의 page : 'order' 이라면
interface ShopPageOrder {
    connectURL: string;
    columns: {
        'orderData': string;
    }
}

// 만약 BoardPage 타입의 page : 'order-list' 이라면
interface ShopPageOrderList {
    connectURL: string;
    columns: {
        'itemImg': string;
        'itemName': string;
        'itemPrice': string;
        'itemCount': string;
    }
}

// 만약 InputData 타입의 template: 'Board' 이라면
interface BoardPage {
    page: BoardPageType;
}

// 만약 BoardPage 타입의 page : 'login' 이라면
interface BoardPageLogin {
    connectURL: string;
    columns: {
        'userID': string;
        'userPW': string;
    }
}

// 만약 BoardPage 타입의 page : 'sign-up' 이라면
interface BoardPageSignUp{
    connectURL: string;
    columns: {
        'userID': string;
        'userPW': string;
    }
}