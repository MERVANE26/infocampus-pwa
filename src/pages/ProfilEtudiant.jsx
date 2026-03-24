import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    FaUniversity,
    FaBell,
    FaExclamationTriangle,
    FaCheckCircle,
    FaArrowLeft,
    FaUsers,
    FaBuilding,
    FaTimes,
    FaUserCircle,
    FaUser,
    FaCog,
    FaEnvelope,
    FaPhone,
    FaSave,
    FaUndo,
    FaGraduationCap,
    FaBook,
    FaIdCard,
    FaUserCheck,
    FaMoon,
    FaSun,
    FaLanguage,
    FaPalette
} from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
import AppNavbar from '../composants/AppNavbar';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styles from './ProfilEtudiant.module.css';
import { formatUserField } from '../utils/formatUserInfo';

// Import de nos composants de boutons personnalisés
import BoutonProfil from '../composants/Boutons/BoutonProfil';

import { api } from '../lib/api';



const ProfilEtudiant = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const formatFieldValue = (field, value) => {
        const formatted = formatUserField(field, value, t);
        return formatted || t('common.unknown');
    };

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

    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
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
        language: i18n.language || 'fr'
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
            const res = await api.get("/auth/profile");

            if (res.data && res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setCurrentUser(prev => ({
                    ...prev,
                    ...res.data.user,
                    studentInfo: res.data.user.studentInfo || prev.studentInfo,
                    photoUrl: res.data.user.photoUrl || res.data.user.photo || prev.photoUrl
                }));

                setSettings(prev => ({
                    ...prev,
                    matricule: res.data.user.studentInfo?.matricule || prev.matricule || "",
                    filiere: res.data.user.studentInfo?.filiere?.name || prev.filiere || "",
                    groupe: res.data.user.studentInfo?.groupe || prev.groupe || "",
                    niveau: res.data.user.studentInfo?.niveau || prev.niveau || ""
                }));
            }

        } catch (error) {
            console.error('Erreur chargement utilisateur:', error);
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
        }
    };

    const checkNotifications = () => {
        // Demander la permission pour les notifications
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    useEffect(() => {
        if (!settings.language) return;
        i18n.changeLanguage(settings.language);
    }, [settings.language, i18n]);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        try {
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    showNotification(t('profile.photoTooLarge'), 'error');
                    return;
                }

                if (!file.type.startsWith('image/')) {
                    showNotification(t('profile.photoInvalidFormat'), 'error');
                    return;
                }

                const formData = new FormData();
                formData.append('profilePic', file);
                const response = await api.put('/auth/update-profile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (response.data && response.data.user) {
                    setCurrentUser(prev => ({
                        ...prev,
                        photoUrl: response.data.user.photoUrl,
                        studentInfo: {
                            ...prev.studentInfo,
                            matricule: response.data.user.studentInfo?.matricule || prev.studentInfo.matricule,
                        }
                    }));
                    // Mettre à jour localStorage avec la nouvelle URL de la photo
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    user.photoUrl = response.data.user.photoUrl;
                    user.studentInfo = {
                        ...user.studentInfo,
                        matricule: response.data.user.studentInfo?.matricule || user.studentInfo?.matricule
                    };
                    localStorage.setItem('user', JSON.stringify(user));
                } else {
                    showNotification(t('profile.photoUpdateError'), 'error');
                }

            }
        } catch (error) {
            showNotification('❌ Erreur lors de la mise à jour de la photo', 'error');
            console.error('Erreur mise à jour photo:', error);
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

            showNotification(t('profile.updateSuccess'), 'success');

            // Retourner au profil après 1 seconde
            setTimeout(() => {
                setActiveTab('profile');
            }, 1000);

        } catch (error) {
            console.error('Erreur sauvegarde paramètres:', error);

            if (error.code === 'ECONNABORTED') {
                showNotification(t('profile.sessionExpired'), 'error');
            } else if (error.response) {
                showNotification(`${t('common.error')}: ${error.response?.data?.error || t('errors.serverError')}`, 'error');
            } else if (error.request) {
                showNotification(t('profile.offlineSaved'), 'warning');
            } else {
                showNotification(t('errors.networkError'), 'error');
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
                                                            <FaGraduationCap /> {formatFieldValue('filiere', currentUser.studentInfo?.filiere?.name)}
                                                        </div>
                                                        <Badge className={styles.universityBadge}>
                                                            <FaUniversity /> {formatFieldValue('campusId', currentUser.studentInfo?.campusId?.name)}
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
                                                                <FaBuilding /> {t('auth.campus')}
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {formatFieldValue('campusId', currentUser.studentInfo?.campusId?.name)}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaBook /> {t('auth.filiere')}
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {formatFieldValue('filiere', currentUser.studentInfo?.filiere?.name)}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaUsers /> {t('auth.group')}
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {formatFieldValue('groupe', currentUser.studentInfo?.groupe)}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaGraduationCap /> {t('auth.niveau')}
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {formatFieldValue('niveau', currentUser.studentInfo?.niveau)}
                                                            </div>
                                                        </div>

                                                        <div className={styles.infoItem}>
                                                            <div className={styles.infoLabel}>
                                                                <FaUserCheck /> {t('profile.verificationStatus')}
                                                            </div>
                                                            <div className={styles.infoValue}>
                                                                {currentUser.verificationStatus === 'verified' ? (
                                                                    <Badge bg="success">
                                                                        <FaCheckCircle /> {t('profile.verificationStatusValues.verified')}
                                                                    </Badge>
                                                                ) : currentUser.verificationStatus === 'pending' ? (
                                                                    <Badge bg="warning">
                                                                        <FaExclamationTriangle /> {t('profile.verificationStatusValues.pending')}
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge bg="danger">
                                                                        <FaTimes /> {t('profile.verificationStatusValues.rejected')}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>


                                                    {/* Informations personnelles */}
                                                    <div className={styles.personalInfo}>
                                                        <h3 className={styles.sectionTitle}>
                                                            <FaUser /> {t('profile.personalInfo')}
                                                        </h3>
                                                        <div className={styles.infoGrid}>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaEnvelope /> {t('profile.email')}
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentUser.email}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaPhone /> {t('profile.phone')}
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentUser.phoneNumber || t('common.unknown')}
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
                                                <FaCog /> {t('profile.settings')}
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
                                                            <FaArrowLeft /> {t('profile.backToProfile')}
                                                        </Button>
                                                        <h2 className={styles.settingsTitle}>
                                                            <FaCog /> {t('profile.settings')}
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
                                                                    <FaGraduationCap /> {t('profile.academicInfo')}
                                                                </span>
                                                            }
                                                        >
                                                            <div className={styles.settingsForm}>
                                                                <h3 className={styles.sectionSubtitle}>
                                                                    {t('profile.academicInfo')}
                                                                </h3>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaIdCard /> {t('profile.matricule')}
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={settings.matricule}
                                                                        onChange={(e) => handleSettingsChange('matricule', e.target.value)}
                                                                        className={styles.formControl}
                                                                        placeholder={t('profile.placeholderMatricule')}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaBook /> {t('auth.filiere')}
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={settings.filiere}
                                                                        onChange={(e) => handleSettingsChange('filiere', e.target.value)}
                                                                        className={styles.formControl}
                                                                        placeholder={t('profile.placeholderFiliere')}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaUsers /> {t('auth.group')}
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={settings.groupe}
                                                                        onChange={(e) => handleSettingsChange('groupe', e.target.value)}
                                                                        className={styles.formControl}
                                                                        placeholder={t('profile.placeholderGroup')}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaGraduationCap /> {t('auth.niveau')}
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        value={settings.niveau}
                                                                        onChange={(e) => handleSettingsChange('niveau', e.target.value)}
                                                                        className={styles.formControl}
                                                                        placeholder={t('profile.placeholderLevel')}
                                                                    />
                                                                </Form.Group>
                                                            </div>
                                                        </Tab>

                                                        <Tab
                                                            eventKey="notifications"
                                                            title={
                                                                <span>
                                                                    <FaBell /> {t('profile.notifications')}
                                                                </span>
                                                            }
                                                        >
                                                            <div className={styles.settingsForm}>
                                                                <h3 className={styles.sectionSubtitle}>
                                                                    {t('profile.notificationPreferences')}
                                                                </h3>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id="emailNotifications"
                                                                        label={t('profile.emailNotifications')}
                                                                        checked={settings.emailNotifications}
                                                                        onChange={(e) => handleSettingsChange('emailNotifications', e.target.checked)}
                                                                        className={styles.switch}
                                                                    />
                                                                    <Form.Text className={styles.helpText}>
                                                                        {t('profile.notificationEmailHint')}
                                                                    </Form.Text>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id="pushNotifications"
                                                                        label={t('profile.pushNotifications')}
                                                                        checked={settings.pushNotifications}
                                                                        onChange={(e) => handleSettingsChange('pushNotifications', e.target.checked)}
                                                                        className={styles.switch}
                                                                    />
                                                                    <Form.Text className={styles.helpText}>
                                                                        {t('profile.notificationPushHint')}
                                                                    </Form.Text>
                                                                </Form.Group>
                                                            </div>
                                                        </Tab>

                                                        <Tab
                                                            eventKey="appearance"
                                                            title={
                                                                <span>
                                                                    <FaPalette /> {t('profile.appearance')}
                                                                </span>
                                                            }
                                                        >
                                                            <div className={styles.settingsForm}>
                                                                <h3 className={styles.sectionSubtitle}>
                                                                    {t('profile.themeAndLanguage')}
                                                                </h3>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaPalette /> {t('profile.theme')}
                                                                    </Form.Label>
                                                                    <div className={styles.themeOptions}>
                                                                        <Button
                                                                            variant={settings.theme === 'light' ? 'primary' : 'outline-secondary'}
                                                                            className={styles.themeButton}
                                                                            onClick={() => handleSettingsChange('theme', 'light')}
                                                                        >
                                                                            <FaSun /> {t('profile.themeLight')}
                                                                        </Button>
                                                                        <Button
                                                                            variant={settings.theme === 'dark' ? 'primary' : 'outline-secondary'}
                                                                            className={styles.themeButton}
                                                                            onClick={() => handleSettingsChange('theme', 'dark')}
                                                                        >
                                                                            <FaMoon /> {t('profile.themeDark')}
                                                                        </Button>
                                                                    </div>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        <FaLanguage /> {t('profile.language')}
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.language}
                                                                        onChange={(e) => handleSettingsChange('language', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="fr">{t('profile.languageFrench')}</option>
                                                                        <option value="en">{t('profile.languageEnglish')}</option>
                                                                        <option value="es">{t('profile.languageSpanish')}</option>
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
                                                                    {t('profile.saving')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaSave className="me-2" />
                                                                    {t('profile.saveChanges')}
                                                                </>
                                                            )}
                                                        </Button>

                                                        <Button
                                                            variant="outline-secondary"
                                                            className={styles.cancelButton}
                                                            onClick={() => setActiveTab('profile')}
                                                        >
                                                            <FaUndo className="me-2" />
                                                            {t('common.cancel')}
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