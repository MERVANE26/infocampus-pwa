import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    FaUniversity,
    FaChalkboardTeacher,
    FaUserTie,
    FaStar,
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
import Modal from 'react-bootstrap/Modal';
import AppNavbar from '../composants/AppNavbar';
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

// Import de nos composants de boutons personnalisés
import { 
    BoutonProfil,
    BoutonFermer,
    BoutonAction
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

const ProfilEtudiant = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // États
    const [currentUser, setCurrentUser] = useState({
        _id: "",
        firstName: "Étudiant",
        lastName: "Utilisateur",
        email: "student@university.cm",
        phoneNumber: "",
        photoUrl: "",
        roles: ["student"],
        status: "student",
        verificationStatus: "pending",
        studentUniversityId: "",
        studentInfo: {
            matricule: "",
            campusId: "",
            filiere: "",
            niveau: "",
            groupe: ""
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
        matricule: currentUser.studentInfo?.matricule || "",
        filiere: currentUser.studentInfo?.filiere || "",
        groupe: currentUser.studentInfo?.groupe || "",
        niveau: currentUser.studentInfo?.niveau || "",
        emailNotifications: true,
        pushNotifications: true,
        theme: 'light',
        language: 'fr'
    });

    // États pour les statistiques
    const [stats, setStats] = useState({
        publications: 0,
        commentaires: 0,
        likes: 0,
        notifications: 0,
        messages: 0,
        cours: 0,
        examens: 0,
        travaux: 0
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
                    studentInfo: user.studentInfo || prev.studentInfo,
                    photoUrl: user.photoUrl || user.photo || prev.photoUrl
                }));
                
                setSettings(prev => ({
                    ...prev,
                    matricule: user.studentInfo?.matricule || prev.matricule || "",
                    filiere: user.studentInfo?.filiere || prev.filiere || "",
                    groupe: user.studentInfo?.groupe || prev.groupe || "",
                    niveau: user.studentInfo?.niveau || prev.niveau || ""
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
                    photoUrl: event.target.result
                }));
                
                // Sauvegarder dans localStorage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.photoUrl = event.target.result;
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
                studentInfo: {
                    ...currentUser.studentInfo,
                    matricule: settings.matricule,
                    filiere: settings.filiere,
                    groupe: settings.groupe,
                    niveau: settings.niveau
                }
            };

            setCurrentUser(updatedUser);

            // Sauvegarder dans localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.studentInfo = {
                ...user.studentInfo,
                matricule: settings.matricule,
                filiere: settings.filiere,
                groupe: settings.groupe,
                niveau: settings.niveau
            };
            localStorage.setItem('user', JSON.stringify(user));

            // Envoyer à l'API
            await api.put('/user/profile', {
                studentInfo: {
                    matricule: settings.matricule,
                    filiere: settings.filiere,
                    groupe: settings.groupe,
                    niveau: settings.niveau
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
        return currentUser.firstName?.[0] + currentUser.lastName?.[0] || 'ET';
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
                    <Toast.Body className={styles.toastText}>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Barre de navigation */}
            <AppNavbar currentUser={currentUser} />

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
                                                                style={currentUser.photoUrl ? { backgroundImage: `url(${currentUser.photoUrl})` } : {}}
                                                            >
                                                                {!currentUser.photoUrl && getInitials()}
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
                                                        <h2 className={styles.studentName}>{currentUser.firstName} {currentUser.lastName}</h2>
                                                        <div className={styles.studentProgram}>
                                                            <FaGraduationCap /> {currentUser.studentInfo?.filiere || 'Filière non définie'}
                                                        </div>
                                                        <Badge className={styles.universityBadge}>
                                                            <FaUniversity /> {currentUser.studentInfo?.campusId || 'Campus non défini'}
                                                        </Badge>
                                                    </div>

                                                    {/* Informations académiques */}
                                                    <div className={styles.infoGrid}>
                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaIdCard /> Matricule
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.studentInfo?.matricule || 'Non défini'}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaBuilding /> Campus ID
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.studentInfo?.campusId || 'Non défini'}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaBook /> Filière
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.studentInfo?.filiere || 'Non définie'}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaUsers /> Groupe
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.studentInfo?.groupe || 'Non défini'}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaGraduationCap /> Niveau
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.studentInfo?.niveau || 'Non défini'}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaUserCheck /> Statut de vérification
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.verificationStatus === 'verified' ? (
                                                                    <Badge bg="success">
                                                                        <FaCheckCircle /> Vérifié
                                                                    </Badge>
                                                                ) : currentUser.verificationStatus === 'pending' ? (
                                                                    <Badge bg="warning">
                                                                        <FaExclamationTriangle /> En attente
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge bg="danger">
                                                                        <FaTimes /> Rejeté
                                                                    </Badge>
                                                                )}
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
                                                                    <FaEnvelope /> Email universitaire
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentUser.email}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaPhone /> Téléphone
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentUser.phoneNumber || 'Non défini'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Boutons d'action - Utilisation de BoutonProfil */}
                                                    <div className={styles.actionButtons}>
                                                        
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
                                                                        <FaIdCard /> Matricule
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={settings.matricule}
                                                                        onChange={(e) => handleSettingsChange('matricule', e.target.value)}
                                                                        className={styles.formControl}
                                                                        placeholder="Exemple: GL2024001"
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaBook /> Filière
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={settings.filiere}
                                                                        onChange={(e) => handleSettingsChange('filiere', e.target.value)}
                                                                        className={styles.formControl}
                                                                        placeholder="Exemple: Génie Logiciel"
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaUsers /> Groupe
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={settings.groupe}
                                                                        onChange={(e) => handleSettingsChange('groupe', e.target.value)}
                                                                        className={styles.formControl}
                                                                        placeholder="Exemple: Cours du Soir"
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaGraduationCap /> Niveau
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={settings.niveau}
                                                                        onChange={(e) => handleSettingsChange('niveau', e.target.value)}
                                                                        className={styles.formControl}
                                                                        placeholder="Exemple: 1ère Année"
                                                                    />
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