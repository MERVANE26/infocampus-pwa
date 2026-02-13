import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    FaUniversity,
    FaChalkboardTeacher,
    FaUserTie,
    FaPen,
    FaSave,
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
    FaUserGraduate,
    FaBuilding,
    FaGlobe,
    FaEye,
    FaEyeSlash,
    FaComments,
    FaExclamationCircle
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdSchool, MdWarning } from 'react-icons/md';
import { BsPersonBadge, BsPersonVcard } from 'react-icons/bs';
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
import ProgressBar from 'react-bootstrap/ProgressBar';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import styles from './FairePublication.module.css';
const newPublication = {};
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

const FairePublication = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // États
    const [currentUser, setCurrentUser] = useState({
        id: "PROF001",
        name: "Pr. Amadou Diallo",
        avatar: "PD",
        role: "Enseignant",
        department: "Informatique",
        filiere: "Genie Logiciel",
        campus: "Campus 2",
        email: "amadou.diallo@universite.cm"
    });
    
    const [publication, setPublication] = useState({
        content: '',
        audience: 'students',
        staffTarget: '',
        filiere: 'tous',
        niveau: '3eme annee',
        campus: 'Campus 2',
        groupe: 'Cours du jour',
        allowComments: true,
        isUrgent: false,
        attachments: []
    });
    
    const [charCount, setCharCount] = useState(0);
    const [charWarning, setCharWarning] = useState('');
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [draftLoaded, setDraftLoaded] = useState(false);

    const MAX_CHARS = 1500;
    const WARNING_CHARS = 1100;
    const ERROR_CHARS = 1300;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

    // Effets
    useEffect(() => {
        // Charger les données utilisateur
        loadUserData();
        
        // Charger un brouillon existant
        loadDraft();

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

        // Nettoyage des URLs des fichiers
        return () => {
            selectedFiles.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
    }, []);

    useEffect(() => {
        updateCharCount();
    }, [publication.content]);

    const loadUserData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentUser(prev => ({
                    ...prev,
                    ...user,
                    avatar: user.firstName?.[0] + user.lastName?.[0] || prev.avatar
                }));
            }
        } catch (error) {
            console.error('Erreur chargement utilisateur:', error);
        }
    };

    const loadDraft = () => {
        try {
            const draft = JSON.parse(localStorage.getItem('publicationDraft'));
            if (draft) {
                setPublication(draft);
                setDraftLoaded(true);
                showNotification('📝 Brouillon chargé automatiquement', 'info');
            }
        } catch (error) {
            console.error('Erreur chargement brouillon:', error);
        }
    };

    const updateCharCount = () => {
        const length = publication.content.length;
        setCharCount(length);
        
        if (length > ERROR_CHARS) {
            setCharWarning('error');
        } else if (length > WARNING_CHARS) {
            setCharWarning('warning');
        } else {
            setCharWarning('');
        }
    };

    const handleChange = (field, value) => {
        setPublication(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Vérifier la taille des fichiers
        const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
            showNotification(`❌ Certains fichiers dépassent ${MAX_FILE_SIZE / 1024 / 1024} Mo`, 'error');
            return;
        }

        // Vérifier le nombre total de fichiers
        if (selectedFiles.length + files.length > 5) {
            showNotification('❌ Maximum 5 fichiers autorisés', 'error');
            return;
        }

        // Créer des previews pour les images
        const newFiles = files.map(file => ({
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            uploadProgress: 0
        }));

        setSelectedFiles(prev => [...prev, ...newFiles]);
        showNotification(`✅ ${files.length} fichier(s) ajouté(s)`, 'success');
        
        // Réinitialiser l'input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => {
            const newFiles = [...prev];
            if (newFiles[index].preview) {
                URL.revokeObjectURL(newFiles[index].preview);
            }
            newFiles.splice(index, 1);
            return newFiles;
        });
        showNotification('🗑️ Fichier supprimé', 'info');
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) return <FaFileImage />;
        if (file.type === 'application/pdf') return <FaFilePdf />;
        return <FaFileAlt />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getTargetingPreview = () => {
        const badges = [];

        switch(publication.audience) {
            case 'students':
                badges.push({ icon: <FaUserGraduate />, text: 'Étudiants', variant: 'primary' });
                if (publication.filiere !== 'tous') {
                    badges.push({ icon: <FaUniversity />, text: publication.filiere, variant: 'info' });
                }
                if (publication.niveau !== 'tous') {
                    badges.push({ icon: <FaUserGraduate />, text: publication.niveau, variant: 'info' });
                }
                if (publication.campus !== 'tous') {
                    badges.push({ icon: <FaBuilding />, text: publication.campus, variant: 'info' });
                }
                if (publication.groupe !== 'tous') {
                    badges.push({ icon: <FaUsers />, text: publication.groupe, variant: 'info' });
                }
                if (badges.length === 1) {
                    badges.push({ icon: <FaGlobe />, text: 'Tous les étudiants', variant: 'secondary' });
                }
                break;

            case 'staff':
                badges.push({ icon: <FaChalkboardTeacher />, text: 'Personnel', variant: 'warning' });
                if (publication.staffTarget) {
                    badges.push({ icon: <FaBuilding />, text: publication.staffTarget, variant: 'warning' });
                } else {
                    badges.push({ icon: <FaUsers />, text: 'Tout le personnel', variant: 'secondary' });
                }
                break;

            case 'both':
                badges.push({ icon: <FaGlobe />, text: 'Tout le monde', variant: 'success' });
                badges.push({ icon: <FaUserGraduate />, text: 'Étudiants', variant: 'primary' });
                badges.push({ icon: <FaChalkboardTeacher />, text: 'Personnel', variant: 'warning' });
                break;
        }

        return badges;
    };

    const validatePublication = () => {
        if (!publication.content.trim()) {
            showNotification('❌ Veuillez rédiger le contenu de votre publication', 'error');
            return false;
        }

        if (publication.content.length < 10) {
            showNotification('❌ Le message est trop court (minimum 10 caractères)', 'error');
            return false;
        }

        return true;
    };

    const publishNow = async () => {
        if (!validatePublication()) return;

        setLoading(true);

        try {
            // Simuler l'upload des fichiers
            const uploadedFiles = [];
            for (let i = 0; i < selectedFiles.length; i++) {
                const fileData = selectedFiles[i];
                setUploadProgress(prev => ({ ...prev, [fileData.name]: 0 }));
                
                // Simuler la progression
                for (let progress = 0; progress <= 100; progress += 20) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    setUploadProgress(prev => ({ ...prev, [fileData.name]: progress }));
                }
                
                uploadedFiles.push({
                    name: fileData.name,
                    size: fileData.size,
                    type: fileData.type,
                    url: fileData.preview || '#',
                    icon: getFileIcon(fileData)
                });
            }

            // Créer la publication
            const newPublication = {
                id: Date.now(),
                author: {
                    name: currentUser.name,
                    avatar: currentUser.avatar,
                    role: currentUser.role,
                    department: currentUser.department
                },
                content: publication.content,
                date: new Date().toISOString(),
                likes: 0,
                comments: 0,
                urgent: publication.isUrgent,
                attachments: uploadedFiles,
                settings: {
                    allowComments: publication.allowComments
                },
                target: {
                    audience: publication.audience,
                    staffTarget: publication.staffTarget,
                    filiere: publication.filiere,
                    niveau: publication.niveau,
                    campus: publication.campus,
                    groupe: publication.groupe
                }
            };

            // Envoyer à l'API
            const response = await api.post('/publications', newPublication);

            if (response.data.success) {
                // Sauvegarder dans localStorage pour le mode hors-ligne
                const publications = JSON.parse(localStorage.getItem('publications')) || [];
                publications.unshift(newPublication);
                localStorage.setItem('publications', JSON.stringify(publications));

                // Effacer le brouillon
                localStorage.removeItem('publicationDraft');

                // Notification PWA
                if (Notification.permission === 'granted') {
                    new Notification('Publication publiée!', {
                        body: 'Votre publication a été créée avec succès',
                        icon: '/icon-192x192.png'
                    });
                }

                showNotification('✅ Publication créée avec succès!', 'success');

                // Redirection
                setTimeout(() => {
                    navigate('/publications');
                }, 2000);
            }

        } catch (error) {
            console.error('Erreur publication:', error);
            
            if (error.code === 'ECONNABORTED') {
                showNotification('❌ Délai de connexion dépassé', 'error');
            } else if (error.response) {
                showNotification(`❌ ${error.response.data.error || 'Erreur serveur'}`, 'error');
            } else if (error.request) {
                showNotification('❌ Mode hors-ligne : publication sauvegardée localement', 'warning');
                // Sauvegarde locale en mode hors-ligne
                const offlinePublications = JSON.parse(localStorage.getItem('offlinePublications')) || [];
                offlinePublications.push({
                    ...newPublication,
                    offline: true,
                    syncPending: true
                });
                localStorage.setItem('offlinePublications', JSON.stringify(offlinePublications));
            } else {
                showNotification('❌ Erreur de connexion', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const saveAsDraft = () => {
        setSavingDraft(true);

        try {
            // Sauvegarder le brouillon
            localStorage.setItem('publicationDraft', JSON.stringify(publication));
            
            // Animation de confirmation
            showNotification('✅ Brouillon enregistré avec succès', 'success');
            
            // Notification PWA
            if (Notification.permission === 'granted') {
                new Notification('Brouillon sauvegardé', {
                    body: 'Votre brouillon a été enregistré',
                    icon: '/icon-192x192.png'
                });
            }
        } catch (error) {
            console.error('Erreur sauvegarde brouillon:', error);
            showNotification('❌ Erreur lors de la sauvegarde', 'error');
        } finally {
            setTimeout(() => setSavingDraft(false), 1000);
        }
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const getCharCounterClass = () => {
        if (charWarning === 'error') return styles.counterError;
        if (charWarning === 'warning') return styles.counterWarning;
        return styles.counterNormal;
    };

    const getProgressBarVariant = () => {
        if (charCount > ERROR_CHARS) return 'danger';
        if (charCount > WARNING_CHARS) return 'warning';
        return 'success';
    };

    return (
        <div className={styles.pageContainer}>
            {/* Notification */}
            {notification && (
                <Alert 
                    variant={notification.type} 
                    className={styles.notification}
                    dismissible
                    onClose={() => setNotification(null)}
                >
                    {notification.message}
                </Alert>
            )}

            {/* En-tête */}
            <Navbar bg="white" expand="lg" className={styles.header} fixed="top">
                <Container>
                    <Navbar.Brand as={Link} to="/" className={styles.brand}>
                        <FaUniversity className={styles.brandIcon} />
                        <div className={styles.brandText}>
                            <span className={styles.brandName}>INFOcAMPUS</span>
                            <span className={styles.brandSub}>CONNECTING UNIVERSITIES</span>
                        </div>
                        <Badge bg="warning" className={styles.roleBadge}>
                            <FaChalkboardTeacher /> ENSEIGNANT
                        </Badge>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Dropdown align="end">
                                <Dropdown.Toggle as="div" className={styles.userMenu}>
                                    <div className={styles.userAvatar}>
                                        {currentUser.avatar}
                                    </div>
                                    <div className={styles.userInfo}>
                                        <div className={styles.userName}>{currentUser.name}</div>
                                        <div className={styles.userRole}>
                                            {currentUser.role} - {currentUser.department}
                                        </div>
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={styles.userDropdown}>
                                    <Dropdown.Item as={Link} to="/profil">
                                        <BsPersonBadge /> Mon profil
                                    </Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/parametres">
                                        ⚙️ Paramètres
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={() => navigate('/login')}>
                                        🚪 Déconnexion
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Contenu principal */}
            <Container className={styles.mainContent}>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        {/* En-tête de page */}
                        <div className={styles.pageHeader}>
                            <Button 
                                variant="link" 
                                className={styles.backButton}
                                onClick={() => navigate('/publications')}
                            >
                                <FaArrowLeft /> Retour
                            </Button>
                            <h1 className={styles.pageTitle}>
                                <FaPen /> Nouvelle publication
                            </h1>
                            <p className={styles.pageSubtitle}>
                                Créez une publication pour vos collègues enseignants ou pour les étudiants
                            </p>
                        </div>

                        {/* Message d'information */}
                        <Alert variant="warning" className={styles.infoMessage}>
                            <FaExclamationTriangle className="me-2" />
                            <Alert.Heading as="h2" className={styles.infoTitle}>
                                Publication réservée au personnel
                            </Alert.Heading>
                            <p>
                                En tant qu'enseignant ou membre de l'administration, 
                                vous pouvez publier pour vos collègues ou pour les étudiants.
                            </p>
                        </Alert>

                        {/* Carte de publication */}
                        <Card className={styles.publicationCard}>
                            <Card.Body>
                                {/* En-tête du publieur */}
                                <div className={styles.publisherInfo}>
                                    <div className={styles.publisherAvatar}>
                                        {currentUser.avatar}
                                    </div>
                                    <div className={styles.publisherDetails}>
                                        <div className={styles.publisherName}>
                                            {currentUser.name}
                                            <Badge bg="warning" className={styles.publisherBadge}>
                                                <FaChalkboardTeacher /> {currentUser.role}
                                            </Badge>
                                        </div>
                                        <div className={styles.publisherRole}>
                                            {currentUser.department} • {currentUser.campus}
                                        </div>
                                    </div>
                                </div>

                                {/* Formulaire */}
                                <Form>
                                    {/* Contenu */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className={styles.formLabel}>
                                            <FaPen /> Contenu de la publication
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            value={publication.content}
                                            onChange={(e) => handleChange('content', e.target.value)}
                                            placeholder="Rédigez votre message ici... (Annonce pour collègues, information pour étudiants, réunion, cours, etc.)"
                                            maxLength={MAX_CHARS}
                                            className={styles.textarea}
                                            isInvalid={charCount > MAX_CHARS}
                                        />
                                        <div className={styles.charCounter}>
                                            <div className={styles.counterText}>
                                                <span className={getCharCounterClass()}>
                                                    {charCount}/{MAX_CHARS} caractères
                                                </span>
                                                {charCount > WARNING_CHARS && (
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={
                                                            <Tooltip>
                                                                {charCount > ERROR_CHARS 
                                                                    ? 'Message trop long!' 
                                                                    : 'Approche de la limite'}
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <FaExclamationCircle className={styles.warningIcon} />
                                                    </OverlayTrigger>
                                                )}
                                            </div>
                                            <ProgressBar 
                                                now={(charCount / MAX_CHARS) * 100}
                                                variant={getProgressBarVariant()}
                                                className={styles.progressBar}
                                            />
                                        </div>
                                    </Form.Group>

                                    {/* Section de ciblage */}
                                    <div className={styles.targetingSection}>
                                        <div className={styles.sectionTitle}>
                                            <FaGlobe /> Ciblage du public
                                        </div>
                                        
                                        <p className={styles.sectionDescription}>
                                            Sélectionnez à qui est destinée votre publication. 
                                            Les publications pour le personnel ne sont pas visibles par les étudiants.
                                        </p>

                                        {/* Audience principale */}
                                        <Form.Group className="mb-3">
                                            <Form.Label className={styles.targetLabel}>
                                                Cette publication est destinée à :
                                            </Form.Label>
                                            <Form.Select
                                                value={publication.audience}
                                                onChange={(e) => handleChange('audience', e.target.value)}
                                                className={styles.select}
                                            >
                                                <option value="students">👨‍🎓 Étudiants uniquement</option>
                                                <option value="staff">👨‍🏫 Personnel uniquement</option>
                                                <option value="both">👥 Tout le monde</option>
                                            </Form.Select>
                                        </Form.Group>

                                        {/* Ciblage personnel */}
                                        {(publication.audience === 'staff' || publication.audience === 'both') && (
                                            <Form.Group className="mb-3">
                                                <Form.Label className={styles.targetLabel}>
                                                    Spécifiez pour quel personnel (facultatif) :
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={publication.staffTarget}
                                                    onChange={(e) => handleChange('staffTarget', e.target.value)}
                                                    placeholder="Ex: Enseignants du département Informatique, Administration du campus 2, etc."
                                                    className={styles.input}
                                                />
                                                <Form.Text className={styles.helpText}>
                                                    Laissez vide si c'est pour tout le personnel
                                                </Form.Text>
                                            </Form.Group>
                                        )}

                                        {/* Ciblage étudiants */}
                                        {(publication.audience === 'students' || publication.audience === 'both') && (
                                            <div className={styles.studentTargeting}>
                                                <Form.Label className={styles.targetLabel}>
                                                    Ciblage des étudiants :
                                                </Form.Label>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={styles.targetSubLabel}>
                                                                Filière
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={publication.filiere}
                                                                onChange={(e) => handleChange('filiere', e.target.value)}
                                                                className={styles.select}
                                                            >
                                                                <option value="tous">Toutes les filières</option>
                                                                <option value="Genie Logiciel">Génie Logiciel</option>
                                                                <option value="TELECOMS">TELECOMS</option>
                                                                <option value="Reseaux">Réseaux et sécurité</option>
                                                                <option value="IIA">IIA</option>
                                                                <option value="MAVA">MAVA</option>
                                                                <option value="MSI">MSI</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                    
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={styles.targetSubLabel}>
                                                                Niveau
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={publication.niveau}
                                                                onChange={(e) => handleChange('niveau', e.target.value)}
                                                                className={styles.select}
                                                            >
                                                                <option value="tous">Tous les niveaux</option>
                                                                <option value="1ere annee">1ère année</option>
                                                                <option value="2eme annee">2ème année</option>
                                                                <option value="3eme annee">3ème année</option>
                                                                <option value="Master 1">Master 1</option>
                                                                <option value="Master 2">Master 2</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                    
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={styles.targetSubLabel}>
                                                                Campus
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={publication.campus}
                                                                onChange={(e) => handleChange('campus', e.target.value)}
                                                                className={styles.select}
                                                            >
                                                                <option value="tous">Tous les campus</option>
                                                                <option value="Campus A">Campus A</option>
                                                                <option value="Campus B">Campus B</option>
                                                                <option value="Campus C">Campus C</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                    
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className={styles.targetSubLabel}>
                                                                Groupe
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={publication.groupe}
                                                                onChange={(e) => handleChange('groupe', e.target.value)}
                                                                className={styles.select}
                                                            >
                                                                <option value="tous">Tous les groupes</option>
                                                                <option value="Cours du jour">Cours du jour</option>
                                                                <option value="Cours du soir">Cours du soir</option>
                                                                <option value="Groupe A">Groupe A</option>
                                                                <option value="Groupe B">Groupe B</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )}

                                        {/* Aperçu du ciblage */}
                                        <div className={styles.targetingPreview}>
                                            <div className={styles.previewTitle}>
                                                Public ciblé :
                                            </div>
                                            <div className={styles.previewBadges}>
                                                {getTargetingPreview().map((badge, index) => (
                                                    <Badge 
                                                        key={index}
                                                        bg={badge.variant}
                                                        className={styles.targetBadge}
                                                    >
                                                        {badge.icon} {badge.text}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pièces jointes */}
                                    <div className={styles.attachmentsSection}>
                                        <div className={styles.sectionTitle}>
                                            <FaPaperclip /> Pièces jointes (facultatif)
                                        </div>
                                        
                                        <div className={styles.fileInputContainer}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                multiple
                                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.ppt,.pptx"
                                                className={styles.fileInput}
                                                id="fileInput"
                                            />
                                            <label htmlFor="fileInput" className={styles.fileInputLabel}>
                                                <FaPaperclip />
                                                <span>Cliquez pour ajouter des fichiers</span>
                                                <small>Taille maximale : 10 Mo par fichier</small>
                                            </label>
                                        </div>

                                        {selectedFiles.length > 0 && (
                                            <div className={styles.fileList}>
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className={styles.fileItem}>
                                                        <div className={styles.fileIcon}>
                                                            {getFileIcon(file)}
                                                        </div>
                                                        <div className={styles.fileInfo}>
                                                            <div className={styles.fileName}>
                                                                {file.name}
                                                            </div>
                                                            <div className={styles.fileMeta}>
                                                                {formatFileSize(file.size)}
                                                                {uploadProgress[file.name] !== undefined && (
                                                                    <span> • Upload: {uploadProgress[file.name]}%</span>
                                                                )}
                                                            </div>
                                                            {file.preview && (
                                                                <img 
                                                                    src={file.preview} 
                                                                    alt={file.name}
                                                                    className={styles.filePreview}
                                                                />
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="link"
                                                            className={styles.removeFile}
                                                            onClick={() => removeFile(index)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Options de publication */}
                                    <div className={styles.publishOptions}>
                                        <div className={styles.optionsTitle}>
                                            ⚙️ Options de publication
                                        </div>
                                        
                                        <Form.Check
                                            type="checkbox"
                                            id="allowComments"
                                            checked={publication.allowComments}
                                            onChange={(e) => handleChange('allowComments', e.target.checked)}
                                            label={
                                                <span className={styles.optionLabel}>
                                                    <FaComments /> Autoriser les commentaires
                                                </span>
                                            }
                                            className="mb-2"
                                        />
                                        
                                        <Form.Check
                                            type="checkbox"
                                            id="markUrgent"
                                            checked={publication.isUrgent}
                                            onChange={(e) => handleChange('isUrgent', e.target.checked)}
                                            label={
                                                <span className={styles.optionLabel}>
                                                    <FaExclamationTriangle /> Marquer comme urgent
                                                    {publication.isUrgent && (
                                                        <Badge bg="danger" className={styles.urgentBadge}>
                                                            URGENT
                                                        </Badge>
                                                    )}
                                                </span>
                                            }
                                        />
                                    </div>

                                    {/* Boutons d'action */}
                                    <div className={styles.actionButtons}>
                                        <Button
                                            variant="secondary"
                                            className={styles.draftButton}
                                            onClick={saveAsDraft}
                                            disabled={savingDraft || loading}
                                        >
                                            {savingDraft ? (
                                                <>
                                                    <Spinner size="sm" className="me-2" />
                                                    Sauvegarde...
                                                </>
                                            ) : (
                                                <>
                                                    <FaSave className="me-2" />
                                                    Brouillon
                                                </>
                                            )}
                                        </Button>
                                        
                                        <Button
                                            variant="success"
                                            className={styles.publishButton}
                                            onClick={publishNow}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner size="sm" className="me-2" />
                                                    Publication...
                                                </>
                                            ) : (
                                                <>
                                                    <FaBell className="me-2" />
                                                    Publier
                                                    <FaArrowRight className="ms-2" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default FairePublication;