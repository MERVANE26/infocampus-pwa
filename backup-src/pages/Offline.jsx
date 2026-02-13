import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    FaWifi,
    FaCloudUploadAlt,
    FaCloudDownloadAlt,
    FaCloud,
    FaCloudOff,
    FaCloudSun,
    FaCloudMoon,
    FaCloudRain,
    FaCloudSnow,
    FaCloudStorm,
    FaCloudMeatball,
    FaWifi as FaWifiIcon,
    FaWifiSlash,
    FaSignal,
    FaSignalSlash,
    FaSatellite,
    FaSatelliteDish,
    FaRss,
    FaRssSquare,
    FaNetworkWired,
    FaEthernet,
    FaBluetooth,
    FaBluetoothB,
    FaMobile,
    FaMobileAlt,
    FaTablet,
    FaTabletAlt,
    FaLaptop,
    FaLaptopHouse,
    FaLaptopMedical,
    FaLaptopCode,
    FaDesktop,
    FaDesktopAlt,
    FaGamepad,
    FaHeadphones,
    FaHeadphonesAlt,
    FaMicrophone,
    FaMicrophoneAlt,
    FaMusic,
    FaFilm,
    FaVideo,
    FaCamera,
    FaCameraRetro,
    FaPhone,
    FaPhoneAlt,
    FaPhoneSlash,
    FaPhoneVolume,
    FaPhoneSquare,
    FaPhoneSquareAlt,
    FaEnvelope,
    FaEnvelopeOpen,
    FaEnvelopeOpenText,
    FaInbox,
    FaPaperPlane,
    FaPaperPlaneAlt,
    FaReply,
    FaReplyAll,
    FaShare,
    FaShareAlt,
    FaShareAltSquare,
    FaSync,
    FaSyncAlt,
    FaRedo,
    FaRedoAlt,
    FaUndo,
    FaUndoAlt,
    FaRandom,
    FaRandomAlt,
    FaCircle,
    FaCircleNotch,
    FaSpinner,
    FaSpinnerAlt,
    FaRefresh,
    FaRefreshAlt,
    FaTimes,
    FaTimesCircle,
    FaTimesCircleAlt,
    FaCheck,
    FaCheckCircle,
    FaCheckCircleAlt,
    FaCheckSquare,
    FaCheckDouble,
    FaExclamation,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaInfo,
    FaInfoCircle,
    FaQuestion,
    FaQuestionCircle,
    FaQuestionSquare,
    FaPlus,
    FaPlusCircle,
    FaPlusSquare,
    FaMinus,
    FaMinusCircle,
    FaMinusSquare,
    FaHeart,
    FaHeartAlt,
    FaHeartbeat,
    FaHeartBroken,
    FaStar,
    FaStarAlt,
    FaStarHalf,
    FaStarHalfAlt,
    FaStarOfLife,
    FaStarOfDavid,
    FaMoon,
    FaMoonAlt,
    FaSun,
    FaSunAlt,
    FaCloudSun as FaCloudSunIcon,
    FaCloudMoon as FaCloudMoonIcon,
    FaCloudRain as FaCloudRainIcon,
    FaCloudSnow as FaCloudSnowIcon,
    FaCloudStorm as FaCloudStormIcon,
    FaCloudMeatball as FaCloudMeatballIcon
} from 'react-icons/fa';
import { 
    MdWifi, 
    MdWifiOff, 
    MdSignalWifiStatusbarConnectedNoInternet,
    MdSignalWifiStatusbarNotConnected,
    MdSignalWifiOff,
    MdSignalCellularConnectedNoInternet,
    MdSignalCellularNoSim,
    MdSignalCellularNull,
    MdSignalCellularOff,
    MdCloudOff as MdCloudOffIcon,
    MdCloudQueue,
    MdCloudSync,
    MdCloudDone,
    MdCloudUpload as MdCloudUploadIcon,
    MdCloudDownload as MdCloudDownloadIcon,
    MdRefresh,
    MdRefreshAlt,
    MdSync,
    MdSyncProblem,
    MdSyncDisabled,
    MdSyncLock,
    MdUpdate,
    MdUpdateDisabled,
    MdAutorenew,
    MdCached,
    MdLoop,
    MdRestartAlt,
    MdRestore,
    MdRestorePage,
    MdRestoreFromTrash,
    MdReplay,
    MdReplayCircleFilled,
    MdReplayCircleOutline,
    MdReplayCircleSharp,
    MdReplayCircle,
    MdReplayCircleOutline as MdReplayCircleOutlineIcon,
    MdReplayCircleFilled as MdReplayCircleFilledIcon,
    MdReplayCircleSharp as MdReplayCircleSharpIcon,
    MdReplayCircle as MdReplayCircleIcon,
    MdReplayCircleOutline as MdReplayCircleOutlineIcon2,
    MdReplayCircleFilled as MdReplayCircleFilledIcon2
} from 'react-icons/md';
import { 
    BsWifi, 
    BsWifiOff, 
    BsCloud, 
    BsCloudCheck, 
    BsCloudDownload, 
    BsCloudUpload, 
    BsCloudSlash,
    BsCloudCheckFill,
    BsCloudDownloadFill,
    BsCloudUploadFill,
    BsCloudSlashFill,
    BsCloudHaze,
    BsCloudHazeFill,
    BsCloudHaze2,
    BsCloudHaze2Fill,
    BsCloudFog,
    BsCloudFogFill,
    BsCloudFog2,
    BsCloudFog2Fill,
    BsCloudLightning,
    BsCloudLightningFill,
    BsCloudLightningRain,
    BsCloudLightningRainFill,
    BsCloudMoon,
    BsCloudMoonFill,
    BsCloudSun,
    BsCloudSunFill,
    BsCloudRain,
    BsCloudRainFill,
    BsCloudRainHeavy,
    BsCloudRainHeavyFill,
    BsCloudSnow,
    BsCloudSnowFill,
    BsCloudStorm,
    BsCloudStormFill,
    BsCloudDrizzle,
    BsCloudDrizzleFill,
    BsCloudHail,
    BsCloudHailFill,
    BsCloudSleet,
    BsCloudSleetFill,
    BsCloudWind,
    BsCloudWindFill
} from 'react-icons/bs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';
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
import Image from 'react-bootstrap/Image';
import Figure from 'react-bootstrap/Figure';
import styles from './Offline.module.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Configuration Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const Offline = () => {
    const navigate = useNavigate();
    
    // États
    const [universityName, setUniversityName] = useState('INFOcAMPUS');
    const [retryCount, setRetryCount] = useState(0);
    const [isChecking, setIsChecking] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [offlineData, setOfflineData] = useState({
        publications: 0,
        comments: 0,
        reactions: 0,
        drafts: 0,
        lastSync: null
    });
    const [syncProgress, setSyncProgress] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [pendingActions, setPendingActions] = useState([]);
    const [showDetails, setShowDetails] = useState(false);
    const [networkType, setNetworkType] = useState('unknown');
    const [connectionSpeed, setConnectionSpeed] = useState(null);
    const [isOnline, setIsOnline] = useState(!navigator.onLine);

    // Effets
    useEffect(() => {
        loadOfflineData();
        checkNetworkStatus();
        loadPendingActions();

        // Écouter les changements de connexion
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Service Worker (Workbox)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker enregistré:', registration);
                    
                    // Écouter les messages du Service Worker
                    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
                })
                .catch(error => {
                    console.log('❌ Service Worker error:', error);
                });
        }

        // Détection du type de réseau
        if ('connection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            updateNetworkInfo(connection);
            
            connection.addEventListener('change', () => updateNetworkInfo(connection));
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
            }
        };
    }, []);

    useEffect(() => {
        if (isChecking) {
            const timer = setTimeout(() => {
                setIsChecking(false);
                if (navigator.onLine) {
                    handleOnline();
                }
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [isChecking]);

    const loadOfflineData = () => {
        try {
            // Compter les publications hors ligne
            const publications = JSON.parse(localStorage.getItem('publications')) || [];
            const offlinePublications = JSON.parse(localStorage.getItem('offlinePublications')) || [];
            
            // Compter les commentaires
            let commentsCount = 0;
            publications.forEach(pub => {
                commentsCount += pub.commentsData?.length || 0;
            });
            
            // Compter les réactions
            let reactionsCount = 0;
            publications.forEach(pub => {
                if (pub.userReaction) reactionsCount++;
                pub.commentsData?.forEach(comment => {
                    if (comment.userReaction) reactionsCount++;
                });
            });
            
            // Compter les brouillons
            const drafts = JSON.parse(localStorage.getItem('publicationDraft')) ? 1 : 0;
            
            // Dernière synchronisation
            const lastSync = localStorage.getItem('lastSync');
            
            setOfflineData({
                publications: publications.length + offlinePublications.length,
                comments: commentsCount,
                reactions: reactionsCount,
                drafts: drafts,
                lastSync: lastSync ? new Date(lastSync).toLocaleString('fr-FR') : null
            });
        } catch (error) {
            console.error('Erreur chargement données hors ligne:', error);
        }
    };

    const loadPendingActions = () => {
        try {
            const actions = JSON.parse(localStorage.getItem('pendingActions')) || [];
            setPendingActions(actions);
        } catch (error) {
            console.error('Erreur chargement actions en attente:', error);
        }
    };

    const checkNetworkStatus = () => {
        setIsOnline(!navigator.onLine);
    };

    const updateNetworkInfo = (connection) => {
        if (connection) {
            setNetworkType(connection.effectiveType || 'unknown');
            setConnectionSpeed(connection.downlink ? `${connection.downlink} Mbps` : null);
        }
    };

    const handleOnline = () => {
        setIsOnline(false);
        showNotification('✅ Connexion rétablie ! Synchronisation en cours...', 'success');
        attemptSync();
    };

    const handleOffline = () => {
        setIsOnline(true);
        showNotification('📶 Connexion perdue. Mode hors ligne activé.', 'warning');
        loadOfflineData();
    };

    const handleServiceWorkerMessage = (event) => {
        const { type, data } = event.data;
        
        switch(type) {
            case 'SYNC_PROGRESS':
                setSyncProgress(data.progress);
                break;
            case 'SYNC_COMPLETE':
                setIsSyncing(false);
                setSyncProgress(100);
                showNotification('✅ Synchronisation terminée !', 'success');
                loadOfflineData();
                loadPendingActions();
                break;
            case 'SYNC_ERROR':
                setIsSyncing(false);
                showNotification(`❌ Erreur de synchronisation: ${data.error}`, 'error');
                break;
            default:
                console.log('Message non géré:', type);
        }
    };

    const attemptSync = async () => {
        setIsSyncing(true);
        setSyncProgress(0);
        
        try {
            // Récupérer les actions en attente
            const actions = JSON.parse(localStorage.getItem('pendingActions')) || [];
            
            if (actions.length === 0) {
                setSyncProgress(100);
                setTimeout(() => {
                    setIsSyncing(false);
                    showNotification('✅ Aucune action en attente', 'success');
                }, 500);
                return;
            }

            // Simuler la progression
            const interval = setInterval(() => {
                setSyncProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(interval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 500);

            // Synchroniser chaque action
            for (let i = 0; i < actions.length; i++) {
                const action = actions[i];
                
                try {
                    switch(action.type) {
                        case 'CREATE_PUBLICATION':
                            await api.post('/publications', action.data);
                            break;
                        case 'CREATE_COMMENT':
                            await api.post(`/publications/${action.publicationId}/comments`, {
                                comment: action.data
                            });
                            break;
                        case 'REACTION':
                            await api.post(`/publications/${action.publicationId}/react`, {
                                reaction: action.reaction
                            });
                            break;
                        default:
                            console.log('Type d\'action inconnu:', action.type);
                    }
                    
                    // Mettre à jour la progression
                    setSyncProgress(Math.round(((i + 1) / actions.length) * 100));
                    
                } catch (error) {
                    console.error(`Erreur synchronisation action ${i}:`, error);
                }
            }

            // Actions synchronisées avec succès
            localStorage.removeItem('pendingActions');
            localStorage.setItem('lastSync', new Date().toISOString());
            
            clearInterval(interval);
            setSyncProgress(100);
            
            setTimeout(() => {
                setIsSyncing(false);
                showNotification('✅ Synchronisation terminée !', 'success');
                loadOfflineData();
                loadPendingActions();
            }, 500);

        } catch (error) {
            console.error('Erreur synchronisation:', error);
            setIsSyncing(false);
            showNotification('❌ Erreur de synchronisation', 'error');
        }
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        setIsChecking(true);
        
        if (navigator.onLine) {
            handleOnline();
        } else {
            setTimeout(() => {
                setIsChecking(false);
                if (!navigator.onLine) {
                    showNotification('📶 Toujours hors ligne. Vérifiez votre connexion.', 'warning');
                }
            }, 3000);
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

    const navigateToHome = () => {
        navigate('/');
    };

    const navigateToPublications = () => {
        navigate('/publications');
    };

    const clearCache = () => {
        if (window.confirm('Voulez-vous vider le cache local ? Les données non synchronisées seront perdues.')) {
            // Vider le cache
            localStorage.removeItem('pendingActions');
            localStorage.removeItem('offlinePublications');
            
            // Recharger les données
            loadOfflineData();
            loadPendingActions();
            
            showNotification('🗑️ Cache vidé avec succès', 'success');
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

            {/* Contenu principal */}
            <Container className={styles.container}>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={8} lg={6} xl={5}>
                        <Card className={styles.offlineCard}>
                            <Card.Body className="p-4 p-md-5 text-center">
                                {/* Logo */}
                                <div className={styles.logoWrapper}>
                                    <div className={styles.iconContainer}>
                                        <FaWifiSlash className={styles.offlineIcon} />
                                    </div>
                                    <h1 className={styles.universityName}>
                                        {universityName}
                                    </h1>
                                </div>

                                {/* Titre */}
                                <h2 className={styles.title}>
                                    <Badge bg="warning" className={styles.statusBadge}>
                                        <FaWifiSlash /> Hors ligne
                                    </Badge>
                                </h2>

                                <p className={styles.message}>
                                    Pas de connexion Internet détectée. 
                                    Voici ce que vous pouvez faire :
                                </p>

                                {/* Fonctionnalités hors ligne */}
                                <Card className={styles.featuresCard}>
                                    <Card.Body>
                                        <ListGroup variant="flush" className={styles.featuresList}>
                                            <ListGroup.Item className={styles.featureItem}>
                                                <FaCloudDownload className={styles.featureIcon} />
                                                <span>Consulter les publications déjà chargées</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className={styles.featureItem}>
                                                <FaCloudDownload className={styles.featureIcon} />
                                                <span>Lire les commentaires disponibles</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className={styles.featureItem}>
                                                <FaCloudUpload className={styles.featureIcon} />
                                                <span>Réagir aux publications (synchronisé après)</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className={styles.featureItem}>
                                                <FaCloudUpload className={styles.featureIcon} />
                                                <span>Modifier votre profil</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className={styles.featureItem}>
                                                <FaCloudUpload className={styles.featureIcon} />
                                                <span>Écrire des commentaires (enregistrés localement)</span>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card.Body>
                                </Card>

                                {/* Données hors ligne */}
                                <Accordion className={styles.dataAccordion}>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                            <FaCloud className="me-2" />
                                            Données disponibles hors ligne
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className={styles.dataStats}>
                                                <div className={styles.statItem}>
                                                    <span className={styles.statLabel}>Publications</span>
                                                    <Badge bg="primary" className={styles.statValue}>
                                                        {offlineData.publications}
                                                    </Badge>
                                                </div>
                                                <div className={styles.statItem}>
                                                    <span className={styles.statLabel}>Commentaires</span>
                                                    <Badge bg="info" className={styles.statValue}>
                                                        {offlineData.comments}
                                                    </Badge>
                                                </div>
                                                <div className={styles.statItem}>
                                                    <span className={styles.statLabel}>Réactions</span>
                                                    <Badge bg="success" className={styles.statValue}>
                                                        {offlineData.reactions}
                                                    </Badge>
                                                </div>
                                                <div className={styles.statItem}>
                                                    <span className={styles.statLabel}>Brouillons</span>
                                                    <Badge bg="warning" className={styles.statValue}>
                                                        {offlineData.drafts}
                                                    </Badge>
                                                </div>
                                                {offlineData.lastSync && (
                                                    <div className={styles.statItem}>
                                                        <span className={styles.statLabel}>Dernière sync</span>
                                                        <Badge bg="secondary" className={styles.statValue}>
                                                            {offlineData.lastSync}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>

                                {/* Actions en attente */}
                                {pendingActions.length > 0 && (
                                    <Alert variant="info" className={styles.pendingAlert}>
                                        <FaCloudUpload className="me-2" />
                                        <strong>{pendingActions.length}</strong> action(s) en attente de synchronisation
                                    </Alert>
                                )}

                                {/* Progression de synchronisation */}
                                {isSyncing && (
                                    <div className={styles.syncProgress}>
                                        <ProgressBar 
                                            now={syncProgress} 
                                            label={`${syncProgress}%`}
                                            variant="success"
                                            className={styles.progressBar}
                                            animated
                                        />
                                        <p className={styles.syncText}>
                                            <FaSync className={styles.syncIcon} />
                                            Synchronisation en cours...
                                        </p>
                                    </div>
                                )}

                                {/* Informations réseau */}
                                {showDetails && (
                                    <Card className={styles.networkInfo}>
                                        <Card.Body>
                                            <h6 className={styles.networkTitle}>
                                                <FaSignal /> Informations réseau
                                            </h6>
                                            <div className={styles.networkDetails}>
                                                <div className={styles.networkItem}>
                                                    <span>État:</span>
                                                    <Badge bg={isOnline ? 'danger' : 'success'}>
                                                        {isOnline ? 'Hors ligne' : 'En ligne'}
                                                    </Badge>
                                                </div>
                                                <div className={styles.networkItem}>
                                                    <span>Type:</span>
                                                    <Badge bg="secondary">{networkType}</Badge>
                                                </div>
                                                {connectionSpeed && (
                                                    <div className={styles.networkItem}>
                                                        <span>Vitesse:</span>
                                                        <Badge bg="secondary">{connectionSpeed}</Badge>
                                                    </div>
                                                )}
                                                <div className={styles.networkItem}>
                                                    <span>Tentatives:</span>
                                                    <Badge bg="secondary">{retryCount}</Badge>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                )}

                                {/* Boutons d'action */}
                                <div className={styles.actionButtons}>
                                    <ButtonGroup vertical className={styles.buttonGroup}>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            onClick={handleRetry}
                                            disabled={isChecking || isSyncing}
                                            className={styles.retryButton}
                                        >
                                            {isChecking ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        className="me-2"
                                                    />
                                                    Vérification...
                                                </>
                                            ) : (
                                                <>
                                                    <FaWifi className="me-2" />
                                                    Réessayer la connexion
                                                </>
                                            )}
                                        </Button>

                                        <Button
                                            variant="outline-primary"
                                            size="lg"
                                            onClick={navigateToPublications}
                                            className={styles.navButton}
                                        >
                                            <FaCloudDownload className="me-2" />
                                            Voir les publications
                                        </Button>

                                        <Button
                                            variant="outline-secondary"
                                            size="lg"
                                            onClick={() => setShowDetails(!showDetails)}
                                            className={styles.detailsButton}
                                        >
                                            <FaSignal className="me-2" />
                                            {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
                                        </Button>

                                        <Button
                                            variant="outline-danger"
                                            size="lg"
                                            onClick={clearCache}
                                            className={styles.cacheButton}
                                        >
                                            <FaTrash className="me-2" />
                                            Vider le cache
                                        </Button>

                                        <Button
                                            variant="outline-success"
                                            size="lg"
                                            onClick={navigateToHome}
                                            className={styles.homeButton}
                                        >
                                            <FaHome className="me-2" />
                                            Retour à l'accueil
                                        </Button>
                                    </ButtonGroup>
                                </div>

                                {/* Message de synchronisation */}
                                <p className={styles.syncMessage}>
                                    <FaCloud className="me-1" />
                                    Les nouvelles données seront synchronisées automatiquement 
                                    lorsque vous serez de nouveau en ligne.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Offline;