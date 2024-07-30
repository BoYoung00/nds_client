import {useEffect, useState} from 'react';
import {getDataBasesForCurrentUser} from "../../../services/api";

export const useDataBaseBlueSidebar = (setSelectedDataBase: (dataBase: DataBaseEntity) => void) => {
    const [selectedId, setSelectedId] = useState(-1);
    const [isOpenCreateDBModal, setIsOpenCreateDBModal] = useState<boolean>(false);
    const [isOpenQueryModal, setIsOpenQueryModal] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [databases, setDatabases] = useState<DataBaseEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDataBasesForCurrentUser();
                setDatabases(data);
            } catch (err) {
                setErrorMessage('데이터베이스를 가져오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const onSelected = (dataBase: DataBaseEntity) => {
        setSelectedId(dataBase.id!!);
        setSelectedDataBase(dataBase);
    }

    const handleQuery = () => {
        if (selectedId === -1) {
            setErrorMessage("선택된 데이터베이스가 없습니다.");
        } else {
            setIsOpenQueryModal(true);
        }
    }

    const handleScript = () => {
        if (selectedId === -1) {
            setErrorMessage("선택된 데이터베이스가 없습니다.");
        } else {
            console.log('스크립트 다운 로직');
        }
    }

    const handleDelete = () => {
        if (selectedId === -1) {
            setErrorMessage("선택된 데이터베이스가 없습니다.");
        } else {
            console.log('삭제 로직');
        }
    }

    return {
        databases,
        selectedId,
        modals: {
            isOpenCreateDBModal,
            setIsOpenCreateDBModal,
            isOpenQueryModal,
            setIsOpenQueryModal,
            errorMessage,
            setErrorMessage,
        },
        handlers: {
            onSelected,
            handleQuery,
            handleScript,
            handleDelete,
        }
    };
};
