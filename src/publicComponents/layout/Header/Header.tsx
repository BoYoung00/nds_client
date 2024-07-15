import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.scss';
import logo from '../../../assets/images/logo.png';
import { extractUserFromEmail } from '../../../utils/utils';
import {useHeader} from "./useHeader";

interface HeaderProps {
    user: UserToken | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const { selectedIndex, showMenu, toggleMenu, menuItems } = useHeader(); // Custom Hook 사용


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

            {user && (
                <div className={styles.header__userInfo} onClick={toggleMenu}>
                    {extractUserFromEmail(user.userEmail)}
                    {showMenu && (
                        <div className={styles.dropdown}>
                            <Link to="/" onClick={onLogout}>
                                로그아웃
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
