import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUniversity,
  FaUserGraduate,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaGraduationCap,
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
import TeacherUniversityMultiSelect from "../composants/InscriptionForm/TeacherUniversityMultiSelect";


const Inscription = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alertMessage, setAlertMessage] = useState({ show: false, text: '' });
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await api.get('/universities/list');
        setUniversities(response.data.universities);
      } catch (err) {
        console.error('Erreur lors du chargement des universités :', err);
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (token || user) {
        navigate('/profile');
      }
    }
    checkToken();
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',

    student: {
      matricule: '',
      university: '',
      campus: '',
      filiere: '',
      niveau: '',
      groupe: ''
    },

    teacher: {
      matricule: '',
      universities: '',
      subjects: '',
      status: 'permanent',
      hasAdminRole: false,
      adminRole: {
        service: '',
        function: ''
      }
    },

    admin: {
      universities: [], // 🔥 changed to array
      service: '',
      function: '',
      hasTeacherRole: false,
      teacherRole: {
        subjects: ''
      }
    },

    terms: false
  });

  useEffect(() => {
    const pendingUser = sessionStorage.getItem('pendingUser');
    if (pendingUser) {
      // Optionnel
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (id.includes('.')) {
      const [parent, child] = id.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: type === 'checkbox' ? checked : value
      }));
    }

    setError('');
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
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
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Mot de passe minimum 6 caractères.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return false;
    }

    if (!formData.terms) {
      setError('Vous devez accepter les conditions.');
      return false;
    }

    if (role === 'student' && !formData.student.university) {
      setError('Université obligatoire.');
      return false;
    }

    if (role === 'teacher' && formData.teacher.universities.length === 0) {
      setError('Au moins une université requise.');
      return false;
    }


    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const submissionData = {
        email: formData.email,
        password: formData.password,
        status: role,
        roles: [role],
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phone
      };

      // ===== STUDENT =====
      if (role === "student") {
        submissionData.studentUniversityId = formData.student.university;

        submissionData.studentInfo = {
          matricule: formData.student.matricule,
          campusId: formData.student.campus,
          filiere: formData.student.filiere,
          niveau: formData.student.niveau,
          groupe: formData.student.groupe
        };
      }

      // ===== TEACHER =====
      if (role === "teacher") {
        submissionData.teacherUniversityIds = formData.teacher.universities;


        submissionData.teacherInfo = {
          matricule: formData.teacher.matricule,
          subjects: formData.teacher.subjects
            .split(',')
            .map(s => s.trim()),
          status: formData.teacher.status
        };

        if (formData.teacher.hasAdminRole) {
          submissionData.roles.push("admin");

          submissionData.adminInfo = {
            service: formData.teacher.adminRole.service,
            fonction: formData.teacher.adminRole.function,
            departement: ""
          };
        }
      }

      // ===== ADMIN =====
      if (role === "admin") {
        submissionData.adminInfo = {
          service: formData.admin.service,
          fonction: formData.admin.function,
          departement: formData.admin.university
        };

        if (formData.admin.hasTeacherRole) {
          submissionData.roles.push("teacher");

          submissionData.teacherUniversityIds = [
            formData.admin.university
          ];

          submissionData.teacherInfo = {
            subjects: formData.admin.teacherRole.subjects
              .split(',')
              .map(s => s.trim()),
            status: "permanent"
          };
        }
      }

      console.log("📦 Données envoyées :", submissionData);

      await api.post('/auth/register', { submissionData });

      sessionStorage.setItem(
        'pendingUser',
        JSON.stringify(submissionData)
      );

      setAlertMessage({
        show: true,
        text: 'Inscription validée ! Redirection...'
      });

      setTimeout(() => {
        navigate(`/otp-validation?email=${encodeURIComponent(formData.email)}&data=${encodeURIComponent(JSON.stringify(submissionData))}`);
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Erreur serveur.');
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

                <div className={styles.logo}>
                  <FaUniversity className={styles.logoIcon} />
                  <h1>INFO<span>cAMPUS</span></h1>
                </div>

                <div className={styles.stepBadge}>
                  <FaGraduationCap /> Étape 1/2 - Inscription
                </div>

                <Form onSubmit={handleSubmit}>

                  <h2 className={styles.sectionTitle}>
                    <FaUserGraduate /> Identité
                  </h2>

                  <Row>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        id="firstName"
                        placeholder="Prénom"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        id="lastName"
                        placeholder="Nom"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Form.Control
                    className="mt-3"
                    type="tel"
                    id="phone"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />

                  <h2 className={styles.sectionTitle}>
                    <FaEnvelope /> Accès email
                  </h2>

                  <Form.Control
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />

                  <RoleSelector
                    role={role}
                    onRoleChange={handleRoleChange}
                  />

                  {role === 'student' && (
                    <StudentFields
                      universities={universities}
                      formData={formData.student}
                      onChange={handleInputChange}
                    />
                  )}

                  {role === 'teacher' && (
                    <TeacherFields
                      universities={universities}
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

                  <h2 className={styles.sectionTitle}>
                    <FaLock /> Mot de passe
                  </h2>

                  <Row>
                    <Col md={6}>
                      <Form.Control
                        type="password"
                        id="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirmer"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                  </Row>

                  <TermsSection
                    checked={formData.terms}
                    onChange={handleInputChange}
                  />

                  {error && (
                    <Alert variant="danger" className="mt-3">
                      <FaExclamationTriangle /> {error}
                    </Alert>
                  )}

                  {alertMessage.show && (
                    <Alert variant="success" className="mt-3">
                      <FaCheckCircle /> {alertMessage.text}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className={`${styles.submitButton} mt-4`}
                    disabled={loading}
                  >
                    {loading ? 'Traitement...' : (
                      <>
                        <FaEnvelope className="me-2" />
                        Recevoir le code
                        <FaArrowRight className="ms-2" />
                      </>
                    )}
                  </Button>

                </Form>

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
