import React from 'react';
import styles from '../DBMode.module.scss';
import { Notification } from "../../../publicComponents/layout/modal/Notification";
import {useResourceTab} from "../hooks/useResourceTab";

const ResourceTab: React.FC = () => {
    const {
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
            handleFetchFileDelete
        },
        modals: {
            errorMessage,
            setErrorMessage,
            successMessage,
            setSuccessMessage
        }
    } = useResourceTab();

    const apiUrl = process.env.REACT_APP_API_URL;

    return (
        <>
            <div className={styles.ResourceTab}>
                <header className={styles.header}>
                    <section className={styles.urlBox}>
                        <div>
                            <span>Submit URL : </span>
                            {isImage ? `${apiUrl}/api/medias/image` : `${apiUrl}/api/medias/video`}
                        </div>
                        <div>
                            <span>URL : </span>
                            {isImage
                                ? selectedImage
                                    ? selectedImage.path
                                    : '이미지를 클릭하여 접근 URL을 확인 하세요.'
                                : selectedVideo
                                    ? selectedVideo.path
                                    : '동영상을 클릭하여 접근 URL을 확인 하세요.'
                            }
                        </div>
                    </section>
                    <section className={styles.butBox}>
                        <div className={`${styles.toggleBut} ${isImage ? styles.on : styles.off}`} onClick={toggle}>
                            <div className={`${styles.circle} ${!isImage ? styles.circleOff : ''}`}></div>
                            <span className={styles.label}>{isImage ? 'Image' : 'Video'}</span>
                        </div>
                        <button className={styles.deleteBut} onClick={handleFetchFileDelete}>DELETE</button>
                    </section>
                </header>
                <main className={styles.main}>
                    {isImage ? (
                        <section>
                            {imagePaths.map((image) => (
                                <img
                                    key={image.id}
                                    src={image.path}
                                    alt={image.fileName}
                                    onClick={() => setSelectedImage(image)}
                                    className={selectedImage?.id === image.id ? styles.selected : ''}
                                />
                            ))}
                            <label className={styles.addBut}>
                                + <input key='image' type="file" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </section>
                    ) : (
                        <section>
                            {videoPaths.map((video) => (
                                <video
                                    key={video.id}
                                    controls
                                    onClick={() => setSelectedVideo(video)}
                                    className={selectedVideo?.id === video.id ? styles.selected : ''}
                                >
                                    <source src={video.path} type="video/mp4" />
                                </video>
                            ))}
                            <label className={styles.addBut} style={{width: '17.8rem'}}>
                                + <input key='video' type="file" accept="video/*" onChange={handleVideoChange} />
                            </label>
                        </section>
                    )}
                </main>
            </div>

            {successMessage && (
                <Notification onClose={() => setSuccessMessage(null)} type="success" message={successMessage} />
            )}
            {errorMessage && (
                <Notification onClose={() => setErrorMessage(null)} type="error" message={errorMessage} />
            )}
        </>
    );
};

export default ResourceTab;
