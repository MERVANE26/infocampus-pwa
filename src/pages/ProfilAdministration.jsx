import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    FaUniversity,
    FaChalkboardTeacher,
    FaUserTie,
    FaUserGraduate,
    FaBell,
    FaExclamationTriangle,
    FaCheckCircle,
    FaInfoCircle,
    FaArrowLeft,
    FaArrowRight,
    FaPaperclip,
    FaTrash,
    FaFilePdf,
    FaFileImage,
    FaFileAlt,
    FaUsers,
    FaBuilding,
    FaGlobe,
    FaEye,
    FaEyeSlash,
    FaComments,
    FaExclamationCircle,
    FaThumbsUp,
    FaThumbsDown,
    FaShare,
    FaBookmark,
    FaDownload,
    FaRegBookmark,
    FaRegComments,
    FaRegThumbsUp,
    FaRegThumbsDown,
    FaTimes,
    FaSearch,
    FaFilter,
    FaSort,
    FaImage,
    FaLink,
    FaClock,
    FaCalendarAlt,
    FaUserCircle,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaHome,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCamera,
    FaSave,
    FaUndo,
    FaEdit,
    FaGraduationCap,
    FaBook,
    FaIdCard,
    FaMapPin,
    FaBirthdayCake,
    FaVenusMars,
    FaHeart,
    FaUserFriends,
    FaUserPlus,
    FaUserMinus,
    FaUserCheck,
    FaUserClock,
    FaUserSlash,
    FaUserEdit,
    FaUserCog,
    FaUserTie as FaUserTieIcon,
    FaUserGraduate as FaUserGraduateIcon,
    FaChalkboardTeacher as FaChalkboardTeacherIcon,
    FaUniversity as FaUniversityIcon,
    FaBuilding as FaBuildingIcon,
    FaMapMarkedAlt,
    FaMobile,
    FaEnvelopeOpen,
    FaEnvelopeOpenText,
    FaLock,
    FaUnlock,
    FaKey,
    FaShieldAlt,
    FaBell as FaBellIcon,
    FaBellSlash,
    FaMoon,
    FaSun,
    FaLanguage,
    FaGlobeAfrica,
    FaGlobeAmericas,
    FaGlobeAsia,
    FaGlobeEurope,
    FaPalette,
    FaFont,
    FaBold,
    FaItalic,
    FaUnderline,
    FaList,
    FaListUl,
    FaListOl,
    FaQuoteRight,
    FaCode,
    FaLink as FaLinkIcon,
    FaImage as FaImageIcon,
    FaVideo,
    FaFile,
    FaFilePdf as FaFilePdfIcon,
    FaFileWord,
    FaFileExcel,
    FaFilePowerpoint,
    FaFileArchive,
    FaFileAudio,
    FaFileVideo,
    FaFileCode,
    FaFileImage as FaFileImageIcon,
    FaFileAlt as FaFileAltIcon,
    FaPlus,
    FaMinus,
    FaTimesCircle,
    FaCheckCircle as FaCheckCircleIcon,
    FaInfoCircle as FaInfoCircleIcon,
    FaExclamationTriangle as FaExclamationTriangleIcon,
    FaChartBar,
    FaChartLine,
    FaChartPie,
    FaTachometerAlt,
    FaUsersCog,
    FaUserCog as FaUserCogIcon,
    FaUserShield,
    FaUserLock,
    FaUserSecret,
    FaUserNinja,
    FaUserAstronaut,
    FaUserInjured,
    FaUserMd,
    FaUserNurse,
    FaUserDoctor,
    FaUserTie as FaUserTieIcon2,
    FaUserGraduate as FaUserGraduateIcon2,
    FaChalkboardTeacher as FaChalkboardTeacherIcon2
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdSchool, MdWarning, MdClose, MdMenu, MdPhotoCamera, MdPhotoLibrary, MdDelete, MdEdit, MdSave, MdCancel, MdArrowBack, MdArrowForward, MdHome, MdPerson, MdSettings, MdNotifications, MdLogout, MdDashboard, MdAssignment, MdClass, MdEvent, MdAnnouncement, MdForum, MdGroup, MdWork, MdLocationOn, MdDateRange, MdAccessTime, MdAttachFile, MdInsertPhoto, MdPictureAsPdf, MdDescription, MdInsertDriveFile, MdCloudUpload, MdCloudDone, MdCloudOff, MdAdminPanelSettings, MdSecurity, MdPrivacyTip, MdReport, MdWarning as MdWarningIcon, MdError, MdCheckCircle, MdInfo, MdLock, MdLockOpen, MdLockOutline } from 'react-icons/md';
import { BsPersonBadge, BsPersonVcard, BsThreeDotsVertical, BsGenderMale, BsGenderFemale, BsGenderTrans, BsHeart, BsHeartFill, BsStar, BsStarFill, BsStarHalf, BsAward, BsTrophy, BsBookmark, BsBookmarkFill, BsBookmarkStar, BsBookmarkStarFill, BsBell, BsBellFill, BsBellSlash, BsBellSlashFill, BsGear, BsGearFill, BsPalette, BsPaletteFill, BsMoon, BsMoonFill, BsSun, BsSunFill, BsTranslate, BsGlobe, BsGlobe2, BsShield, BsShieldFill, BsShieldShaded, BsShieldLock, BsShieldLockFill, BsShieldCheck, BsShieldFillCheck } from 'react-icons/bs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import ListGroup from 'react-bootstrap/ListGroup';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import InputGroup from 'react-bootstrap/InputGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';
import Placeholder from 'react-bootstrap/Placeholder';
import Table from 'react-bootstrap/Table';
import styles from './ProfilAdministration.module.css';

// Import de nos composants de boutons personnalisés
import { 
    BoutonProfil,
    BoutonFermer,
    BoutonAction,
} from '../composants/Index';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Configuration Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteurs Axios
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('🚀 Requête envoyée:', config.url);
        return config;
    },
    error => {
        console.error('❌ Erreur requête:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        console.log('✅ Réponse reçue:', response.status);
        return response;
    },
    error => {
        console.error('❌ Erreur réponse:', error);
        return Promise.reject(error);
    }
);

const ProfilAdministration = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // États
    const [currentAdmin, setCurrentAdmin] = useState({
        id: "ADM001",
        fullName: "FOSTO FRID",
        firstName: "Fosto",
        lastName: "Frid",
        title: "CHARGE DE LA COMMUNICATION",
        email: localStorage.getItem('adminEmail') || "admin@iug.cm",
        phone: localStorage.getItem('adminPhone') || "+237 699 123 456",
        department: localStorage.getItem('adminDepartment') || "Communication",
        photo: "https://i.pravatar.cc/150?img=8",
        role: "Administrateur",
        universite: "Institut Universitaire du Golfe",
        campus: "Campus Principal",
        bureau: "Bâtiment Administratif, Bureau 101",
        hireDate: "15/01/2022",
        permissions: [
            "Gestion des utilisateurs",
            "Modération des publications",
            "Statistiques globales",
            "Gestion des annonces",
            "Configuration système"
        ],
        stats: {
            students: 1245,
            teachers: 48,
            activeUsers: 892,
            totalPublications: 156,
            pendingModeration: 12,
            reports: 3
        },
        notifications: {
            publications: localStorage.getItem('adminNotifications') || "all",
            system: localStorage.getItem('adminSystemNotifications') || "all"
        }
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [notification, setNotification] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');
    
    // États pour les paramètres
    const [settings, setSettings] = useState({
        phone: currentAdmin.phone,
        email: currentAdmin.email,
        department: currentAdmin.department,
        notifications: currentAdmin.notifications.publications,
        systemNotifications: currentAdmin.notifications.system,
        emailNotifications: true,
        pushNotifications: true,
        theme: 'light',
        language: 'fr'
    });

    // Effets
    useEffect(() => {
        loadAdminData();

        // Service Worker (Workbox)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('✅ Service Worker enregistré:', registration);
                    })
                    .catch(error => {
                        console.log('❌ Service Worker error:', error);
                    });
            });
        }

        // Charger les notifications
        checkNotifications();
    }, []);

    const loadAdminData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentAdmin(prev => ({
                    ...prev,
                    ...user,
                    fullName: user.firstName + ' ' + user.lastName || prev.fullName,
                    photo: user.photo || prev.photo,
                    phone: user.phone || prev.phone,
                    email: user.email || prev.email,
                    department: user.department || prev.department
                }));
                
                setSettings(prev => ({
                    ...prev,
                    phone: user.phone || prev.phone,
                    email: user.email || prev.email,
                    department: user.department || prev.department
                }));
            }
        } catch (error) {
            console.error('Erreur chargement utilisateur:', error);
        }
    };

    const checkNotifications = () => {
        // Demander la permission pour les notifications
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showNotification('❌ La photo ne doit pas dépasser 5 Mo', 'error');
                return;
            }

            if (!file.type.startsWith('image/')) {
                showNotification('❌ Veuillez sélectionner une image', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                setCurrentAdmin(prev => ({
                    ...prev,
                    photo: event.target.result
                }));
                
                // Sauvegarder dans localStorage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.photo = event.target.result;
                localStorage.setItem('user', JSON.stringify(user));
                
                showNotification('✅ Photo de profil mise à jour !', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSettingsChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveSettings = async () => {
        setSaving(true);

        try {
            // Mettre à jour l'administrateur
            const updatedAdmin = {
                ...currentAdmin,
                phone: settings.phone,
                email: settings.email,
                department: settings.department,
                notifications: {
                    publications: settings.notifications,
                    system: settings.systemNotifications
                }
            };

            setCurrentAdmin(updatedAdmin);

            // Sauvegarder dans localStorage
            localStorage.setItem('adminPhone', settings.phone);
            localStorage.setItem('adminEmail', settings.email);
            localStorage.setItem('adminDepartment', settings.department);
            localStorage.setItem('adminNotifications', settings.notifications);
            localStorage.setItem('adminSystemNotifications', settings.systemNotifications);

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.phone = settings.phone;
            user.email = settings.email;
            user.department = settings.department;
            localStorage.setItem('user', JSON.stringify(user));

            // Envoyer à l'API
            await api.put('/user/profile', {
                phone: settings.phone,
                email: settings.email,
                department: settings.department,
                notifications: {
                    publications: settings.notifications,
                    system: settings.systemNotifications
                }
            });

            showNotification('✅ Paramètres enregistrés avec succès !', 'success');

            // Retourner au profil après 1 seconde
            setTimeout(() => {
                setActiveTab('profile');
            }, 1000);

        } catch (error) {
            console.error('Erreur sauvegarde paramètres:', error);
            
            if (error.code === 'ECONNABORTED') {
                showNotification('❌ Délai de connexion dépassé', 'error');
            } else if (error.response) {
                showNotification(`❌ ${error.response.data.error || 'Erreur serveur'}`, 'error');
            } else if (error.request) {
                showNotification('❌ Mode hors-ligne : modifications sauvegardées localement', 'warning');
            } else {
                showNotification('❌ Erreur de connexion', 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    const createPublication = () => {
        showNotification('📝 Redirection vers la création de publication...', 'info');
        setTimeout(() => {
            navigate('/faire-publication');
        }, 1000);
    };

    const logout = () => {
        if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
            // Effacer les données locales
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Notification PWA
            if (Notification.permission === 'granted') {
                new Notification('Déconnexion', {
                    body: 'Vous avez été déconnecté',
                    icon: '/icon-192x192.png'
                });
            }
            
            // Rediriger vers la page de connexion
            navigate('/login');
        }
    };

    const showNotification = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const getInitials = () => {
        if (currentAdmin.fullName) {
            return currentAdmin.fullName.split(' ').map(n => n[0]).join('');
        }
        return currentAdmin.firstName?.[0] + currentAdmin.lastName?.[0] || 'AD';
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className={styles.pageContainer}>
            {/* Toast Container pour les notifications */}
            <ToastContainer position="top-end" className={styles.toastContainer}>
                <Toast 
                    show={showToast} 
                    onClose={() => setShowToast(false)}
                    bg={toastType}
                    className={styles.toast}
                >
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Barre de navigation */}
            <Navbar bg="white" expand="lg" className={styles.header} fixed="top">
                <Container>
                    <Navbar.Brand as={Link} to="/" className={styles.brand}>
                        <FaUniversity className={styles.brandIcon} />
                        <div className={styles.brandText}>
                            <span className={styles.brandName}>INFOcAMPUS</span>
                            <span className={styles.brandSub}>CONNECTING UNIVERSITIES</span>
                        </div>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav">
                        <MdMenu />
                    </Navbar.Toggle>
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Link 
                                as={Link} 
                                to="/profil" 
                                className={`${styles.navLink} ${activeTab === 'profile' ? styles.active : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <FaUserCircle /> Profil
                            </Nav.Link>
                            <Nav.Link 
                                as={Link} 
                                to="/publications" 
                                className={styles.navLink}
                            >
                                <FaBell /> Publications
                            </Nav.Link>
                            <Nav.Link 
                                as={Link} 
                                to="/parametres" 
                                className={`${styles.navLink} ${activeTab === 'settings' ? styles.active : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                <FaCog /> Paramètres
                            </Nav.Link>
                        </Nav>

                        <Dropdown align="end">
                            <Dropdown.Toggle as="div" className={styles.userMenu}>
                                <div 
                                    className={styles.userAvatar}
                                    style={currentAdmin.photo ? { backgroundImage: `url(${currentAdmin.photo})` } : {}}
                                >
                                    {!currentAdmin.photo && getInitials()}
                                </div>
                                <div className={styles.userInfo}>
                                    <div className={styles.userName}>{currentAdmin.fullName}</div>
                                    <div className={styles.userRole}>{currentAdmin.role}</div>
                                </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className={styles.userDropdown}>
                                <Dropdown.Item as={Link} to="/profil">
                                    <FaUserCircle /> Mon profil
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/parametres">
                                    <FaCog /> Paramètres
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={logout}>
                                    <FaSignOutAlt /> Déconnexion
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Contenu principal */}
            <Container className={styles.mainContent}>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        {/* Navigation par onglets */}
                        <Card className={styles.tabCard}>
                            <Card.Body>
                                <Tabs
                                    activeKey={activeTab}
                                    onSelect={(k) => setActiveTab(k)}
                                    className={styles.tabs}
                                    fill
                                >
                                    <Tab 
                                        eventKey="profile" 
                                        title={
                                            <span className={styles.tabTitle}>
                                                <FaUserCircle /> Profil
                                            </span>
                                        }
                                    >
                                        {/* Section Profil */}
                                        <div className={styles.profileSection}>
                                            {/* Carte de profil */}
                                            <Card className={styles.profileCard}>
                                                <Card.Body>
                                                    <div className={styles.avatarSection}>
                                                        <div className={styles.avatarWrapper}>
                                                            <div 
                                                                className={styles.avatar}
                                                                style={currentAdmin.photo ? { backgroundImage: `url(${currentAdmin.photo})` } : {}}
                                                            >
                                                                {!currentAdmin.photo && getInitials()}
                                                            </div>
                                                            <OverlayTrigger
                                                                placement="bottom"
                                                                overlay={<Tooltip>Changer la photo</Tooltip>}
                                                            >
                                                                <BoutonProfil
                                                                    action="photo"
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                />
                                                            </OverlayTrigger>
                                                            <input
                                                                type="file"
                                                                ref={fileInputRef}
                                                                onChange={handlePhotoChange}
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                            />
                                                        </div>
                                                        <h2 className={styles.adminName}>{currentAdmin.fullName}</h2>
                                                        <div className={styles.adminTitle}>
                                                            <FaUserTie /> {currentAdmin.title}
                                                        </div>
                                                        <Badge className={styles.universityBadge}>
                                                            <FaUniversity /> {currentAdmin.universite}
                                                        </Badge>
                                                    </div>

                                                    {/* Statistiques administrateur */}
                                                    <div className={styles.statsGrid}>
                                                        <div className={styles.statCard}>
                                                            <FaUsers className={styles.statIcon} />
                                                            <div className={styles.statContent}>
                                                                <span className={styles.statNumber}>
                                                                    {formatNumber(currentAdmin.stats.students)}
                                                                </span>
                                                                <span className={styles.statLabel}>Étudiants</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.statCard}>
                                                            <FaChalkboardTeacher className={styles.statIcon} />
                                                            <div className={styles.statContent}>
                                                                <span className={styles.statNumber}>
                                                                    {currentAdmin.stats.teachers}
                                                                </span>
                                                                <span className={styles.statLabel}>Enseignants</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.statCard}>
                                                            <FaUserCheck className={styles.statIcon} />
                                                            <div className={styles.statContent}>
                                                                <span className={styles.statNumber}>
                                                                    {formatNumber(currentAdmin.stats.activeUsers)}
                                                                </span>
                                                                <span className={styles.statLabel}>Actifs</span>
                                                            </div>
                                                        </div>
                                                        <div className={styles.statCard}>
                                                            <FaBell className={styles.statIcon} />
                                                            <div className={styles.statContent}>
                                                                <span className={styles.statNumber}>
                                                                    {currentAdmin.stats.totalPublications}
                                                                </span>
                                                                <span className={styles.statLabel}>Publications</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Statistiques de modération */}
                                                    <div className={styles.moderationStats}>
                                                        <div className={styles.moderationItem}>
                                                            <FaClock className={styles.moderationIcon} />
                                                            <div className={styles.moderationContent}>
                                                                <span className={styles.moderationLabel}>
                                                                    En attente de modération
                                                                </span>
                                                                <Badge bg="warning" className={styles.moderationBadge}>
                                                                    {currentAdmin.stats.pendingModeration}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className={styles.moderationItem}>
                                                            <FaExclamationTriangle className={styles.moderationIcon} />
                                                            <div className={styles.moderationContent}>
                                                                <span className={styles.moderationLabel}>
                                                                    Signalements
                                                                </span>
                                                                <Badge bg="danger" className={styles.moderationBadge}>
                                                                    {currentAdmin.stats.reports}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Informations professionnelles */}
                                                    <div className={styles.infoSection}>
                                                        <h3 className={styles.sectionTitle}>
                                                            <FaIdCard /> Informations professionnelles
                                                        </h3>
                                                        <div className={styles.infoGrid}>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <MdEmail /> Email
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentAdmin.email}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaPhone /> Téléphone
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentAdmin.phone}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaBuilding /> Département
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentAdmin.department}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaMapMarkerAlt /> Bureau
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentAdmin.bureau}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaCalendarAlt /> Date d'embauche
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentAdmin.hireDate}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaBuilding /> Campus
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentAdmin.campus}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Permissions */}
                                                    <div className={styles.permissionsSection}>
                                                        <h3 className={styles.sectionTitle}>
                                                            <FaShieldAlt /> Permissions
                                                        </h3>
                                                        <div className={styles.permissionsList}>
                                                            {currentAdmin.permissions.map((permission, index) => (
                                                                <Badge key={index} className={styles.permissionBadge}>
                                                                    <FaCheckCircle className={styles.permissionIcon} />
                                                                    {permission}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Actions rapides */}
                                                    <div className={styles.quickActions}>
                                                        <h3 className={styles.sectionTitle}>
                                                            <FaTachometerAlt /> Actions rapides
                                                        </h3>
                                                        <div className={styles.quickActionsGrid}>
                                                            <Button
                                                                variant="outline-primary"
                                                                className={styles.quickAction}
                                                                onClick={() => navigate('/gestion-utilisateurs')}
                                                            >
                                                                <FaUsersCog /> Gérer les utilisateurs
                                                            </Button>
                                                            <Button
                                                                variant="outline-warning"
                                                                className={styles.quickAction}
                                                                onClick={() => navigate('/moderation')}
                                                            >
                                                                <FaShieldAlt /> Modérer les publications
                                                            </Button>
                                                            <Button
                                                                variant="outline-info"
                                                                className={styles.quickAction}
                                                                onClick={() => navigate('/statistiques')}
                                                            >
                                                                <FaChartBar /> Voir les statistiques
                                                            </Button>
                                                            <Button
                                                                variant="outline-success"
                                                                className={styles.quickAction}
                                                                onClick={createPublication}
                                                            >
                                                                <FaBell /> Publier une annonce
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Boutons d'action - Utilisation de BoutonProfil */}
                                                    <div className={styles.actionButtons}>
                                                        <BoutonProfil
                                                            action="publication"
                                                            onClick={createPublication}
                                                        />
                                                        
                                                        <BoutonProfil
                                                            action="modifier"
                                                            onClick={() => setActiveTab('settings')}
                                                        />
                                                        
                                                        <BoutonProfil
                                                            action="deconnexion"
                                                            onClick={logout}
                                                        />
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    </Tab>

                                    <Tab 
                                        eventKey="settings" 
                                        title={
                                            <span className={styles.tabTitle}>
                                                <FaCog /> Paramètres
                                            </span>
                                        }
                                    >
                                        {/* Section Paramètres */}
                                        <div className={styles.settingsSection}>
                                            <Card className={styles.settingsCard}>
                                                <Card.Body>
                                                    <div className={styles.settingsHeader}>
                                                        <Button
                                                            variant="link"
                                                            className={styles.backButton}
                                                            onClick={() => setActiveTab('profile')}
                                                        >
                                                            <FaArrowLeft /> Retour au profil
                                                        </Button>
                                                        <h2 className={styles.settingsTitle}>
                                                            <FaCog /> Paramètres
                                                        </h2>
                                                        <div style={{ width: '100px' }}></div>
                                                    </div>

                                                    <Tabs
                                                        defaultActiveKey="personal"
                                                        className={styles.settingsTabs}
                                                    >
                                                        <Tab 
                                                            eventKey="personal" 
                                                            title={
                                                                <span>
                                                                    <FaUser /> Informations
                                                                </span>
                                                            }
                                                        >
                                                            <div className={styles.settingsForm}>
                                                                <h3 className={styles.sectionSubtitle}>
                                                                    Informations personnelles
                                                                </h3>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaPhone /> Numéro de téléphone
                                                                    </Form.Label>
                                                                    <InputGroup>
                                                                        <InputGroup.Text>
                                                                            <FaPhone />
                                                                        </InputGroup.Text>
                                                                        <Form.Control
                                                                            type="tel"
                                                                            value={settings.phone}
                                                                            onChange={(e) => handleSettingsChange('phone', e.target.value)}
                                                                            placeholder="+237 6XX XXX XXX"
                                                                            className={styles.formInput}
                                                                        />
                                                                    </InputGroup>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <MdEmail /> Email
                                                                    </Form.Label>
                                                                    <InputGroup>
                                                                        <InputGroup.Text>
                                                                            <MdEmail />
                                                                        </InputGroup.Text>
                                                                        <Form.Control
                                                                            type="email"
                                                                            value={settings.email}
                                                                            onChange={(e) => handleSettingsChange('email', e.target.value)}
                                                                            placeholder="admin@iug.cm"
                                                                            className={styles.formInput}
                                                                        />
                                                                    </InputGroup>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaBuilding /> Département
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.department}
                                                                        onChange={(e) => handleSettingsChange('department', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="Administration">Administration</option>
                                                                        <option value="Direction">Direction</option>
                                                                        <option value="Scolarité">Scolarité</option>
                                                                        <option value="Finances">Finances</option>
                                                                        <option value="Ressources Humaines">Ressources Humaines</option>
                                                                        <option value="Communication">Communication</option>
                                                                    </Form.Select>
                                                                </Form.Group>
                                                            </div>
                                                        </Tab>

                                                        <Tab 
                                                            eventKey="notifications" 
                                                            title={
                                                                <span>
                                                                    <FaBell /> Notifications
                                                                </span>
                                                            }
                                                        >
                                                            <div className={styles.settingsForm}>
                                                                <h3 className={styles.sectionSubtitle}>
                                                                    Préférences de notification
                                                                </h3>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        Notifications des publications
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.notifications}
                                                                        onChange={(e) => handleSettingsChange('notifications', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="all">Toutes les publications</option>
                                                                        <option value="important">Publications importantes seulement</option>
                                                                        <option value="none">Aucune notification</option>
                                                                    </Form.Select>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        Notifications système
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.systemNotifications}
                                                                        onChange={(e) => handleSettingsChange('systemNotifications', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="all">Toutes les notifications</option>
                                                                        <option value="errors">Seulement les erreurs</option>
                                                                        <option value="none">Aucune notification</option>
                                                                    </Form.Select>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id="emailNotifications"
                                                                        label="Notifications par email"
                                                                        checked={settings.emailNotifications}
                                                                        onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                                                                        className={styles.switch}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id="pushNotifications"
                                                                        label="Notifications push"
                                                                        checked={settings.pushNotifications}
                                                                        onChange={(e) => handleSettingsChange('pushNotifications', e.target.checked)}
                                                                        className={styles.switch}
                                                                    />
                                                                </Form.Group>
                                                            </div>
                                                        </Tab>

                                                        <Tab 
                                                            eventKey="security" 
                                                            title={
                                                                <span>
                                                                    <FaShieldAlt /> Sécurité
                                                                </span>
                                                            }
                                                        >
                                                            <div className={styles.settingsForm}>
                                                                <h3 className={styles.sectionSubtitle}>
                                                                    Paramètres de sécurité
                                                                </h3>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaLock /> Authentification à deux facteurs
                                                                    </Form.Label>
                                                                    <div className={styles.securityOption}>
                                                                        <Form.Check
                                                                            type="switch"
                                                                            id="twoFactor"
                                                                            label="Activer l'authentification à deux facteurs"
                                                                            className={styles.switch}
                                                                        />
                                                                        <Form.Text className={styles.helpText}>
                                                                            Renforcez la sécurité de votre compte
                                                                        </Form.Text>
                                                                    </div>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaKey /> Sessions actives
                                                                    </Form.Label>
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        className={styles.securityButton}
                                                                    >
                                                                        Déconnecter tous les appareils
                                                                    </Button>
                                                                </Form.Group>
                                                            </div>
                                                        </Tab>

                                                        <Tab 
                                                            eventKey="appearance" 
                                                            title={
                                                                <span>
                                                                    <FaPalette /> Apparence
                                                                </span>
                                                            }
                                                        >
                                                            <div className={styles.settingsForm}>
                                                                <h3 className={styles.sectionSubtitle}>
                                                                    Thème et langue
                                                                </h3>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaPalette /> Thème
                                                                    </Form.Label>
                                                                    <div className={styles.themeOptions}>
                                                                        <Button
                                                                            variant={settings.theme === 'light' ? 'primary' : 'outline-secondary'}
                                                                            className={styles.themeButton}
                                                                            onClick={() => handleSettingsChange('theme', 'light')}
                                                                        >
                                                                            <FaSun /> Clair
                                                                        </Button>
                                                                        <Button
                                                                            variant={settings.theme === 'dark' ? 'primary' : 'outline-secondary'}
                                                                            className={styles.themeButton}
                                                                            onClick={() => handleSettingsChange('theme', 'dark')}
                                                                        >
                                                                            <FaMoon /> Sombre
                                                                        </Button>
                                                                    </div>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaLanguage /> Langue
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.language}
                                                                        onChange={(e) => handleSettingsChange('language', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="fr">Français</option>
                                                                        <option value="en">English</option>
                                                                        <option value="es">Español</option>
                                                                    </Form.Select>
                                                                </Form.Group>
                                                            </div>
                                                        </Tab>
                                                    </Tabs>

                                                    {/* Boutons d'action des paramètres */}
                                                    <div className={styles.settingsActions}>
                                                        <Button
                                                            variant="primary"
                                                            className={styles.saveButton}
                                                            onClick={saveSettings}
                                                            disabled={saving}
                                                        >
                                                            {saving ? (
                                                                <>
                                                                    <Spinner size="sm" className="me-2" />
                                                                    Sauvegarde...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaSave className="me-2" />
                                                                    Enregistrer les modifications
                                                                </>
                                                            )}
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline-secondary"
                                                            className={styles.cancelButton}
                                                            onClick={() => {
                                                                setActiveTab('profile');
                                                            }}
                                                        >
                                                            <FaUndo className="me-2" />
                                                            Annuler
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfilAdministration;