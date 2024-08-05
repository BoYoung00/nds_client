import {useEffect, useState} from 'react';
import {downloadNdsFile, getDataBasesForCurrentUser} from "../../../services/api";

export const useDataBaseBlueSidebar = (setSelectedDataBase: (dataBase: DataBaseEntity) => void) => {
    const [selectedDatabaseID, setSelectedDatabaseID] = useState(-1);
    const [isOpenCreateDBModal, setIsOpenCreateDBModal] = useState<boolean>(false);
    const [isOpenQueryModal, setIsOpenQueryModal] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [databases, setDatabases] = useState<DataBaseEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchData();
    }, []);

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

    const onSelected = (dataBase: DataBaseEntity) => {
        setSelectedDatabaseID(dataBase.id!!);
        setSelectedDataBase(dataBase);
    }

    const handleQuery = () => {
        if (selectedDatabaseID === -1) {
            setErrorMessage("선택된 데이터베이스가 없습니다.");
        } else {
            setIsOpenQueryModal(true);
        }
    }

    const handleScript = async () => {
        if (selectedDatabaseID === -1) {
            setErrorMessage("선택된 데이터베이스가 없습니다.");
        } else {
            try {
                const { blob: fileBlob, fileName } = await downloadNdsFile(selectedDatabaseID);

                // Blob URL 생성
                const url = URL.createObjectURL(fileBlob);

                // 임시 링크 요소를 생성하여 파일 다운로드를 트리거
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName; // 파일 이름 설정

                // 링크를 문서에 추가하고 클릭하여 다운로드
                document.body.appendChild(a);
                a.click();

                // 다운로드 후 링크 및 Blob URL을 정리
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('파일 다운로드 중 오류 발생:', error);
                setErrorMessage("파일 다운로드 중 오류가 발생했습니다.");
            }
        }
    };

    const handleDelete = () => {
        if (selectedDatabaseID === -1) {
            setErrorMessage("선택된 데이터베이스가 없습니다.");
        } else {
            console.log('삭제 로직');
        }
    }

    return {
        databases,
        setDatabases,
        selectedId: selectedDatabaseID,
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
