import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Search.module.scss';
import searchIcon from '../../../../assets/images/search.png';

// 임시 데이터
interface Temp {
    tableName: string;
    pkColumnName: string;
    joinColumnDataType: string;
}
const tempList: Temp[] = [
    {
        tableName: 'Users',
        pkColumnName: 'user_id',
        joinColumnDataType: 'INT'
    },
    {
        tableName: 'Orders',
        pkColumnName: 'order_id',
        joinColumnDataType: 'VARCHAR'
    },
    {
        tableName: 'Products',
        pkColumnName: 'product_id',
        joinColumnDataType: 'UUID'
    },
    {
        tableName: 'Orders2',
        pkColumnName: 'order_id2',
        joinColumnDataType: 'VARCHAR'
    },
    {
        tableName: 'Orders3',
        pkColumnName: 'order_id3',
        joinColumnDataType: 'VARCHAR'
    },
];

interface SearchModalProps {
    title: string;
    handleSelectData: (item: any | null) => void;
    showSearch: boolean;
    setShowSearch: (show: boolean) => void;
}

const Search: React.FC<SearchModalProps> = ({ handleSelectData, showSearch, setShowSearch, title }) => {
    const { dataBaseID } = useParams<{ dataBaseID: string }>();
    const [joinData, setJoinData] = useState<any[] | null>(tempList);
    const [searchTerm, setSearchTerm] = useState<string>(''); // 검색어 상태 추가

    const fetchSearchDataData = async () => {
        // 데이터 가져오는 코드 (현재는 tempList 사용)
    };

    useEffect(() => {
        fetchSearchDataData();
    }, [dataBaseID]);

    const handleRowClick = (item: any | null) => {
        handleSelectData(item);
        setShowSearch(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // 검색어를 기반으로 joinData 필터링
    const filteredData = joinData?.filter(item =>
        item.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pkColumnName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.joinColumnDataType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!showSearch) return null;

    return (
        <div className={styles.search}>
            <section className={styles.search__title}>
                {title}
                <p onClick={() => handleRowClick(null)}>
                    X
                </p>
            </section>
            <section className={styles.search__searchBar}>
                <div className={styles.search__searchBar__inputBox}>
                    <img src={searchIcon} alt="Search Icon" />
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </section>
            <section className={styles.search__listBox}>
                <div>
                    {filteredData && filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <p key={index}>
                                <span onClick={() => handleRowClick(item)}>
                                    {item.tableName} / {item.pkColumnName} / {item.joinColumnDataType}
                                </span>
                                {index !== filteredData.length - 1 && <hr style={{ background: '#bdbdbd', height: '1px', border: 'none' }} />}
                            </p>
                        ))
                    ) : (
                        <p>데이터가 없습니다.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Search;
