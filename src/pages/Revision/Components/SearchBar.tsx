import styles from '../Revision.module.scss';
import React from "react";
import {useRevision} from "../../../contexts/RevisionContext";

const SearchBar: React.FC = () => {
    const {} = useRevision();

    return (
        <div className={styles.searchBar}>
            <div className={styles.searchBar__container}>
                <select>
                    <option>메세지</option>
                    <option>해시</option>
                </select>
                <input type="text" placeholder='검색어를 입력해주세요.'/>
                <button>검 색</button>
            </div>
        </div>
    );
};

export default SearchBar;