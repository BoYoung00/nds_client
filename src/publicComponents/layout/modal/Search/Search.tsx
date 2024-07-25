import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Search.module.scss';
import searchIcon from '../../../../assets/images/search.png';

interface JoinTableItem {
    id: number;
    tableName: string;
    pkColumnName: string;
    joinColumnDataType: string;
}

interface SearchModalProps {
    handleJoinTableSelect: (item: JoinTableItem | null) => void;
    showSearch: boolean;
    setShowSearch: (show: boolean) => void;
}

const Search: React.FC<SearchModalProps> = ({ handleJoinTableSelect, showSearch, setShowSearch }) => {
    const { dataBaseID } = useParams<{ dataBaseID: string }>();
    const [joinTableData, setJoinTableData] = useState<JoinTableItem[] | null>(null);

    const fetchJoinData = async () => {

    };

    useEffect(() => {
        fetchJoinData();
    }, [dataBaseID]);

    const handleRowClick = (item: JoinTableItem | null) => {
        handleJoinTableSelect(item);
        setShowSearch(false);
    };

    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchTitle}>조인할 테이블 PK 검색</div>
            <div className={styles.searchName}>
                <img src={searchIcon} alt="Search Icon" style={{ width: '25px', height: '25px' }} />
                <input type="text" placeholder="검색어를 입력하세요." className={styles.sn} />
            </div>
            <div className={styles.attribute}>
                <div className={styles.listBox}>
                    <div onClick={() => handleRowClick(null)}>
                        <p className={styles.cancelBtn}>Cancel</p>
                    </div>
                    {joinTableData && joinTableData.length > 0 ? (
                        joinTableData.map((item, index) => (
                            <div key={item.id}>
                                <div onClick={() => handleRowClick(item)}>
                                    <p className={styles.joinData}>
                                        {item.tableName} / {item.pkColumnName} / {item.joinColumnDataType}
                                    </p>
                                </div>
                                {index !== joinTableData.length - 1 && <hr />}
                            </div>
                        ))
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
