import styles from '../Revision.module.scss';
import React, { useEffect, useState } from "react";
import { useRevision } from "../../../contexts/RevisionContext";

const SearchBar: React.FC = () => {
    const { stampings, setSearchStampings, handelResetSearchStamping } = useRevision();

    const [searchWord, setSearchWord] = useState<string>('');
    const [searchType, setSearchType] = useState<string>('메세지'); // select 요소의 선택된 값 추적

    useEffect(() => {
        handelResetSearchStamping();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(event.target.value);
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchType(event.target.value);
    };

    const handleSearch = () => {
        const filteredStampings = stampings.filter(stamping => {
            if (searchType === '메세지') {
                return stamping.message.includes(searchWord);
            } else if (searchType === '해시') {
                return stamping.stampingHash.slice(0, 6).includes(searchWord);
            }
            return false;
        });
        setSearchStampings(filteredStampings);
    };

    return (
        <div className={styles.searchBar}>
            <div className={styles.searchBar__container}>
                <select onChange={handleSelectChange} value={searchType}>
                    <option value="메세지">메세지</option>
                    <option value="해시">해시</option>
                </select>
                <input
                    type="text"
                    placeholder="검색어를 입력해주세요."
                    onChange={handleChange}
                    value={searchWord}
                />
                <button onClick={handleSearch}>검 색</button>
            </div>
        </div>
    );
};

export default SearchBar;
