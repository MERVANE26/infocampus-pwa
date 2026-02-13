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
    FaFileAlt as FaFileAltIcon
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdSchool, MdWarning, MdClose, MdMenu, MdPhotoCamera, MdPhotoLibrary, MdDelete, MdEdit, MdSave, MdCancel, MdArrowBack, MdArrowForward, MdHome, MdPerson, MdSettings, MdNotifications, MdLogout, MdDashboard, MdAssignment, MdClass, MdEvent, MdAnnouncement, MdForum, MdGroup, MdWork, MdLocationOn, MdDateRange, MdAccessTime, MdAttachFile, MdInsertPhoto, MdPictureAsPdf, MdDescription, MdInsertDriveFile, MdCloudUpload, MdCloudDone, MdCloudOff } from 'react-icons/md';
import { BsPersonBadge, BsPersonVcard, BsThreeDotsVertical, BsGenderMale, BsGenderFemale, BsGenderTrans, BsHeart, BsHeartFill, BsStar, BsStarFill, BsStarHalf, BsAward, BsTrophy, BsBookmark, BsBookmarkFill, BsBookmarkStar, BsBookmarkStarFill, BsBell, BsBellFill, BsBellSlash, BsBellSlashFill, BsGear, BsGearFill, BsPalette, BsPaletteFill, BsMoon, BsMoonFill, BsSun, BsSunFill, BsTranslate, BsGlobe, BsGlobe2 } from 'react-icons/bs';
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
import styles from './ProfilEtudiant.module.css';

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

const ProfilEtudiant = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // États
    const [currentUser, setCurrentUser] = useState({
        id: "ETU001",
        fullName: "LaurenDa M.",
        firstName: "LaurenDa",
        lastName: "M.",
        email: "laurenda.m@universite.cm",
        phone: "+237 6XX XXX XXX",
        photo: "https://i.pravatar.cc/150?img=32",
        role: "Étudiante",
        campus: localStorage.getItem('userCampus') || "Campus 2",
        filiere: localStorage.getItem('userFiliere') || "Génie Logiciel",
        groupe: localStorage.getItem('userGroupe') || "Cours du Soir",
        niveau: localStorage.getItem('userNiveau') || "1ère Année",
        matricule: "GL2024001",
        dateNaissance: "2002-05-15",
        lieuNaissance: "Douala",
        genre: "Féminin",
        adresse: "123 Rue de l'Université, Douala",
        telephone: "+237 699 123 456",
        emailAlternatif: "laurenda.m@gmail.com",
        universite: "Institut Universitaire du Golfe",
        departement: "Informatique",
        anneeAcademique: "2024-2025",
        moyenne: 15.5,
        credits: 45,
        totalCredits: 60,
        status: "Actif",
        dateInscription: "2024-09-01"
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
        campus: currentUser.campus,
        filiere: currentUser.filiere,
        groupe: currentUser.groupe,
        niveau: currentUser.niveau,
        emailNotifications: true,
        pushNotifications: true,
        theme: 'light',
        language: 'fr'
    });

    // États pour les statistiques
    const [stats, setStats] = useState({
        publications: 15,
        commentaires: 28,
        likes: 42,
        notifications: 3,
        messages: 5,
        cours: 8,
        examens: 4,
        travaux: 12
    });

    // Effets
    useEffect(() => {
        loadUserData();

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

    const loadUserData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentUser(prev => ({
                    ...prev,
                    ...user,
                    fullName: user.firstName + ' ' + user.lastName || prev.fullName,
                    photo: user.photo || prev.photo
                }));
                
                setSettings(prev => ({
                    ...prev,
                    campus: user.campus || prev.campus,
                    filiere: user.filiere || prev.filiere,
                    groupe: user.groupe || prev.groupe,
                    niveau: user.niveau || prev.niveau
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
                setCurrentUser(prev => ({
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
            // Mettre à jour l'utilisateur
            const updatedUser = {
                ...currentUser,
                campus: settings.campus,
                filiere: settings.filiere,
                groupe: settings.groupe,
                niveau: settings.niveau
            };

            setCurrentUser(updatedUser);

            // Sauvegarder dans localStorage
            localStorage.setItem('userCampus', settings.campus);
            localStorage.setItem('userFiliere', settings.filiere);
            localStorage.setItem('userGroupe', settings.groupe);
            localStorage.setItem('userNiveau', settings.niveau);

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.campus = settings.campus;
            user.filiere = settings.filiere;
            user.groupe = settings.groupe;
            user.niveau = settings.niveau;
            localStorage.setItem('user', JSON.stringify(user));

            // Envoyer à l'API
            await api.put('/user/profile', {
                campus: settings.campus,
                filiere: settings.filiere,
                groupe: settings.groupe,
                niveau: settings.niveau
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
        return currentUser.firstName?.[0] + currentUser.lastName?.[0] || currentUser.fullName.split(' ').map(n => n[0]).join('');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const getProgressPercentage = () => {
        return (currentUser.credits / currentUser.totalCredits) * 100;
    };

    const getRoleIcon = () => {
        switch(currentUser.role) {
            case 'Administration':
                return <FaUserTieIcon />;
            case 'Enseignant':
                return <FaChalkboardTeacherIcon />;
            default:
                return <FaUserGraduateIcon />;
        }
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
                                    style={currentUser.photo ? { backgroundImage: `url(${currentUser.photo})` } : {}}
                                >
                                    {!currentUser.photo && getInitials()}
                                </div>
                                <div className={styles.userInfo}>
                                    <div className={styles.userName}>{currentUser.fullName}</div>
                                    <div className={styles.userRole}>{currentUser.role}</div>
                                </div>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className={styles.userDropdown}>
                                <Dropdown.Item as={Link} to="/profil">
                                    <FaUserCircle /> Mon profil
                                </Dropdown.Item>
                                <Dropdown.Item as={Link} to="/parametres">
                                    <FaCog /> Paramètres
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setActiveTab('settings')}>
                                    <FaBell /> Notifications
                                    {stats.notifications > 0 && (
                                        <Badge bg="danger" className={styles.notificationBadge}>
                                            {stats.notifications}
                                        </Badge>
                                    )}
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
                                                                style={currentUser.photo ? { backgroundImage: `url(${currentUser.photo})` } : {}}
                                                            >
                                                                {!currentUser.photo && getInitials()}
                                                            </div>
                                                            <OverlayTrigger
                                                                placement="bottom"
                                                                overlay={<Tooltip>Changer la photo</Tooltip>}
                                                            >
                                                                <Button
                                                                    variant="link"
                                                                    className={styles.cameraButton}
                                                                    onClick={() => fileInputRef.current?.click()}
                                                                >
                                                                    <FaCamera />
                                                                </Button>
                                                            </OverlayTrigger>
                                                            <input
                                                                type="file"
                                                                ref={fileInputRef}
                                                                onChange={handlePhotoChange}
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                            />
                                                        </div>
                                                        <h2 className={styles.studentName}>{currentUser.fullName}</h2>
                                                        <div className={styles.studentProgram}>
                                                            <FaGraduationCap /> {currentUser.filiere}
                                                        </div>
                                                        <Badge className={styles.universityBadge}>
                                                            <FaUniversity /> {currentUser.universite}
                                                        </Badge>
                                                    </div>

                                                    {/* Informations académiques */}
                                                    <div className={styles.infoGrid}>
                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaIdCard /> Matricule
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.matricule}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaBuilding /> Campus
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.campus}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaBook /> Filière
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.filiere}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaUsers /> Groupe
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.groupe}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaGraduationCap /> Niveau
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.niveau}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaCalendarAlt /> Année académique
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.anneeAcademique}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaUserCheck /> Statut
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                <Badge bg="success" className={styles.statusBadge}>
                                                                    {currentUser.status}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaCalendarAlt /> Inscription
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {formatDate(currentUser.dateInscription)}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Progression académique */}
                                                    <div className={styles.progressSection}>
                                                        <h3 className={styles.sectionTitle}>
                                                            <FaGraduationCap /> Progression académique
                                                        </h3>
                                                        <div className={styles.progressInfo}>
                                                            <div className={styles.progressLabel}>
                                                                <span>Crédits obtenus</span>
                                                                <span>{currentUser.credits}/{currentUser.totalCredits}</span>
                                                            </div>
                                                            <ProgressBar 
                                                                now={getProgressPercentage()}
                                                                variant="success"
                                                                className={styles.progressBar}
                                                            />
                                                        </div>
                                                        <div className={styles.statsGrid}>
                                                            <div className={styles.statCard}>
                                                                <div className={styles.statIcon}>
                                                                    <FaBook />
                                                                </div>
                                                                <div className={styles.statContent}>
                                                                    <div className={styles.statValue}>{stats.cours}</div>
                                                                    <div className={styles.statLabel}>Cours</div>
                                                                </div>
                                                            </div>
                                                            <div className={styles.statCard}>
                                                                <div className={styles.statIcon}>
                                                                    <FaCalendarAlt />
                                                                </div>
                                                                <div className={styles.statContent}>
                                                                    <div className={styles.statValue}>{stats.examens}</div>
                                                                    <div className={styles.statLabel}>Examens</div>
                                                                </div>
                                                            </div>
                                                            <div className={styles.statCard}>
                                                                <div className={styles.statIcon}>
                                                                    <FaFileAlt />
                                                                </div>
                                                                <div className={styles.statContent}>
                                                                    <div className={styles.statValue}>{stats.travaux}</div>
                                                                    <div className={styles.statLabel}>Travaux</div>
                                                                </div>
                                                            </div>
                                                            <div className={styles.statCard}>
                                                                <div className={styles.statIcon}>
                                                                    <FaStar />
                                                                </div>
                                                                <div className={styles.statContent}>
                                                                    <div className={styles.statValue}>{currentUser.moyenne}</div>
                                                                    <div className={styles.statLabel}>Moyenne</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Informations personnelles */}
                                                    <div className={styles.personalInfo}>
                                                        <h3 className={styles.sectionTitle}>
                                                            <FaUser /> Informations personnelles
                                                        </h3>
                                                        <div className={styles.infoGrid}>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaBirthdayCake /> Date de naissance
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {formatDate(currentUser.dateNaissance)}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaMapPin /> Lieu de naissance
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentUser.lieuNaissance}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaVenusMars /> Genre
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentUser.genre}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaMapMarkedAlt /> Adresse
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentUser.adresse}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Contacts */}
                                                    <div className={styles.contactInfo}>
                                                        <h3 className={styles.sectionTitle}>
                                                            <FaEnvelope /> Contacts
                                                        </h3>
                                                        <div className={styles.infoGrid}>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <MdEmail /> Email universitaire
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentUser.email}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaEnvelopeOpen /> Email alternatif
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentUser.emailAlternatif}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaPhone /> Téléphone
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentUser.telephone}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Boutons d'action */}
                                                    <div className={styles.actionButtons}>
                                                        <Button
                                                            variant="primary"
                                                            className={styles.primaryButton}
                                                            onClick={() => navigate('/publications')}
                                                        >
                                                            <FaBell /> Voir les publications
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline-secondary"
                                                            className={styles.secondaryButton}
                                                            onClick={() => setActiveTab('settings')}
                                                        >
                                                            <FaEdit /> Modifier mes informations
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline-danger"
                                                            className={styles.secondaryButton}
                                                            onClick={logout}
                                                        >
                                                            <FaSignOutAlt /> Déconnexion
                                                        </Button>
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
                                                        defaultActiveKey="academic"
                                                        className={styles.settingsTabs}
                                                    >
                                                        <Tab 
                                                            eventKey="academic" 
                                                            title={
                                                                <span>
                                                                    <FaGraduationCap /> Académique
                                                                </span>
                                                            }
                                                        >
                                                            <div className={styles.settingsForm}>
                                                                <h3 className={styles.sectionSubtitle}>
                                                                    Informations académiques
                                                                </h3>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaBuilding /> Campus
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.campus}
                                                                        onChange={(e) => handleSettingsChange('campus', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="Campus 1">Campus 1</option>
                                                                        <option value="Campus 2">Campus 2</option>
                                                                        <option value="Campus 3">Campus 3</option>
                                                                        <option value="Campus 4">Campus 4</option>
                                                                        <option value="Campus 5">Campus 5</option>
                                                                    </Form.Select>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaBook /> Filière
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.filiere}
                                                                        onChange={(e) => handleSettingsChange('filiere', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="Génie Logiciel">Génie Logiciel</option>
                                                                        <option value="Réseaux et Télécoms">Réseaux et Télécoms</option>
                                                                        <option value="Informatique Industrielle">Informatique Industrielle</option>
                                                                        <option value="Data Science">Data Science</option>
                                                                        <option value="Cybersécurité">Cybersécurité</option>
                                                                        <option value="Marketing Digital">Marketing Digital</option>
                                                                        <option value="Gestion d'Entreprise">Gestion d'Entreprise</option>
                                                                        <option value="Finance">Finance</option>
                                                                    </Form.Select>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaUsers /> Groupe
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.groupe}
                                                                        onChange={(e) => handleSettingsChange('groupe', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="Cours du Jour">Cours du Jour</option>
                                                                        <option value="Cours du Soir">Cours du Soir</option>
                                                                        <option value="Weekend">Weekend</option>
                                                                        <option value="En ligne">En ligne</option>
                                                                    </Form.Select>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaGraduationCap /> Niveau
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.niveau}
                                                                        onChange={(e) => handleSettingsChange('niveau', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="1ère Année">1ère Année</option>
                                                                        <option value="2ème Année">2ème Année</option>
                                                                        <option value="3ème Année">3ème Année</option>
                                                                        <option value="4ème Année">4ème Année</option>
                                                                        <option value="5ème Année">5ème Année</option>
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
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id="emailNotifications"
                                                                        label="Notifications par email"
                                                                        checked={settings.emailNotifications}
                                                                        onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                                                                        className={styles.switch}
                                                                    />
                                                                    <Form.Text className={styles.helpText}>
                                                                        Recevoir les notifications importantes par email
                                                                    </Form.Text>
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
                                                                    <Form.Text className={styles.helpText}>
                                                                        Recevoir les notifications dans votre navigateur
                                                                    </Form.Text>
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
                                                            onClick={() => setActiveTab('profile')}
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

export default ProfilEtudiant;