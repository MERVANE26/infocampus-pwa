import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../composants/LanguageSwitcher';
import { FaCheckCircle, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import RoleSelector from '../composants/InscriptionForm/RoleSelector';
import StudentFields from '../composants/InscriptionForm/StudentFields';
import TeacherFields from '../composants/InscriptionForm/TeacherFields';
import AdminFields from '../composants/InscriptionForm/AdminFields';
import TermsSection from '../composants/InscriptionForm/TermsSection';
import loginStyles from './Connexion.module.css';
import { api } from '../lib/api';
import { LOGO } from '../assets';


const Inscription = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [role, setRole] = useState('student');
  const [currentStep, setCurrentStep] = useState(1);
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
      setError(t('auth.fillAllFields'));
      return false;
    }

    if (formData.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return false;
    }

    if (!formData.terms) {
      setError(t('auth.acceptTerms'));
      return false;
    }

    if (role === 'student' && !formData.student.university) {
      setError(t('auth.universityRequired'));
      return false;
    }

    if (role === 'teacher' && formData.teacher.universities.length === 0) {
      setError(t('auth.atLeastOneUniversity'));
      return false;
    }

    return true;
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
          setError(t('auth.fillAllFields'));
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError(t('auth.invalidEmail'));
          return false;
        }

        return true;
      case 2:
        // Role is always set; just ensure it exists
        return true;
      case 3:
        if (role === 'student' && !formData.student.university) {
          setError(t('auth.universityRequired'));
          return false;
        }
        if (role === 'teacher' && formData.teacher.universities.length === 0) {
          setError(t('auth.atLeastOneUniversity'));
          return false;
        }

        return true;
      case 4:
        return validateForm();
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      setError('');
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const goToPreviousStep = () => {
    setError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
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
        text: t('auth.registerSuccess')
      });

      setTimeout(() => {
        navigate(`/otp-validation?email=${encodeURIComponent(formData.email)}&data=${encodeURIComponent(JSON.stringify(submissionData))}`);
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || t('errors.serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.loginContainer}>
      <Container fluid className={loginStyles.containerWrapper}>
        <Row className="align-items-center min-vh-100 g-4">
          <Col lg={6} xs={12} className={`${loginStyles.featuresColumn} d-none d-lg-flex`}>
            <div className={loginStyles.featuresContent}>
              <h1 className={loginStyles.featuresTitle}>{t('common.appName')}</h1>
              <p className={loginStyles.featuresSubtitle}>{t('common.slogan')}</p>

              <div className={loginStyles.featuresList}>
                {[
                  { step: 1, title: t('auth.step1Title') },
                  { step: 2, title: t('auth.step2Title') },
                  { step: 3, title: t('auth.step3Title') },
                  { step: 4, title: t('auth.step4Title') }
                ].map((item) => (
                  <button
                    key={item.step}
                    type="button"
                    className={`${loginStyles.stepItem} ${currentStep === item.step ? loginStyles.stepItemActive : ''}`}
                    onClick={() => setCurrentStep(item.step)}
                  >
                    <div className={loginStyles.stepNumber}>{item.step}</div>
                    <div>
                      <h6>{item.title}</h6>
                      <p className={loginStyles.stepItemText}>{t(`auth.step${item.step}Desc`)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Col>

          <Col lg={6} xs={12} className={loginStyles.formColumn}>
            <Card className={loginStyles.loginCard}>
              <Card.Body className={loginStyles.cardBody}>
                <div className={loginStyles.headerSection}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className={loginStyles.brandHeader}>
                      <img src={LOGO} alt={t('common.appName')} className={loginStyles.brandLogo} />
                      <h2 className={loginStyles.formTitle}>{t('auth.register')}</h2>
                    </div>
                    <LanguageSwitcher />
                  </div>
                  <p className={loginStyles.formSubtitle}>{t('auth.createAccountSubtitle')}</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <div className={loginStyles.stepHeader}>
                    <div className={loginStyles.stepInfo}>
                      <span className={loginStyles.stepNumber}>{t('auth.step')} {currentStep}/4</span>
                      <h5 className={loginStyles.stepTitle}>{t(`auth.step${currentStep}Title`)}</h5>
                      <p className={loginStyles.stepDescription}>{t(`auth.step${currentStep}Desc`)}</p>
                    </div>
                  </div>

                  {currentStep === 1 && (
                    <>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className={loginStyles.label}>{t('auth.firstName')}</Form.Label>
                            <Form.Control
                              type="text"
                              id="firstName"
                              placeholder={t('auth.firstName')}
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={loginStyles.input}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className={loginStyles.label}>{t('auth.lastName')}</Form.Label>
                            <Form.Control
                              type="text"
                              id="lastName"
                              placeholder={t('auth.lastName')}
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={loginStyles.input}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mt-3">
                        <Form.Label className={loginStyles.label}>{t('auth.phoneNumber')}</Form.Label>
                        <Form.Control
                          type="tel"
                          id="phone"
                          placeholder={t('auth.phoneNumber')}
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={loginStyles.input}
                        />
                      </Form.Group>

                      <Form.Group className="mt-3">
                        <Form.Label className={loginStyles.label}>{t('auth.email')}</Form.Label>
                        <Form.Control
                          type="email"
                          id="email"
                          placeholder={t('auth.email')}
                          value={formData.email}
                          onChange={handleInputChange}
                          className={loginStyles.input}
                        />
                      </Form.Group>
                    </>
                  )}

                  {currentStep === 2 && (
                    <div className="mt-3">
                      <RoleSelector role={role} onRoleChange={handleRoleChange} />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="mt-3">
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
                          universities={universities}
                        />
                      )}
                    </div>
                  )}

                  {currentStep === 4 && (
                    <>
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className={loginStyles.label}>{t('auth.password')}</Form.Label>
                            <Form.Control
                              type="password"
                              id="password"
                              placeholder={t('auth.password')}
                              value={formData.password}
                              onChange={handleInputChange}
                              className={loginStyles.input}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className={loginStyles.label}>{t('auth.confirmPassword')}</Form.Label>
                            <Form.Control
                              type="password"
                              id="confirmPassword"
                              placeholder={t('auth.confirmPassword')}
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={loginStyles.input}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <TermsSection checked={formData.terms} onChange={handleInputChange} />
                    </>
                  )}

                  {error && (
                    <Alert variant="danger" className={loginStyles.alert}>
                      <FaExclamationTriangle /> {error}
                    </Alert>
                  )}

                  {alertMessage.show && (
                    <Alert variant="success" className={loginStyles.alert}>
                      <FaCheckCircle /> {alertMessage.text}
                    </Alert>
                  )}

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={goToPreviousStep}
                      disabled={currentStep === 1 || loading}
                      className={loginStyles.stepButton}
                    >
                      {t('common.back')}
                    </Button>

                    <Button
                      type={currentStep === 4 ? 'submit' : 'button'}
                      variant="primary"
                      onClick={currentStep === 4 ? undefined : goToNextStep}
                      disabled={loading}
                      className={loginStyles.submitButton}
                    >
                      {loading && currentStep === 4 ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          {t('common.loading')}
                        </>
                      ) : (
                        <>
                          {currentStep === 4 ? (
                            t('auth.register')
                          ) : (
                            t('common.next')
                          )}
                          <FaArrowRight className="ms-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </Form>

                <p className={loginStyles.signupText}>
                  {t('auth.alreadyHaveAccount')}{' '}
                  <Link to="/login" className={loginStyles.signupLink}>
                    {t('auth.login')}
                  </Link>
                </p>

                <div className={loginStyles.footerLinks}>
                  <Link to="/about" className={loginStyles.footerLink}>{t('common.about')}</Link>
                  <span>•</span>
                  <Link to="/privacy" className={loginStyles.footerLink}>{t('common.privacy')}</Link>
                  <span>•</span>
                  <Link to="/terms" className={loginStyles.footerLink}>{t('common.terms')}</Link>
                  <span>•</span>
                  <LanguageSwitcher />
                </div>
              </Card.Body>
            </Card>

            <div className={`${loginStyles.mobileFeatures} d-lg-none mt-4`}>
              <small className="text-muted text-center d-block">
                {t('common.appName')} - {t('common.slogan')}
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Inscription;
