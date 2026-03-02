import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import InputGroup from 'react-bootstrap/InputGroup';
import { api } from '../lib/api';
import styles from './Connexion.module.css';

const Connexion = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) navigate('/profile');
  }, [navigate]);

  const validateForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      setError(t('auth.fillAllFields'));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t('auth.invalidEmail'));
      return false;
    }
    if (password.length < 6) {
      setError(t('auth.passwordTooShort'));
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
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('loginTime', new Date().toISOString());

        if (rememberMe) {
          localStorage.setItem('rememberEmail', formData.email);
        }

        const redirectMap = {
          'student': '/profil-etudiant',
          'teacher': '/profil-enseignant',
          'admin': '/profil-administration'
        };

        setTimeout(() => {
          navigate(redirectMap[response.data.user.roles?.[0]] || '/profile');
        }, 500);
      } else {
        setError(t('auth.loginSuccess') === 'Login successful!' ? 'Invalid credentials' : response.data?.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('errors.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  return (
    <div className={styles.loginContainer}>
      <Container fluid className={styles.containerWrapper}>
        <Row className="align-items-center min-vh-100 g-4">
          {/* Illustation / Features Column */}
          <Col lg={6} xs={12} className={`${styles.featuresColumn} d-none d-lg-flex`}>
            <div className={styles.featuresContent}>
              <h1 className={styles.featuresTitle}>{t('common.appName')}</h1>
              <p className={styles.featuresSubtitle}>
                Connecting Universities, Empowering Communities
              </p>
              
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>✓</div>
                  <div>
                    <h6>{t('publication.title')}</h6>
                    <p>{t('publication.comments')}</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>✓</div>
                  <div>
                    <h6>{t('profile.academicInfo')}</h6>
                    <p>{t('profile.personalInfo')}</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>✓</div>
                  <div>
                    <h6>{t('nav.universities')}</h6>
                    <p>Connect with your institution</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Login Form Column */}
          <Col lg={6} xs={12} className={styles.formColumn}>
            <Card className={styles.loginCard}>
              <Card.Body className={styles.cardBody}>
                <div className={styles.headerSection}>
                  <h2 className={styles.formTitle}>{t('auth.login')}</h2>
                  <p className={styles.formSubtitle}>{t('auth.fillAllFields')}</p>
                </div>

                {error && (
                  <Alert variant="danger" dismissible onClose={() => setError('')} className={styles.alert}>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <Form.Group className="mb-4">
                    <Form.Label className={styles.label}>{t('auth.email')}</Form.Label>
                    <InputGroup className={styles.inputGroup}>
                      <InputGroup.Text className={styles.inputIcon}>
                        <FaEnvelope />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                      />
                    </InputGroup>
                  </Form.Group>

                  {/* Password Field */}
                  <Form.Group className="mb-3">
                    <Form.Label className={styles.label}>{t('auth.password')}</Form.Label>
                    <InputGroup className={styles.inputGroup}>
                      <InputGroup.Text className={styles.inputIcon}>
                        <FaLock />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={styles.input}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.passwordToggle}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  {/* Remember Me & Forgot Password */}
                  <div className={`d-flex justify-content-between align-items-center mb-4 ${styles.optionsRow}`}>
                    <Form.Check
                      type="checkbox"
                      label={t('auth.rememberMe')}
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <Link to="#" className={styles.forgotLink}>
                      {t('auth.forgotPassword')}
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className={styles.submitButton}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        {t('auth.login')}
                        <FaArrowRight className="ms-2" />
                      </>
                    )}
                  </Button>
                </Form>

                {/* Sign Up Link */}
                <p className={styles.signupText}>
                  {t('auth.dontHaveAccount')}{' '}
                  <Link to="/register" className={styles.signupLink}>
                    {t('auth.register')}
                  </Link>
                </p>

                {/* Additional Links */}
                <div className={styles.footerLinks}>
                  <Link to="/about" className={styles.footerLink}>About</Link>
                  <span>•</span>
                  <Link to="/privacy" className={styles.footerLink}>Privacy</Link>
                  <span>•</span>
                  <Link to="/terms" className={styles.footerLink}>Terms</Link>
                </div>
              </Card.Body>
            </Card>

            {/* Mobile Features (visible on small screens) */}
            <div className={`${styles.mobileFeatures} d-lg-none mt-4`}>
              <small className="text-muted text-center d-block">
                {t('common.appName')} - Connecting Universities Worldwide
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Connexion;
