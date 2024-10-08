import React, {useEffect, useRef, useState} from 'react';
import styles from './Main.module.scss';
import logo from "../../assets/images/logo.png";
import dataImage from '../../assets/images/erd/data.png';
import likeImage from '../../assets/images/erd/like.png';
import restApiImage from '../../assets/images/erd/restApi.png';
import queryImage from '../../assets/images/erd/query.png';
import excelImage from '../../assets/images/erd/excel.png';
import resourceImage from '../../assets/images/erd/resource.png';
import ellipse_red from '../../assets/images/ellipse_red.png';
import ellipse_blue from '../../assets/images/ellipse_blue.png';
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import database from '../../assets/images/main/database.png';
import apiArchive from '../../assets/images/main/apiArchive.png';
import revision from '../../assets/images/main/revision.png';
import workspace from '../../assets/images/main/workspace.png';

const Main: React.FC = () => {
    // 헤더 이동
    const section1Ref = useRef<HTMLDivElement>(null);
    const section2Ref = useRef<HTMLDivElement>(null);
    const section3Ref = useRef<HTMLDivElement>(null);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Intersection Observer
    const [observer1Ref, observer1InView] = useInView({ threshold: 0.3, triggerOnce: true, });
    const [observer2Ref, observer2InView] = useInView({ threshold: 0.3, triggerOnce: true, });
    const [observer3Ref, observer3InView] = useInView({ threshold: 0.3, triggerOnce: true, });
    const [observer4Ref, observer4InView] = useInView({ threshold: 0.3, triggerOnce: true, });
    const [observer5Ref, observer5InView] = useInView({ threshold: 0.3, triggerOnce: true, });
    const [observer6Ref, observer6InView] = useInView({ threshold: 0.3, triggerOnce: true, });
    const [observer7Ref, observer7InView] = useInView({ threshold: 0.3, triggerOnce: true, });
    const [observer8Ref, observer8InView] = useInView({ threshold: 0.3, triggerOnce: true, });

    // parallax
    const [scrollY, setScrollY] = useState(0);

    const handleScroll = () => {
        setScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={styles.main}>
            <header className={styles.header}>
                <ul>
                    <img className={styles.header__logo} src={logo} alt="Logo" />
                    <li onClick={() => scrollToSection(section1Ref)}>DATABASE</li>
                    <li onClick={() => scrollToSection(section2Ref)}>REVISION</li>
                    <li onClick={() => scrollToSection(section2Ref)}>API ARCHIVE</li>
                    <li onClick={() => scrollToSection(section3Ref)}>WORKSPACE</li>
                </ul>
                <Link to={'/auth'}>로그인</Link>
            </header>

            <div className={styles.sectionsContainer}>
                <div ref={section1Ref} className={styles.group1}>
                    <section className={`${styles.group1__header} ${observer1InView ? styles.visible1 : ''}`} ref={observer1Ref}>
                        <p>서비스 소개</p>
                        <p>우리 D-SIM은 웹으로 쉽게 데이터베이스를 관리할 수 있는 서비스를 제공합니다.</p>
                    </section>
                    <section className={styles.group1__mainTop}>
                        <img
                            src={database}
                            alt="database"
                            className={`${styles.group1__mainTop__img} ${observer2InView ? styles.visible2 : ''}`} ref={observer2Ref}
                        />
                        <div className={`${styles.group1__mainTop__comment} ${observer3InView ? styles.visible3 : ''}`} ref={observer3Ref}>
                            <h2>DATABASE</h2>
                            <p>
                                <span>“쉽고 빠른 데이터베이스 생성 및 관리”</span>
                                복잡한 설정 없이 몇 번의 클릭만으로 물리적 또는 논리적 데이터베이스를 손쉽게 생성하고, 이를 웹 사이트와 연동해 다양한 기능을 활용할 수 있습니다.
                            </p>
                        </div>
                    </section>
                    <section className={styles.group1__mainBottom}>
                        <div className={`${styles.group1__mainBottom__comment} ${observer4InView ? styles.visible4 : ''}`} ref={observer4Ref}>
                            <h2>DATABASE 활용 방법</h2>
                            <p>6가지 기능을 사용하여 <br />데이터베이스 테이블 데이터를 <br /> 관리하고 활용해 보세요. </p>
                        </div>
                        <div className={`${styles.cardBox} ${observer5InView ? styles.visible5 : ''}`} ref={observer5Ref}>
                            <MainCard title={'DATA'} comment={`데이터베이스 테이블에 \n 데이터를 넣어 관리하는 기능`} src={dataImage} />
                            <MainCard title={'REST API'} comment={'테이블에 접근 가능한 \n Rest Api Url들을 모두 모아\n 한 눈에 볼 수 있는 기능'} src={restApiImage} />
                            <MainCard title={'CUSTOM API'} comment={'테이블 데이터를 필터링 하여 \n Rest Api Url로 접근해 \n 사용할 수 있는 기능'} src={likeImage} />
                            <MainCard title={'SQL, CLASS'} comment={'여러 가지 DB 시스템에 대한 .sql 파일 추출 및 데이터 전송을 위해 사용되는 DTO 자동 생성 기능'} src={queryImage} />
                            <MainCard title={'EXCEL'} comment={'CSV 파일을 통하여 테이블 \n 데이터를 추출하고, import \n 할 수 있게 해주는 기능'} src={excelImage} />
                            <MainCard title={'RESOURCE'} comment={'Media 타입의 이미지, 동영상\n 파일들을 관리해주는 기능'} src={resourceImage} />
                        </div>
                        <img
                            src={ellipse_red}
                            alt="ellipse_red"
                            className={`${styles.ellipse} ${styles.ellipse__red}`}
                            style={{
                                transform: `translate(${scrollY * 0.03}px, ${scrollY * 0.03}px) scale(${1 + scrollY * 0.0001})`,
                                transition: 'transform 0.6s ease-out',
                            }}
                        />
                        <img
                            src={ellipse_blue}
                            alt="ellipse_blue"
                            className={`${styles.ellipse} ${styles.ellipse__blue}`}
                            style={{
                                transform: `translate(${scrollY * -0.03}px, ${scrollY * 0.03}px) scale(${1 + scrollY * 0.0001})`,
                                transition: 'transform 0.6s ease-out',
                            }}
                        />
                    </section>
                </div>

                <div ref={section2Ref} className={styles.group2}>
                    <section className={`${styles.group2__section} ${observer6InView ? styles.visible6 : ''}`} ref={observer6Ref}>
                        <img src={revision} alt="revision" />
                        <h2>REVISION</h2>
                        <p>
                            <span>“데이터베이스 버전 관리”</span>
                            데이터베이스 변경 내역을 저장하고, 원하는 시점으로 쉽게 되돌리거나 체크아웃할 수 있습니다. 리셋 기능으로 잘못된 변경도 간편하게 복구하세요.
                        </p>
                    </section>
                    <section className={`${styles.group2__section} ${observer7InView ? styles.visible7 : ''}`} ref={observer7Ref}>
                        <img src={apiArchive} alt="apiArchive" />
                        <h2>API ARCHIVE</h2>
                        <p>
                            <span>“API 보관함”</span>
                            원하는 데이터베이스 테이블의 REST API를 보관함에 저장하여 관리하여 보세요. 좀 더 빠른 웹 페이지 제작을 하실 수 있습니다.
                        </p>
                    </section>
                </div>

                <div ref={section3Ref} className={styles.group3} >
                    <h1 className={`${observer8InView ? styles.visible8 : ''}`}>WORKSPACE</h1>
                    <img src={workspace} alt="workspace" className={`${observer8InView ? styles.visible8 : ''}`} ref={observer8Ref}/>
                    <p className={`${observer8InView ? styles.visible9 : ''}`}>직접 만든 데이터베이스를 바탕으로 템플릿을 이용해 본인만의 웹 사이트를 만들어보세요.</p>
                </div>
            </div>
        </div>
    );
}

export default Main;

interface MainCardProps {
    title: string;
    comment: string;
    src: string;
}

const MainCard: React.FC<MainCardProps> = ({ title, comment, src}) => {

    return (
        <div className={styles.mainCard}>
            <div className={styles.contentWrap}>
                <span className={styles.imgWrap}>
                    <img src={src} alt={title} />
                </span>
                <h2>{title}</h2>
                <p>{comment}</p>
            </div>
        </div>
    );
}
