import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaUserTie,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaUniversity,
  FaSchool,
  FaGraduationCap,
  FaBook,
  FaUsers,
  FaIdCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaBriefcase,
  FaGlobe
} from 'react-icons/fa';
import { MdEmail, MdPassword, MdPhone, MdSchool } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { BsPersonBadge, BsPersonVcard } from 'react-icons/bs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import styles from './Inscription.module.css';

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

const Inscription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('student');
  const [universities, setUniversities] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [universitiesLoading, setUniversitiesLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    student: false,
    teacher: false,
    admin: false
  });
  
  const [formData, setFormData] = useState({
    student: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      phone: '',
      password: '',
      confirmPassword: '',
      universityId: '',
      campusId: '',
      filiere: '',
      niveau: '',
      groupe: '',
      matricule: '',
      terms: false
    },
    teacher: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      phone: '',
      password: '',
      confirmPassword: '',
      universityIds: [],
      subjects: '',
      notificationMode: 'targeted',
      terms: false,
      verification: false
    },
    admin: {
      firstName: '',
      lastName: '',
      email: '',
      confirmEmail: '',
      phone: '',
      password: '',
      confirmPassword: '',
      universityId: '',
      service: '',
      position: '',
      departement: '',
      notificationMode: 'targeted',
      terms: false,
      confidentiality: false,
      verification: false
    }
  });
  
  const [passwordStrength, setPasswordStrength] = useState({
    student: 0,
    teacher: 0,
    admin: 0
  });

  const [errors, setErrors] = useState({
    student: {},
    teacher: {},
    admin: {}
  });

  // Gestion des onglets avec hash URL
  useEffect(() => {
    const hash = location.hash.substring(1);
    if (hash && ['student', 'teacher', 'admin'].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location]);

  // Charger les universités au montage
  useEffect(() => {
    loadUniversities();

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
  }, []);

  // Charger les campus quand l'université change
  useEffect(() => {
    if (formData.student.universityId) {
      loadCampuses(formData.student.universityId);
    }
  }, [formData.student.universityId]);

  // Charger les universités
  const loadUniversities = async () => {
    try {
      setUniversitiesLoading(true);
      const response = await api.get('/universities');
      setUniversities(response.data);
    } catch (error) {
      console.error('Erreur chargement universités:', error);
      showNotification('❌ Impossible de charger la liste des universités', 'danger');
    } finally {
      setUniversitiesLoading(false);
    }
  };

  // Charger les campus
  const loadCampuses = async (universityId) => {
    try {
      const response = await api.get(`/universities/${universityId}/campuses`);
      setCampuses(response.data);
    } catch (error) {
      console.error('Erreur chargement campus:', error);
      showNotification('❌ Impossible de charger la liste des campus', 'danger');
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.history.replaceState(null, null, `#${tabId}`);
  };

  const handleInputChange = (userType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [userType]: {
        ...prev[userType],
        [field]: value
      }
    }));

    // Effacer l'erreur pour ce champ
    if (errors[userType][field]) {
      setErrors(prev => ({
        ...prev,
        [userType]: {
          ...prev[userType],
          [field]: null
        }
      }));
    }

    if (field.includes('password')) {
      checkPasswordStrength(userType, value);
    }
  };

  const togglePasswordVisibility = (userType) => {
    setShowPasswords(prev => ({
      ...prev,
      [userType]: !prev[userType]
    }));
  };

  const checkPasswordStrength = (userType, password) => {
    if (!password) {
      setPasswordStrength(prev => ({ ...prev, [userType]: 0 }));
      return;
    }

    let strength = 0;
    
    // Longueur
    if (userType === 'student') {
      if (password.length >= 6) strength++;
      if (password.length >= 8) strength++;
    } else if (userType === 'teacher') {
      if (password.length >= 8) strength++;
      if (password.length >= 12) strength++;
    } else if (userType === 'admin') {
      if (password.length >= 10) strength++;
      if (password.length >= 14) strength++;
    }
    
    // Complexité
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    setPasswordStrength(prev => ({ ...prev, [userType]: Math.min(strength, 5) }));
  };

  const getPasswordStrengthClass = (userType) => {
    const strength = passwordStrength[userType];
    if (strength <= 2) return styles.strengthWeak;
    if (strength <= 3) return styles.strengthMedium;
    return styles.strengthStrong;
  };

  const getPasswordStrengthText = (userType) => {
    const strength = passwordStrength[userType];
    const data = formData[userType];
    
    if (!data.password) {
      const minLength = userType === 'admin' ? 10 : userType === 'teacher' ? 8 : 6;
      return `Minimum ${minLength} caractères${userType === 'admin' ? ' (sécurité renforcée)' : ''}`;
    }
    
    if (strength <= 2) {
      return userType === 'admin' ? '⚠️ Mot de passe trop faible' : '⚠️ Mot de passe faible';
    }
    if (strength <= 3) {
      return '✓ Mot de passe moyen';
    }
    return '✓ Mot de passe fort';
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const validateField = (userType, field, value, allData) => {
    const newErrors = { ...errors[userType] };

    switch(field) {
      case 'email':
      case 'confirmEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field === 'email' && !emailRegex.test(value)) {
          newErrors.email = 'Format d\'email invalide';
        } else if (field === 'confirmEmail' && value !== allData.email) {
          newErrors.confirmEmail = 'Les emails ne correspondent pas';
        }
        break;

      case 'password':
        const minLength = userType === 'admin' ? 10 : userType === 'teacher' ? 8 : 6;
        if (value.length < minLength) {
          newErrors.password = `Minimum ${minLength} caractères`;
        }
        break;

      case 'confirmPassword':
        if (value !== allData.password) {
          newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        break;

      case 'phone':
        if (value && !/^\+?[0-9\s\-()]{8,}$/.test(value)) {
          newErrors.phone = 'Format de téléphone invalide';
        } else {
          delete newErrors.phone;
        }
        break;

      default:
        if (!value && allData.requiredFields?.includes(field)) {
          newErrors[field] = 'Ce champ est requis';
        }
    }

    setErrors(prev => ({
      ...prev,
      [userType]: newErrors
    }));

    return Object.keys(newErrors).length === 0;
  };

  const validateFormData = (userType) => {
    const data = formData[userType];
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Champs communs
    if (!data.firstName?.trim()) newErrors.firstName = 'Prénom requis';
    if (!data.lastName?.trim()) newErrors.lastName = 'Nom requis';
    
    if (!emailRegex.test(data.email)) newErrors.email = 'Email invalide';
    if (data.email !== data.confirmEmail) newErrors.confirmEmail = 'Les emails ne correspondent pas';

    const minLength = userType === 'admin' ? 10 : userType === 'teacher' ? 8 : 6;
    if (data.password.length < minLength) {
      newErrors.password = `Minimum ${minLength} caractères`;
    }
    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation spécifique par type
    switch(userType) {
      case 'student':
        if (!data.universityId) newErrors.universityId = 'Université requise';
        if (!data.filiere?.trim()) newErrors.filiere = 'Filière requise';
        if (!data.niveau) newErrors.niveau = 'Niveau requis';
        if (!data.terms) newErrors.terms = 'Vous devez accepter les conditions';
        break;
        
      case 'teacher':
        if (!data.phone?.trim()) newErrors.phone = 'Téléphone requis';
        if (!data.universityIds?.length) newErrors.universityIds = 'Au moins une université requise';
        if (!data.subjects?.trim()) newErrors.subjects = 'Matière(s) requise(s)';
        if (!data.terms) newErrors.terms = 'Conditions requises';
        if (!data.verification) newErrors.verification = 'Certification requise';
        break;
        
      case 'admin':
        if (!data.phone?.trim()) newErrors.phone = 'Téléphone requis';
        if (!data.universityId) newErrors.universityId = 'Université requise';
        if (!data.service?.trim()) newErrors.service = 'Service requis';
        if (!data.position?.trim()) newErrors.position = 'Fonction requise';
        if (!data.terms) newErrors.terms = 'Conditions requises';
        if (!data.confidentiality) newErrors.confidentiality = 'Confidentialité requise';
        if (!data.verification) newErrors.verification = 'Certification requise';
        break;
    }

    setErrors(prev => ({ ...prev, [userType]: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const prepareSubmissionData = (userType) => {
    const data = formData[userType];
    const baseData = {
      status: userType,
      roles: [userType]
    };

    switch(userType) {
      case 'student':
        return {
          ...baseData,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email.toLowerCase(),
          password: data.password,
          phoneNumber: data.phone || undefined,
          universityId: data.universityId,
          campusId: data.campusId || null,
          filiere: data.filiere,
          niveau: data.niveau,
          groupe: data.groupe || undefined,
          matricule: data.matricule || undefined
        };
        
      case 'teacher':
        return {
          ...baseData,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email.toLowerCase(),
          password: data.password,
          phoneNumber: data.phone,
          universityIds: data.universityIds,
          subjects: data.subjects.split(',').map(s => s.trim()).filter(s => s),
          notificationMode: data.notificationMode
        };
        
      case 'admin':
        return {
          ...baseData,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email.toLowerCase(),
          password: data.password,
          phoneNumber: data.phone,
          universityId: data.universityId,
          service: data.service,
          position: data.position,
          departement: data.departement || undefined,
          notificationMode: data.notificationMode
        };
        
      default:
        return baseData;
    }
  };

  const handleSubmit = async (userType, event) => {
    event.preventDefault();
    
    if (!validateFormData(userType)) {
      showNotification('❌ Veuillez corriger les erreurs dans le formulaire', 'danger');
      return;
    }

    setLoading(true);

    try {
      const submissionData = prepareSubmissionData(userType);
      
      const response = await api.post('/auth/register', submissionData);

      if (response.data.success) {
        showNotification('✅ Compte créé avec succès !', 'success');
        
        // Notification PWA
        if (Notification.permission === 'granted') {
          new Notification('Inscription réussie!', {
            body: `Bienvenue sur INFOcAMPUS`,
            icon: '/icon-192x192.png'
          });
        }
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        showNotification(`❌ ${response.data.error || 'Erreur lors de l\'inscription'}`, 'danger');
      }

    } catch (error) {
      console.error('Erreur inscription:', error);
      
      if (error.code === 'ECONNABORTED') {
        showNotification('❌ Délai de connexion dépassé', 'danger');
      } else if (error.response) {
        showNotification(`❌ ${error.response.data.error || 'Erreur serveur'}`, 'danger');
      } else if (error.request) {
        showNotification('❌ Serveur indisponible', 'danger');
      } else {
        showNotification('❌ Erreur de connexion', 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer la sélection multiple d'universités
  const handleTeacherUniversityChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map(option => option.value);
    handleInputChange('teacher', 'universityIds', selectedIds);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.background}></div>
      
      <Container className={styles.container}>
        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            <Card className={styles.registerCard}>
              <Card.Body className="p-4 p-md-5">
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

                {/* Logo */}
                <div className={styles.logoContainer}>
                  <div className={styles.logoWrapper}>
                    <FaUniversity className={styles.mainLogo} />
                  </div>
                  <h1 className={styles.title}>INFOcAMPUS</h1>
                  <p className={styles.subtitle}>
                    Plateforme de communication universitaire
                  </p>
                </div>

                {/* Navigation par onglets avec React-Bootstrap */}
                <div className={styles.tabContainer}>
                  <Nav variant="tabs" activeKey={activeTab} onSelect={handleTabChange} className={styles.tabs}>
                    <Nav.Item>
                      <Nav.Link eventKey="student" className={styles.tab}>
                        <FaUserGraduate className={styles.tabIcon} />
                        <span>Étudiant</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="teacher" className={styles.tab}>
                        <FaChalkboardTeacher className={styles.tabIcon} />
                        <span>Enseignant</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="admin" className={styles.tab}>
                        <FaUserTie className={styles.tabIcon} />
                        <span>Administration</span>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>

                {/* Contenu des onglets */}
                <Tab.Container activeKey={activeTab}>
                  <Tab.Content>
                    <Tab.Pane eventKey="student">
                      <StudentTab 
                        formData={formData.student}
                        universities={universities}
                        campuses={campuses}
                        universitiesLoading={universitiesLoading}
                        passwordStrength={passwordStrength.student}
                        showPassword={showPasswords.student}
                        errors={errors.student}
                        getPasswordStrengthClass={() => getPasswordStrengthClass('student')}
                        getPasswordStrengthText={() => getPasswordStrengthText('student')}
                        onChange={(field, value) => handleInputChange('student', field, value)}
                        onUniversityChange={(universityId) => {
                          handleInputChange('student', 'universityId', universityId);
                        }}
                        onTogglePassword={() => togglePasswordVisibility('student')}
                        onBlur={(field) => validateField('student', field, formData.student[field], formData.student)}
                        onSubmit={(e) => handleSubmit('student', e)}
                        loading={loading}
                      />
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="teacher">
                      <TeacherTab 
                        formData={formData.teacher}
                        universities={universities}
                        universitiesLoading={universitiesLoading}
                        passwordStrength={passwordStrength.teacher}
                        showPassword={showPasswords.teacher}
                        errors={errors.teacher}
                        getPasswordStrengthClass={() => getPasswordStrengthClass('teacher')}
                        getPasswordStrengthText={() => getPasswordStrengthText('teacher')}
                        onChange={(field, value) => handleInputChange('teacher', field, value)}
                        onUniversityChange={handleTeacherUniversityChange}
                        onTogglePassword={() => togglePasswordVisibility('teacher')}
                        onBlur={(field) => validateField('teacher', field, formData.teacher[field], formData.teacher)}
                        onSubmit={(e) => handleSubmit('teacher', e)}
                        loading={loading}
                      />
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="admin">
                      <AdminTab 
                        formData={formData.admin}
                        universities={universities}
                        universitiesLoading={universitiesLoading}
                        passwordStrength={passwordStrength.admin}
                        showPassword={showPasswords.admin}
                        errors={errors.admin}
                        getPasswordStrengthClass={() => getPasswordStrengthClass('admin')}
                        getPasswordStrengthText={() => getPasswordStrengthText('admin')}
                        onChange={(field, value) => handleInputChange('admin', field, value)}
                        onTogglePassword={() => togglePasswordVisibility('admin')}
                        onBlur={(field) => validateField('admin', field, formData.admin[field], formData.admin)}
                        onSubmit={(e) => handleSubmit('admin', e)}
                        loading={loading}
                      />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>

                {/* Lien vers connexion */}
                <div className={styles.loginLink}>
                  Déjà inscrit ? <Link to="/login">Se connecter</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Sous-composant Étudiant
const StudentTab = ({ 
  formData, 
  universities, 
  campuses, 
  universitiesLoading, 
  passwordStrength,
  showPassword,
  errors,
  getPasswordStrengthClass,
  getPasswordStrengthText,
  onChange, 
  onUniversityChange,
  onTogglePassword,
  onBlur,
  onSubmit, 
  loading 
}) => (
  <div className={styles.tabContent}>
    <div className={styles.userTypeBadge}>
      <FaUserGraduate className={styles.badgeIcon} />
      <span>Inscription Étudiant</span>
    </div>

    <Form onSubmit={onSubmit} className={styles.form}>
      {/* Section Informations personnelles */}
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <BsPersonBadge className={styles.sectionIcon} />
          <span>Informations personnelles</span>
        </div>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>
                Prénom <span className={styles.required}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
                onBlur={() => onBlur('firstName')}
                placeholder="Votre prénom"
                isInvalid={!!errors.firstName}
                disabled={loading}
                className={styles.input}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>
                Nom <span className={styles.required}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) => onChange('lastName', e.target.value)}
                onBlur={() => onBlur('lastName')}
                placeholder="Votre nom"
                isInvalid={!!errors.lastName}
                disabled={loading}
                className={styles.input}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <MdEmail className={styles.inputIcon} /> Email universitaire <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            onBlur={() => onBlur('email')}
            placeholder="prenom.nom@universite.cm"
            isInvalid={!!errors.email}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
          <Form.Text className={styles.helpText}>
            Utilisez votre email universitaire officiel
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaEnvelope className={styles.inputIcon} /> Confirmer l'email <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="email"
            value={formData.confirmEmail}
            onChange={(e) => onChange('confirmEmail', e.target.value)}
            onBlur={() => onBlur('confirmEmail')}
            placeholder="Confirmez votre email"
            isInvalid={!!errors.confirmEmail}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmEmail}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaPhone className={styles.inputIcon} /> Téléphone
          </Form.Label>
          <Form.Control
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            placeholder="+237 6XX XXX XXX"
            isInvalid={!!errors.phone}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phone}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* Section Sécurité */}
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <FaLock className={styles.sectionIcon} />
          <span>Sécurité du compte</span>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <RiLockPasswordFill className={styles.inputIcon} /> Mot de passe <span className={styles.required}>*</span>
          </Form.Label>
          <div className={styles.passwordInput}>
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              onBlur={() => onBlur('password')}
              placeholder="••••••••"
              isInvalid={!!errors.password}
              disabled={loading}
              className={styles.input}
            />
            <Button
              variant="link"
              onClick={onTogglePassword}
              className={styles.passwordToggle}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </div>
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
          
          <div className={styles.passwordStrength}>
            <div className={styles.strengthBar}>
              <div 
                className={`${styles.strengthBarFill} ${getPasswordStrengthClass()}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
            <small className={styles.strengthText}>
              {getPasswordStrengthText()}
            </small>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaLock className={styles.inputIcon} /> Confirmer le mot de passe <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            onBlur={() => onBlur('confirmPassword')}
            placeholder="••••••••"
            isInvalid={!!errors.confirmPassword}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* Section Académique */}
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <FaGraduationCap className={styles.sectionIcon} />
          <span>Informations académiques</span>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaUniversity className={styles.inputIcon} /> Université <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Select
            value={formData.universityId}
            onChange={(e) => onUniversityChange(e.target.value)}
            onBlur={() => onBlur('universityId')}
            isInvalid={!!errors.universityId}
            disabled={universitiesLoading || loading}
            className={styles.select}
          >
            <option value="">
              {universitiesLoading ? 'Chargement...' : 'Choisissez votre université'}
            </option>
            {universities.map(univ => (
              <option key={univ._id} value={univ._id}>
                {univ.name} ({univ.code})
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.universityId}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaSchool className={styles.inputIcon} /> Campus
          </Form.Label>
          <Form.Select
            value={formData.campusId}
            onChange={(e) => onChange('campusId', e.target.value)}
            disabled={!formData.universityId || loading}
            className={styles.select}
          >
            <option value="">
              {!formData.universityId 
                ? 'Sélectionnez d\'abord une université' 
                : 'Choisissez votre campus (optionnel)'}
            </option>
            {campuses.map(campus => (
              <option key={campus._id} value={campus._id}>
                {campus.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>
                <FaBook className={styles.inputIcon} /> Filière <span className={styles.required}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.filiere}
                onChange={(e) => onChange('filiere', e.target.value)}
                onBlur={() => onBlur('filiere')}
                placeholder="Ex: Génie Logiciel"
                isInvalid={!!errors.filiere}
                disabled={loading}
                className={styles.input}
              />
              <Form.Control.Feedback type="invalid">
                {errors.filiere}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>
                <FaGraduationCap className={styles.inputIcon} /> Niveau <span className={styles.required}>*</span>
              </Form.Label>
              <Form.Select
                value={formData.niveau}
                onChange={(e) => onChange('niveau', e.target.value)}
                onBlur={() => onBlur('niveau')}
                isInvalid={!!errors.niveau}
                disabled={loading}
                className={styles.select}
              >
                <option value="">Votre niveau</option>
                <option value="1ere-annee">1ère Année</option>
                <option value="2eme-annee">2ème Année</option>
                <option value="3eme-annee">3ème Année</option>
                <option value="4eme-annee">4ème Année</option>
                <option value="5eme-annee">5ème Année</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.niveau}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaUsers className={styles.inputIcon} /> Groupe
          </Form.Label>
          <Form.Control
            type="text"
            value={formData.groupe}
            onChange={(e) => onChange('groupe', e.target.value)}
            placeholder="Ex: Jours, Soirs, A, B"
            disabled={loading}
            className={styles.input}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaIdCard className={styles.inputIcon} /> Matricule
          </Form.Label>
          <Form.Control
            type="text"
            value={formData.matricule}
            onChange={(e) => onChange('matricule', e.target.value)}
            placeholder="Votre numéro de matricule"
            disabled={loading}
            className={styles.input}
          />
        </Form.Group>
      </div>

      {/* Conditions */}
      <Form.Group className="mb-4">
        <div className={styles.checkboxGroup}>
          <Form.Check
            type="checkbox"
            id="studentTerms"
            checked={formData.terms}
            onChange={(e) => onChange('terms', e.target.checked)}
            isInvalid={!!errors.terms}
            disabled={loading}
            label={
              <span>
                J'accepte les <a href="#" target="_blank" rel="noopener noreferrer">conditions d'utilisation</a> et la <a href="#" target="_blank" rel="noopener noreferrer">politique de confidentialité</a> d'INFOcAMPUS
              </span>
            }
          />
          {errors.terms && (
            <Form.Text className={styles.errorText}>
              <FaExclamationTriangle /> {errors.terms}
            </Form.Text>
          )}
        </div>
      </Form.Group>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        className={`${styles.submitButton} ${styles.studentButton}`}
        disabled={loading}
        size="lg"
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Création du compte...
          </>
        ) : (
          <>
            <FaUserGraduate className="me-2" />
            Créer mon compte étudiant
            <FaArrowRight className="ms-2" />
          </>
        )}
      </Button>
    </Form>
  </div>
);

// Sous-composant Enseignant
const TeacherTab = ({ 
  formData, 
  universities, 
  universitiesLoading, 
  passwordStrength,
  showPassword,
  errors,
  getPasswordStrengthClass,
  getPasswordStrengthText,
  onChange, 
  onUniversityChange,
  onTogglePassword,
  onBlur,
  onSubmit, 
  loading 
}) => (
  <div className={styles.tabContent}>
    <div className={styles.userTypeBadge}>
      <FaChalkboardTeacher className={styles.badgeIcon} />
      <span>Inscription Enseignant</span>
    </div>

    <Alert variant="info" className={styles.infoAlert}>
      <FaInfoCircle className="me-2" />
      <strong>Attention :</strong> Un enseignant peut être associé à plusieurs universités.
    </Alert>

    <Form onSubmit={onSubmit} className={styles.form}>
      {/* Section Informations personnelles */}
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <BsPersonBadge className={styles.sectionIcon} />
          <span>Informations personnelles</span>
        </div>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>
                Prénom <span className={styles.required}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
                onBlur={() => onBlur('firstName')}
                placeholder="Votre prénom"
                isInvalid={!!errors.firstName}
                disabled={loading}
                className={styles.input}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>
                Nom <span className={styles.required}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) => onChange('lastName', e.target.value)}
                onBlur={() => onBlur('lastName')}
                placeholder="Votre nom"
                isInvalid={!!errors.lastName}
                disabled={loading}
                className={styles.input}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <MdEmail className={styles.inputIcon} /> Email professionnel <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            onBlur={() => onBlur('email')}
            placeholder="votre.email@institution.educ"
            isInvalid={!!errors.email}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaEnvelope className={styles.inputIcon} /> Confirmer l'email <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="email"
            value={formData.confirmEmail}
            onChange={(e) => onChange('confirmEmail', e.target.value)}
            onBlur={() => onBlur('confirmEmail')}
            placeholder="Confirmez votre email"
            isInvalid={!!errors.confirmEmail}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmEmail}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaPhone className={styles.inputIcon} /> Téléphone <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            placeholder="+237 6XX XXX XXX"
            isInvalid={!!errors.phone}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phone}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* Section Sécurité */}
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <FaLock className={styles.sectionIcon} />
          <span>Sécurité du compte</span>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <RiLockPasswordFill className={styles.inputIcon} /> Mot de passe <span className={styles.required}>*</span>
          </Form.Label>
          <div className={styles.passwordInput}>
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              onBlur={() => onBlur('password')}
              placeholder="••••••••"
              isInvalid={!!errors.password}
              disabled={loading}
              className={styles.input}
            />
            <Button
              variant="link"
              onClick={onTogglePassword}
              className={styles.passwordToggle}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </div>
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
          
          <div className={styles.passwordStrength}>
            <div className={styles.strengthBar}>
              <div 
                className={`${styles.strengthBarFill} ${getPasswordStrengthClass()}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
            <small className={styles.strengthText}>
              {getPasswordStrengthText()}
            </small>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaLock className={styles.inputIcon} /> Confirmer le mot de passe <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            onBlur={() => onBlur('confirmPassword')}
            placeholder="••••••••"
            isInvalid={!!errors.confirmPassword}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* Section Professionnelle */}
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <FaBook className={styles.sectionIcon} />
          <span>Informations professionnelles</span>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaUniversity className={styles.inputIcon} /> Université(s) où vous enseignez <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Select
            multiple
            value={formData.universityIds}
            onChange={onUniversityChange}
            onBlur={() => onBlur('universityIds')}
            isInvalid={!!errors.universityIds}
            disabled={universitiesLoading || loading}
            className={`${styles.select} ${styles.multiSelect}`}
            style={{ height: '100px' }}
          >
            {universities.map(univ => (
              <option key={univ._id} value={univ._id}>
                {univ.name} ({univ.code})
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.universityIds}
          </Form.Control.Feedback>
          <Form.Text className={styles.helpText}>
            Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs universités
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaBook className={styles.inputIcon} /> Matière(s) enseignée(s) <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={formData.subjects}
            onChange={(e) => onChange('subjects', e.target.value)}
            onBlur={() => onBlur('subjects')}
            placeholder="Ex: Programmation Web, Base de données"
            isInvalid={!!errors.subjects}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.subjects}
          </Form.Control.Feedback>
          <Form.Text className={styles.helpText}>
            Séparez par des virgules si plusieurs matières
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaGlobe className={styles.inputIcon} /> Mode de notification
          </Form.Label>
          <Form.Select
            value={formData.notificationMode}
            onChange={(e) => onChange('notificationMode', e.target.value)}
            disabled={loading}
            className={styles.select}
          >
            <option value="targeted">Notifications ciblées uniquement</option>
            <option value="all">Toutes les notifications</option>
            <option value="none">Aucune notification</option>
          </Form.Select>
        </Form.Group>
      </div>

      {/* Conditions */}
      <Form.Group className="mb-3">
        <div className={styles.checkboxGroup}>
          <Form.Check
            type="checkbox"
            id="teacherTerms"
            checked={formData.terms}
            onChange={(e) => onChange('terms', e.target.checked)}
            isInvalid={!!errors.terms}
            disabled={loading}
            label={
              <span>
                J'accepte les <a href="#" target="_blank" rel="noopener noreferrer">conditions d'utilisation</a> et la <a href="#" target="_blank" rel="noopener noreferrer">politique de confidentialité</a> d'INFOcAMPUS
              </span>
            }
          />
          {errors.terms && (
            <Form.Text className={styles.errorText}>
              <FaExclamationTriangle /> {errors.terms}
            </Form.Text>
          )}
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <div className={styles.checkboxGroup}>
          <Form.Check
            type="checkbox"
            id="teacherVerification"
            checked={formData.verification}
            onChange={(e) => onChange('verification', e.target.checked)}
            isInvalid={!!errors.verification}
            disabled={loading}
            label="Je certifie que je suis un enseignant autorisé à utiliser cette plateforme"
          />
          {errors.verification && (
            <Form.Text className={styles.errorText}>
              <FaExclamationTriangle /> {errors.verification}
            </Form.Text>
          )}
        </div>
      </Form.Group>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        className={`${styles.submitButton} ${styles.teacherButton}`}
        disabled={loading}
        size="lg"
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Création du compte...
          </>
        ) : (
          <>
            <FaChalkboardTeacher className="me-2" />
            Créer mon compte enseignant
            <FaArrowRight className="ms-2" />
          </>
        )}
      </Button>
    </Form>
  </div>
);

// Sous-composant Admin
const AdminTab = ({ 
  formData, 
  universities, 
  universitiesLoading, 
  passwordStrength,
  showPassword,
  errors,
  getPasswordStrengthClass,
  getPasswordStrengthText,
  onChange, 
  onTogglePassword,
  onBlur,
  onSubmit, 
  loading 
}) => (
  <div className={styles.tabContent}>
    <div className={styles.userTypeBadge}>
      <FaUserTie className={styles.badgeIcon} />
      <span>Inscription Administration</span>
    </div>

    <Alert variant="warning" className={styles.warningAlert}>
      <FaExclamationTriangle className="me-2" />
      <strong>Accès restreint :</strong> Cette inscription est réservée aux membres officiels de l'administration universitaire.
    </Alert>

    <div className={styles.privilegeInfo}>
      <h4><FaLock /> Privilèges du compte Administration</h4>
      <ul>
        <li><FaCheckCircle /> Publication d'annonces officielles</li>
        <li><FaCheckCircle /> Gestion des comptes utilisateurs</li>
        <li><FaCheckCircle /> Accès aux statistiques globales</li>
        <li><FaCheckCircle /> Modération des publications</li>
      </ul>
    </div>

    <Form onSubmit={onSubmit} className={styles.form}>
      {/* Section Informations personnelles */}
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <BsPersonBadge className={styles.sectionIcon} />
          <span>Informations personnelles</span>
        </div>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>
                Prénom <span className={styles.required}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
                onBlur={() => onBlur('firstName')}
                placeholder="Votre prénom"
                isInvalid={!!errors.firstName}
                disabled={loading}
                className={styles.input}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className={styles.label}>
                Nom <span className={styles.required}>*</span>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={(e) => onChange('lastName', e.target.value)}
                onBlur={() => onBlur('lastName')}
                placeholder="Votre nom"
                isInvalid={!!errors.lastName}
                disabled={loading}
                className={styles.input}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <MdEmail className={styles.inputIcon} /> Email administratif <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
            onBlur={() => onBlur('email')}
            placeholder="votre.nom@admin.universite.cm"
            isInvalid={!!errors.email}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.email}
          </Form.Control.Feedback>
          <Form.Text className={styles.helpText}>
            Utilisez votre email administratif officiel
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaEnvelope className={styles.inputIcon} /> Confirmer l'email <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="email"
            value={formData.confirmEmail}
            onChange={(e) => onChange('confirmEmail', e.target.value)}
            onBlur={() => onBlur('confirmEmail')}
            placeholder="Confirmez votre email"
            isInvalid={!!errors.confirmEmail}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmEmail}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaPhone className={styles.inputIcon} /> Téléphone <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            placeholder="+237 6XX XXX XXX"
            isInvalid={!!errors.phone}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.phone}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* Section Sécurité */}
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <FaLock className={styles.sectionIcon} />
          <span>Sécurité du compte</span>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <RiLockPasswordFill className={styles.inputIcon} /> Mot de passe <span className={styles.required}>*</span>
          </Form.Label>
          <div className={styles.passwordInput}>
            <Form.Control
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => onChange('password', e.target.value)}
              onBlur={() => onBlur('password')}
              placeholder="••••••••"
              isInvalid={!!errors.password}
              disabled={loading}
              className={styles.input}
            />
            <Button
              variant="link"
              onClick={onTogglePassword}
              className={styles.passwordToggle}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </div>
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
          
          <div className={styles.passwordStrength}>
            <div className={styles.strengthBar}>
              <div 
                className={`${styles.strengthBarFill} ${getPasswordStrengthClass()}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
            <small className={styles.strengthText}>
              {getPasswordStrengthText()}
            </small>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaLock className={styles.inputIcon} /> Confirmer le mot de passe <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            onBlur={() => onBlur('confirmPassword')}
            placeholder="••••••••"
            isInvalid={!!errors.confirmPassword}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      {/* Section Administrative */}
      <div className={styles.formSection}>
        <div className={styles.sectionTitle}>
          <FaBuilding className={styles.sectionIcon} />
          <span>Fonction administrative</span>
        </div>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaUniversity className={styles.inputIcon} /> Université <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Select
            value={formData.universityId}
            onChange={(e) => onChange('universityId', e.target.value)}
            onBlur={() => onBlur('universityId')}
            isInvalid={!!errors.universityId}
            disabled={universitiesLoading || loading}
            className={styles.select}
          >
            <option value="">
              {universitiesLoading ? 'Chargement...' : 'Choisissez votre université'}
            </option>
            {universities.map(univ => (
              <option key={univ._id} value={univ._id}>
                {univ.name} ({univ.code})
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.universityId}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaBuilding className={styles.inputIcon} /> Service <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={formData.service}
            onChange={(e) => onChange('service', e.target.value)}
            onBlur={() => onBlur('service')}
            placeholder="Ex: Scolarité"
            isInvalid={!!errors.service}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.service}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaBriefcase className={styles.inputIcon} /> Fonction/Poste <span className={styles.required}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            value={formData.position}
            onChange={(e) => onChange('position', e.target.value)}
            onBlur={() => onBlur('position')}
            placeholder="Ex: Chef de service Scolarité"
            isInvalid={!!errors.position}
            disabled={loading}
            className={styles.input}
          />
          <Form.Control.Feedback type="invalid">
            {errors.position}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaBuilding className={styles.inputIcon} /> Département
          </Form.Label>
          <Form.Control
            type="text"
            value={formData.departement}
            onChange={(e) => onChange('departement', e.target.value)}
            placeholder="Ex: Informatique"
            disabled={loading}
            className={styles.input}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>
            <FaGlobe className={styles.inputIcon} /> Mode de notification
          </Form.Label>
          <Form.Select
            value={formData.notificationMode}
            onChange={(e) => onChange('notificationMode', e.target.value)}
            disabled={loading}
            className={styles.select}
          >
            <option value="targeted">Notifications ciblées uniquement</option>
            <option value="all">Toutes les notifications</option>
            <option value="none">Aucune notification</option>
          </Form.Select>
        </Form.Group>
      </div>

      {/* Conditions */}
      <Form.Group className="mb-3">
        <div className={styles.checkboxGroup}>
          <Form.Check
            type="checkbox"
            id="adminTerms"
            checked={formData.terms}
            onChange={(e) => onChange('terms', e.target.checked)}
            isInvalid={!!errors.terms}
            disabled={loading}
            label={
              <span>
                J'accepte les <a href="#" target="_blank" rel="noopener noreferrer">conditions d'utilisation</a> et m'engage à respecter la <a href="#" target="_blank" rel="noopener noreferrer">charte d'utilisation administrative</a>
              </span>
            }
          />
          {errors.terms && (
            <Form.Text className={styles.errorText}>
              <FaExclamationTriangle /> {errors.terms}
            </Form.Text>
          )}
        </div>
      </Form.Group>

      <Form.Group className="mb-3">
        <div className={styles.checkboxGroup}>
          <Form.Check
            type="checkbox"
            id="adminConfidentiality"
            checked={formData.confidentiality}
            onChange={(e) => onChange('confidentiality', e.target.checked)}
            isInvalid={!!errors.confidentiality}
            disabled={loading}
            label="Je m'engage à respecter la confidentialité des données auxquelles j'aurai accès"
          />
          {errors.confidentiality && (
            <Form.Text className={styles.errorText}>
              <FaExclamationTriangle /> {errors.confidentiality}
            </Form.Text>
          )}
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <div className={styles.checkboxGroup}>
          <Form.Check
            type="checkbox"
            id="adminVerification"
            checked={formData.verification}
            onChange={(e) => onChange('verification', e.target.checked)}
            isInvalid={!!errors.verification}
            disabled={loading}
            label="Je certifie que je suis un membre autorisé de l'administration universitaire"
          />
          {errors.verification && (
            <Form.Text className={styles.errorText}>
              <FaExclamationTriangle /> {errors.verification}
            </Form.Text>
          )}
        </div>
      </Form.Group>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        className={`${styles.submitButton} ${styles.adminButton}`}
        disabled={loading}
        size="lg"
      >
        {loading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            Création du compte...
          </>
        ) : (
          <>
            <FaUserTie className="me-2" />
            Créer mon compte administrateur
            <FaArrowRight className="ms-2" />
          </>
        )}
      </Button>
    </Form>
  </div>
);

export default Inscription;