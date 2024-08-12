import {useEffect, useState} from 'react';
import {
    deleteImage,
    deleteVideo,
    getImagesPathList,
    getVideoPathList,
    uploadImageFile,
    uploadVideoFile
} from "../../../services/api";
import {useDataBase} from "../../../contexts/DataBaseContext";

export const useResourceTab = () => {
    const { selectedTable } = useDataBase();

    const [loading, setLoading] = useState<boolean>(false);
    const [isImage, setIsImage] = useState<boolean>(true);

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

    const toggle = () => setIsImage(!isImage);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleUpload(e.target.files[0]);
            e.target.value = '';
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleUpload(e.target.files[0])
            e.target.value = '';
        }
    };

    // 이미지 업로드
    const handleUpload = async (file: File) => {
        if (!selectedTable?.tableHash) return;

        try {
            let response: string;
            if (isImage) { // 이미지
                response = await uploadImageFile(selectedTable.tableHash, file);
                await fetchImages(selectedTable.tableHash);
            } else { // 비디오
                response = await uploadVideoFile(selectedTable.tableHash, file);
                await fetchVideos(selectedTable.tableHash);
            }
            setSuccessMessage(response);
        } catch (error) {
            const errorMessage = (error as Error).message || '알 수 없는 오류가 발생했습니다.';
            console.error('업로드 오류:', errorMessage);
            setErrorMessage(errorMessage);
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
        try {
            if (isImage && selectedImage) {
                await deleteImage(selectedImage.id);
                setImagePaths(prevPaths => prevPaths.filter(image => image !== selectedImage));
                setSuccessMessage("이미지 삭제에 성공하셨습니다.");
            } else if (!isImage && selectedVideo) {
                await deleteVideo(selectedVideo.id);
                setVideoPaths(prevPaths => prevPaths.filter(video => video !== selectedVideo));
                setSuccessMessage("비디오 삭제에 성공하셨습니다.");
            } else {
                setErrorMessage("선택된 파일이 없습니다.");
            }
        } catch (error) {
            const errorMessage = (error as Error).message || '파일 삭제에 실패했습니다.';
            setErrorMessage(errorMessage);
        }
    };

    return {
        hooks: {
            loading,
            isImage,
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
