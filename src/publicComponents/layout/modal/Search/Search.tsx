import React, {useState} from 'react';
import styles from './Search.module.scss';
import searchIcon from '../../../../assets/images/search.png';

// 임시 데이터
const tempList: JoinTable[] = [
    {
        id: 1,
        tableName: 'Users',
        pkColumnName: 'user_id',
        joinColumnDataType: 'INT'
    },
    {
        id: 2,
        tableName: 'Orders',
        pkColumnName: 'order_id',
        joinColumnDataType: 'VARCHAR'
    },
    {
        id: 3,
        tableName: 'Products',
        pkColumnName: 'product_id',
        joinColumnDataType: 'UUID'
    },
    {
        id: 4,
        tableName: 'Orders2',
        pkColumnName: 'order_id2',
        joinColumnDataType: 'VARCHAR'
    },
    {
        id: 5,
        tableName: 'Orders3',
        pkColumnName: 'order_id3',
        joinColumnDataType: 'VARCHAR'
    },
];

interface SearchModalProps {
    title: string;
    handleSelectData: (item: any) => void;
    showSearch: boolean;
    setShowSearch: (show: boolean) => void;
    dataList: any[];
    type: 'joinTable' | 'joinData' | 'media';
}

const Search: React.FC<SearchModalProps> = ({ handleSelectData, showSearch, setShowSearch, title , dataList, type}) => {
    const [searchTerm, setSearchTerm] = useState<string>(''); // 검색어 상태 추가

    const handleRowClick = (item: any | null) => {
        handleSelectData(item);
        setShowSearch(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    //joinTable 검색 필터링
    const joinTableFilter = dataList?.filter(item =>
        item.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pkColumnName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.joinColumnDataType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //joinData 검색 필터링
    const joinDataFilter = dataList?.filter(item =>
        item.tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pkColumnName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.joinColumnDataType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //mediaData 검색 필터링
    const mediaDataFilter = dataList?.filter(item =>
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
                {type === 'joinTable' &&
                    <div>
                    {joinTableFilter && joinTableFilter.length > 0 ? (
                        joinTableFilter.map((item, index) => (
                            <p key={index}>
                                <span onClick={() => handleRowClick(item)}>
                                    {item.tableName} / {item.pkColumnName} / {item.joinColumnDataType}
                                </span>
                                {index !== joinTableFilter.length - 1 && <hr style={{ background: '#bdbdbd', height: '1px', border: 'none' }} />}
                            </p>
                        ))
                    ) : (
                        <p>데이터가 없습니다.</p>
                    )}
                    </div>
                }
            </section>
        </div>
    );
};

export default Search;
