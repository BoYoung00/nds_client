import { useState } from 'react';

export const useDataBaseBlueSidebar = (setSelectedDataBase: (dataBase: DataBaseEntity) => void) => {
    const [selectedId, setSelectedId] = useState(-1);
    const [isOpenCreateDBModal, setIsOpenCreateDBModal] = useState<boolean>(false);
    const [isOpenQueryModal, setIsOpenQueryModal] = useState<boolean>(false);
    const [isErrorOpen, setIsErrorOpen] = useState<boolean>(false);

    const onSelected = (dataBase: DataBaseEntity) => {
        setSelectedId(dataBase.id!!);
        setSelectedDataBase(dataBase);
    }

    const handleQuery = () => {
        if (selectedId === -1) {
            setIsErrorOpen(true);
        } else {
            setIsOpenQueryModal(true);
        }
    }

    const handleScript = () => {
        if (selectedId === -1) {
            setIsErrorOpen(true);
        } else {
            console.log('스크립트 다운 로직');
        }
    }

    const handleDelete = () => {
        if (selectedId === -1) {
            setIsErrorOpen(true);
        } else {
            console.log('삭제 로직');
        }
    }

    return {
        selectedId,
        modals: {
            isOpenCreateDBModal,
            setIsOpenCreateDBModal,
            isOpenQueryModal,
            setIsOpenQueryModal,
            isErrorOpen,
            setIsErrorOpen,
        },
        handlers: {
            onSelected,
            handleQuery,
            handleScript,
            handleDelete,
        }
    };
};
