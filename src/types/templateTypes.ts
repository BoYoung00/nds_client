interface pageType {
    template: 'Board' | 'Shop'; // 더 추가될 수 있음
    page: BoardPageType | ShopPageType;
}

type ShopPageType = 'main' | 'cart' | 'order' | 'order-list';
type BoardPageType = 'login' | 'sign-up' | 'main-notice' | 'main-list' | 'view-notice' | 'view-list' | 'after_login-notice' | 'after_login-list' | 'write-user' | 'write-admin';

// 쇼핑몰
// 만약 ShopPageType 타입의 page : 'main' 이라면
interface ShopPageMain {
    connectURL: string;
    inputs: {
        'shopName': string;
        'shopComment': string;
        'mainImgUrl': string;
        'cartTableUrl': string;
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
    inputs: {
        'OrderTableUrl': string;
    }
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
        'itemImg': string;
        'itemName': string;
        'itemPrice': string;
        'itemCount': string;
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
        'title': string;
        'date': string;
        'writer': string;
        'mainText': string;
        'img': string;
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
        'userToken': string;
        'tableHash': string;
    }
    columns: {
        'post_id': string;
        'title': string;
        'mainText': string;
        'fileUpload': string;
        'date': string;
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