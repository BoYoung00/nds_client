import React, { useEffect, useState } from 'react';
import styles from '../WebBuilder.module.scss';
import LineTitle from "../../../publicComponents/UI/LineTitle";
import doubleArrow from '../../../assets/images/doubleArrow.png';
import { useParams } from "react-router-dom";

// PageData 타입을 정의하는 인터페이스들
type PageData = ShopPageMain | ShopPageCart | ShopPageOrder | ShopPageOrderList | BoardPageLogin | BoardPageSignUp;

interface ApplyTableDataProps {
    selectedTab: string;
}

const ApplyTableData: React.FC<ApplyTableDataProps> = ({ selectedTab }) => {
    const { page } = useParams<{ page: string }>();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [inputData, setInputData] = useState<PageData | null>(null);

    const handleToggle = () => {
        setIsVisible(!isVisible);
    };

    useEffect(() => {
        const pageType: pageType = {
            template: page as 'Board' | 'Shop',
            page: page === 'Board' ? selectedTab as BoardPageType : selectedTab as ShopPageType
        };
        try {
            const data = getPageData(pageType);
            setInputData(data);
            // console.log('현재 페이지: ', data);
        } catch (error) {
            console.error('Error fetching page data:', error);
        }
    }, [page, selectedTab]);

    useEffect(() => {
        console.log('inputData', inputData);
    }, [inputData])

    // inputs가 존재하는 타입인지 확인하는 타입 가드 함수
    function hasInputs(data: any): data is { inputs: Record<string, string> } {
        return data && 'inputs' in data;
    }

    // columns가 존재하는 타입인지 확인하는 타입 가드 함수
    function hasColumns(data: any): data is { columns: Record<string, string> } {
        return data && 'columns' in data;
    }

    function getPageData(inputData: pageType): PageData {
        if (inputData.template === 'Shop') {
            switch (inputData.page) {
                case 'main':
                    return {
                        connectURL: '',
                        inputs: {
                            "shopName": '',
                            "shopComment": '',
                            "mainImgUrl": ''
                        },
                        columns: {
                            "itemImg": '',
                            "itemName": '',
                            "itemPrice": ''
                        }
                    };
                case 'cart':
                    return {
                        connectURL: '',
                        columns: {
                            "itemImg": '',
                            "itemName": '',
                            "itemPrice": '',
                            "itemCount": ''
                        }
                    };
                case 'order':
                    return {
                        connectURL: '',
                        columns: {
                            "orderData": ''
                        }
                    };
                case 'order-list':
                    return {
                        connectURL: '',
                        columns: {
                            'itemImg': '',
                            'itemName': '',
                            'itemPrice': '',
                            'itemCount': ''
                        }
                    };
                default:
                    throw new Error(`Unknown Shop Page Type: ${inputData.page}`);
            }
        } else if (inputData.template === 'Board') {
            switch (inputData.page) {
                case 'login':
                    return {
                        connectURL: '',
                        columns: {
                            'userID': '',
                            'userPW': ''
                        }
                    };
                case 'sign-up':
                    return {
                        connectURL: '',
                        columns: {
                            'userID': '',
                            'userPW': ''
                        }
                    };
                    // 이후 페이지 데이터들은 변경 사항 있을 것 같아서 나중에 채울 예정
                default:
                    throw new Error(`Unknown Board Page Type: ${inputData.page}`);
            }
        } else {
            throw new Error(`Unknown Template: ${inputData.template}`);
        }
    }

    // 영어 키를 한글 레이블로 변환하는 매핑 객체
    const labelMapping: Record<string, string> = {
        "shopName": "상점 이름",
        "shopComment": "상점 설명",
        "mainImgUrl": "메인 이미지 URL",
        "itemImg": "아이템 이미지",
        "itemName": "아이템 이름",
        "itemPrice": "아이템 가격",
        "itemCount": "아이템 수량",
        "orderData": "주문 데이터",
        "userID": "사용자 아이디",
        "userPW": "비밀번호"
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

    return (
        <div className={`${styles.applyTableData} ${isVisible ? styles.show : ''}`}>
            <div className={styles.slideButtonContainer}>
                <div className={styles.slideButtonWrap}>
                    <img className={`${styles.slideButton} ${isVisible ? styles.show : ''}`}
                         onClick={handleToggle}
                         src={doubleArrow}
                    />
                </div>
            </div>
            <div className={styles.slideContainer}>
                <LineTitle text={'내 테이블 데이터 적용하기'} />
                <section className={styles.slideContainer__header}>
                    <input type="text" placeholder='적용할 테이블 REST API Get URL을 붙여주세요.' />
                    <button>적용</button>
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
                                columnNames={['test1', 'test2']}
                            />
                        ))}
                    </div>
                </section>
                <section className={styles.slideContainer__footer}>
                    <button>데이터 적용</button>
                </section>
            </div>
        </div>
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
                    <option value="">{title}로 사용할 행을 선택해주세요.</option>
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
