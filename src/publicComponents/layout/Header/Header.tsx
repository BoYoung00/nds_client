import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import styles from './Header.module.scss';
import logo from '../../../assets/images/logo.png';
import {useHeader} from "./useHeader";

interface HeaderProps {
    token: string;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ token, onLogout }) => {
    const { selectedIndex, showMenu, toggleMenu, menuItems } = useHeader();
    const [email, setEmail] = useState<string | null>(null);

    const copyTokenToClipboard = (token: string) => {
        navigator.clipboard.writeText(token)
            .catch((err) => {
                console.error('토큰 복사 실패:', err);
            });
    };

    useEffect(()=> {
        setEmail(localStorage.getItem('email'));
    }, [token])

    return (
        <header className={styles.header}>
            <img className={styles.header__nav__logo} src={logo} alt="Logo" />
            <ul className={styles.header__nav}>
                {menuItems && menuItems.map((item, index) => (
                    <li
                        key={index}
                        className={`${styles.header__nav__item} ${
                            selectedIndex === index ? styles['header__nav__item--selected'] : ''
                        }`}
                    >
                        <Link to={item.path}>{item.text}</Link>
                    </li>
                ))}
            </ul>

            {(token && email) ? (
                    <div className={styles.header__userInfo} onClick={toggleMenu}>
                        {email}
                        {showMenu && (
                            <div className={styles.dropdown}>
                                <Link to="/" onClick={onLogout}>
                                    로그아웃
                                </Link>
                                <a onClick={() => copyTokenToClipboard(token)}>
                                    토큰 복사
                                </a>
                            </div>
                        )}
                    </div>
                ) :
                <div className={styles.header__userInfo} onClick={toggleMenu}>
                    NULL
                    {showMenu && (
                        <div className={styles.dropdown}>
                            <Link to="/" onClick={onLogout}>
                                로그아웃
                            </Link>
                            <a onClick={() => copyTokenToClipboard(token)}>
                                토큰 복사
                            </a>
                        </div>
                    )}
                </div>
            }
        </header>
    );
};

export default Header;
