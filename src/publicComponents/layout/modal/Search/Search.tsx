import React, { useState } from 'react';
import styles from './Search.module.scss';
import searchIcon from '../../../../assets/images/search.png';

interface SearchModalProps {
    title: string;
    handleSelectData: (item: any) => void;
    showSearch: boolean;
    setShowSearch: (show: boolean) => void;
    dataList: any[];
    type: 'joinTable' | 'joinData' | 'media';
}

const Search: React.FC<SearchModalProps> = ({ handleSelectData, showSearch, setShowSearch, title, dataList, type }) => {
    const [searchTerm, setSearchTerm] = useState<string>(''); // 검색어 상태 추가

    const handleRowClick = (item: any | null) => {
        handleSelectData(item);
        setShowSearch(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // 검색어를 소문자로 변환하여 대소문자 구분 없이 검색
    const searchTermLower = searchTerm.toLowerCase();

    // 필터링 함수
    const filterData = () => {
        switch (type) {
            case 'joinTable':
                return dataList.filter(item =>
                    item.name.toLowerCase().includes(searchTermLower) ||
                    (item.pkColumn && item.pkColumn.name.toLowerCase().includes(searchTermLower)) ||
                    (item.pkColumn && item.pkColumn.type.toLowerCase().includes(searchTermLower))
                );
            case 'joinData':
                return dataList.filter(item =>
                    item.tableName.toLowerCase().includes(searchTermLower)
                );
            case 'media':
                return dataList.filter(item =>
                    item.tableName.toLowerCase().includes(searchTermLower)
                );
            default:
                return [];
        }
    };

    const filteredData = filterData();

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
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <div key={index}>
                            <span onClick={() => handleRowClick(`${item.name} / ${item.pkColumn?.name} / ${item.pkColumn?.type}`)}>
                                {item.name} / {item.pkColumn?.name} / {item.pkColumn?.type}
                            </span>
                            {index !== filteredData.length - 1 && <hr style={{ background: '#bdbdbd', height: '1px', border: 'none' }} />}
                        </div>
                    ))
                ) : (
                    <p>데이터가 없습니다.</p>
                )}
            </section>
        </div>
    );
};

export default Search;
