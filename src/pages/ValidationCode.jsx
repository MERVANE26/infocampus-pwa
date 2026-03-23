import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaEnvelope,
    FaCheckCircle,
    FaExclamationTriangle,
    FaRedo} from 'react-icons/fa';
import { Container, Card, Alert, Button } from 'react-bootstrap';
import CodeInput from '../composants/CodeInput/CodeInput';
import styles from './ValidationCode.module.css';
import { api } from '../lib/api';
import { useTranslation } from 'react-i18next';

const ValidationCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState(['', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(100); // 5 minutes en secondes
    const [canResend, setCanResend] = useState(false);
    const { t } = useTranslation();

    // Récupérer l'email depuis l'URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        const dataParam = params.get('data');
        const pendingUser = sessionStorage.getItem('pendingUser');

        if (dataParam) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(dataParam));
                console.log('Données reçues pour validation :', parsedData);
                setData(parsedData || pendingUser ? JSON.parse(pendingUser) : null);
            } catch (err) {
                console.error('Erreur lors du parsing des données :', err);
            }
        }
        setEmail(emailParam || 'email@exemple.com');
    }, [location]);

    // Timer pour le code
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);



    const handleCodeChange = (newCode) => {
        setCode(newCode);
        setError('');
    };

    const validateCode = async () => {
        const fullCode = code.join('');

        if (fullCode.length !== 5) {
            setError(t('validation.invalidLength'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Simulation de validation
            const response = await api.post('/auth/verify', {
                data,
                code: fullCode
            });


            if (response.data && response.data.success) {
                setSuccess(true);

                // Récupérer les données de l'utilisateur
                const pendingUser = sessionStorage.getItem('pendingUser');
                localStorage.setItem('user', JSON.stringify(response.data?.user));
                localStorage.setItem('token', response.data?.token);

                if (pendingUser) {
                    // Nettoyer le stockage
                    sessionStorage.removeItem('pendingUser');
                }

                // Redirection après succès
                setTimeout(() => {
                    navigate('/profile', {
                        state: {
                            message: t('validation.registerSuccessMessage')
                        }
                    });
                }, 2000);
            } else {
                setError(t('validation.incorrect'));
            }
        } catch (err) {
            setError(err.response?.data?.message || t('validation.errorGeneric'));
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        if (!canResend) return;

        setLoading(true);

        try {
            // Simulation d'envoi
            await api.post('/auth/resend-otp', data);

            // Reset du timer
            setTimeLeft(300);
            setCanResend(false);
            setError('');

        } catch (err) {
            setError(t('validation.resend.error'));
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.pageContainer}>
            <Container>
                <div className={styles.wrapper}>
                    <Card className={styles.validationCard}>
                        <Card.Body className="p-4 p-md-5">
                            {/* Icône */}
                            <div className={styles.iconContainer}>
                                <FaEnvelope className={styles.icon} />
                            </div>

                            {/* Titre */}
                            <h2 className={styles.title}>
                                {t('validation.title')}
                            </h2>

                            {/* Email */}
                            <div className={styles.emailDisplay}>
                                <FaEnvelope /> {email}
                            </div>

                            {/* Instructions */}
                            <p className={styles.instructions}>
                                {t('validation.instructions')}
                            </p>

                            {/* Timer */}
                            {!canResend && (
                                <div className={styles.timer}>
                                    {t('validation.timerPrefix')} {formatTime(timeLeft)}
                                </div>
                            )}

                            {/* Code Input */}
                            <CodeInput
                                value={code}
                                onChange={handleCodeChange}
                                onComplete={validateCode}
                            />

                            {/* Message d'erreur */}
                            {error && (
                                <Alert variant="danger" className={styles.alert}>
                                    <FaExclamationTriangle /> {error}
                                </Alert>
                            )}

                            {/* Message de succès */}
                            {success && (
                                <Alert variant="success" className={styles.alert}>
                                    <FaCheckCircle /> Compte créé avec succès ! Redirection...
                                </Alert>
                            )}

                            {/* Bouton valider */}
                            <Button
                                className={styles.validateButton}
                                onClick={validateCode}
                                disabled={loading || success}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        {t('validation.validateButton.loading')}
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle className="me-2" />
                                        {t('validation.validateButton.label')}
                                    </>
                                )}
                            </Button>

                            {/* Lien renvoyer */}
                            <div className={styles.resendSection}>
                                {canResend ? (
                                    <button
                                        className={styles.resendLink}
                                        onClick={resendCode}
                                        disabled={loading}
                                    >
                                        <FaRedo /> {t('validation.resend.label')}
                                    </button>
                                ) : (
                                    <span className={styles.resendDisabled}>
                                        {t('validation.resend.disabled', { time: formatTime(timeLeft) })}
                                    </span>
                                )}
                            </div>

                            {/* Lien retour */}
                            <div className={styles.backLink}>
                                <a href="/register" onClick={() => navigate(-1)}>
                                    {t('validation.modifyEmail')}
                                </a>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </div>
    );
};

export default ValidationCode;