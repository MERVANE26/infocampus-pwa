import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import styles from './Connexion.module.css';

const Connexion = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userType: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Configuration Axios
    const api = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    // Intercepteur Axios
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

    useEffect(() => {
        // Vérifier si l'utilisateur est déjà connecté
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            navigate('/dashboard');
        }

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
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateForm = () => {
        const { userType, email, password } = formData;
        
        if (!userType || !email || !password) {
            setError('Veuillez remplir tous les champs');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Veuillez entrer un email valide');
            return false;
        }
        
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
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
                password: formData.password,
                user_type: formData.userType
            });

            console.log('📦 Données reçues:', response.data);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('loginTime', new Date().toISOString());

                // Notification PWA
                if (Notification.permission === 'granted') {
                    new Notification('Connexion réussie!', {
                        body: `Bienvenue ${response.data.user.name || 'utilisateur'}`,
                        icon: '/icon-192x192.png'
                    });
                }

                const redirectMap = {
                    'etudiant': '/profil-etudiant',
                    'enseignant': '/profil-enseignant',
                    'admin': '/profil-administration'
                };

                const path = redirectMap[formData.userType] || '/dashboard';
                
                setTimeout(() => {
                    navigate(path);
                }, 1000);
            } else {
                setError(response.data.error || 'Email ou mot de passe incorrect');
            }

        } catch (err) {
            if (err.code === 'ECONNABORTED') {
                setError('Délai de connexion dépassé. Vérifiez votre connexion.');
            } else if (err.response) {
                setError(err.response.data.error || `Erreur ${err.response.status}`);
            } else if (err.request) {
                setError('Serveur indisponible. Vérifiez que le backend est lancé');
            } else {
                setError('Erreur de connexion: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.background}></div>
            
            <Container className={styles.container}>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={6} lg={5} xl={4}>
                        <Card className={styles.loginCard}>
                            <Card.Body className="p-4 p-sm-5">
                                {/* Logo et titre */}
                                <div className={styles.header}>
                                    <div className={styles.logoWrapper}>
                                        <span className={styles.mainLogo}>INFO</span>
                                    </div>
                                    <h1 className={styles.title}>INFOcAMPUS</h1>
                                    <p className={styles.subtitle}>
                                        L'éducation connectée
                                    </p>
                                </div>

                                {/* Formulaire */}
                                <Form onSubmit={handleSubmit} className={styles.form}>
                                    {/* Type d'utilisateur */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className={styles.label}>
                                            Statut
                                        </Form.Label>
                                        <Form.Select
                                            name="userType"
                                            value={formData.userType}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className={styles.select}
                                        >
                                            <option value="">Sélectionnez votre statut</option>
                                            <option value="etudiant">Étudiant</option>
                                            <option value="enseignant">Enseignant</option>
                                            <option value="admin">Administration</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Email */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className={styles.label}>
                                            Email universitaire
                                        </Form.Label>
                                        <div className={styles.inputGroup}>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="prenom.nom@universite.cm"
                                                disabled={loading}
                                                className={styles.input}
                                                required
                                            />
                                        </div>
                                    </Form.Group>

                                    {/* Mot de passe */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className={styles.label}>
                                            Mot de passe
                                        </Form.Label>
                                        <div className={styles.inputGroup}>
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Votre mot de passe"
                                                disabled={loading}
                                                className={styles.input}
                                                required
                                            />
                                            <Button
                                                variant="link"
                                                onClick={togglePasswordVisibility}
                                                className={styles.passwordToggle}
                                            >
                                                {showPassword ? "Cacher" : "Afficher"}
                                            </Button>
                                        </div>
                                    </Form.Group>

                                    {/* Message d'erreur */}
                                    {error && (
                                        <Alert 
                                            variant="danger" 
                                            className={styles.alert}
                                            dismissible
                                            onClose={() => setError('')}
                                        >
                                            <Alert.Heading as="p" className="mb-0">
                                                {error}
                                            </Alert.Heading>
                                        </Alert>
                                    )}

                                    {/* Bouton de connexion */}
                                    <Button
                                        type="submit"
                                        className={styles.loginButton}
                                        disabled={loading}
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                Connexion en cours...
                                            </>
                                        ) : (
                                            "Se connecter"
                                        )}
                                    </Button>

                                    {/* Liens supplémentaires */}
                                    <div className={styles.links}>
                                        <Link to="/mot-de-passe-oublie" className={styles.link}>
                                            Mot de passe oublié ?
                                        </Link>
                                        <Link to="/inscription" className={styles.link}>
                                            Pas encore inscrit ?
                                        </Link>
                                    </div>
                                </Form>

                                {/* Section information */}
                                <div className={styles.infoSection}>
                                    <div className={styles.divider}></div>
                                    <p className={styles.infoText}>
                                        Pour les universités africaines - Plateforme de communication intelligente
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Connexion;