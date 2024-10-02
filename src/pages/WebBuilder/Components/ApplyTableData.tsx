import React, {useEffect, useState} from 'react';
import styles from '../WebBuilder.module.scss';
import LineTitle from "../../../publicComponents/UI/LineTitle";
import doubleArrow from '../../../assets/images/doubleArrow.png';
import {useParams} from "react-router-dom";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import axios from "axios";
import {workSpaceBuildDataSave} from "../../../services/api";

// PageData 타입을 정의하는 인터페이스들
type PageData = ShopPageMain | ShopPageCart | ShopPageOrder | ShopPageOrderList | BoardPageLogin | BoardPageSignUp | BoardPageMainNotice | BoardPageMainList | BoardPageViewList | BoardPageAfterLoginList | BoardPageViewNotice | BoardPageWriteUser | BoardPageAfterLoginNotice | BoardPageWriteAdmin | TodoPageTodoList | GalleryPageGalleryList;

interface ApplyTableDataProps {
    selectedTab: string;
    workspaceData: WorkspaceResponse | null;
    // fetchTemplateSSR: () => void;
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
        setFetchColumnNames([]);
        const pageType: pageType = {
            template: template as 'Board' | 'Shop' | 'Todo' | 'Gallery',
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
        if (fetchColumnNames.length === 0) handelFetchRestApiData();
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
                            "ItemID": responseData.columns?.['ItemID'] || '',
                            "ItemImage": responseData.columns?.['ItemImage'] || '',
                            "ItemName": responseData.columns?.['ItemName'] || '',
                            "ItemPrice": responseData.columns?.['ItemPrice'] || ''
                        }
                    };
                case 'cart':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            "OrderID": responseData.columns?.['OrderID'] || '',
                            "ItemID": responseData.columns?.['ItemID'] || '',
                            "UserID": responseData.columns?.['UserID'] || '',
                            "ItemImage": responseData.columns?.['ItemImage'] || '',
                            "ItemName": responseData.columns?.['ItemName'] || '',
                            "ItemPrice": responseData.columns?.['ItemPrice'] || '',
                            "ItemCount": responseData.columns?.['ItemCount'] || ''
                        }
                    };
                case 'order':
                    return {
                        connectURL: '',
                    };
                case 'order-list':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            "OrderID": responseData.columns?.['OrderID'] || '',
                            "ItemID": responseData.columns?.['ItemID'] || '',
                            "UserID": responseData.columns?.['UserID'] || '',
                            "ItemImage": responseData.columns?.['ItemImage'] || '',
                            "ItemName": responseData.columns?.['ItemName'] || '',
                            "ItemPrice": responseData.columns?.['ItemPrice'] || '',
                            "ItemCount": responseData.columns?.['ItemCount'] || ''
                        }
                    };
                default:
                    throw new Error(`페이지 매핑 데이터 타입이 없음: ${inputData.page}`);
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
                            'post_id': responseData.columns?.['post_id'] || '',
                            'title': responseData.columns?.['title'] || '',
                            'date': responseData.columns?.['date'] || '',
                            'writer': responseData.columns?.['writer'] || '',
                            'mainText': responseData.columns?.['mainText'] || '',
                            'img': responseData.columns?.['img'] || '',
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
                            'post_id': responseData.columns?.['post_id'] || '',
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
                            'imgUrl': responseData.columns?.['imgUrl'] || '',
                        },
                        columns: {
                            'post_id': responseData.columns?.['post_id'] || '',
                            'title': responseData.columns?.['title'] || '',
                            'mainText': responseData.columns?.['mainText'] || '',
                            'fileUpload': responseData.columns?.['fileUpload'] || '',
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
                    throw new Error(`페이지 매핑 데이터 타입이 없음: ${inputData.page}`);
            }
        }  else if (inputData.template === 'Todo') {
            switch (inputData.page) {
                case 'todo-list':
                    return {
                        connectURL: responseData.connectURL,
                        columns: {
                            'todo-id': responseData.columns?.['todo-id'] || '',
                            'title': responseData.columns?.['title'] || '',
                            'description': responseData.columns?.['description'] || '',
                            'startDate': responseData.columns?.['startDate'] || '',
                            'endDate': responseData.columns?.['endDate'] || '',
                            'category': responseData.columns?.['category'] || '',
                            'status': responseData.columns?.['status'] || '',
                        }
                    };
                default:
                    throw new Error(`페이지 매핑 데이터 타입이 없음: ${inputData.page}`);
            }
        } else if (inputData.template === 'Gallery') {
            switch (inputData.page) {
                case 'gallery-list':
                    return {
                        connectURL: responseData.connectURL,
                        inputs: {
                          'galleryName': responseData.columns?.['galleryName'] || '',
                        },
                        columns: {
                            'id': responseData.columns?.['id'] || '',
                            'title': responseData.columns?.['title'] || '',
                            'date': responseData.columns?.['date'] || '',
                            'comment': responseData.columns?.['comment'] || '',
                            'img': responseData.columns?.['img'] || '',
                        }
                    };
                default:
                    throw new Error(`페이지 매핑 데이터 타입이 없음: ${inputData.page}`);
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
        'ItemID': '아이템 번호',
        "ItemImage": "아이템 이미지",
        "ItemName": "아이템 이름",
        "ItemPrice": "아이템 가격",
        "ItemCount": "아이템 수량",
        'title': '제목',
        'mainText': '메인 글',
        'date': '날짜',
        'role': '권한',
        'id': '아이디',
        'password': '비밀번호',
        'writer': '작성자',
        'img': '이미지',
        'post_id': '게시물 ID',
        'fileUpload': '파일 업로드',
        'UserID': '회원 ID',
        'OrderID': '주문 ID',
        'name': '회원 이름',
        'description': '설명',
        'startDate': '시작 날짜',
        'endDate': '종료 날짜',
        'category': '카테고리',
        'status': '상태',
        'todo-id': '작업 ID',
        'comment': '설명',
        'galleryName': '갤러리 이름'
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
            // fetchTemplateSSR();
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
            // setSuccessMessage('테이블 통신에 성공하셨습니다.')
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
            <p>{title} { isSelect ? '행' : ''}</p>
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
