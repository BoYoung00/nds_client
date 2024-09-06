import {useState} from 'react';
import {downloadNdsFile} from "../../../services/api";
import {downloadFile} from "../../../utils/utils";
import {useDataBase} from "../../../contexts/DataBaseContext";

export const useDataBaseBlueSidebar = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { selectedDataBase, setSelectedDataBase } = useDataBase();

    const [selectedDatabaseID, setSelectedDatabaseID] = useState(selectedDataBase ? selectedDataBase?.id! : -1);
    const [isOpenCreateDBModal, setIsOpenCreateDBModal] = useState<boolean>(false);
    const [isOpenQueryModal, setIsOpenQueryModal] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSelected = (dataBase: DataBaseEntity) => {
        setSelectedDatabaseID(dataBase.id!!);
        setSelectedDataBase(dataBase);
    }

    const handleQuery = () => {
        if (selectedDatabaseID === -1) {
            setErrorMessage("데이터베이스를 선택해주세요.");
        } else {
            setIsOpenQueryModal(true);
        }
    }

    const handleScript = async () => {
        if (selectedDatabaseID === -1) {
            setErrorMessage("데이터베이스를 선택해주세요.");
        } else {
            try {
                const { blob: fileBlob, fileName } = await downloadNdsFile(selectedDatabaseID);
                downloadFile(fileBlob, fileName); // 파일 다운로드
            } catch (error) {
                console.error('파일 다운로드 중 오류 발생:', error);
                setErrorMessage("파일 다운로드 중 오류가 발생했습니다.");
            }
        }
    };

    const handleDelete = () => {
        if (selectedDatabaseID === -1) {
            setErrorMessage("데이터베이스를 선택해주세요.");
        } else {
            console.log('삭제 로직');
        }
    }

    return {
        selectedDatabaseID,
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
