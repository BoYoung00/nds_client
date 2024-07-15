type VCS = {
    VCS_ID: bigint;
    VCS_FilePath: string;
    checkSum: string;
    isLastCommit: number;
    userToken: string;
    dataBaseID: string;
}

type API = {
    API_ID: bigint;
    createUserToken: string;
    API_Path: string;
    optionFilter: string;
}

type Image = {
    media_ID: bigint;
    name: string;
    path: string;
    uplodateTime: string;
    userToken: string;
    table_ID: bigint;
}

type Video = {
    video_ID: bigint;
    name: string;
    path: string;
    uplodateTime: string;
    userToken: string;
    table_ID: bigint;
}

type DataBase = {
    dataBase_ID: bigint;
    tableName: string;
    comment: string;
    createUserToken: string;
}

type Table = {
    table_ID: bigint;
    tableName: string;
    createTime: string;
    updateTime: string;
    tableHash: string;
    database_ID: bigint;
    createUserToken: string;
}

type Column = {
    column_ID: bigint;
    columnName: string;
    columnType: string;
    table_ID: bigint;
}

type IntData = {
    data_ID: bigint;
    data: string;
    dataUUID: string;
    API_Path: string;
    dataCreateTime: string;
    column_ID: bigint;
}

type TextData = {
    data_ID: bigint;
    data: string;
    dataUUID: string;
    API_Path: string;
    dataCreateTime: string;
    column_ID: bigint;
}

type RealData = {
    data_ID: bigint;
    data: string;
    dataUUID: string;
    API_Path: string;
    dataCreateTime: string;
    column_ID: bigint;
}

