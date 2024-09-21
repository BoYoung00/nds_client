import React, {useEffect, useState} from 'react';
import styles from '../WebBuilder.module.scss';
import LineTitle from "../../../publicComponents/UI/LineTitle";
import doubleArrow from '../../../assets/images/doubleArrow.png';
import {useParams} from "react-router-dom";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import axios from "axios";
import {workSpaceBuildDataSave} from "../../../services/api";

// PageData 타입을 정의하는 인터페이스들
type PageData = ShopPageMain | ShopPageCart | ShopPageOrderList | BoardPageLogin | BoardPageSignUp | BoardPageMainNotice | BoardPageMainList | BoardPageViewList | BoardPageAfterLoginList | BoardPageViewNotice | BoardPageWriteUser | BoardPageAfterLoginNotice | BoardPageWriteAdmin;

interface ApplyTableDataProps {
    selectedTab: string;
    workspaceData: WorkspaceResponse | null;
    fetchTemplateSSR: () => void;
}

const ApplyTableData: React.FC<ApplyTableDataProps> = ({ selectedTab, workspaceData, fetchTemplateSSR }) => {
    const { template } = useParams<{ template: string }>();

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [inputData, setInputData] = useState<PageData | null>(null);
    const [fetchColumnNames, setFetchColumnNames] = useState<string[]>([]);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleToggle = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        const pageType: pageType = {
            template: template as 'Board' | 'Shop',
            page: template === 'Board' ? selectedTab as BoardPageType : selectedTab as ShopPageType
        };
        try {
            const data = getPageData(pageType);
            setInputData(data);
        } catch (error) {
            console.error('Error fetching page data:', error);
        }
    }, [workspaceData]);

    useEffect(()=> {
        if (fetchColumnNames.length === 0)
            handelFetchRestApiData();
    }, [inputData])

    // inputs가 존재하는 타입인지 확인하는 타입 가드 함수
    function hasInputs(data: any): data is { inputs: Record<string, string> } {
        return data && 'inputs' in data;
    }

    // columns가 존재하는 타입인지 확인하는 타입 가드 함수
    function hasColumns(data: any): data is { columns: Record<string, string> } {
        return data && 'columns' in data;
    }

    // 데이터 초기화 함수
    const initializeWorkspaceResponse = (data: WorkspaceResponse | null): WorkspaceResponse => {
        return {
            connectURL: data?.connectURL || '',
            templateName: data?.templateName || '',
            page: data?.page || '',
            buildURL: data?.buildURL || '',
            columns: data?.columns || {},
            htmlCode: data?.htmlCode || ''
        };
    };

    function getPageData(inputData: pageType): PageData {
        const responseData = initializeWorkspaceResponse(workspaceData);

        if (inputData.template === 'Shop') {
            switch (inputData.page) {
                case 'main':
                    return {
                        connectURL: responseData.connectURL,
                        inputs: {
                            "cartTableUrl": responseData.columns?.['cartTableUrl'] || '',
                            "shopName": responseData.columns?.['shopName'] || '',
                            "shopComment": responseData.columns?.['shopComment'] || '',
                            "mainImgUrl": responseData.columns?.['mainImgUrl'] || ''
                        },
                        columns: {
                            "ItemID": responseData.columns?.['ItemID'] || '',
                            "ItemImage": responseData.columns?.['ItemImage'] || '',
                            "ItemName": responseData.columns?.['ItemName'] || '',
                            "ItemPrice": responseData.columns?.['ItemPrice'] || ''
                        }
                    };
                case 'cart':
                    return {
                        connectURL: responseData.connectURL,
                        inputs: {
                            "OrderTableUrl": responseData.columns?.['OrderTableUrl'] || '',
                        },
                        columns: {
                            "CartID": responseData.columns?.['CartID'] || '',
                            "ItemID": responseData.columns?.['ItemID'] || '',
                            "UserID": responseData.columns?.['UserID'] || '',
                            "ItemImage": responseData.columns?.['ItemImage'] || '',
                            "ItemName": responseData.columns?.['ItemName'] || '',
                            "ItemPrice": responseData.columns?.['ItemPrice'] || '',
                            "ItemCount": responseData.columns?.['ItemCount'] || ''
                        }
                    };
                case 'order-list':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'itemImg': responseData.columns?.['itemImg'] || '',
                            'itemName': responseData.columns?.['itemName'] || '',
                            'itemPrice': responseData.columns?.['itemPrice'] || '',
                            'itemCount': responseData.columns?.['itemCount'] || ''
                        }
                    };
                default:
                    throw new Error(`Unknown Shop Page Type: ${inputData.page}`);
            }
        } else if (inputData.template === 'Board') {
            switch (inputData.page) {
                case 'login':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'role': responseData.columns?.['role'] || '',
                            'id': responseData.columns?.['id'] || '',
                            'password': responseData.columns?.['password'] || ''
                        }
                    };
                case 'sign-up':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'id': responseData.columns?.['id'] || '',
                            'name': responseData.columns?.['name'] || '',
                            'password': responseData.columns?.['password'] || '',
                            'role': responseData.columns?.['role'] || ''
                        }
                    };
                case 'main-notice':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'title': responseData.columns?.['title'] || '',
                            'date': responseData.columns?.['date'] || '',
                        }
                    };
                case 'main-list':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'title': responseData.columns?.['title'] || '',
                            'date': responseData.columns?.['date'] || '',
                        }
                    };
                case 'view-list':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'title': responseData.columns?.['title'] || '',
                            'date': responseData.columns?.['date'] || '',
                            'writer': responseData.columns?.['writer'] || '',
                            'mainText': responseData.columns?.['mainText'] || '',
                            'img': responseData.columns?.['img'] || '',
                        }
                    };
                case 'after_login-list':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'title': responseData.columns?.['title'] || '',
                            'date': responseData.columns?.['date'] || '',
                        }
                    };
                case 'view-notice':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'title': responseData.columns?.['title'] || '',
                            'date': responseData.columns?.['date'] || '',
                            'writer': responseData.columns?.['writer'] || '',
                            'mainText': responseData.columns?.['mainText'] || '',
                        }
                    };
                case 'write-user':
                    return {
                        connectURL: responseData.connectURL,
                        inputs: {
                            'userToken': responseData.columns?.['userToken'] || '',
                            'tableHash': responseData.columns?.['tableHash'] || '',
                        },
                        columns: {
                            'post_id': responseData.columns?.['post_id'] || '',
                            'title': responseData.columns?.['title'] || '',
                            'mainText': responseData.columns?.['mainText'] || '',
                            'fileUpload': responseData.columns?.['fileUpload'] || '',
                            'date': responseData.columns?.['date'] || '',
                        }
                    };
                case 'after_login-notice':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'title': responseData.columns?.['title'] || '',
                            'date': responseData.columns?.['date'] || '',
                        }
                    };
                case 'write-admin':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'post_id': responseData.columns?.['post_id'] || '',
                            'title': responseData.columns?.['title'] || '',
                            'mainText': responseData.columns?.['mainText'] || '',
                            'date': responseData.columns?.['date'] || '',
                        }
                    };
                default:
                    throw new Error(`아직 페이지 데이터 값 매핑 안 함: ${inputData.page}`);
            }
        } else {
            throw new Error(`Unknown Template: ${inputData.template}`);
        }
    }

    // 영어 키를 한글 레이블로 변환하는 매핑 객체
    const labelMapping: Record<string, string> = {
        "shopName": "쇼핑몰 이름",
        "shopComment": "쇼핑몰 설명",
        "mainImgUrl": "메인 이미지 URL",
        "cartTableUrl": '카트 테이블 Rest Api Url',
        'ItemID': '아이템 번호',
        "ItemImage": "아이템 이미지",
        "ItemName": "아이템 이름",
        "ItemPrice": "아이템 가격",
        "ItemCount": "아이템 수량",
        "userID": "사용자 아이디",
        "userPW": "비밀번호"
    };

    // connect url 변경 핸들러
    const handleConnectURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                connectURL: event.target.value,
            };
        });
    };

    // 입력값 변경 핸들러
    const handleInputChange = (key: string, newValue: string) => {
        // @ts-ignore
        setInputData(prevData => {
            if (!prevData) return null;

            if (hasInputs(prevData)) {
                return {
                    ...prevData,
                    inputs: {
                        ...prevData.inputs,
                        [key]: newValue
                    }
                };
            }

            return prevData;
        });
    };

    // 선택값 변경 핸들러
    const handleSelectChange = (key: string, selectedValue: string) => {
        // @ts-ignore
        setInputData(prevData => {
            if (!prevData) return null;

            if (hasColumns(prevData)) {
                return {
                    ...prevData,
                    columns: {
                        ...prevData.columns,
                        [key]: selectedValue
                    }
                };
            }
            return prevData;
        });
    };

    // 테이블 데이터 저장 통신
    const handelFetchBuildDataSave = async () => {
        const userEmail = localStorage.getItem('email')
        const workspaceRequest: WorkspaceRequest = {
            connectURL: inputData?.connectURL || '',
            template: template?.toLowerCase() || 'board',
            page: selectedTab || '',
            username: userEmail || '',
            columns: {
                ...(
                    hasInputs(inputData) ? inputData.inputs : {}
                ),
                ...(
                    hasColumns(inputData) ? inputData.columns : {}
                )
            },
            bodyHTMLCode: ''
        };
        console.log('데이터 적용', workspaceRequest)
        try {
            await workSpaceBuildDataSave(workspaceRequest);
            setSuccessMessage('템플릿 데이터 저장에 성공하셨습니다.')
            fetchTemplateSSR();
        } catch (e) {
            const error = (e as Error).message || '알 수 없는 오류가 발생 하였습니다.'
            setErrorMessage(error)
        }
    }

    // REST API 통신
    const handelFetchRestApiData = async () => {
        if (!inputData) return;
        if (!inputData.connectURL || inputData.connectURL === '') return;
        try {
            const response = await axios.get(`${inputData.connectURL}`);
            const columnNames = Object.keys(response.data[0]);
            setFetchColumnNames(columnNames);
            console.log('columnNames', columnNames);
            setSuccessMessage('테이블 통신에 성공하셨습니다.')
        } catch (error) {
            let message = '알 수 없는 오류가 발생했습니다.';
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    message = '요청이 시간 초과되었습니다. 네트워크 상태를 확인해주세요.';
                } else if (error.message.includes('Network Error')) {
                    message = '유효하지 않은 Rest api url입니다. 다시 확인해주세요.';
                } else if (error.response) {
                    message = `서버 오류: ${error.response.status} - ${error.response.statusText}`;
                } else {
                    message = error.message;
                }
            } else if (error instanceof Error) {
                message = error.message;
            }
            setErrorMessage(message);
        }
    };

    return (
        <>
            <div className={`${styles.applyTableData} ${isVisible ? styles.show : ''}`}>
                <div className={styles.slideButtonContainer}>
                    <div className={styles.slideButtonWrap}>
                        <img className={`${styles.slideButton} ${isVisible ? styles.show : ''}`}
                             onClick={handleToggle}
                             src={doubleArrow}
                             alt='화살표'
                        />
                    </div>
                </div>
                <div className={styles.slideContainer}>
                    <LineTitle text={'내 테이블 데이터 적용하기'} />
                    <section className={styles.slideContainer__header}>
                        <input
                            type="text"
                            value={inputData?.connectURL}
                            onChange={handleConnectURLChange}
                            placeholder='적용할 테이블 REST API Get URL을 붙여주세요.'
                        />
                        <button onClick={handelFetchRestApiData}>적용</button>
                    </section>
                    <section className={styles.slideContainer__main}>
                        <div className={styles.headerTitle}>
                            <p>테이블 행 선택</p>
                        </div>
                        <div className={styles.columnContent}>
                            {inputData && hasInputs(inputData) && Object.entries(inputData.inputs).map(([key, value], index) => (
                                <InputColumnData
                                    key={index}
                                    title={labelMapping[key] || key}
                                    value={value}
                                    onChange={(newValue) => handleInputChange(key, newValue)}
                                    isSelect={false}
                                />
                            ))}
                            {inputData && hasColumns(inputData) && Object.entries(inputData.columns).map(([key, value], index) => (
                                <InputColumnData
                                    key={index}
                                    title={labelMapping[key] || key}
                                    value={value}
                                    onChange={(newValue) => handleSelectChange(key, newValue)}
                                    columnNames={fetchColumnNames}
                                />
                            ))}
                        </div>
                    </section>
                    <section className={styles.slideContainer__footer}>
                        <button onClick={handelFetchBuildDataSave}>데이터 적용</button>
                    </section>
                </div>
            </div>

            { successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            /> }

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default ApplyTableData;

interface InputColumnDataProps {
    isSelect?: boolean;
    title: string;
    value: string;
    onChange: (newValue: string) => void;
    columnNames?: string[];
}

const InputColumnData: React.FC<InputColumnDataProps> = ({ isSelect = true, title, value, onChange, columnNames }) => {
    return (
        <div className={styles.columnSelect}>
            <p>{title}</p>
            {isSelect ?
                <select value={value} onChange={(e) => onChange(e.target.value)}>
                    <option value="">{title}(으)로 사용할 행을 선택해주세요.</option>
                    {columnNames && columnNames.map(name => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
                :
                <input type='text' value={value} onChange={(e) => onChange(e.target.value)} />
            }
        </div>
    );
};
