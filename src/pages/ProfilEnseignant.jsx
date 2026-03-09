
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaUniversity,
    FaChalkboardTeacher,
    FaBell,
    FaCheckCircle,
    FaArrowLeft,
    FaBuilding,
    FaClock,
    FaUserCircle,
    FaUser,
    FaCog,
    FaPhone,
    FaMapMarkerAlt,
    FaSave,
    FaUndo,
    FaGraduationCap,
    FaBook,
    FaIdCard,
    FaMoon,
    FaSun,
    FaLanguage,
    FaPalette} from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
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
import InputGroup from 'react-bootstrap/InputGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import styles from './ProfilEnseignant.module.css';
import { useTranslation } from 'react-i18next';

// Import de nos composants de boutons personnalisés
import { 
    BoutonProfil,
    BoutonMatiere} from '../composants/Index';
import { api } from '../lib/api';


const ProfilEnseignant = ({universities}) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    
    // États
    const [currentTeacher, setCurrentTeacher] = useState({
        _id: "",
        firstName: "Enseignant",
        lastName: "Utilisateur",
        email: "teacher@university.cm",
        phoneNumber: "",
        photoUrl: "",
        roles: ["teacher"],
        status: "teacher",
        verificationStatus: "pending",
        teacherUniversityIds: [],
        teacherInfo: {
            matricule: "",
            subjects: [],
            status: "permanent",
            notificationMode: "targeted"
        }
    });

    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');
    const [newSubject, setNewSubject] = useState('');
    const [ setEditingSubjects] = useState(false);
    
    // États pour les paramètres
    const [settings, setSettings] = useState({
        phoneNumber: currentTeacher.phoneNumber || "",
        notificationMode: currentTeacher.teacherInfo?.notificationMode || "targeted",
        status: currentTeacher.teacherInfo?.status || "permanent",
        emailNotifications: true,
        pushNotifications: true,
        theme: 'light',
        language: i18n.language || 'fr'
    });

    // Effets
    useEffect(() => {
        loadTeacherData();

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

    const loadTeacherData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentTeacher(prev => ({
                    ...prev,
                    ...user,
                    teacherInfo: user.teacherInfo || prev.teacherInfo,
                    photoUrl: user.photoUrl || user.photo || prev.photoUrl
                }));
                
                setSettings(prev => ({
                    ...prev,
                    phoneNumber: user.phoneNumber || prev.phoneNumber || "",
                    notificationMode: user.teacherInfo?.notificationMode || prev.notificationMode || "targeted",
                    status: user.teacherInfo?.status || prev.status || "permanent"
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

    useEffect(() => {
        if (!settings.language) return;
        i18n.changeLanguage(settings.language);
    }, [settings.language, i18n]);

    const handlePhotoChange = async(e) => {
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
                     setCurrentTeacher(prev => ({
                         ...prev,
                         photoUrl: response.data.user.photoUrl,
                         teacherInfo: {
                             ...prev.teacherInfo,
                             matricule: response.data.user.teacherInfo?.matricule || prev.teacherInfo.matricule,
                         }
                     }));
                     // Mettre à jour localStorage avec la nouvelle URL de la photo
                     const user = JSON.parse(localStorage.getItem('user') || '{}');
                     user.photoUrl = response.data.user.photoUrl;
                     user.teacherInfo = {
                         ...user.teacherInfo,
                         matricule: response.data.user.teacherInfo?.matricule || user.teacherInfo?.matricule
                     };
                     localStorage.setItem('user', JSON.stringify(user));
                 } else {
                     showNotification(t('profile.photoUpdateError'), 'error');
                 }
 
             }
         } catch (error) {
             showNotification(t('profile.photoUpdateError'), 'error');
             console.error('Erreur mise à jour photo:', error);
         }
     
    };

    const handleAddSubject = () => {
        if (!newSubject.trim()) {
            showNotification(t('profile.subjectRequired'), 'error');
            return;
        }

        if (currentTeacher.teacherInfo?.subjects?.includes(newSubject.trim())) {
            showNotification(t('profile.subjectAlreadyExists'), 'error');
            return;
        }

        setCurrentTeacher(prev => ({
            ...prev,
            teacherInfo: {
                ...prev.teacherInfo,
                subjects: [...(prev.teacherInfo?.subjects || []), newSubject.trim()]
            }
        }));

        setNewSubject('');
        showNotification(t('profile.subjectAdded'), 'success');
    };

    const handleRemoveSubject = (subjectToRemove) => {
        if (window.confirm(`Supprimer la matière "${subjectToRemove}" ?`)) {
            setCurrentTeacher(prev => ({
                ...prev,
                teacherInfo: {
                    ...prev.teacherInfo,
                    subjects: (prev.teacherInfo?.subjects || []).filter(s => s !== subjectToRemove)
                }
            }));
            showNotification(t('profile.subjectRemoved'), 'info');
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
            // Mettre à jour l'enseignant
            const updatedTeacher = {
                ...currentTeacher,
                phoneNumber: settings.phoneNumber,
                teacherInfo: {
                    ...currentTeacher.teacherInfo,
                    status: settings.status,
                    notificationMode: settings.notificationMode
                }
            };

            setCurrentTeacher(updatedTeacher);

            // Sauvegarder dans localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.phoneNumber = settings.phoneNumber;
            user.teacherInfo = {
                ...user.teacherInfo,
                status: settings.status,
                notificationMode: settings.notificationMode,
                subjects: currentTeacher.teacherInfo?.subjects || []
            };
            localStorage.setItem('user', JSON.stringify(user));

            // Envoyer à l'API
            await api.put('/user/profile', {
                phoneNumber: settings.phoneNumber,
                teacherInfo: {
                    status: settings.status,
                    notificationMode: settings.notificationMode,
                    subjects: currentTeacher.teacherInfo?.subjects || []
                }
            });

            showNotification(t('profile.updateSuccess'), 'success');

            // Retourner au profil après 1 seconde
            setTimeout(() => {
                setActiveTab('profile');
                setEditingSubjects(false);
            }, 1000);

        } catch (error) {
            console.error('Erreur sauvegarde paramètres:', error);
            
            if (error.code === 'ECONNABORTED') {
                showNotification(t('profile.sessionExpired'), 'error');
            } else if (error.response) {
                showNotification(`❌ ${error.response.data.error || 'Erreur serveur'}`, 'error');
            } else if (error.request) {
                showNotification(t('profile.offlineSaved'), 'warning');
            } else {
                showNotification(t('errors.networkError'), 'error');
            }
        } finally {
            setSaving(false);
        }
    };

    const createPublication = () => {
        showNotification(t('profile.redirectToCreatePost'), 'info');
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
        return currentTeacher.firstName?.[0] + currentTeacher.lastName?.[0] || 'EN';
    };

    const [allUniversities, setAllUniversities] = useState(universities || []);

    useEffect(() => {
        if (universities && universities.length) {
            setAllUniversities(universities);
        }
    }, [universities]);

    useEffect(() => {
        const fetchUniversities = async () => {
            if (allUniversities && allUniversities.length) return;
            try {
                const response = await api.get('/universities/list');
                setAllUniversities(response.data.universities || []);
            } catch (err) {
                console.error('Erreur lors du chargement des universités :', err);
            }
        };

        fetchUniversities();
    }, [allUniversities]);

    const teacherUniversities = (currentTeacher.teacherUniversityIds || [])
        .map((id) => {
            const university = allUniversities.find((u) => u.id === id || u._id === id);
            if (university?.name) return university.name;
            return t(`auth.campusName.${id}`, { defaultValue: id });
        })
        .filter(Boolean)
        .join(', ') || t('common.unknown');

    const getVerificationVariant = (status) => {
        switch (status) {
            case 'verified':
                return 'success';
            case 'pending':
                return 'warning';
            case 'rejected':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const verificationLabel = t(`profile.verificationStatusValues.${currentTeacher.verificationStatus}`, {
        defaultValue: currentTeacher.verificationStatus || t('common.unknown'),
    });

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
            <AppNavbar currentUser={currentTeacher} />

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
                                                <FaUserCircle /> {t('profile.title')}
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
                                                                style={currentTeacher.photoUrl ? { backgroundImage: `url(${currentTeacher.photoUrl})` } : {}}
                                                            >
                                                                {!currentTeacher.photoUrl && getInitials()}
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
                                                        <h2 className={styles.teacherName}>{currentTeacher.firstName} {currentTeacher.lastName}</h2>
                                                        <div className={styles.teacherTitle}>
                                                            <FaChalkboardTeacher /> {currentTeacher.roles[0]} | {currentTeacher.teacherInfo?.status || t('auth.teacher')}
                                                        </div>

                                                        <div className={styles.teacherMeta}>
                                                            <Badge bg={getVerificationVariant(currentTeacher.verificationStatus)} className={styles.verificationBadge}>
                                                                <FaCheckCircle /> {verificationLabel}
                                                            </Badge>
                                                            {currentTeacher.teacherInfo?.matricule && (
                                                                <div className={styles.matriculeLine}>
                                                                    <FaIdCard /> {t('profile.matricule')}: {currentTeacher.teacherInfo.matricule}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <Badge className={styles.universityBadge}>
                                                            <FaUniversity /> {teacherUniversities}
                                                        </Badge>
                                                    </div>


                                                    {/* Professional information */}
                                                    <div className={styles.infoSection}>
                                                        <h3 className={styles.sectionTitle}>
                                                            <FaIdCard /> {t('profile.professionalInfo')}
                                                        </h3>
                                                        <div className={styles.infoGrid}>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <MdEmail /> {t('profile.email')}
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentTeacher.email}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaPhone /> {t('profile.phone')}
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentTeacher.phoneNumber}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaBuilding /> {t('profile.department')}
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentTeacher.department}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaMapMarkerAlt /> {t('profile.office')}
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentTeacher.bureau}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaGraduationCap /> {t('profile.speciality')}
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentTeacher.specialite}
                                                                </div>
                                                            </div>
                                                            <div className={styles.infoItem}>
                                                                <div className={styles.infoLabel}>
                                                                    <FaClock /> {t('profile.experience')}
                                                                </div>
                                                                <div className={styles.infoValue}>
                                                                    {currentTeacher.experience}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Taught subjects */}
                                                    <div className={styles.subjectsSection}>
                                                        <h3 className={styles.sectionTitle}>
                                                            <FaBook /> {t('profile.subjects')}
                                                        </h3>
                                                        <div className={styles.subjectsList}>
                                                            {(currentTeacher.teacherInfo?.subjects || []).map((subject, index) => (
                                                                <Badge 
                                                                    key={index}
                                                                    className={styles.subjectTag}
                                                                >
                                                                    {subject}
                                                                </Badge>
                                                            ))}
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
                                                        defaultActiveKey="personal"
                                                        className={styles.settingsTabs}
                                                    >
                                                        <Tab 
                                                            eventKey="personal" 
                                                            title={
                                                                <span>
                                                                    <FaUser /> {t('profile.personalInfo')}
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
                                                                            value={settings.phoneNumber}
                                                                            onChange={(e) => handleSettingsChange('phoneNumber', e.target.value)}
                                                                            placeholder="+237 6XX XXX XXX"
                                                                            className={styles.formInput}
                                                                        />
                                                                    </InputGroup>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        Statut enseignant
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.status}
                                                                        onChange={(e) => handleSettingsChange('status', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="permanent">Permanent</option>
                                                                        <option value="assistant">Assistant</option>
                                                                        <option value="vacataire">Vacataire</option>
                                                                    </Form.Select>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        Mode de notification
                                                                    </Form.Label>
                                                                    <Form.Select
                                                                        value={settings.notificationMode}
                                                                        onChange={(e) => handleSettingsChange('notificationMode', e.target.value)}
                                                                        className={styles.formSelect}
                                                                    >
                                                                        <option value="all">Tout</option>
                                                                        <option value="targeted">Ciblé</option>
                                                                        <option value="none">Aucun</option>
                                                                    </Form.Select>
                                                                </Form.Group>
                                                            </div>
                                                        </Tab>

                                                        <Tab 
                                                            eventKey="subjects" 
                                                            title={
                                                                <span>
                                                                    <FaBook /> Matières
                                                                </span>
                                                            }
                                                        >
                                                            <div className={styles.settingsForm}>
                                                                <h3 className={styles.sectionSubtitle}>
                                                                        {t('profile.subjects')}
                                                                    </h3>
                                                                    <h3 className={styles.sectionSubtitle}>
                                                                        {t('profile.subjects')}
                                                                    </h3>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        Ajouter une matière
                                                                    </Form.Label>
                                                                    <InputGroup>
                                                                        <Form.Control
                                                                            type="text"
                                                                            value={newSubject}
                                                                            onChange={(e) => setNewSubject(e.target.value)}
                                                                            placeholder="Ex: Algorithmique, Base de données..."
                                                                            className={styles.formInput}
                                                                            onKeyPress={(e) => {
                                                                                if (e.key === 'Enter') {
                                                                                    handleAddSubject();
                                                                                }
                                                                            }}
                                                                        />
                                                                        <BoutonMatiere
                                                                            type="add"
                                                                            onAction={handleAddSubject}
                                                                        />
                                                                    </InputGroup>
                                                                </Form.Group>

                                                                <div className={styles.currentSubjects}>
                                                                    <Form.Label className={styles.formLabel}>
                                                                        {t('profile.currentSubjects')}
                                                                    </Form.Label>
                                                                    <div className={styles.subjectsList}>
                                                                        {(currentTeacher.teacherInfo?.subjects || []).map((subject, index) => (
                                                                            <BoutonMatiere
                                                                                key={index}
                                                                                type="subject"
                                                                                subject={subject}
                                                                                onAction={() => handleRemoveSubject(subject)}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
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
                                                                        Recevoir les notifications importantes par email
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
                                                                        Recevoir les notifications dans votre navigateur
                                                                    </Form.Text>
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id="showEmail"
                                                                        label={t('profile.showEmailPublic')}
                                                                        checked={settings.showEmail}
                                                                        onChange={(e) => handleSettingsChange('showEmail', e.target.checked)}
                                                                        className={styles.switch}
                                                                    />
                                                                </Form.Group>

                                                                <Form.Group className={styles.formGroup}>
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id="showPhone"
                                                                        label={t('profile.showPhonePublic')}
                                                                        checked={settings.showPhone}
                                                                        onChange={(e) => handleSettingsChange('showPhone', e.target.checked)}
                                                                        className={styles.switch}
                                                                    />
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
                                                            onClick={() => {
                                                                setActiveTab('profile');
                                                                setEditingSubjects(false);
                                                                setNewSubject('');
                                                            }}
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

export default ProfilEnseignant;