import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaBook, 
    FaUsers, 
    FaGraduationCap, 
    FaPlus, 
    FaEdit, 
    FaTrash,
    FaUniversity,
    FaChartLine,
    FaCalendarAlt,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaBuilding
} from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Modal, Form, Alert, Badge, Tabs, Tab } from 'react-bootstrap';
// import { useTheme } from '../context/ThemeContext';
import AppNavbar from '../composants/AppNavbar';
import styles from './DashboardUniversite.module.css';

const DashboardUniversite = () => {
    const navigate = useNavigate();
    // const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [university, setUniversity] = useState(null);
    const [filieres, setFilieres] = useState([]);
    const [groupes, setGroupes] = useState([]);
    const [showFiliereModal, setShowFiliereModal] = useState(false);
    const [showGroupeModal, setShowGroupeModal] = useState(false);
    const [editingFiliere, setEditingFiliere] = useState(null);
    const [editingGroupe, setEditingGroupe] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        niveau: 'Licence 1',
        duree: '3 ans'
    });
    const [groupeFormData, setGroupeFormData] = useState({
        nom: '',
        filiereId: '',
        effectifMax: 50,
        responsable: ''
    });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // Données simulées (à remplacer par votre API)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user ) {
            navigate('/login');
            return;
        }

        // Simuler le chargement des données
        setTimeout(() => {
            setUniversity({
                id: 1,
                nom: 'Institut Universitaire du Golfe',
                campus: 'Campus B',
                departement: 'Informatique',
                email: 'informatique@iug.cm',
                telephone: '+237 699 999 999',
                dateCreation: '2005-01-15',
                totalEtudiants: 450,
                totalEnseignants: 28,
                totalFilieres: 4,
                totalGroupes: 12
            });

            setFilieres([
                { id: 1, nom: 'Génie Logiciel', description: 'Formation en développement logiciel', niveau: 'Licence 3', duree: '3 ans', nbEtudiants: 120 },
                { id: 2, nom: 'Réseaux et Télécoms', description: 'Infrastructures réseau', niveau: 'Licence 3', duree: '3 ans', nbEtudiants: 85 },
                { id: 3, nom: 'Intelligence Artificielle', description: 'IA et Machine Learning', niveau: 'Master 1', duree: '2 ans', nbEtudiants: 45 },
                { id: 4, nom: 'Cybersécurité', description: 'Sécurité informatique', niveau: 'Master 1', duree: '2 ans', nbEtudiants: 38 }
            ]);

            setGroupes([
                { id: 1, nom: 'Groupe A', filiereId: 1, filiereNom: 'Génie Logiciel', effectif: 35, effectifMax: 40, responsable: 'Dr. Ngo Bassong' },
                { id: 2, nom: 'Groupe B', filiereId: 1, filiereNom: 'Génie Logiciel', effectif: 32, effectifMax: 40, responsable: 'Prof. Diallo' },
                { id: 3, nom: 'Groupe A', filiereId: 2, filiereNom: 'Réseaux', effectif: 28, effectifMax: 35, responsable: 'Dr. Kamga' }
            ]);

            setLoading(false);
        }, 1000);
    }, [navigate]);

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    };

    const handleFiliereSubmit = () => {
        if (!formData.nom) {
            showAlert('Veuillez remplir tous les champs', 'error');
            return;
        }

        if (editingFiliere) {
            // Modifier
            setFilieres(filieres.map(f => 
                f.id === editingFiliere.id ? { ...f, ...formData } : f
            ));
            showAlert('Filière modifiée avec succès', 'success');
        } else {
            // Ajouter
            const newFiliere = {
                id: Date.now(),
                ...formData,
                nbEtudiants: 0
            };
            setFilieres([...filieres, newFiliere]);
            showAlert('Filière ajoutée avec succès', 'success');
        }

        setShowFiliereModal(false);
        setEditingFiliere(null);
        setFormData({ nom: '', description: '', niveau: 'Licence 1', duree: '3 ans' });
    };

    const handleGroupeSubmit = () => {
        if (!groupeFormData.nom || !groupeFormData.filiereId) {
            showAlert('Veuillez remplir tous les champs', 'error');
            return;
        }

        const filiere = filieres.find(f => f.id === parseInt(groupeFormData.filiereId));
        
        if (editingGroupe) {
            setGroupes(groupes.map(g => 
                g.id === editingGroupe.id ? { 
                    ...g, 
                    ...groupeFormData, 
                    filiereNom: filiere?.nom,
                    effectifMax: parseInt(groupeFormData.effectifMax)
                } : g
            ));
            showAlert('Groupe modifié avec succès', 'success');
        } else {
            const newGroupe = {
                id: Date.now(),
                ...groupeFormData,
                filiereNom: filiere?.nom,
                effectif: 0,
                effectifMax: parseInt(groupeFormData.effectifMax)
            };
            setGroupes([...groupes, newGroupe]);
            showAlert('Groupe ajouté avec succès', 'success');
        }

        setShowGroupeModal(false);
        setEditingGroupe(null);
        setGroupeFormData({ nom: '', filiereId: '', effectifMax: 50, responsable: '' });
    };

    const deleteFiliere = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
            setFilieres(filieres.filter(f => f.id !== id));
            showAlert('Filière supprimée', 'info');
        }
    };

    const deleteGroupe = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce groupe ?')) {
            setGroupes(groupes.filter(g => g.id !== id));
            showAlert('Groupe supprimé', 'info');
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Chargement du tableau de bord...</p>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <AppNavbar currentUser={{ firstName: 'Chef', lastName: 'Département', role: 'Chef de département' }} />
            
            <Container className={styles.mainContent}>
                {/* Alert */}
                {alert.show && (
                    <Alert variant={alert.type === 'error' ? 'danger' : alert.type} className={styles.alert}>
                        {alert.message}
                    </Alert>
                )}

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
                        <FaUniversity className={styles.headerIcon} />
                        <div>
                            <h1>{university?.nom}</h1>
                            <p className={styles.headerSubtitle}>
                                {university?.departement} • {university?.campus}
                            </p>
                        </div>
                    </div>
                    <div className={styles.headerStats}>
                        <div className={styles.statItem}>
                            <FaUserGraduate />
                            <span>{university?.totalEtudiants}</span>
                            <small>Étudiants</small>
                        </div>
                        <div className={styles.statItem}>
                            <FaChalkboardTeacher />
                            <span>{university?.totalEnseignants}</span>
                            <small>Enseignants</small>
                        </div>
                        <div className={styles.statItem}>
                            <FaBook />
                            <span>{university?.totalFilieres}</span>
                            <small>Filières</small>
                        </div>
                        <div className={styles.statItem}>
                            <FaUsers />
                            <span>{university?.totalGroupes}</span>
                            <small>Groupes</small>
                        </div>
                    </div>
                </div>

                {/* Onglets */}
                <Tabs defaultActiveKey="filieres" className={styles.tabs} id="university-dashboard-tabs">
                    <Tab eventKey="filieres" title="📚 Filières">
                        <div className={styles.tabContent}>
                            <div className={styles.tabHeader}>
                                <h3>Filières de formation</h3>
                                <Button 
                                    variant="primary" 
                                    onClick={() => setShowFiliereModal(true)}
                                    className={styles.addButton}
                                >
                                    <FaPlus /> Ajouter une filière
                                </Button>
                            </div>

                            <div className={styles.filieresGrid}>
                                {filieres.map(filiere => (
                                    <Card key={filiere.id} className={styles.filiereCard}>
                                        <Card.Body>
                                            <div className={styles.cardHeader}>
                                                <h4>{filiere.nom}</h4>
                                                <Badge bg="info" className={styles.niveauBadge}>
                                                    {filiere.niveau}
                                                </Badge>
                                            </div>
                                            <p className={styles.description}>{filiere.description}</p>
                                            <div className={styles.cardStats}>
                                                <div className={styles.cardStat}>
                                                    <FaGraduationCap />
                                                    <span>{filiere.nbEtudiants} étudiants</span>
                                                </div>
                                                <div className={styles.cardStat}>
                                                    <FaCalendarAlt />
                                                    <span>{filiere.duree}</span>
                                                </div>
                                            </div>
                                            <div className={styles.cardActions}>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingFiliere(filiere);
                                                        setFormData({
                                                            nom: filiere.nom,
                                                            description: filiere.description,
                                                            niveau: filiere.niveau,
                                                            duree: filiere.duree
                                                        });
                                                        setShowFiliereModal(true);
                                                    }}
                                                >
                                                    <FaEdit /> Modifier
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm"
                                                    onClick={() => deleteFiliere(filiere.id)}
                                                >
                                                    <FaTrash /> Supprimer
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="groupes" title="👥 Groupes">
                        <div className={styles.tabContent}>
                            <div className={styles.tabHeader}>
                                <h3>Groupes d'étudiants</h3>
                                <Button 
                                    variant="primary" 
                                    onClick={() => setShowGroupeModal(true)}
                                    className={styles.addButton}
                                >
                                    <FaPlus /> Créer un groupe
                                </Button>
                            </div>

                            <div className={styles.groupesGrid}>
                                {groupes.map(groupe => {
                                    const filiere = filieres.find(f => f.id === groupe.filiereId);
                                    return (
                                        <Card key={groupe.id} className={styles.groupeCard}>
                                            <Card.Body>
                                                <div className={styles.cardHeader}>
                                                    <h4>{groupe.nom}</h4>
                                                    <Badge bg="secondary">{filiere?.nom || groupe.filiereNom}</Badge>
                                                </div>
                                                <div className={styles.cardStats}>
                                                    <div className={styles.cardStat}>
                                                        <FaUsers />
                                                        <span>{groupe.effectif} / {groupe.effectifMax} étudiants</span>
                                                    </div>
                                                    <div className={styles.cardStat}>
                                                        <FaChalkboardTeacher />
                                                        <span>Responsable: {groupe.responsable || 'Non défini'}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.progressBar}>
                                                    <div 
                                                        className={styles.progressFill}
                                                        style={{ width: `${(groupe.effectif / groupe.effectifMax) * 100}%` }}
                                                    />
                                                </div>
                                                <div className={styles.cardActions}>
                                                    <Button 
                                                        variant="outline-primary" 
                                                        size="sm"
                                                        onClick={() => {
                                                            setEditingGroupe(groupe);
                                                            setGroupeFormData({
                                                                nom: groupe.nom,
                                                                filiereId: groupe.filiereId,
                                                                effectifMax: groupe.effectifMax,
                                                                responsable: groupe.responsable || ''
                                                            });
                                                            setShowGroupeModal(true);
                                                        }}
                                                    >
                                                        <FaEdit /> Modifier
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        size="sm"
                                                        onClick={() => deleteGroupe(groupe.id)}
                                                    >
                                                        <FaTrash /> Supprimer
                                                    </Button>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="statistiques" title="📊 Statistiques">
                        <div className={styles.tabContent}>
                            <h3>Vue d'ensemble</h3>
                            <Row>
                                <Col md={6} lg={3}>
                                    <Card className={styles.statsCard}>
                                        <Card.Body>
                                            <FaUserGraduate className={styles.statsIcon} />
                                            <div className={styles.statsNumber}>{university?.totalEtudiants}</div>
                                            <div className={styles.statsLabel}>Étudiants</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} lg={3}>
                                    <Card className={styles.statsCard}>
                                        <Card.Body>
                                            <FaChalkboardTeacher className={styles.statsIcon} />
                                            <div className={styles.statsNumber}>{university?.totalEnseignants}</div>
                                            <div className={styles.statsLabel}>Enseignants</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} lg={3}>
                                    <Card className={styles.statsCard}>
                                        <Card.Body>
                                            <FaBook className={styles.statsIcon} />
                                            <div className={styles.statsNumber}>{university?.totalFilieres}</div>
                                            <div className={styles.statsLabel}>Filières</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6} lg={3}>
                                    <Card className={styles.statsCard}>
                                        <Card.Body>
                                            <FaUsers className={styles.statsIcon} />
                                            <div className={styles.statsNumber}>{university?.totalGroupes}</div>
                                            <div className={styles.statsLabel}>Groupes</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Tab>
                </Tabs>

                {/* Modal Ajouter/Modifier Filière */}
                <Modal show={showFiliereModal} onHide={() => {
                    setShowFiliereModal(false);
                    setEditingFiliere(null);
                    setFormData({ nom: '', description: '', niveau: 'Licence 1', duree: '3 ans' });
                }} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingFiliere ? 'Modifier la filière' : 'Ajouter une filière'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nom de la filière *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                    placeholder="Ex: Génie Logiciel"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Description de la filière..."
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Niveau</Form.Label>
                                <Form.Select
                                    value={formData.niveau}
                                    onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                                >
                                    <option>Licence 1</option>
                                    <option>Licence 2</option>
                                    <option>Licence 3</option>
                                    <option>Master 1</option>
                                    <option>Master 2</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Durée</Form.Label>
                                <Form.Select
                                    value={formData.duree}
                                    onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                                >
                                    <option>1 an</option>
                                    <option>2 ans</option>
                                    <option>3 ans</option>
                                    <option>4 ans</option>
                                    <option>5 ans</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setShowFiliereModal(false);
                            setEditingFiliere(null);
                        }}>Annuler</Button>
                        <Button variant="primary" onClick={handleFiliereSubmit}>Enregistrer</Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal Ajouter/Modifier Groupe */}
                <Modal show={showGroupeModal} onHide={() => {
                    setShowGroupeModal(false);
                    setEditingGroupe(null);
                    setGroupeFormData({ nom: '', filiereId: '', effectifMax: 50, responsable: '' });
                }} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingGroupe ? 'Modifier le groupe' : 'Créer un groupe'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nom du groupe *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={groupeFormData.nom}
                                    onChange={(e) => setGroupeFormData({ ...groupeFormData, nom: e.target.value })}
                                    placeholder="Ex: Groupe A, Groupe 1, etc."
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Filière *</Form.Label>
                                <Form.Select
                                    value={groupeFormData.filiereId}
                                    onChange={(e) => setGroupeFormData({ ...groupeFormData, filiereId: e.target.value })}
                                >
                                    <option value="">Sélectionner une filière</option>
                                    {filieres.map(f => (
                                        <option key={f.id} value={f.id}>{f.nom}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Effectif maximum</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={groupeFormData.effectifMax}
                                    onChange={(e) => setGroupeFormData({ ...groupeFormData, effectifMax: e.target.value })}
                                    min="1"
                                    max="200"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Responsable pédagogique</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={groupeFormData.responsable}
                                    onChange={(e) => setGroupeFormData({ ...groupeFormData, responsable: e.target.value })}
                                    placeholder="Nom du responsable"
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setShowGroupeModal(false);
                            setEditingGroupe(null);
                        }}>Annuler</Button>
                        <Button variant="primary" onClick={handleGroupeSubmit}>Enregistrer</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default DashboardUniversite;