import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUniversity, FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaHamburger } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './AppNavbar.module.css';

const AppNavbar = ({ currentUser = {} }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        navigate('/login');
    };

    // Determine active link
    const isActive = (path) => location.pathname === path ? styles.active : '';

    return (
        <Navbar bg="white" expand="lg" className={styles.header} fixed="top">
            <Container fluid className="px-3 px-md-5">
                <Navbar.Brand as={Link} to="/" className={styles.brand}>
                    <FaUniversity className={styles.brandIcon} />
                    <div className={styles.brandText}>
                        <span className={styles.brandName}>{t('common.appName')}</span>
                        <span className={styles.brandSub}>CONNECTING UNIVERSITIES</span>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav">
                    <MdMenu />
                </Navbar.Toggle>
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={Link} to="/profile" className={`${styles.navLink} ${isActive('/profile')}`}>
                            <FaUserCircle /> {t('nav.myProfile')}
                        </Nav.Link>
                        <Nav.Link as={Link} to="/publications" className={`${styles.navLink} ${isActive('/publications')}`}>
                            <FaBell /> {t('nav.publications')}
                        </Nav.Link>
                        <Nav.Link as={Link} to="/faire-publication" className={`${styles.navLink} ${isActive('/faire-publication')}`}>
                            <FaBell /> {t('nav.createPublication')}
                        </Nav.Link>
                    </Nav>

                    <div className={`d-flex align-items-center gap-3`}>
                        <LanguageSwitcher />
                        
                        <Dropdown align="end">
                            <Dropdown.Toggle as="div" className={styles.userMenu}>
                                <div className={styles.userAvatar}>
                                    {currentUser.avatar || `${currentUser.firstName?.[0]}${currentUser.lastName?.[0]}`}
                                </div>
                                <div className={styles.userInfo}>
                                    <div className={styles.userName}>
                                        {currentUser.firstName && currentUser.lastName 
                                            ? `${currentUser.firstName} ${currentUser.lastName?.slice(0,1).toUpperCase()}` 
                                            : currentUser.name || t('common.profile')}
                                    </div>
                                    <div className={styles.userRole}>
                                        {Array.isArray(currentUser.roles) ? currentUser.roles[0] : currentUser.role || 'User'}
                                    </div>
                                </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className={styles.userDropdown}>
                                <Dropdown.Item as={Link} to="/profile">
                                    <FaUserCircle /> {t('nav.myProfile')}
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/about">
                                    <FaCog /> {t('common.settings')}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={handleLogout}>
                                    <FaSignOutAlt /> {t('common.logout')}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
     
