import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
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
    FaComments,
    FaExclamationCircle,
    FaUniversity
} from 'react-icons/fa';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import styles from './FairePublication.module.css';
import { api } from '../lib/api';

const FairePublication = () => {
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
        niveau: '3eme annee',
        campus: 'Campus 2',
        groupe: 'Cours du jour',
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


    const MAX_CHARS = 1500;
    const WARNING_CHARS = 1100;
    const ERROR_CHARS = 1300;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Mo

    useEffect(() => {
        loadUserData();
        loadDraft();
        updateCharCount();
    }, []);


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
                    if (user.roles && user.roles.includes('teacher') && Array.isArray(user.teacherUniversityIds)) {
                        unis = unis.filter(u => user.teacherUniversityIds.includes(u.id));
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


    useEffect(() => {
        updateCharCount();
    }, [publication.content]);

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

    const loadDraft = () => {
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
        // reset campus filter when university switches
        if (publication.campus !== 'tous') {
            handleChange('campus', 'tous');
        }
    }, [selectedUniversityId, userUniversities]);

    useEffect(() => {
        updateTargetingPreview();
    }, [publication.audience, publication.filiere, publication.niveau,
    publication.campus, publication.groupe, publication.staffTarget]);

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
                const campusObj = availableCampuses.find(c => (c.id || c) === publication.campus);
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
            if (!userStr) {
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
                        return user.roles[0] === "admin" ? "admin" : "teacher";
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
                authorRole: user.roles[0],

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
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                };
            }

            console.log("🚀 Sending:", basePayload, selectedFiles);

            await api.post("/posts/", requestData, config);

            localStorage.removeItem("teacherDraft");

            showNotification("✅ Publication créée avec succès", "success");

            setTimeout(() => {
                navigate("/publications");
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
                                                                <option value="genie-logiciel">Génie Logiciel</option>
                                                                <option value="telecoms">TELECOMS</option>
                                                                <option value="reseaux">Réseaux et sécurité</option>
                                                                <option value="iia">IIA</option>
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
                                                                <option value="tous">Tous les niveaux</option>
                                                                <option value="1ere annee">1ère année</option>
                                                                <option value="2eme annee">2ème année</option>
                                                                <option value="3eme annee">3ème année</option>
                                                                <option value="Master 1">Master 1</option>
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
                                                                <option value="Cours du jour">Cours du jour</option>
                                                                <option value="Cours du soir">Cours du soir</option>
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
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default FairePublication;