import styles from '../Revision.module.scss';
import React from "react";
import {useSearchBar} from "../hooks/useSearchBar";

const SearchBar: React.FC = () => {
    const {
        searchWord,
        searchType,
        handleChange,
        handleSelectChange,
        handleSearch,
    } = useSearchBar();

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
