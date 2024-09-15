import React, {useEffect, useState} from 'react';
import styles from '../WebBuilder.module.scss';
import LineTitle from "../../../publicComponents/UI/LineTitle";
import doubleArrow from '../../../assets/images/doubleArrow.png';
import {useParams} from "react-router-dom";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import axios from "axios";

// PageData 타입을 정의하는 인터페이스들
type PageData = ShopPageMain | ShopPageCart | ShopPageOrder | ShopPageOrderList | BoardPageLogin | BoardPageSignUp;

interface ApplyTableDataProps {
    selectedTab: string;
    workspaceData: WorkspaceResponse | null;
}

const ApplyTableData: React.FC<ApplyTableDataProps> = ({ selectedTab, workspaceData }) => {
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
    }, [template, selectedTab]);

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
                            "shopName": responseData.columns?.['shopName'] || '',
                            "shopComment": responseData.columns?.['shopComment'] || '',
                            "mainImgUrl": responseData.columns?.['mainImgUrl'] || ''
                        },
                        columns: {
                            "itemImg": responseData.columns?.['itemImg'] || '',
                            "itemName": responseData.columns?.['itemName'] || '',
                            "itemPrice": responseData.columns?.['itemPrice'] || ''
                        }
                    };
                case 'cart':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            "itemImg": responseData.columns?.['itemImg'] || '',
                            "itemName": responseData.columns?.['itemName'] || '',
                            "itemPrice": responseData.columns?.['itemPrice'] || '',
                            "itemCount": responseData.columns?.['itemCount'] || ''
                        }
                    };
                case 'order':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            "orderData": responseData.columns?.['orderData'] || ''
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
                            'userID': responseData.columns?.['userID'] || '',
                            'userPW': responseData.columns?.['userPW'] || ''
                        }
                    };
                case 'sign-up':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'userID': responseData.columns?.['userID'] || '',
                            'userPW': responseData.columns?.['userPW'] || ''
                        }
                    };
                // 이후 페이지 데이터들은 변경 사항 있을 것 같아서 나중에 채울 예정
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
        "itemImg": "아이템 이미지",
        "itemName": "아이템 이름",
        "itemPrice": "아이템 가격",
        "itemCount": "아이템 수량",
        "orderData": "주문 데이터",
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

    const handelFetchBuildDataSave = async () => {
        const userEmail = localStorage.getItem('email')
        const workspaceRequest: WorkspaceRequest = {
            connectURL: inputData?.connectURL || '',
            template: template || 'Board',
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
        console.log('데이터 적용 (템플릿 미완성인 관계로 통신 로직 주석처리)', workspaceRequest)
        // try {
        //     const response = await workSpaceBuildDataSave(workspaceRequest);
        //     console.log('템플릿 데이터 저장', response)
        // } catch (e) {
        //     const error = (e as Error).message || '알 수 없는 오류가 발생 하였습니다.'
        //     setErrorMessage(error)
        // }
    }

    const handelFetchRestApiData = async () => {
        if (!inputData) return;
        if (!inputData.connectURL && inputData.connectURL === '') return;
        try {
            const response = await axios.get(`${inputData.connectURL}`);
            const columnNames = Object.keys(response.data[0]);
            setFetchColumnNames(columnNames);
            console.log('columnNames', columnNames)
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
