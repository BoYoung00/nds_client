import {useEffect, useState} from 'react';
import {
    deleteImage,
    deleteVideo,
    getImagesPathList,
    getVideoPathList,
    uploadImageFile,
    uploadVideoFile
} from "../../../services/api";

export const useResourceTab = (selectedTable: TableData | null) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isOn, setIsOn] = useState<boolean>(true);

    const [imagePaths, setImagePaths] = useState<MediaFile[]>([]);
    const [videoPaths, setVideoPaths] = useState<MediaFile[]>([]);

    const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<MediaFile | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedTable?.tableHash) {
            fetchImages(selectedTable.tableHash);
            fetchVideos(selectedTable.tableHash);
        }
    }, [selectedTable]);

    const toggle = () => {
        setIsOn(!isOn);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleUpload(e.target.files[0])
        }
    };

    const handleUpload = async (file: File) => {
        if (!selectedTable?.tableHash) return;

        if (isOn) {
            try {
                const response = await uploadImageFile(selectedTable.tableHash, file);
                setSuccessMessage(response);
                await fetchImages(selectedTable.tableHash);
            } catch (error) {
                const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
                setErrorMessage(errorMessage);
            }
        } else {
            try {
                const response = await uploadVideoFile(selectedTable.tableHash, file);
                setSuccessMessage(response);
                await fetchVideos(selectedTable.tableHash);
            } catch (error) {
                const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
                setErrorMessage(errorMessage);
            }
        }
    };

    const fetchImages = async (tableHash: string) => {
        try {
            setLoading(true);
            const data = await getImagesPathList(tableHash);
            // console.log('이미지 경로 리스트', data);
            setImagePaths(data);
        } catch (error) {
            setErrorMessage('이미지 경로 목록을 가져오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchVideos = async (tableHash: string) => {
        try {
            setLoading(true);
            const data = await getVideoPathList(tableHash);
            // console.log('비디오 경로 리스트', data);
            setVideoPaths(data);
        } catch (error) {
            setErrorMessage('비디오 경로 목록을 가져오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchFileDelete = async () => {
        if (isOn && selectedImage) {
            try {
                await deleteImage(selectedImage.id);
                setImagePaths(prevPaths => prevPaths.filter(image => image !== selectedImage));
                setSuccessMessage("이미지 삭제에 성공하셨습니다.");
            } catch (error) {
                setErrorMessage('이미지 파일 삭제에 실패했습니다.');
            }
        } else if (!isOn && selectedVideo) {
            try {
                await deleteVideo(selectedVideo.id);
                setVideoPaths(prevPaths => prevPaths.filter(video => video !== selectedVideo));
                setSuccessMessage("비디오 삭제에 성공하셨습니다.");
            } catch (error) {
                setErrorMessage('비디오 파일 삭제에 실패했습니다.');
            }
        } else {
            setErrorMessage("선택된 파일이 없습니다.");
        }
    };

    return {
        hooks: {
            loading,
            isOn,
            imagePaths,
            videoPaths,
            selectedImage,
            selectedVideo,
            setSelectedImage,
            setSelectedVideo
        },
        handlers: {
            toggle,
            handleImageChange,
            handleVideoChange,
            handleUpload,
            handleFetchFileDelete
        },
        modals: {
            errorMessage,
            setErrorMessage,
            successMessage,
            setSuccessMessage
        }
    };
};
