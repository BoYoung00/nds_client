import React, { useState } from 'react';
import styles from './Search.module.scss';
import searchIcon from '../../../../assets/images/search.png';

interface SearchModalProps {
    title: string;
    handleSelectData: (...args: any[]) => void;
    showSearch: boolean;
    setShowSearch: (show: boolean) => void;
    dataList: any[];  // images와 videos 데이터를 받아 처리할 리스트
    type: 'joinTable' | 'joinData' | 'media';
    index?: number;
}

const Search: React.FC<SearchModalProps> = ({ handleSelectData, showSearch, setShowSearch, title, dataList, type, index }) => {
    const [searchTerm, setSearchTerm] = useState<string>(''); // 검색어 상태 추가

    const handleRowClick = (item: any) => {
        if (type === 'joinTable')
            handleSelectData(item, index);
        else if (type === 'joinData')
            handleSelectData(item);
        else
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
                    item.toLowerCase().includes(searchTermLower)
                );
            case 'media':
                return dataList.filter(item =>
                    item.fileName.toLowerCase().includes(searchTermLower)
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
                        <div key={index} onClick={() => handleRowClick(item.path)}>
                            {type === 'joinTable' ? (
                                <>
                                    {item.name} / {item.pkColumn?.name} / {item.pkColumn?.type}
                                </>
                            ) : type === 'media' ? (
                                <>
                                    {item.path.endsWith('.mp4') ? (
                                        <video key={item.id} controls>
                                            <source src={item.path} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img src={item.path} alt={item.fileName} />
                                    )}
                                    {item.fileName}
                                </>
                            ) : (
                                <>
                                    {item}
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={{marginLeft: '1.1rem'}}>데이터가 없습니다.</p>
                )}
                <span className={styles.search__listBox__cancel} onClick={() => handleRowClick(null)}>
                    Cancel
                </span>
            </section>
        </div>
    );
};

export default Search;
