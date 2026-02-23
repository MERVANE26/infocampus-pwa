import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaEnvelope,
    FaCheckCircle,
    FaExclamationTriangle,
    FaRedo,
    FaArrowRight
} from 'react-icons/fa';
import { Container, Card, Alert, Button } from 'react-bootstrap';
import CodeInput from '../composants/CodeInput/CodeInput';
import styles from './ValidationCode.module.css';

const ValidationCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes en secondes
    const [canResend, setCanResend] = useState(false);

    // Récupérer l'email depuis l'URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
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

    // Récupérer le code stocké (pour simulation)
    const getStoredCode = () => {
        return sessionStorage.getItem('validationCode') || '123456';
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        setError('');
    };

    const validateCode = async () => {
        const fullCode = code.join('');
        
        if (fullCode.length !== 6) {
            setError('Veuillez entrer le code à 6 chiffres.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Simulation de validation
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const storedCode = getStoredCode();
            
            if (fullCode === storedCode) {
                setSuccess(true);
                
                // Récupérer les données de l'utilisateur
                const pendingUser = sessionStorage.getItem('pendingUser');
                
                if (pendingUser) {
                    // Ici, vous appelleriez votre API pour créer le compte
                    console.log('✅ Compte validé:', JSON.parse(pendingUser));
                    
                    // Nettoyer le stockage
                    sessionStorage.removeItem('pendingUser');
                    sessionStorage.removeItem('validationCode');
                }
                
                // Redirection après succès
                setTimeout(() => {
                    navigate('/login', { 
                        state: { 
                            message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.' 
                        } 
                    });
                }, 2000);
            } else {
                setError('Code incorrect. Veuillez vérifier et réessayer.');
            }
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        if (!canResend) return;
        
        setLoading(true);
        
        try {
            // Simulation d'envoi
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Générer un nouveau code
            const newCode = Math.floor(100000 + Math.random() * 900000).toString();
            sessionStorage.setItem('validationCode', newCode);
            
            // Reset du timer
            setTimeLeft(300);
            setCanResend(false);
            setError('');
            
            // Log pour simulation
            console.log('📧 Nouveau code envoyé:', newCode);
            
            alert(`Nouveau code envoyé à ${email}`);
            
        } catch (err) {
            setError('Erreur lors de l\'envoi du code.');
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
                                Code de validation
                            </h2>

                            {/* Email */}
                            <div className={styles.emailDisplay}>
                                <FaEnvelope /> {email}
                            </div>

                            {/* Instructions */}
                            <p className={styles.instructions}>
                                Entrez le code à 6 chiffres reçu par email
                            </p>

                            {/* Timer */}
                            {!canResend && (
                                <div className={styles.timer}>
                                    Code valide pendant : {formatTime(timeLeft)}
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
                                        Validation...
                                    </>
                                ) : (
                                    <>
                                        <FaCheckCircle className="me-2" />
                                        Valider le code
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
                                        <FaRedo /> Renvoyer le code
                                    </button>
                                ) : (
                                    <span className={styles.resendDisabled}>
                                        Renvoyer le code dans {formatTime(timeLeft)}
                                    </span>
                                )}
                            </div>

                            {/* Lien retour */}
                            <div className={styles.backLink}>
                                <a href="#" onClick={() => navigate(-1)}>
                                    ← Modifier l'email
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