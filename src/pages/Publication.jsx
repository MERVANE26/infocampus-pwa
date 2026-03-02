import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
    FaBell,
    FaExclamationTriangle,
    FaInfoCircle,
    FaPaperclip,
    FaFilePdf,
    FaFileImage,
    FaFileAlt,
    FaThumbsUp,
    FaThumbsDown,
    FaDownload,
    FaSearch,
    FaClock,
    FaArrowLeft,
    FaArrowRight,
    FaComments,
    FaShare,
    FaEllipsisH
} from 'react-icons/fa';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
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
import Image from 'react-bootstrap/Image';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import styles from './Publication.module.css';
import AppNavbar from '../composants/AppNavbar';
import { api } from '../lib/api';


const Publication = () => {
    const navigate = useNavigate();
    
    // États
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || {
        id: "ETU000",
        name: "LaurenDa M.",
        avatar: "LM",
        role: "Étudiante",
        email: "laurenda.m@universite.cm"
    });

    const [publications, setPublications] = useState([]);
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
    
    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        total: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });
    
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

    // Trigger API reload when filters change
    useEffect(() => {
        setCurrentPage(1);
        loadPublications(1);
    }, [filterType, sortBy]);

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

    const loadPublications = async (pageNum = 1) => {
        setLoading(true);
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            
            // Build query parameters based on filters
            const params = new URLSearchParams();
            
            // Add pagination
            params.append('page', pageNum);
            params.append('limit', pageSize);
            
            // Add current user's university
            if (user && (user.studentUniversityId || user.teacherUniversitiesIds[0])) {
                params.append('universityId', user.studentUniversityId);
            }
            
            // Map filterType to API parameters
            if (filterType === 'urgent') {
                params.append('urgent', 'true');
            } else if (filterType === 'teacher') {
                params.append('authorRole', 'teacher');
            } else if (filterType === 'admin') {
                params.append('authorRole', 'admin');
            } else if (filterType === 'student') {
                params.append('targetType', 'student');
            }
            
            // Map sortBy to API parameter
            let sortParam = '-createdAt'; // default: most recent
            if (sortBy === 'popular') {
                sortParam = '-likes'; // backend can't calculate popularity, use likes as proxy
            } else if (sortBy === 'likes') {
                sortParam = '-likes';
            } else if (sortBy === 'recent') {
                sortParam = '-createdAt';
            }
            params.append('sortBy', sortParam);
            
            // Fetch from API
            const response = await api.get(`/posts/all?${params.toString()}`);
            
            if (response.data.success) {
                setPublications(response.data.data || []);
                setPagination(response.data.pagination || {
                    currentPage: pageNum,
                    totalPages: 1,
                    limit: pageSize,
                    total: 0,
                    hasNextPage: false,
                    hasPrevPage: false,
                });
                setCurrentPage(pageNum);
            } else {
                throw new Error('API returned success: false');
            }
        } catch (error) {
            console.error('Erreur chargement publications:', error);
            
            // Fallback to localStorage
            const localPublications = JSON.parse(localStorage.getItem('publications')) || [];
            if (localPublications.length > 0) {
                setPublications(localPublications);
            }
            
            showNotification('📱 Mode hors-ligne : chargement des publications locales', 'warning');
        } finally {
            setLoading(false);
        }
    };


    const handleReaction = async (postId, reactionType) => {
        try {
            const updatedPublications = publications.map(pub => {
                if (pub._id === postId) {
                    const newPub = { ...pub };
                    
                    // Check if user already reacted
                    const userReactedWith = pub.userReactions?.find(r => r.userId === (currentUser._id || currentUser.id))?. reaction;
                    
                    if (userReactedWith === reactionType) {
                        // Toggle off: remove the reaction
                        newPub.userReaction = null;
                        newPub.userReactions = newPub.userReactions?.filter(r => r.userId !== (currentUser._id || currentUser.id)) || [];
                        newPub[reactionType === 'like' ? 'likes' : 'dislikes']--;
                        showNotification(`Réaction retirée`, 'info');
                    } else {
                        // Toggle on with new reaction
                        // Remove old reaction if exists
                        if (userReactedWith) {
                            newPub[userReactedWith === 'like' ? 'likes' : 'dislikes']--;
                            newPub.userReactions = newPub.userReactions?.filter(r => r.userId !== (currentUser._id || currentUser.id)) || [];
                        }
                        // Add new reaction
                        newPub[reactionType === 'like' ? 'likes' : 'dislikes']++;
                        newPub.userReaction = reactionType;
                        newPub.userReactions = newPub.userReactions || [];
                        newPub.userReactions.push({
                            userId: currentUser._id || currentUser.id,
                            reaction: reactionType
                        });
                        showNotification(`Vous avez ${reactionType === 'like' ? 'aimé' : 'disliké'} cette publication`, 'success');
                    }
                    
                    return newPub;
                }
                return pub;
            });

            setPublications(updatedPublications);
            localStorage.setItem('publications', JSON.stringify(updatedPublications));

              const config = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                };

            // Send to API
            await api.patch(`/posts/${postId}/react`, {
                reaction: reactionType,
                userId: currentUser._id || currentUser.id
            }, config);

        } catch (error) {
            console.error('Erreur réaction:', error.response.data.message || error.message);
            showNotification('❌ Erreur lors de la réaction', 'error');
        }
    };

    const handleCommentReaction = async (postId, commentId, reactionType) => {
        setPublications(prev => prev.map(pub => {
            if (pub._id === postId) {
                const updatedComments = pub.commentsData?.map(comment => {
                    if (comment._id === commentId) {
                        const newComment = { ...comment };
                        const userReactedWith = comment.userReactions?.find(r => r.userId === (currentUser._id || currentUser.id))?. reaction;

                        if (userReactedWith === reactionType) {
                            // Toggle off
                            newComment.userReaction = null;
                            newComment.userReactions = newComment.userReactions?.filter(r => r.userId !== (currentUser._id || currentUser.id)) || [];
                            newComment[reactionType === 'like' ? 'likes' : 'dislikes']--;
                        } else {
                            // Toggle on with change
                            if (userReactedWith) {
                                newComment[userReactedWith === 'like' ? 'likes' : 'dislikes']--;
                                newComment.userReactions = newComment.userReactions?.filter(r => r.userId !== (currentUser._id || currentUser.id)) || [];
                            }
                            newComment[reactionType === 'like' ? 'likes' : 'dislikes']++;
                            newComment.userReaction = reactionType;
                            newComment.userReactions = newComment.userReactions || [];
                            newComment.userReactions.push({
                                userId: currentUser._id || currentUser.id,
                                reaction: reactionType
                            });
                        }
                        
                        return newComment;
                    }
                    return comment;
                }) || [];
                
                return { ...pub, commentsData: updatedComments };
            }
            return pub;
        }));

         const config = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                };

        // send to API after optimistic update
        try {
            await api.patch(`/posts/${postId}/comment/${commentId}/react`, {
                reaction: reactionType,
                userId: currentUser._id || currentUser.id
            }, config);
        } catch (err) {
            console.error('Erreur réaction commentaire:', err);
            showNotification('❌ Erreur lors de la réaction au commentaire', 'error');
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !currentPublication) return;

        try {
            const comment = {
                _id: Date.now().toString(),
                authorName: currentUser.firstName + ' ' + currentUser.lastName,
                authorAvatar: currentUser.avatar,
                authorRole: Array.isArray(currentUser.roles) ? currentUser.roles[0] : currentUser.role,
                text: newComment,
                createdAt: new Date().toISOString(),
                likes: 0,
                dislikes: 0,
                authorId: currentUser._id || currentUser.id,
                userReactions: [],
                userReaction: null
            };

            const updatedPublications = publications.map(pub => {
                if (pub._id === currentPublication._id) {
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

             const config = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                };

            // Envoyer à l'API
            const response = await api.post(`/posts/${currentPublication._id}/comment`, {
                text: newComment,
                authorId: currentUser._id || currentUser.id
            }, config);

            // Update comment._id from API response if available
            if (response?.data?._id) {
                comment._id = response.data._id;
                const finalUpdatedPublications = publications.map(pub => {
                    if (pub._id === currentPublication._id) {
                        return {
                            ...pub,
                            commentsData: pub.commentsData.map(c => c._id === comment._id ? comment : c)
                        };
                    }
                    return pub;
                });
                setPublications(finalUpdatedPublications);
                localStorage.setItem('publications', JSON.stringify(finalUpdatedPublications));
            }

            showNotification('✅ Commentaire ajouté !', 'success');

            // Fermer le modal après 2 secondes
            setTimeout(() => {
                setShowCommentsModal(false);
                setCurrentPublication(null);
            }, 2000);

        } catch (error) {
            console.error('Erreur ajout commentaire:', error);
            showNotification('❌ Erreur lors de l\'ajout du commentaire', 'error');
            // optionally queue the comment for later sync
        }
    };

    const openComments = (publication) => {
        setCurrentPublication(publication);
        setShowCommentsModal(true);
    };

    const showNotification = (message, type = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
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
            {/* Toast Notification */}
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

            {/* Navigation */}
            <AppNavbar currentUser={currentUser} />

            {/* Main Feed */}
            <Container fluid className={styles.mainContent}>
                <Row className="justify-content-center">
                    {/* Feed Column */}
                    <Col lg={6} md={8} xs={12} className={styles.feedColumn}>
                        {/* Search & Filters */}
                        <Card className={styles.filterCard}>
                            <Card.Body className="p-3">
                                <InputGroup className="mb-3" size="sm">
                                    <InputGroup.Text className={styles.searchIcon}>
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Rechercher une publication..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={styles.searchInput}
                                    />
                                </InputGroup>

                                <Row className="g-2">
                                    <Col xs={6} sm={4}>
                                        <Form.Select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            size="sm"
                                        >
                                            <option value="all">Tous</option>
                                            <option value="urgent">Urgent</option>
                                            <option value="teacher">Enseignants</option>
                                            <option value="admin">Admin</option>
                                        </Form.Select>
                                    </Col>
                                    <Col xs={6} sm={4}>
                                        <Form.Select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            size="sm"
                                        >
                                            <option value="recent">Plus récent</option>
                                            <option value="popular">Populaire</option>
                                            <option value="likes">Plus aimé</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Loading State */}
                        {loading && (
                            <div className={styles.centerContent}>
                                <Spinner animation="border" variant="primary" />
                            </div>
                        )}

                        {/* Publications Feed */}
                        {!loading && publications.length === 0 ? (
                            <Card className={styles.emptyState}>
                                <Card.Body className="text-center py-5">
                                    <FaBell size={32} className="text-muted mb-3" />
                                    <p className="text-muted">Aucune publication</p>
                                </Card.Body>
                            </Card>
                        ) : (
                            <div className={styles.feedList}>
                                {publications.map((post) => (
                                    <Card key={post._id} className={styles.postCard}>
                                        {/* Post Header */}
                                        <Card.Body className={styles.postHeader}>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div className="d-flex align-items-center gap-2 flex-grow-1">
                                                    <div className={styles.postAvatar}>
                                                        {post.authorAvatar || post.authorName?.charAt(0)}
                                                    </div>
                                                    <div className={styles.authorInfo}>
                                                        <h6 className={styles.authorName}>
                                                            {post.authorName}
                                                            {post.urgent && (
                                                                <Badge bg="danger" className={styles.urgentBadge}>
                                                                    <FaExclamationTriangle /> URGENT
                                                                </Badge>
                                                            )}
                                                        </h6>
                                                        <small className="text-muted">
                                                            <FaClock size={12} className="me-1" />
                                                            {formatDate(post.updatedAt)}
                                                        </small>
                                                    </div>
                                                </div>
                                                <Button variant="link" size="sm" className={styles.moreBtn}>
                                                    <FaEllipsisH />
                                                </Button>
                                            </div>
                                        </Card.Body>

                                        {/* Post Content */}
                                        <Card.Body className={styles.postContent}>
                                            <p>{post.content}</p>

                                            {/* Attachments */}
                                            {post.attachments?.length > 0 && (
                                                <div className={styles.attachmentsPreview}>
                                                    {post.attachments.map((file, idx) => (
                                                        <div key={idx} className={styles.attachmentItem}>
                                                            <span className={styles.fileIcon}>
                                                                {file.type === 'pdf' && <FaFilePdf />}
                                                                {file.type === 'image' && <FaFileImage />}
                                                                {['pdf', 'image'].indexOf(file.type) === -1 && <FaFileAlt />}
                                                            </span>
                                                            <span className={styles.fileName}>{file.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Images */}
                                            {post.images?.length > 0 && (
                                                <div className={styles.imagesGrid}>
                                                    {post.images.map((img, idx) => (
                                                        <div key={idx} className={styles.imageItem}>
                                                            <img src={img.url} alt={img.caption} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </Card.Body>

                                        {/* Stats */}
                                        <div className={styles.postStats}>
                                            <span><FaThumbsUp size={12} /> {post.likes}</span>
                                            <span><FaComments size={12} /> {post.comments}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className={styles.postActions}>
                                            <Button
                                                variant="link"
                                                className={`${styles.actionBtn} ${post.userReaction === 'like' ? styles.active : ''}`}
                                                onClick={() => handleReaction(post._id, 'like')}
                                            >
                                                {post.userReaction === 'like' ? (
                                                    <MdFavorite className={styles.iconActive} />
                                                ) : (
                                                    <MdFavoriteBorder />
                                                )}
                                                <span>J'aime</span>
                                            </Button>
                                            <Button
                                                variant="link"
                                                className={styles.actionBtn}
                                                onClick={() => openComments(post)}
                                            >
                                                <FaComments />
                                                <span>Commenter</span>
                                            </Button>
                                            <Button variant="link" className={styles.actionBtn}>
                                                <FaShare />
                                                <span>Partager</span>
                                            </Button>
                                        </div>

                                        {/* Comments Modal Trigger */}
                                        {showCommentsModal && currentPublication?._id === post._id && (
                                            <div className={styles.commentsPreview}>
                                                <small className="text-muted d-block mb-2">
                                                    {post.comments} commentaires
                                                </small>
                                            </div>
                                        )}
                                    </Card>
                                ))}

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className={styles.paginationContainer}>
                                        <ButtonGroup>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                disabled={!pagination.hasPrevPage || loading}
                                                onClick={() => loadPublications(pagination.currentPage - 1)}
                                            >
                                                <FaArrowLeft /> Précédent
                                            </Button>
                                            <Button variant="outline-secondary" disabled size="sm">
                                                {pagination.currentPage} / {pagination.totalPages}
                                            </Button>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                disabled={!pagination.hasNextPage || loading}
                                                onClick={() => loadPublications(pagination.currentPage + 1)}
                                            >
                                                Suivant <FaArrowRight />
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                )}
                            </div>
                        )}
                    </Col>

                    {/* Sidebar */}
                    <Col lg={3} className={`d-none d-lg-block ${styles.sidebar}`}>
                        {/* User Info Card */}
                        <Card className={styles.userCard}>
                            <Card.Body className="text-center">
                                <div className={styles.largeAvatar}>
                                    {currentUser.avatar || `${currentUser.firstName?.[0]}${currentUser.lastName?.[0]}`}
                                </div>
                                <h6 className="mt-3 mb-1">
                                    {currentUser.firstName} {currentUser.lastName}
                                </h6>
                                <p className="text-muted small mb-2">{currentUser.email}</p>
                                <Badge bg="primary">
                                    {Array.isArray(currentUser.roles) ? currentUser.roles[0] : currentUser.role}
                                </Badge>
                            </Card.Body>
                        </Card>

                        {/* Stats Card */}
                        <Card className={styles.statsCard}>
                            <Card.Body>
                                <h6 className="mb-3">Aujourd'hui</h6>
                                <div className={styles.statItem}>
                                    <span>Publications</span>
                                    <strong>{publications.length}</strong>
                                </div>
                                <div className={styles.statItem}>
                                    <span>Réactions</span>
                                    <strong>
                                        {publications.reduce((sum, p) => sum + (p.likes || 0), 0)}
                                    </strong>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Comments Modal */}
            <Modal
                show={showCommentsModal}
                onHide={() => {
                    setShowCommentsModal(false);
                    setCurrentPublication(null);
                }}
                centered
                size="lg"
                className={styles.commentsModal}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FaComments className="me-2" />
                        Commentaires ({currentPublication?.comments || 0})
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    {/* Add Comment */}
                    <div className={styles.addCommentForm}>
                        <div className={styles.smallAvatar}>
                            {currentUser.avatar || `${currentUser.firstName?.[0]}${currentUser.lastName?.[0]}`}
                        </div>
                        <InputGroup size="sm">
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Écrivez un commentaire..."
                                className={styles.commentInputField}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddComment();
                                    }
                                }}
                            />
                        </InputGroup>
                        <Button
                            size="sm"
                            className={styles.submitBtn}
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                        >
                            Envoyer
                        </Button>
                    </div>

                    {/* Comments List */}
                    <div className={styles.commentsList}>
                        {currentPublication?.commentsData?.length === 0 ? (
                            <p className="text-muted text-center py-4">Aucun commentaire</p>
                        ) : (
                            currentPublication?.commentsData?.map((comment) => (
                                <div key={comment._id} className={styles.commentItem}>
                                    <div className={styles.smallAvatar}>
                                        {comment.authorAvatar || comment.authorName?.charAt(0)}
                                    </div>
                                    <div className={styles.commentData}>
                                        <div className={styles.commentMeta}>
                                            <strong>{comment.authorName}</strong>
                                            <small className="text-muted">
                                                {formatDate(comment.updatedAt)}
                                            </small>
                                        </div>
                                        <p className={styles.commentText}>{comment.text}</p>
                                        <div className={styles.commentReactions}>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() =>
                                                    handleCommentReaction(
                                                        currentPublication._id,
                                                        comment._id,
                                                        'like'
                                                    )
                                                }
                                            >
                                                <MdFavorite size={14} /> {comment.likes}
                                            </Button>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                onClick={() =>
                                                    handleCommentReaction(
                                                        currentPublication._id,
                                                        comment._id,
                                                        'dislike'
                                                    )
                                                }
                                            >
                                                <FaThumbsDown size={12} /> {comment.dislikes}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Publication;
