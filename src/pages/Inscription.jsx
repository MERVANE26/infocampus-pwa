import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    FaUniversity,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaUserTie,
    FaEnvelope,
    FaLock,
    FaPhone,
    FaGraduationCap,
    FaBook,
    FaUsers,
    FaBuilding,
    FaBriefcase,
    FaCheckCircle,
    FaInfoCircle,
    FaExclamationTriangle,
    FaArrowRight
} from 'react-icons/fa';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import RoleSelector from '../composants/InscriptionForm/RoleSelector';
import StudentFields from '../composants/InscriptionForm/StudentFields';
import TeacherFields from '../composants/InscriptionForm/TeacherFields';
import AdminFields from '../composants/InscriptionForm/AdminFields';
import TermsSection from '../composants/InscriptionForm/TermsSection';
import styles from './Inscription.module.css';
import { api } from '../lib/api';


const Inscription = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState({ show: false, text: '' });
    
    const [formData, setFormData] = useState({
        // Infos de base
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        emailPassword: '',
        password: '',
        confirmPassword: '',
        
        // Rôle
        role: 'student',
        
        // Étudiant
        student: {
            university: '',
            campus: '',
            filiere: '',
            niveau: '',
            groupe: ''
        },
        
        // Enseignant
        teacher: {
            universities: '',
            subjects: '',
            status: 'permanent',
            hasAdminRole: false,
            adminRole: {
                service: '',
                function: ''
            }
        },
        
        // Admin
        admin: {
            university: '',
            service: '',
            function: '',
            hasTeacherRole: false,
            teacherRole: {
                subjects: ''
            }
        },
        
        // Conditions
        terms: false
    });

    useEffect(() => {
        const pendingUser = sessionStorage.getItem('pendingUser');
        if (pendingUser) {
            // Optionnel : restaurer les données
        }
    }, []);

    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        
        if (id.includes('.')) {
            // Gestion des champs imbriqués (ex: student.university)
            const [parent, child] = id.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            // Champs simples
            setFormData(prev => ({
                ...prev,
                [id]: type === 'checkbox' ? checked : value
            }));
        }
        
        setError('');
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setFormData(prev => ({ ...prev, role: newRole }));
    };

    const toggleTeacherAdmin = () => {
        setFormData(prev => ({
            ...prev,
            teacher: {
                ...prev.teacher,
                hasAdminRole: !prev.teacher.hasAdminRole
            }
        }));
    };

    const toggleAdminTeacher = () => {
        setFormData(prev => ({
            ...prev,
            admin: {
                ...prev.admin,
                hasTeacherRole: !prev.admin.hasTeacherRole
            }
        }));
    };

    const validateForm = () => {
        // Vérifications de base
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
            setError('Veuillez remplir tous les champs obligatoires.');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.');
            return false;
        }

        if (!formData.terms) {
            setError('Vous devez accepter les conditions d\'utilisation.');
            return false;
        }

        // Vérifications selon le rôle
        if (role === 'student') {
            if (!formData.student.university || !formData.student.campus || 
                !formData.student.filiere || !formData.student.niveau || !formData.student.groupe) {
                setError('Veuillez remplir tous les champs étudiants.');
                return false;
            }
        } else if (role === 'teacher') {
            if (!formData.teacher.universities || !formData.teacher.subjects) {
                setError('Veuillez remplir tous les champs enseignants.');
                return false;
            }
            
            if (formData.teacher.hasAdminRole && 
                (!formData.teacher.adminRole.service || !formData.teacher.adminRole.function)) {
                setError('Veuillez remplir les informations du rôle administratif.');
                return false;
            }
        } else if (role === 'admin') {
            if (!formData.admin.university || !formData.admin.service || !formData.admin.function) {
                setError('Veuillez remplir tous les champs administration.');
                return false;
            }
            
            if (formData.admin.hasTeacherRole && !formData.admin.teacherRole.subjects) {
                setError('Veuillez remplir les matières enseignées.');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        setError('');

        try {
            // Préparation des données
            const submissionData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email,
                emailPassword: formData.emailPassword,
                role: role,
                password: formData.password
            };

            // Ajout des données spécifiques au rôle
            if (role === 'student') {
                submissionData.student = formData.student;
            } else if (role === 'teacher') {
                submissionData.teacher = {
                    universities: formData.teacher.universities.split(',').map(u => u.trim()),
                    subjects: formData.teacher.subjects.split(',').map(s => s.trim()),
                    status: formData.teacher.status
                };
                
                if (formData.teacher.hasAdminRole) {
                    submissionData.teacher.adminRole = formData.teacher.adminRole;
                }
            } else if (role === 'admin') {
                submissionData.admin = formData.admin;
                
                if (formData.admin.hasTeacherRole) {
                    submissionData.admin.teacherRole = {
                        subjects: formData.admin.teacherRole.subjects.split(',').map(s => s.trim())
                    };
                }
            }

            console.log('📦 Données envoyées:', submissionData);

            // Stockage temporaire (sans le mot de passe email pour sécurité)
            const dataToStore = { ...submissionData };
            delete dataToStore.emailPassword;
            
            sessionStorage.setItem('pendingUser', JSON.stringify(dataToStore));
            
            setAlertMessage({
                show: true,
                text: 'Inscription validée ! Redirection vers la validation...'
            });
            
            setTimeout(() => {
                navigate(`/otp-validation?email=${encodeURIComponent(formData.email)}`);
            }, 2000);

        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className={styles.inscriptionCard}>
                            <Card.Body className="p-4">
                                {/* Logo */}
                                <div className={styles.logo}>
                                    <FaUniversity className={styles.logoIcon} />
                                    <h1>INFO<span>cAMPUS</span></h1>
                                </div>

                                {/* Step badge */}
                                <div className={styles.stepBadge}>
                                    <FaGraduationCap /> Étape 1/2 - Inscription
                                </div>

                                {/* Formulaire */}
                                <Form onSubmit={handleSubmit}>
                                    {/* Identité */}
                                    <h2 className={styles.sectionTitle}>
                                        <FaUserGraduate /> Identité
                                    </h2>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label>
                                                    Prénom <span className={styles.required}>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label>
                                                    Nom <span className={styles.required}>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label>
                                            <FaPhone /> Téléphone <span className={styles.required}>*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="6XX XXX XXX"
                                            required
                                            className={styles.input}
                                        />
                                    </Form.Group>

                                    {/* Email et code */}
                                    <h2 className={styles.sectionTitle}>
                                        <FaEnvelope /> Accès email
                                    </h2>

                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label>
                                            Adresse email <span className={styles.required}>*</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="exemple@gmail.com"
                                            required
                                            className={styles.input}
                                        />
                                        <Form.Text className={styles.note}>
                                            <FaInfoCircle /> C'est ici que vous recevrez le code de validation
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label>
                                            Mot de passe de votre email
                                            <span className={styles.optional}>optionnel</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            id="emailPassword"
                                            value={formData.emailPassword}
                                            onChange={handleInputChange}
                                            placeholder="Mot de passe de votre boîte email"
                                            className={styles.input}
                                        />
                                        <Form.Text className={styles.note}>
                                            <span className={styles.optionalTag}>🔐 Optionnel</span>
                                            Nécessaire pour l'envoi automatique du code. Non stocké sur nos serveurs.
                                        </Form.Text>
                                    </Form.Group>

                                    {/* Sélecteur de rôle */}
                                    <RoleSelector 
                                        role={role}
                                        onRoleChange={handleRoleChange}
                                    />

                                    {/* Champs selon le rôle */}
                                    {role === 'student' && (
                                        <StudentFields 
                                            formData={formData.student}
                                            onChange={handleInputChange}
                                        />
                                    )}

                                    {role === 'teacher' && (
                                        <TeacherFields 
                                            formData={formData.teacher}
                                            onChange={handleInputChange}
                                            onToggleAdmin={toggleTeacherAdmin}
                                        />
                                    )}

                                    {role === 'admin' && (
                                        <AdminFields 
                                            formData={formData.admin}
                                            onChange={handleInputChange}
                                            onToggleTeacher={toggleAdminTeacher}
                                        />
                                    )}

                                    {/* Mot de passe compte */}
                                    <h2 className={styles.sectionTitle}>
                                        <FaLock /> Votre compte INFOcAMPUS
                                    </h2>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label>
                                                    Mot de passe <span className={styles.required}>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    id="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    required
                                                    minLength="6"
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label>
                                                    Confirmer <span className={styles.required}>*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    id="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    required
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Conditions */}
                                    <TermsSection 
                                        checked={formData.terms}
                                        onChange={handleInputChange}
                                    />

                                    {/* Message d'erreur */}
                                    {error && (
                                        <Alert variant="danger" className={styles.alert}>
                                            <FaExclamationTriangle /> {error}
                                        </Alert>
                                    )}

                                    {/* Message de succès */}
                                    {alertMessage.show && (
                                        <Alert variant="success" className={styles.alert}>
                                            <FaCheckCircle /> {alertMessage.text}
                                        </Alert>
                                    )}

                                    {/* Bouton submit */}
                                    <Button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Traitement...
                                            </>
                                        ) : (
                                            <>
                                                <FaEnvelope className="me-2" />
                                                Recevoir le code de validation
                                                <FaArrowRight className="ms-2" />
                                            </>
                                        )}
                                    </Button>
                                </Form>

                                {/* Lien connexion */}
                                <div className={styles.toggleForm}>
                                    Déjà un compte ? <Link to="/login">Se connecter</Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Inscription;