import { useEffect, useState } from "react";
import { useRevision } from "../../../contexts/RevisionContext";

export const useSearchBar = () => {
    const { stampings, setSearchStampings, handelResetSearchStamping } = useRevision();
    const [searchWord, setSearchWord] = useState<string>('');
    const [searchType, setSearchType] = useState<string>('메세지');

    useEffect(() => {
        handelResetSearchStamping();
    }, [handelResetSearchStamping]);

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

    return {
        searchWord,
        searchType,
        handleChange,
        handleSelectChange,
        handleSearch,
    };
};
