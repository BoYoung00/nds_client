import React from "react";
import styles from './Ui.module.scss';


const LoadingSpinner: React.FC = () => {
    return (
        <div className={styles.spinner}></div>
    );
};

export default LoadingSpinner;

/*
const [loading, setLoading] = useState(true);

useEffect(() => {
    // 예시로 3초 후 로딩이 끝나는 상태
    const timer = setTimeout(() => {
        setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
}, []);

<div>
    {loading ? <Spinner /> : <p>로딩 완료!</p>}
</div>
*/