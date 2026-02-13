import React, { useState, useEffect } from 'react';
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
    FaMapMarkerAlt
} from 'react-icons/fa';
import { MdEmail, MdPhone, MdSchool, MdWarning, MdClose, MdMenu } from 'react-icons/md';
import { BsPersonBadge, BsPersonVcard, BsThreeDotsVertical } from 'react-icons/bs';
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
import styles from './Publication.module.css';

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

const Publication = () => {
    const navigate = useNavigate();
    
    // États
    const [currentUser, setCurrentUser] = useState({
        id: "ETU000",
        name: "LaurenDa M.",
        avatar: "LM",
        role: "Étudiante",
        email: "laurenda.m@universite.cm"
    });

    const [publications, setPublications] = useState([]);
    const [filteredPublications, setFilteredPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notification, setNotification] = useState(null);
    
    // États pour les modals
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentPublication, setCurrentPublication] = useState(null);
    const [newComment, setNewComment] = useState('');
    
    // États pour les commentaires
    const [comments, setComments] = useState({});
    const [commentReactions, setCommentReactions] = useState({});
    
    // États pour les filtres
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [searchTerm, setSearchTerm] = useState('');
    
    // États pour les toasts
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('info');

    // Effets
    useEffect(() => {
        loadUserData();
        loadPublications();

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

        // Gestionnaire de touche Echap
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (showCommentsModal) setShowCommentsModal(false);
                if (showLightbox) setShowLightbox(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        filterAndSortPublications();
    }, [publications, filterType, sortBy, searchTerm]);

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

    const loadPublications = async () => {
        setLoading(true);
        try {
            // Essayer de charger depuis l'API
            const response = await api.get('/publications');
            if (response.data.success) {
                setPublications(response.data.publications);
            }
        } catch (error) {
            console.error('Erreur chargement publications:', error);
            
            // Fallback: charger depuis localStorage ou données mock
            const localPublications = JSON.parse(localStorage.getItem('publications')) || [];
            if (localPublications.length > 0) {
                setPublications(localPublications);
            } else {
                // Données mockées
                setPublications(mockPublications);
            }
            
            showNotification('📱 Mode hors-ligne : chargement des publications locales', 'warning');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortPublications = () => {
        let filtered = [...publications];

        // Filtre par type
        if (filterType !== 'all') {
            filtered = filtered.filter(p => {
                if (filterType === 'urgent') return p.urgent;
                if (filterType === 'teacher') return p.authorRole === 'Enseignant';
                if (filterType === 'admin') return p.authorRole === 'Administration';
                if (filterType === 'student') return p.authorRole === 'Étudiant';
                return true;
            });
        }

        // Recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                p.content.toLowerCase().includes(term) ||
                p.author.toLowerCase().includes(term) ||
                p.authorRole.toLowerCase().includes(term)
            );
        }

        // Tri
        filtered.sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(b.date) - new Date(a.date);
            }
            if (sortBy === 'popular') {
                return (b.likes + b.comments) - (a.likes + a.comments);
            }
            if (sortBy === 'likes') {
                return b.likes - a.likes;
            }
            return 0;
        });

        setFilteredPublications(filtered);
    };

    const handleReaction = async (publicationId, reactionType) => {
        try {
            const updatedPublications = publications.map(pub => {
                if (pub.id === publicationId) {
                    const newPub = { ...pub };
                    
                    // Annuler la réaction si c'est la même
                    if (pub.userReaction === reactionType) {
                        newPub[reactionType === 'like' ? 'likes' : 'dislikes']--;
                        newPub.userReaction = null;
                        showNotification(`Réaction retirée`, 'info');
                    } else {
                        // Supprimer l'ancienne réaction
                        if (pub.userReaction) {
                            newPub[pub.userReaction === 'like' ? 'likes' : 'dislikes']--;
                        }
                        // Ajouter la nouvelle
                        newPub[reactionType === 'like' ? 'likes' : 'dislikes']++;
                        newPub.userReaction = reactionType;
                        showNotification(`Vous avez ${reactionType === 'like' ? 'aimé' : 'disliké'} cette publication`, 'success');
                    }
                    
                    return newPub;
                }
                return pub;
            });

            setPublications(updatedPublications);
            
            // Sauvegarder dans localStorage
            localStorage.setItem('publications', JSON.stringify(updatedPublications));

            // Envoyer à l'API
            await api.post(`/publications/${publicationId}/react`, {
                reaction: reactionType
            });

        } catch (error) {
            console.error('Erreur réaction:', error);
            showNotification('❌ Erreur lors de la réaction', 'error');
        }
    };

    const handleCommentReaction = (publicationId, commentId, reactionType) => {
        setPublications(prev => prev.map(pub => {
            if (pub.id === publicationId) {
                const updatedComments = pub.commentsData.map(comment => {
                    if (comment.id === commentId) {
                        const newComment = { ...comment };
                        
                        if (comment.userReaction === reactionType) {
                            newComment[reactionType === 'like' ? 'likes' : 'dislikes']--;
                            newComment.userReaction = null;
                        } else {
                            if (comment.userReaction) {
                                newComment[comment.userReaction === 'like' ? 'likes' : 'dislikes']--;
                            }
                            newComment[reactionType === 'like' ? 'likes' : 'dislikes']++;
                            newComment.userReaction = reactionType;
                        }
                        
                        return newComment;
                    }
                    return comment;
                });
                
                return { ...pub, commentsData: updatedComments };
            }
            return pub;
        }));
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !currentPublication) return;

        try {
            const comment = {
                id: Date.now(),
                author: currentUser.name,
                avatar: currentUser.avatar,
                role: currentUser.role,
                text: newComment,
                date: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                userReaction: null
            };

            const updatedPublications = publications.map(pub => {
                if (pub.id === currentPublication.id) {
                    return {
                        ...pub,
                        commentsData: [comment, ...pub.commentsData],
                        comments: (pub.comments || 0) + 1
                    };
                }
                return pub;
            });

            setPublications(updatedPublications);
            setNewComment('');
            
            // Sauvegarder dans localStorage
            localStorage.setItem('publications', JSON.stringify(updatedPublications));

            // Envoyer à l'API
            await api.post(`/publications/${currentPublication.id}/comments`, {
                comment: newComment
            });

            showNotification('✅ Commentaire ajouté !', 'success');

            // Fermer le modal après 2 secondes
            setTimeout(() => {
                setShowCommentsModal(false);
                setCurrentPublication(null);
            }, 2000);

        } catch (error) {
            console.error('Erreur ajout commentaire:', error);
            showNotification('❌ Erreur lors de l\'ajout du commentaire', 'error');
        }
    };

    const openComments = (publication) => {
        setCurrentPublication(publication);
        setShowCommentsModal(true);
    };

    const openLightbox = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowLightbox(true);
    };

    const handleDownload = (fileName) => {
        showNotification(`📥 Téléchargement de "${fileName}" démarré`, 'success');
        
        // Simuler un suivi de téléchargement
        console.log(`Fichier téléchargé: ${fileName} - Utilisateur: ${currentUser.name}`);
    };

    const showNotification = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const getAvatarClass = (role) => {
        switch(role) {
            case 'Administration': return styles.avatarAdmin;
            case 'Enseignant': return styles.avatarTeacher;
            default: return styles.avatarStudent;
        }
    };

    const getCommentAvatarClass = (role) => {
        switch(role) {
            case 'Administration': return styles.commentAvatarAdmin;
            case 'Enseignant': return styles.commentAvatarTeacher;
            default: return styles.commentAvatarStudent;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours} h`;
        if (diffDays === 1) return 'Hier';
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        return date.toLocaleDateString('fr-FR');
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
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
                            <Nav.Link as={Link} to="/profil" className={styles.navLink}>
                                <FaUserCircle /> Profil
                            </Nav.Link>
                            <Nav.Link as={Link} to="/publications" className={`${styles.navLink} ${styles.active}`}>
                                <FaBell /> Publications
                            </Nav.Link>
                            <Nav.Link as={Link} to="/parametres" className={styles.navLink}>
                                <FaCog /> Paramètres
                            </Nav.Link>
                        </Nav>

                        <Dropdown align="end">
                            <Dropdown.Toggle as="div" className={styles.userMenu}>
                                <div className={styles.userAvatar}>
                                    {currentUser.avatar}
                                </div>
                                <div className={styles.userInfo}>
                                    <div className={styles.userName}>{currentUser.name}</div>
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
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => navigate('/login')}>
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
                        {/* Message informatif pour étudiants */}
                        {currentUser.role === 'Étudiante' && (
                            <Alert variant="info" className={styles.infoMessage}>
                                <FaInfoCircle className="me-2" />
                                <Alert.Heading as="h2" className={styles.infoTitle}>
                                    📢 Publications du Campus
                                </Alert.Heading>
                                <p>
                                    Les publications sont réservées aux enseignants et à l'administration. 
                                    En tant qu'étudiant, vous pouvez consulter, réagir et commenter les publications.
                                </p>
                            </Alert>
                        )}

                        {/* Barre de recherche et filtres */}
                        <Card className={styles.filterCard}>
                            <Card.Body>
                                <Row>
                                    <Col md={6}>
                                        <InputGroup className={styles.searchInput}>
                                            <InputGroup.Text>
                                                <FaSearch />
                                            </InputGroup.Text>
                                            <Form.Control
                                                placeholder="Rechercher une publication..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </InputGroup>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Select 
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className={styles.filterSelect}
                                        >
                                            <option value="all">Toutes</option>
                                            <option value="urgent">Urgentes</option>
                                            <option value="teacher">Enseignants</option>
                                            <option value="admin">Administration</option>
                                            <option value="student">Étudiants</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Select 
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className={styles.filterSelect}
                                        >
                                            <option value="recent">Plus récentes</option>
                                            <option value="popular">Plus populaires</option>
                                            <option value="likes">Plus aimées</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Liste des publications */}
                        {loading ? (
                            <div className={styles.loadingContainer}>
                                <Spinner animation="border" variant="primary" />
                                <p>Chargement des publications...</p>
                            </div>
                        ) : filteredPublications.length === 0 ? (
                            <Card className={styles.emptyState}>
                                <Card.Body className="text-center">
                                    <FaBell className={styles.emptyIcon} />
                                    <h3>Aucune publication</h3>
                                    <p>Aucune publication ne correspond à vos critères</p>
                                </Card.Body>
                            </Card>
                        ) : (
                            <div className={styles.publicationsList}>
                                {filteredPublications.map((post) => (
                                    <Card key={post.id} className={styles.publicationCard}>
                                        <Card.Body>
                                            {/* En-tête de la publication */}
                                            <div className={styles.publisherInfo}>
                                                <div className={`${styles.publisherAvatar} ${getAvatarClass(post.authorRole)}`}>
                                                    {post.authorAvatar}
                                                </div>
                                                <div className={styles.publisherDetails}>
                                                    <div className={styles.publisherName}>
                                                        {post.author}
                                                        {post.urgent && (
                                                            <Badge bg="danger" className={styles.urgentBadge}>
                                                                <FaExclamationTriangle /> URGENT
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className={styles.publisherMeta}>
                                                        <span className={styles.publisherRole}>{post.authorRole}</span>
                                                        <span className={styles.publisherDate}>
                                                            <FaClock /> {formatDate(post.date)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contenu */}
                                            <div className={styles.publicationContent}>
                                                {post.content.split('\n').map((line, i) => (
                                                    <p key={i}>{line}</p>
                                                ))}
                                            </div>

                                            {/* Pièces jointes */}
                                            {post.attachments?.length > 0 && (
                                                <div className={styles.attachmentsSection}>
                                                    <div className={styles.attachmentsTitle}>
                                                        <FaPaperclip /> Pièces jointes ({post.attachments.length})
                                                    </div>
                                                    <div className={styles.attachmentsGrid}>
                                                        {post.attachments.map((attachment, index) => (
                                                            <a
                                                                key={index}
                                                                href={attachment.url}
                                                                className={styles.attachmentItem}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={() => handleDownload(attachment.name)}
                                                            >
                                                                <div className={`${styles.attachmentIcon} ${styles[attachment.type + 'Icon']}`}>
                                                                    {attachment.type === 'pdf' && <FaFilePdf />}
                                                                    {attachment.type === 'image' && <FaFileImage />}
                                                                    {attachment.type !== 'pdf' && attachment.type !== 'image' && <FaFileAlt />}
                                                                </div>
                                                                <div className={styles.attachmentInfo}>
                                                                    <div className={styles.attachmentName}>
                                                                        {attachment.name}
                                                                    </div>
                                                                    <div className={styles.attachmentMeta}>
                                                                        <span>{formatFileSize(attachment.size)}</span>
                                                                        <span>• {attachment.type.toUpperCase()}</span>
                                                                    </div>
                                                                </div>
                                                                <Button variant="link" className={styles.downloadButton}>
                                                                    <FaDownload />
                                                                </Button>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Images */}
                                            {post.images?.length > 0 && (
                                                <div className={styles.imagesSection}>
                                                    {post.images.map((image, index) => (
                                                        <div
                                                            key={index}
                                                            className={styles.imagePreview}
                                                            onClick={() => openLightbox(image.url)}
                                                        >
                                                            <Image src={image.url} alt={image.caption} fluid />
                                                            {image.caption && (
                                                                <div className={styles.imageCaption}>
                                                                    {image.caption}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Statistiques */}
                                            <div className={styles.publicationStats}>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>{post.likes} personnes aiment</Tooltip>}
                                                >
                                                    <span className={styles.statItem}>
                                                        <FaThumbsUp /> {post.likes}
                                                    </span>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>{post.dislikes} personnes n'aiment pas</Tooltip>}
                                                >
                                                    <span className={styles.statItem}>
                                                        <FaThumbsDown /> {post.dislikes}
                                                    </span>
                                                </OverlayTrigger>
                                                <OverlayTrigger
                                                    placement="top"
                                                    overlay={<Tooltip>{post.comments} commentaires</Tooltip>}
                                                >
                                                    <span className={styles.statItem}>
                                                        <FaComments /> {post.comments}
                                                    </span>
                                                </OverlayTrigger>
                                                {post.attachments?.length > 0 && (
                                                    <OverlayTrigger
                                                        placement="top"
                                                        overlay={<Tooltip>{post.attachments.length} pièces jointes</Tooltip>}
                                                    >
                                                        <span className={styles.statItem}>
                                                            <FaPaperclip /> {post.attachments.length}
                                                        </span>
                                                    </OverlayTrigger>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className={styles.publicationActions}>
                                                <Button
                                                    variant="link"
                                                    className={`${styles.actionButton} ${post.userReaction === 'like' ? styles.activeLike : ''}`}
                                                    onClick={() => handleReaction(post.id, 'like')}
                                                >
                                                    {post.userReaction === 'like' ? <FaThumbsUp /> : <FaRegThumbsUp />}
                                                    <span>J'aime</span>
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className={`${styles.actionButton} ${post.userReaction === 'dislike' ? styles.activeDislike : ''}`}
                                                    onClick={() => handleReaction(post.id, 'dislike')}
                                                >
                                                    {post.userReaction === 'dislike' ? <FaThumbsDown /> : <FaRegThumbsDown />}
                                                    <span>Je n'aime pas</span>
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className={styles.actionButton}
                                                    onClick={() => openComments(post)}
                                                >
                                                    <FaRegComments />
                                                    <span>Commenter</span>
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>

            {/* Modal des commentaires */}
            <Modal
                show={showCommentsModal}
                onHide={() => {
                    setShowCommentsModal(false);
                    setCurrentPublication(null);
                    setNewComment('');
                }}
                centered
                size="lg"
                className={styles.commentsModal}
            >
                <Modal.Header closeButton className={styles.modalHeader}>
                    <Modal.Title>
                        <FaComments /> Commentaires
                        {currentPublication && (
                            <Badge bg="secondary" className="ms-2">
                                {currentPublication.comments}
                            </Badge>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    {/* Formulaire de commentaire */}
                    <div className={styles.commentForm}>
                        <div className={styles.commentAvatar}>
                            {currentUser.avatar}
                        </div>
                        <div className={styles.commentInputContainer}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Écrivez votre commentaire..."
                                className={styles.commentInput}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddComment();
                                    }
                                }}
                            />
                            <Button
                                variant="success"
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className={styles.commentSubmit}
                            >
                                Commenter
                            </Button>
                        </div>
                    </div>

                    {/* Liste des commentaires */}
                    <div className={styles.commentsList}>
                        {currentPublication?.commentsData?.length === 0 ? (
                            <div className={styles.emptyComments}>
                                <FaRegComments className={styles.emptyIcon} />
                                <p>Aucun commentaire</p>
                                <small>Soyez le premier à commenter</small>
                            </div>
                        ) : (
                            currentPublication?.commentsData?.map((comment) => (
                                <div key={comment.id} className={styles.commentItem}>
                                    <div className={`${styles.commentAvatar} ${getCommentAvatarClass(comment.role)}`}>
                                        {comment.avatar}
                                    </div>
                                    <div className={styles.commentContent}>
                                        <div className={styles.commentHeader}>
                                            <div className={styles.commentAuthor}>
                                                {comment.author}
                                                <Badge bg="secondary" className={styles.commentRole}>
                                                    {comment.role}
                                                </Badge>
                                            </div>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>{new Date(comment.date).toLocaleString('fr-FR')}</Tooltip>}
                                            >
                                                <span className={styles.commentDate}>
                                                    <FaClock /> {formatDate(comment.date)}
                                                </span>
                                            </OverlayTrigger>
                                        </div>
                                        <div className={styles.commentText}>
                                            {comment.text}
                                        </div>
                                        <div className={styles.commentActions}>
                                            <Button
                                                variant="link"
                                                className={`${styles.commentAction} ${comment.userReaction === 'like' ? styles.activeLike : ''}`}
                                                onClick={() => handleCommentReaction(currentPublication.id, comment.id, 'like')}
                                            >
                                                {comment.userReaction === 'like' ? <FaThumbsUp /> : <FaRegThumbsUp />}
                                                <span>{comment.likes}</span>
                                            </Button>
                                            <Button
                                                variant="link"
                                                className={`${styles.commentAction} ${comment.userReaction === 'dislike' ? styles.activeDislike : ''}`}
                                                onClick={() => handleCommentReaction(currentPublication.id, comment.id, 'dislike')}
                                            >
                                                {comment.userReaction === 'dislike' ? <FaThumbsDown /> : <FaRegThumbsDown />}
                                                <span>{comment.dislikes}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Modal.Body>
            </Modal>

            {/* Lightbox pour les images */}
            <Modal
                show={showLightbox}
                onHide={() => setShowLightbox(false)}
                centered
                size="xl"
                className={styles.lightboxModal}
                contentClassName={styles.lightboxContent}
            >
                <Modal.Body className={styles.lightboxBody}>
                    <Button
                        variant="link"
                        className={styles.lightboxClose}
                        onClick={() => setShowLightbox(false)}
                    >
                        <FaTimes />
                    </Button>
                    {selectedImage && (
                        <Image
                            src={selectedImage}
                            alt=""
                            className={styles.lightboxImage}
                            fluid
                        />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

// Données mockées
const mockPublications = [
    {
        id: 1,
        author: "Dr. Ngo Bassong",
        authorAvatar: "NB",
        authorRole: "Enseignant",
        content: "📚 Supports de cours pour la semaine 15\n\nJe partage avec vous les supports de cours pour la semaine prochaine. Veuillez télécharger les documents suivants avant le prochain cours.\n\n• Algorithmique Avancée - Chapitre 4\n• Exercices d'application\n• Corrigés des TP précédents",
        date: new Date(Date.now() - 30 * 60000).toISOString(),
        likes: 12,
        dislikes: 0,
        comments: 3,
        userReaction: null,
        urgent: true,
        attachments: [
            {
                type: "pdf",
                name: "Algorithmique_Avancee_Chap4.pdf",
                size: 4.2 * 1024 * 1024,
                icon: "📕",
                url: "#"
            },
            {
                type: "pdf", 
                name: "Exercices_Application_Semaine15.pdf",
                size: 2.8 * 1024 * 1024,
                icon: "📘",
                url: "#"
            }
        ],
        images: [],
        commentsData: [
            {
                id: 1,
                author: "Marie Tanga",
                avatar: "MT",
                role: "Étudiante",
                text: "Merci pour les documents ! Est-ce qu'il y aura un QCM cette semaine ?",
                date: new Date(Date.now() - 25 * 60000).toISOString(),
                likes: 2,
                dislikes: 0,
                userReaction: null
            },
            {
                id: 2,
                author: "Luc Ndongo",
                avatar: "LN",
                role: "Étudiant", 
                text: "Les exercices semblent intéressants, j'ai hâte de les tester !",
                date: new Date(Date.now() - 20 * 60000).toISOString(),
                likes: 1,
                dislikes: 0,
                userReaction: null
            }
        ]
    },
    {
        id: 2,
        author: "Prof. Sarah Johnson",
        authorAvatar: "SJ",
        authorRole: "Enseignant",
        content: "🏆 Photo du gagnant du concours d'algorithmique\n\nFélicitations à Thomas Mbala qui a remporté le concours d'algorithmique organisé cette semaine !",
        date: new Date(Date.now() - 2 * 3600000).toISOString(),
        likes: 28,
        dislikes: 0,
        comments: 7,
        userReaction: "like",
        urgent: false,
        attachments: [],
        images: [
            {
                url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
                caption: "Thomas Mbala recevant son prix pour le concours d'algorithmique"
            }
        ],
        commentsData: [
            {
                id: 1,
                author: "Thomas Mbala",
                avatar: "TM",
                role: "Étudiant",
                text: "Merci beaucoup professeur ! C'était un vrai défi, j'ai beaucoup appris.",
                date: new Date(Date.now() - 1 * 3600000).toISOString(),
                likes: 5,
                dislikes: 0,
                userReaction: null
            }
        ]
    },
    {
        id: 3,
        author: "Administration",
        authorAvatar: "AD",
        authorRole: "Administration",
        content: "📋 Informations importantes pour les examens de fin de semestre\n\n• Dates des examens : 15-20 décembre\n• Salles attribuées : consulter le PDF\n• Matériel autorisé : calculatrice scientifique uniquement\n• Pièce d'identité obligatoire",
        date: new Date(Date.now() - 24 * 3600000).toISOString(),
        likes: 42,
        dislikes: 5,
        comments: 12,
        userReaction: null,
        urgent: false,
        attachments: [
            {
                type: "pdf",
                name: "Planning_Examens_Decembre.pdf",
                size: 1.8 * 1024 * 1024,
                icon: "📅",
                url: "#"
            }
        ],
        images: [],
        commentsData: [
            {
                id: 1,
                author: "Jean Dupont",
                avatar: "JD",
                role: "Étudiant",
                text: "Est-ce que les salles seront chauffées ? Il fait très froid en ce moment.",
                date: new Date(Date.now() - 23 * 3600000).toISOString(),
                likes: 8,
                dislikes: 0,
                userReaction: null
            }
        ]
    }
];

export default Publication;