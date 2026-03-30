import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../composants/AppNavbar';
import {
    FaPen,
    FaSave,
    FaBell,
    FaExclamationTriangle,
    FaArrowLeft,
    FaArrowRight,
    FaPaperclip,
    FaTrash,
    FaFilePdf,
    FaFileImage,
    FaFileAlt,
    FaUsers,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaBuilding,
    FaGlobe,
    FaExclamationCircle,
    FaSearch
} from 'react-icons/fa';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, InputGroup } from 'react-bootstrap';
import styles from './FairePublication.module.css';
import { api } from '../lib/api';
import { useTranslation } from 'react-i18next';


const FairePublication = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // États
    const [currentUser, setCurrentUser] = useState({
        id: "PROF001",
        name: "Pr. Amadou Diallo",
        avatar: "PD",
        roles: ["Enseignant"],
        department: "Informatique",
        filiere: "Genie Logiciel",
        campus: "Campus 2"
    });

    const [publication, setPublication] = useState({
        content: '',
        audience: 'students',
        staffTarget: '',
        filiere: 'tous',
        niveau: 'tous',
        campus: 'tous',
        groupe: 'jours',
        allowComments: true,
        isUrgent: false
    });

    const [charCount, setCharCount] = useState(0);
    const [charWarning, setCharWarning] = useState('');
    const [loading, setLoading] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [notification, setNotification] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [userUniversities, setUserUniversities] = useState([]); // normalized list {id,name,campuses[]}
    const [selectedUniversityId, setSelectedUniversityId] = useState("");
    const [availableCampuses, setAvailableCampuses] = useState([]); // campuses for currently selected university
    const [availableFields, setAvailableFields] = useState([]); // fields for currently selected university

    // Post feed (for search & filter preview)
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsError, setPostsError] = useState(null);
    const [postSearch, setPostSearch] = useState('');
    const [postFilterAudience, setPostFilterAudience] = useState('all');
    const [postFilterUrgent, setPostFilterUrgent] = useState(false);
    const [postFilterFiliere, setPostFilterFiliere] = useState('tous');
    const [postFilterNiveau, setPostFilterNiveau] = useState('tous');
    const [postFilterCampus, setPostFilterCampus] = useState('tous');
    const [postFilterGroupe, setPostFilterGroupe] = useState('tous');
    const postSearchDebounce = useRef(null);


    const MAX_CHARS = 1500;
    const WARNING_CHARS = 1100;
    const ERROR_CHARS = 1300;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo




    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/universities/list');
                let unis = res.data.universities || [];

                // normalize every entry to {id,name,campuses}
                // unis = unis.map(u => {
                //     // some endpoints wrap under universityId
                //     const base = u.id;
                //     return {
                //         id: base.id ,
                //         name: u.name ,
                //         campuses: u.campuses || base.campuses || []
                //     };
                // });

                // if teacher, restrict to the set of universities in user object
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.roles && user.status === 'teacher' && Array.isArray(user.teacherUniversityIds)) {
                        unis = unis.filter(u => user.teacherUniversityIds.includes(u.id));
                    }

                    if (user.roles && user.status === 'admin') {
                        unis = unis.filter(u => u.id === user.adminUniversityId);
                    }

                }

                setUserUniversities(unis);
                if (unis.length === 1) {
                    setSelectedUniversityId(unis[0].id);
                }
            } catch (err) {
                console.error('Erreur récupération universités :', err);
            }
        };

        fetchUser();
    }, []);



    const loadUserData = () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                // keep teacher universities list if present
                const extra = {};
                if (user.teacherUniversityIds) {
                    extra.teacherUniversityIds = user.teacherUniversityIds;
                }

                if (user.adminUniversityId) {
                    extra.adminUniversityId = user.adminUniversityId;
                }
                setCurrentUser(prev => ({
                    ...prev,
                    ...user,
                    ...extra,
                    id: user._id || user.id,
                    name: user.firstName + ' ' + user.lastName?.slice(0, 1).toUpperCase(),
                    avatar: user.firstName?.[0] + user.lastName?.[0] || prev.avatar,
                    roles: user.roles
                }));
            } catch (error) {
                console.error('Erreur chargement utilisateur:', error);
            }
        }
    };

    const loadDraft = useCallback(() => {
        try {
            const draft = JSON.parse(localStorage.getItem('teacherDraft'));
            if (draft) {
                if (window.confirm('Un brouillon de publication a été trouvé. Voulez-vous le charger ?')) {
                    setPublication({
                        content: draft.message || '',
                        audience: draft.audience || 'students',
                        staffTarget: draft.staffTarget || '',
                        filiere: draft.filiere || 'tous',
                        niveau: draft.niveau || 'tous',
                        campus: draft.campus || 'tous',
                        groupe: draft.groupe || 'tous',
                        allowComments: draft.allowComments !== false,
                        isUrgent: draft.urgent || false
                    });
                    if (draft.universityId) {
                        setSelectedUniversityId(draft.universityId);
                    }
                    showNotification('Brouillon chargé avec succès', 'success');
                }
            }
        } catch (error) {
            console.error('Erreur chargement brouillon:', error);
        }
    }, []);

    const updateCharCount = useCallback(() => {
        const length = publication.content.length;
        setCharCount(length);

        if (length > ERROR_CHARS) {
            setCharWarning('error');
        } else if (length > WARNING_CHARS) {
            setCharWarning('warning');
        } else {
            setCharWarning('');
        }
    }, [publication.content.length]);

    useEffect(() => {
        updateCharCount();
    }, [publication.content, updateCharCount]);


    const handleChange = (field, value) => {
        setPublication(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        // Vérifier la taille
        const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
            showNotification('❌ Certains fichiers dépassent 10 Mo', 'error');
            return;
        }

        // Vérifier le nombre max (5 fichiers)
        if (selectedFiles.length + files.length > 5) {
            showNotification('❌ Maximum 5 fichiers autorisés', 'error');
            return;
        }

        // Ajouter les fichiers
        const newFiles = files.map(file => ({
            file,
            name: file.name,
            size: file.size,
            type: getFileType(file.name),
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
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

    const getFileType = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return 'image';
        if (ext === 'pdf') return 'pdf';
        return 'document';
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf': return <FaFilePdf />;
            case 'image': return <FaFileImage />;
            default: return <FaFileAlt />;
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const updateTargetingPreview = () => {
        setShowPreview(true);
    };

    // whenever university selection or list changes update campuses and clear campus filter
    useEffect(() => {
        const uni = userUniversities.find(u => u.id === selectedUniversityId);
        setAvailableCampuses(uni?.campuses || []);
        setAvailableFields(uni?.fields || []);
        // reset campus filter when university switches

    }, [selectedUniversityId, userUniversities]);

    useEffect(() => {
        updateTargetingPreview();
    }, [publication]);

    // Fetch recent posts to help users avoid duplicates (search + filters)
    const loadPosts = useCallback(async (pageNum = 1) => {
        setPostsLoading(true);
        setPostsError(null);
        try {
            const params = new URLSearchParams();
            params.append('page', pageNum);
            params.append('limit', 20);

            if (selectedUniversityId) {
                params.append('universityId', selectedUniversityId);
            }

            if (postSearch.trim()) {
                params.append('search', postSearch.trim());
            }

            if (postFilterUrgent) {
                params.append('urgent', 'true');
            }

            if (postFilterAudience && postFilterAudience !== 'all') {
                params.append('targetType', postFilterAudience);
            }

            if (postFilterFiliere && postFilterFiliere !== 'tous') {
                params.append('filiere', postFilterFiliere);
            }
            if (postFilterNiveau && postFilterNiveau !== 'tous') {
                params.append('niveau', postFilterNiveau);
            }
            if (postFilterGroupe && postFilterGroupe !== 'tous') {
                params.append('groupe', postFilterGroupe);
            }
            if (postFilterCampus && postFilterCampus !== 'tous') {
                params.append('campusId', postFilterCampus);
            }

            const response = await api.get(`/posts/all?${params.toString()}`);
            if (response.data.success) {
                setPosts(response.data.data || []);
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error('Erreur chargement des publications:', error);
            setPostsError('Impossible de récupérer les publications');
        } finally {
            setPostsLoading(false);
        }
    }, [postFilterAudience, postFilterCampus, postFilterFiliere, postFilterGroupe, postFilterNiveau, postFilterUrgent, postSearch, selectedUniversityId])

    useEffect(() => {
        // Debounce search to avoid triggering API for every keystroke
        if (postSearchDebounce.current) {
            clearTimeout(postSearchDebounce.current);
        }
        postSearchDebounce.current = setTimeout(() => {
            loadPosts();
        }, 400);

        return () => clearTimeout(postSearchDebounce.current);
    }, [postSearch, postFilterAudience, postFilterUrgent, postFilterFiliere, postFilterNiveau, postFilterCampus, postFilterGroupe, selectedUniversityId, loadPosts]);

    const filteredPosts = posts.filter((post) => {
        const term = postSearch.trim().toLowerCase();
        const matchesSearch =
            !term ||
            post.content?.toLowerCase().includes(term) ||
            post.authorName?.toLowerCase().includes(term);
        if (!matchesSearch) return false;

        if (postFilterUrgent && !post.options?.urgent) return false;

        if (postFilterAudience && postFilterAudience !== 'all') {
            const targetType = post.target?.type;
            if (targetType !== postFilterAudience) return false;
        }

        if (postFilterFiliere && postFilterFiliere !== 'tous') {
            const filieres = post.target?.filieres || [];
            if (!filieres.includes(postFilterFiliere)) return false;
        }
        if (postFilterNiveau && postFilterNiveau !== 'tous') {
            const niveaux = post.target?.niveaux || [];
            if (!niveaux.includes(postFilterNiveau)) return false;
        }
        if (postFilterGroupe && postFilterGroupe !== 'tous') {
            const groupes = post.target?.groupes || [];
            if (!groupes.includes(postFilterGroupe)) return false;
        }
        if (postFilterCampus && postFilterCampus !== 'tous') {
            const campusIds = post.target?.campusIds || [];
            const found = campusIds.some(id => String(id) === String(postFilterCampus));
            if (!found) return false;
        }

        return true;
    });

    const getTargetingBadges = () => {
        const badges = [];

        if (publication.audience === 'students' || publication.audience === 'both') {
            badges.push({ icon: <FaUserGraduate />, text: 'Étudiants', type: 'student' });

            if (publication.filiere !== 'tous') {
                badges.push({ icon: '🎓', text: publication.filiere, type: 'student' });
            }
            if (publication.niveau !== 'tous') {
                badges.push({ icon: '📚', text: publication.niveau, type: 'student' });
            }
            if (publication.campus !== 'tous') {
                const campusObj = availableCampuses.find(c => (c._id || c) === publication.campus);
                badges.push({ icon: <FaBuilding />, text: campusObj ? campusObj.name || publication.campus : publication.campus, type: 'student' });
            }
            if (publication.groupe !== 'tous') {
                badges.push({ icon: '⏰', text: publication.groupe, type: 'student' });
            }
        }

        if (publication.audience === 'staff' || publication.audience === 'both') {
            badges.push({ icon: <FaChalkboardTeacher />, text: 'Personnel', type: 'staff' });

            if (publication.staffTarget) {
                badges.push({ icon: <FaBuilding />, text: publication.staffTarget, type: 'staff' });
            }
        }

        if (publication.audience === 'both') {
            badges.unshift({ icon: <FaGlobe />, text: 'Tout le monde', type: 'both' });
        }

        return badges;
    };

    const validatePublication = () => {
        if (!publication.content.trim()) {
            showNotification('❌ Veuillez rédiger le contenu de votre publication', 'error');
            return false;
        }
        if (!selectedUniversityId) {
            showNotification('❌Veuillez sélectionner une université', 'error');
            return false;
        }
        return true;
    };

    const publishNow = async () => {
        if (!validatePublication()) return;

        setLoading(true);

        try {
            const userStr = localStorage.getItem("user");
            const token = localStorage.getItem("token");
            if (!userStr && !token) {
                showNotification("Utilisateur non authentifié", "error");
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);

            // 🔥 Map audience to PostSchema target.type (singular values)
            const mapAudience = () => {
                switch (publication.audience) {
                    case "students":
                        return "student";
                    case "staff":
                        return user.roles[0] === "teacher" ? "teacher" : "admin";
                    case "teacher":
                        return "teacher";
                    case "both":
                        return "all";
                    default:
                        return "all";
                }
            };

            const basePayload = {
                universityId: selectedUniversityId,

                authorId: user._id,
                authorName: `${user.firstName} ${user.lastName}`,
                authorAvatar: currentUser.avatar,
                authorRole: user.status,

                content: publication.content,

                images: [],

                target: {
                    type: mapAudience(),

                    campusIds:
                        publication.campus !== "tous"
                            ? [publication.campus]
                            : [],

                    filieres:
                        publication.filiere !== "tous"
                            ? [publication.filiere]
                            : [],

                    niveaux:
                        publication.niveau !== "tous"
                            ? [publication.niveau]
                            : [],

                    groupes:
                        publication.groupe !== "tous"
                            ? [publication.groupe]
                            : []
                },

                options: {
                    allowComments: publication.allowComments,
                    allowReactions: true,
                    pinned: false,
                    urgent: publication.isUrgent
                }
            };

            // decide whether to use multipart/form-data
            let requestData = basePayload;
            let config = {};

            if (selectedFiles.length > 0) {
                const formData = new FormData();
                // append all simple fields
                Object.entries(basePayload).forEach(([key, val]) => {
                    if (typeof val === 'object') {
                        formData.append(key, JSON.stringify(val));
                    } else {
                        formData.append(key, val);
                    }
                });
                // add each file under attachments
                selectedFiles.forEach(fileObj => {
                    formData.append('attachments', fileObj.file);
                });
                requestData = formData;
                config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                };
            }

            console.log("🚀 Sending:", basePayload, selectedFiles);

            await api.post("/posts/", requestData, config);

            localStorage.removeItem("teacherDraft");

            showNotification("✅ Publication créée avec succès", "success");

            setTimeout(() => {
                navigate("/posts");
            }, 1500);

        } catch (error) {
            console.error(error);
            showNotification("Erreur lors de la publication", "error");
        } finally {
            setLoading(false);
        }
    };


    const saveAsDraft = () => {
        if (!publication.content.trim()) {
            showNotification('Le brouillon est vide', 'error');
            return;
        }

        setSavingDraft(true);

        setTimeout(() => {
            const draft = {
                message: publication.content,
                audience: publication.audience,
                staffTarget: publication.staffTarget,
                filiere: publication.filiere,
                niveau: publication.niveau,
                campus: publication.campus,
                groupe: publication.groupe,
                urgent: publication.isUrgent,
                allowComments: publication.allowComments,
                universityId: selectedUniversityId,
                date: new Date().toISOString()
            };

            localStorage.setItem('teacherDraft', JSON.stringify(draft));
            showNotification('✅ Brouillon enregistré avec succès', 'success');
            setSavingDraft(false);
        }, 500);
    };

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        loadUserData();
        loadDraft();
        updateCharCount();
    }, [loadDraft, updateCharCount]);


    return (
        <div className={styles.pageContainer}>
            {/* Notification */}
            {notification && (
                <Alert
                    variant={notification.type === 'success' ? 'success' : notification.type === 'error' ? 'danger' : 'info'}
                    className={styles.notification}
                    onClose={() => setNotification(null)}
                    dismissible
                >
                    {notification.message}
                </Alert>
            )}

            {/* En-tête */}
            <AppNavbar currentUser={currentUser} />

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
                            <Alert.Heading>
                                <FaExclamationTriangle /> Publication réservée au personnel
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
                                                <FaChalkboardTeacher /> {currentUser.roles[0]}
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
                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label className={styles.formLabel}>
                                            <FaPen /> Contenu de la publication
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            value={publication.content}
                                            onChange={(e) => handleChange('content', e.target.value)}
                                            placeholder="Rédigez votre message ici..."
                                            maxLength={MAX_CHARS}
                                            className={styles.messageInput}
                                        />
                                        <div className={styles.charCounter}>
                                            <span className={
                                                charWarning === 'error' ? styles.counterError :
                                                    charWarning === 'warning' ? styles.counterWarning :
                                                        styles.counterNormal
                                            }>
                                                {charCount}/{MAX_CHARS} caractères
                                            </span>
                                            {charCount > WARNING_CHARS && (
                                                <FaExclamationCircle className={styles.warningIcon} />
                                            )}
                                        </div>
                                    </Form.Group>

                                    {/* Section ciblage */}
                                    <div className={styles.targetingSection}>
                                        <div className={styles.sectionTitle}>
                                            <FaGlobe /> Ciblage du public
                                        </div>

                                        {userUniversities.length > 0 && (
                                            <Form.Group className="mb-3">
                                                <Form.Label>Select University</Form.Label>
                                                <Form.Select
                                                    value={selectedUniversityId}
                                                    onChange={(e) => setSelectedUniversityId(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Choose university</option>
                                                    {userUniversities.map((u) => (
                                                        <option key={u.id} value={u.id}>
                                                            {u.name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        )}


                                        <p className={styles.sectionDescription}>
                                            Sélectionnez à qui est destinée votre publication.
                                        </p>

                                        <Form.Group className={styles.formGroup}>
                                            <Form.Label className={styles.audienceLabel}>
                                                Cette publication est destinée à :
                                            </Form.Label>
                                            <Form.Select
                                                value={publication.audience}
                                                onChange={(e) => handleChange('audience', e.target.value)}
                                                className={styles.audienceSelect}
                                            >
                                                <option value="students">👨‍🎓 Étudiants uniquement</option>
                                                <option value="staff">👨‍🏫 Personnel uniquement</option>
                                                <option value="teacher">👨‍🏫 Professeur uniquement</option>
                                                <option value="both">👥 Tout le monde</option>
                                            </Form.Select>
                                        </Form.Group>

                                        {/* Champs personnel */}
                                        {(publication.audience === 'staff' || publication.audience === 'both') && (
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.fieldLabel}>
                                                    Spécifiez pour quel personnel (facultatif) :
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={publication.staffTarget}
                                                    onChange={(e) => handleChange('staffTarget', e.target.value)}
                                                    placeholder="Ex: Enseignants du département Informatique"
                                                    className={styles.textInput}
                                                />
                                                <Form.Text className={styles.helpText}>
                                                    Laissez vide si c'est pour tout le personnel
                                                </Form.Text>
                                            </Form.Group>
                                        )}

                                        {/* Champs étudiants */}
                                        {(publication.audience === 'students' || publication.audience === 'both') && (
                                            <div className={styles.studentTargeting}>
                                                <Form.Label className={styles.fieldLabel}>
                                                    Ciblage des étudiants :
                                                </Form.Label>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className={styles.formGroup}>
                                                            <Form.Label className={styles.targetLabel}>
                                                                Filière
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={publication.filiere}
                                                                onChange={(e) => handleChange('filiere', e.target.value)}
                                                                className={styles.targetSelect}
                                                            >

                                                                <option value="tous">Toutes les filières</option>
                                                                {availableFields.map(f => (
                                                                    <option key={f._id || f} value={f._id || f}>
                                                                        {f.name || f}
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className={styles.formGroup}>
                                                            <Form.Label className={styles.targetLabel}>
                                                                Niveau
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={publication.niveau}
                                                                onChange={(e) => handleChange('niveau', e.target.value)}
                                                                className={styles.targetSelect}
                                                            >
                                                                <option value="tous">tous / all</option>
                                                                <option value="l1">{t('auth.level.l1')}</option>
                                                                <option value="l2">{t('auth.level.l2')}</option>
                                                                <option value="l3">{t('auth.level.l3')}</option>
                                                                <option value="m1">{t('auth.level.m1')}</option>
                                                                <option value="m2">{t('auth.level.m2')}</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className={styles.formGroup}>
                                                            <Form.Label className={styles.targetLabel}>
                                                                Campus
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={publication.campus}
                                                                onChange={(e) => handleChange('campus', e.target.value)}
                                                                className={styles.targetSelect}
                                                            >
                                                                <option value="tous">Tous les campus</option>
                                                                {availableCampuses.map(c => (
                                                                    <option key={c._id || c} value={c._id || c}>
                                                                        {c.name || c}
                                                                    </option>
                                                                ))}
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className={styles.formGroup}>
                                                            <Form.Label className={styles.targetLabel}>
                                                                Groupe
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={publication.groupe}
                                                                onChange={(e) => handleChange('groupe', e.target.value)}
                                                                className={styles.targetSelect}
                                                            >
                                                                <option value="tous">Tous les groupes</option>
                                                                <option value="jours">Cours du jour</option>
                                                                <option value="soirs">Cours du soir</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )}

                                        {/* Aperçu ciblage */}
                                        {showPreview && (
                                            <div className={styles.targetingPreview}>
                                                <div className={styles.previewTitle}>
                                                    Public ciblé :
                                                </div>
                                                <div className={styles.previewBadges}>
                                                    {getTargetingBadges().map((badge, index) => (
                                                        <Badge
                                                            key={index}
                                                            className={`${styles.targetBadge} ${styles[badge.type]}`}
                                                        >
                                                            {badge.icon} {badge.text}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pièces jointes */}
                                    <div className={styles.attachmentsSection}>
                                        <div className={styles.attachmentsTitle}>
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
                                                <small>Taille max : 10 Mo par fichier</small>
                                            </label>
                                        </div>

                                        {selectedFiles.length > 0 && (
                                            <div className={styles.fileList}>
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className={styles.fileItem}>
                                                        <div className={`${styles.fileIcon} ${styles[file.type]}`}>
                                                            {getFileIcon(file.type)}
                                                        </div>
                                                        <div className={styles.fileInfo}>
                                                            <div className={styles.fileName}>{file.name}</div>
                                                            <div className={styles.fileSize}>
                                                                {formatFileSize(file.size)} • {file.type.toUpperCase()}
                                                            </div>
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

                                    {/* Options */}
                                    <div className={styles.publishOptions}>
                                        <div className={styles.optionsTitle}>
                                            ⚙️ Options de publication
                                        </div>

                                        <Form.Check
                                            type="checkbox"
                                            id="allowComments"
                                            checked={publication.allowComments}
                                            onChange={(e) => handleChange('allowComments', e.target.checked)}
                                            label="Autoriser les commentaires"
                                            className={styles.optionCheckbox}
                                        />

                                        <Form.Check
                                            type="checkbox"
                                            id="markUrgent"
                                            checked={publication.isUrgent}
                                            onChange={(e) => handleChange('isUrgent', e.target.checked)}
                                            label={
                                                <span>
                                                    Marquer comme urgent
                                                    {publication.isUrgent && (
                                                        <Badge bg="danger" className={styles.urgentBadge}>
                                                            URGENT
                                                        </Badge>
                                                    )}
                                                </span>
                                            }
                                            className={styles.optionCheckbox}
                                        />
                                    </div>

                                    {/* Boutons */}
                                    <div className={styles.actionButtons}>
                                        <Button
                                            variant="secondary"
                                            className={styles.draftButton}
                                            onClick={saveAsDraft}
                                            disabled={savingDraft || loading}
                                        >
                                            {savingDraft ? (
                                                <><span className="spinner-border spinner-border-sm me-2" />Sauvegarde...</>
                                            ) : (
                                                <><FaSave className="me-2" />Brouillon</>
                                            )}
                                        </Button>

                                        <Button
                                            variant="success"
                                            className={styles.publishButton}
                                            onClick={publishNow}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <><span className="spinner-border spinner-border-sm me-2" />Publication...</>
                                            ) : (
                                                <><FaBell className="me-2" />Publier <FaArrowRight className="ms-2" /></>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>

                        {/* Publications récentes (recherche / filtres) */}
                        <div className={styles.postsSection}>
                            <div className={styles.postsHeader}>
                                <div className={styles.postsTitle}>
                                    <FaUsers className="me-2" /> Publications récentes
                                </div>
                                <div className={styles.postsFilterBar}>
                                    <InputGroup className={styles.postsSearchInput}>
                                        <InputGroup.Text>
                                            <FaSearch />
                                        </InputGroup.Text>
                                        <Form.Control
                                            placeholder="Rechercher parmi les publications"
                                            value={postSearch}
                                            onChange={(e) => setPostSearch(e.target.value)}
                                        />
                                    </InputGroup>

                                    <Form.Select
                                        value={postFilterAudience}
                                        onChange={(e) => setPostFilterAudience(e.target.value)}
                                        className={styles.postsFilterSelect}
                                    >
                                        <option value="all">Tous</option>
                                        <option value="student">Étudiants</option>
                                        <option value="teacher">Personnel</option>
                                        <option value="admin">Administrateurs</option>
                                    </Form.Select>

                                    <Form.Select
                                        value={postFilterFiliere}
                                        onChange={(e) => setPostFilterFiliere(e.target.value)}
                                        className={styles.postsFilterSelect}
                                    >
                                        <option value="tous">Toutes les filières</option>
                                        <option value="genie-logiciel">Génie Logiciel</option>
                                        <option value="telecoms">TELECOMS</option>
                                        <option value="reseaux">Réseaux et sécurité</option>
                                        <option value="iia">IIA</option>
                                    </Form.Select>

                                    <Form.Select
                                        value={postFilterNiveau}
                                        onChange={(e) => setPostFilterNiveau(e.target.value)}
                                        className={styles.postsFilterSelect}
                                    >
                                        <option value="tous">Tous les niveaux</option>
                                        <option value="1ere annee">1ère année</option>
                                        <option value="2eme annee">2ème année</option>
                                        <option value="3eme annee">3ème année</option>
                                        <option value="Master 1">Master 1</option>
                                    </Form.Select>

                                    <Form.Select
                                        value={postFilterCampus}
                                        onChange={(e) => setPostFilterCampus(e.target.value)}
                                        className={styles.postsFilterSelect}
                                    >
                                        <option value="tous">Tous les campus</option>
                                        {availableCampuses.map(c => (
                                            <option key={c._id || c} value={c._id || c}>
                                                {c.name || c}
                                            </option>
                                        ))}
                                    </Form.Select>

                                    <Form.Select
                                        value={postFilterGroupe}
                                        onChange={(e) => setPostFilterGroupe(e.target.value)}
                                        className={styles.postsFilterSelect}
                                    >
                                        <option value="tous">Tous les groupes</option>
                                        <option value="Cours du jour">Cours du jour</option>
                                        <option value="Cours du soir">Cours du soir</option>
                                    </Form.Select>

                                    <Form.Check
                                        type="checkbox"
                                        id="filter-urgent"
                                        label="Urgent uniquement"
                                        checked={postFilterUrgent}
                                        onChange={(e) => setPostFilterUrgent(e.target.checked)}
                                        className={styles.postsFilterCheckbox}
                                    />
                                </div>
                            </div>

                            {postsLoading && (
                                <div className={styles.postsLoading}>
                                    <span className="spinner-border spinner-border-sm me-2" /> Chargement...
                                </div>
                            )}

                            {postsError && (
                                <Alert variant="danger" className="mt-3">
                                    {postsError}
                                </Alert>
                            )}

                            {!postsLoading && !postsError && filteredPosts.length === 0 && (
                                <Card className={styles.emptyPosts}>
                                    <Card.Body className="text-center py-4">
                                        <FaBell size={20} className="text-muted mb-2" />
                                        <p className="text-muted mb-0">Aucune publication trouvée.</p>
                                    </Card.Body>
                                </Card>
                            )}

                            {!postsLoading && !postsError && filteredPosts.length > 0 && (
                                <div className={styles.postsList}>
                                    {filteredPosts.map((post) => (
                                        <Card key={post._id} className={styles.postItem}>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <div className="fw-bold">{post.authorName}</div>
                                                        <small className="text-muted">
                                                            {new Date(post.createdAt).toLocaleString()}
                                                        </small>
                                                    </div>
                                                    {post.options?.urgent && (
                                                        <Badge bg="danger" className="text-uppercase">
                                                            Urgent
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="mt-2 mb-2">{post.content}</div>
                                                <div className="d-flex flex-wrap gap-2">
                                                    {(post.target?.type && post.target.type !== 'all') && (
                                                        <Badge bg="secondary">Cible: {post.target.type}</Badge>
                                                    )}
                                                    {post.target?.filieres?.map((f) => (
                                                        <Badge bg="info" key={f}>Filière: {f}</Badge>
                                                    ))}
                                                    {post.target?.niveaux?.map((n) => (
                                                        <Badge bg="info" key={n}>Niveau: {n}</Badge>
                                                    ))}
                                                    {post.target?.groupes?.map((g) => (
                                                        <Badge bg="info" key={g}>Groupe: {g}</Badge>
                                                    ))}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default FairePublication;