import {useEffect, useState} from 'react';
import {downloadNdsFile, updateDatabaseComment} from "../../../services/api";
import {downloadFile} from "../../../utils/utils";
import {useDataBase} from "../../../contexts/DataBaseContext";

export const useDataBaseBlueSidebar = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const { selectedDataBase, setSelectedDataBase, setDatabases, databases } = useDataBase();

    const [comment, setComment] = useState<string>('');
    // const [selectedDatabaseID, setSelectedDatabaseID] = useState(selectedDataBase ? selectedDataBase?.id! : -1);
    const [isOpenCreateDBModal, setIsOpenCreateDBModal] = useState<boolean>(false);
    const [isOpenQueryModal, setIsOpenQueryModal] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedDataBase) {
            setComment(selectedDataBase?.comment || '');
        }
    }, [selectedDataBase, databases, setSelectedDataBase]);


    const onSelected = (dataBase: DataBaseEntity) => {
        setSelectedDataBase(dataBase);
        setComment(dataBase.comment || '');
    }

    const handleQuery = () => {
        if (selectedDataBase?.id === -1) {
            setErrorMessage("데이터베이스를 선택해주세요.");
        } else {
            setIsOpenQueryModal(true);
        }
    }

    const handleScript = async () => {
        if (!selectedDataBase) return;
        if (selectedDataBase.id === -1) {
            setErrorMessage("데이터베이스를 선택해주세요.");
        } else {
            try {
                const { blob: fileBlob, fileName } = await downloadNdsFile(selectedDataBase.id!);
                downloadFile(fileBlob, fileName); // 파일 다운로드
            } catch (error) {
                console.error('파일 다운로드 중 오류 발생:', error);
                setErrorMessage("파일 다운로드 중 오류가 발생했습니다.");
            }
        }
    };

    const handleDelete = () => {
        if (selectedDataBase?.id === -1) {
            setErrorMessage("데이터베이스를 선택해주세요.");
        } else {
            console.log('삭제 로직');
        }
    }

    const handleCommentChange = (newComment: string) => {
        if (comment !== newComment)
            setComment(newComment);
    };

    const handleCommentBlur = async () => {
        const prevSelectedDatabase = selectedDataBase;
        if (selectedDataBase) {
            try {
                await updateDatabaseComment(selectedDataBase.id! , comment);

                setDatabases(prevDatabaseDataList => {
                    const updatedDatabases = prevDatabaseDataList.map(database =>
                        database.id === selectedDataBase.id
                            ? { ...database, comment: comment }
                            : database
                    );
                    setSelectedDataBase(updatedDatabases.find(database => database.id === prevSelectedDatabase?.id) || null);
                    return updatedDatabases;
                });

            } catch (error) {
                const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
                setErrorMessage(errorMessage);
            }
        }
    };

    return {
        comment,
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
            handleCommentChange,
            handleCommentBlur
        }
    };
};
