interface pageType {
    template: 'Board' | 'Shop' | 'Todo'; // 더 추가될 수 있음
    page: BoardPageType | ShopPageType | TodoPageType;
}

type ShopPageType = 'main' | 'cart' | 'order' | 'order-list';
type BoardPageType = 'login' | 'sign-up' | 'main-notice' | 'main-list' | 'view-notice' | 'view-list' | 'after_login-notice' | 'after_login-list' | 'write-user' | 'write-admin';
type TodoPageType = 'todo-list';

// 쇼핑몰
// 만약 ShopPageType 타입의 page : 'main' 이라면
interface ShopPageMain {
    connectURL: string;
    inputs: {
        'shopName': string;
        'shopComment': string;
        'mainImgUrl': string;
    }
    columns: {
        'ItemID': string;
        'ItemImage': string;
        'ItemName': string;
        'ItemPrice': string;
    }
}

// 만약 ShopPageType 타입의 page : 'cart' 이라면
interface ShopPageCart {
    connectURL: string;
    columns: {
        'CartID': string;
        'ItemID': string;
        'UserID': string;
        'ItemImage': string;
        'ItemName': string;
        'ItemPrice': string;
        'ItemCount': string;
    }
}

// 만약 ShopPageType 타입의 page : 'order-list' 이라면
interface ShopPageOrderList {
    connectURL: string;
    columns: {
        'CartID': string;
        'ItemID': string;
        'UserID': string;
        'ItemImage': string;
        'ItemName': string;
        'ItemPrice': string;
        'ItemCount': string;
    }
}


// 게시판
// 만약 BoardPage 타입의 page : 'login' 이라면
interface BoardPageLogin {
    connectURL: string;
    columns: {
        'role': string;
        'id': string;
        'password': string;
    }
}

// 만약 BoardPage 타입의 page : 'sign-up' 이라면
interface BoardPageSignUp{
    connectURL: string;
    columns: {
        'id': string;
        'name': string;
        'password': string;
        'role': string;
    }
}

// 만약 BoardPage 타입의 page : 'main-notice' 이라면
interface BoardPageMainNotice{
    connectURL: string;
    columns: {
        'title': string;
        'date': string;
    }
}

// 만약 BoardPage 타입의 page : 'main-list' 이라면
interface BoardPageMainList{
    connectURL: string;
    columns: {
        'title': string;
        'date': string;
    }
}

// 만약 BoardPage 타입의 page : 'view-list' 이라면
interface BoardPageViewList{
    connectURL: string;
    columns: {
        'post_id': string;
        'title': string;
        'date': string;
        'writer': string;
        'mainText': string;
        'img': string;
    }
}

// 만약 BoardPage 타입의 page : 'after_login-notice' 이라면
interface BoardPageAfterLoginNotice{
    connectURL: string;
    columns: {
        'title': string;
        'date': string;
    }
}

// 만약 BoardPage 타입의 page : 'after_login-list' 이라면
interface BoardPageAfterLoginList{
    connectURL: string;
    columns: {
        'title': string;
        'date': string;
    }
}


// 만약 BoardPage 타입의 page : 'view-notice' 이라면
interface BoardPageViewNotice{
    connectURL: string;
    columns: {
        'post_id': string;
        'title': string;
        'date': string;
        'writer': string;
        'mainText': string;
    }
}

// 만약 BoardPage 타입의 page : 'write-user' 이라면
interface BoardPageWriteUser{
    connectURL: string;
    inputs: {
        'imgUrl': string; // 이미지를 저장할 url
    }
    columns: {
        'post_id': string;
        'title': string;
        'mainText': string;
        'fileUpload': string;
        'date': string;
    }
}

// 만약 BoardPage 타입의 page : 'write-admin' 이라면
interface BoardPageWriteAdmin{
    connectURL: string;
    columns: {
        'post_id': string;
        'title': string;
        'mainText': string;
        'date': string;
    }
}

// 할 일 (Todo)
// 만약 TodoPage 타입의 page : 'todo-list' 이라면
interface TodoPageTodoList{
    connectURL: string;
    columns: {
        'title': string;
        'description': string;
        'startDate': string;
        'endDate': string;
        'category': string;
        'status': string;
    }
}