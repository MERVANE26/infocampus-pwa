import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaUniversity,
    FaGlobe,
    FaCity,
    FaMap,
    FaMapMarkerAlt,
    FaEnvelope,
    FaPhone,
    FaCalendar,
    FaTag,
    FaBuilding,
    FaAlignLeft,
    FaImage,
    FaInfoCircle,
    FaCheckCircle,
    FaExclamationTriangle,
    FaPaperPlane,
    FaShieldAlt
} from 'react-icons/fa';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import ProgressSteps from '../composants/UniversityForm/ProgressSteps';
import FileUpload from '../composants/UniversityForm/FileUpload';
import InfoBox from '../composants/UniversityForm/InfoBox';
import styles from './CreationUniversite.module.css';

const CreationUniversite = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        universityName: 'Institut Universitaire du Golfe',
        country: 'Cameroun',
        city: 'Douala',
        region: 'Littoral',
        address: 'Boulevard de la Liberté, BP 1234',
        email: 'contact@iug-douala.cm',
        phone: '+237 699 999 999',
        website: 'https://www.iug-douala.cm',
        founded: '2005',
        type: 'Privée',
        campus: 2,
        description: "L'Institut Universitaire du Golfe (IUG) de Douala est un établissement privé d'enseignement supérieur créé en 2005. Il forme des cadres compétents dans les domaines du management, des technologies et des sciences. L'IUG est reconnu pour son excellence académique et son insertion professionnelle.",
        logo: null
    });

    const [fileInfo, setFileInfo] = useState({ message: '', type: '' });
    const [alertMessage, setAlertMessage] = useState({ show: false, text: '' });
    const [loading, setLoading] = useState(false);

    const steps = ['Informations', 'Validation', 'Confirmation'];

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleCampusChange = (change) => {
        setFormData(prev => {
            let newValue = prev.campus + change;
            if (newValue < 1) newValue = 1;
            if (newValue > 20) newValue = 20;
            return { ...prev, campus: newValue };
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setFileInfo({
                    message: 'Fichier trop volumineux (max 2Mo)',
                    type: 'error'
                });
            } else {
                setFormData(prev => ({ ...prev, logo: file }));
                setFileInfo({
                    message: `Fichier sélectionné : ${file.name}`,
                    type: 'success'
                });
            }
        }
    };

    const generateValidationCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const validateForm = () => {
        const requiredFields = ['universityName', 'country', 'city', 'email', 'phone', 'description', 'type', 'campus'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                setAlertMessage({
                    show: true,
                    text: 'Veuillez remplir tous les champs obligatoires.'
                });
                setTimeout(() => setAlertMessage({ show: false, text: '' }), 3000);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);

        try {
            const validationCode = generateValidationCode();
            
            // Sauvegarder les données
            sessionStorage.setItem('universityFormData', JSON.stringify({
                ...formData,
                logo: formData.logo ? formData.logo.name : 'logo-non-fourni.png'
            }));
            sessionStorage.setItem('validationCode', validationCode);
            
            // Log pour simulation
            console.log('📧 EMAIL DE VALIDATION', {
                to: formData.email,
                subject: 'Code de validation INFOCAMPUS',
                code: validationCode
            });
            
            setAlertMessage({
                show: true,
                text: `Formulaire validé ! Redirection vers la page de validation... Un code a été envoyé à ${formData.email}`
            });
            
            setTimeout(() => {
                navigate('/validation-universite');
            }, 2000);
            
        } catch (error) {
            setAlertMessage({
                show: true,
                text: 'Une erreur est survenue. Veuillez réessayer.'
            });
        } finally {
            setLoading(false);
        }
    };

    const fillIUGExample = () => {
        setFormData({
            universityName: 'Institut Universitaire du Golfe',
            country: 'Cameroun',
            city: 'Douala',
            region: 'Littoral',
            address: 'Boulevard de la Liberté, BP 1234',
            email: 'contact@iug-douala.cm',
            phone: '+237 699 999 999',
            website: 'https://www.iug-douala.cm',
            founded: '2005',
            type: 'Privée',
            campus: 2,
            description: "L'Institut Universitaire du Golfe (IUG) de Douala est un établissement privé d'enseignement supérieur créé en 2005. Il forme des cadres compétents dans les domaines du management, des technologies et des sciences. L'IUG est reconnu pour son excellence académique et son insertion professionnelle.",
            logo: null
        });
    };

    useEffect(() => {
        fillIUGExample();
    }, []);

    return (
        <div className={styles.pageContainer}>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={10} xl={8}>
                        <Card className={styles.formCard}>
                            <Card.Body className="p-4 p-md-5">
                                {/* Header */}
                                <div className={styles.header}>
                                    <div className={styles.logoContainer}>
                                        <div className={styles.logoIcon}>
                                            <FaUniversity />
                                        </div>
                                        <div className={styles.logoText}>
                                            <h1>INFO<span>CAMPUS</span></h1>
                                            <p>
                                                Plateforme de gestion universitaire 
                                                <span className={styles.subtitle}> • Création d'établissements</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className={styles.badge}>
                                        <FaShieldAlt /> Création sécurisée
                                    </div>
                                </div>

                                {/* Progress Steps */}
                                <ProgressSteps currentStep={currentStep} steps={steps} />

                                {/* Formulaire */}
                                <Form onSubmit={handleSubmit}>
                                    {/* Nom de l'établissement */}
                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label className={styles.label}>
                                            <FaUniversity className={styles.labelIcon} /> Nom de l'établissement *
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="universityName"
                                            value={formData.universityName}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Institut Universitaire du Golfe"
                                            required
                                            className={styles.input}
                                        />
                                    </Form.Group>

                                    {/* Pays, Ville, Région */}
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.label}>
                                                    <FaGlobe className={styles.labelIcon} /> Pays *
                                                </Form.Label>
                                                <Form.Select
                                                    id="country"
                                                    value={formData.country}
                                                    onChange={handleInputChange}
                                                    required
                                                    className={styles.select}
                                                >
                                                    <option value="">Sélectionnez un pays</option>
                                                    <optgroup label="🌍 Afrique">
                                                        <option value="Cameroun">Cameroun</option>
                                                        <option value="Sénégal">Sénégal</option>
                                                        <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                                                        <option value="Nigeria">Nigeria</option>
                                                        <option value="Gabon">Gabon</option>
                                                        <option value="RDC">RDC</option>
                                                        <option value="Afrique du Sud">Afrique du Sud</option>
                                                    </optgroup>
                                                    <optgroup label="🌍 Europe">
                                                        <option value="France">France</option>
                                                    </optgroup>
                                                    <optgroup label="🌎 Amérique">
                                                        <option value="Canada">Canada</option>
                                                    </optgroup>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.label}>
                                                    <FaCity className={styles.labelIcon} /> Ville *
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="Ex: Douala"
                                                    required
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.label}>
                                                    <FaMap className={styles.labelIcon} /> Région / Province
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    id="region"
                                                    value={formData.region}
                                                    onChange={handleInputChange}
                                                    placeholder="Ex: Littoral"
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Adresse */}
                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label className={styles.label}>
                                            <FaMapMarkerAlt className={styles.labelIcon} /> Adresse complète
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Ex: Boulevard de la Liberté, BP 1234"
                                            className={styles.input}
                                        />
                                    </Form.Group>

                                    {/* Email et Téléphone */}
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.label}>
                                                    <FaEnvelope className={styles.labelIcon} /> Email de contact *
                                                </Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    id="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="contact@etablissement.edu"
                                                    required
                                                    className={styles.input}
                                                />
                                                <Form.Text className={styles.helpText}>
                                                    Un code de validation sera envoyé à cette adresse
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.label}>
                                                    <FaPhone className={styles.labelIcon} /> Téléphone *
                                                </Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    id="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+237 6XX XXX XXX"
                                                    required
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Site web et Année */}
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.label}>
                                                    <FaGlobe className={styles.labelIcon} /> Site web
                                                </Form.Label>
                                                <Form.Control
                                                    type="url"
                                                    id="website"
                                                    value={formData.website}
                                                    onChange={handleInputChange}
                                                    placeholder="https://www.etablissement.edu"
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.label}>
                                                    <FaCalendar className={styles.labelIcon} /> Année de fondation
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    id="founded"
                                                    value={formData.founded}
                                                    onChange={handleInputChange}
                                                    min="1800"
                                                    max="2024"
                                                    placeholder="Ex: 2005"
                                                    className={styles.input}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Type et Campus */}
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.label}>
                                                    <FaTag className={styles.labelIcon} /> Type d'établissement *
                                                </Form.Label>
                                                <Form.Select
                                                    id="type"
                                                    value={formData.type}
                                                    onChange={handleInputChange}
                                                    required
                                                    className={styles.select}
                                                >
                                                    <option value="">Sélectionnez un type</option>
                                                    <option value="Publique">Université Publique</option>
                                                    <option value="Privée">Université Privée</option>
                                                    <option value="Institut">Institut Supérieur</option>
                                                    <option value="Grande École">Grande École</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group className={styles.formGroup}>
                                                <Form.Label className={styles.label}>
                                                    <FaBuilding className={styles.labelIcon} /> Nombre de campus *
                                                </Form.Label>
                                                <div className={styles.campusCounter}>
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => handleCampusChange(-1)}
                                                        className={styles.counterBtn}
                                                        type="button"
                                                    >
                                                        -
                                                    </Button>
                                                    <Form.Control
                                                        type="number"
                                                        id="campus"
                                                        value={formData.campus}
                                                        onChange={handleInputChange}
                                                        min="1"
                                                        max="20"
                                                        required
                                                        className={styles.counterInput}
                                                    />
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => handleCampusChange(1)}
                                                        className={styles.counterBtn}
                                                        type="button"
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* Description */}
                                    <Form.Group className={styles.formGroup}>
                                        <Form.Label className={styles.label}>
                                            <FaAlignLeft className={styles.labelIcon} /> Description de l'établissement *
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            id="description"
                                            rows={4}
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Présentez votre établissement, son histoire, ses valeurs, ses filières principales..."
                                            required
                                            className={styles.textarea}
                                        />
                                    </Form.Group>

                                    {/* Logo Upload */}
                                    <FileUpload
                                        onFileSelect={handleFileChange}
                                        fileInfo={fileInfo}
                                        label="Logo de l'établissement"
                                        icon={FaImage}
                                    />

                                    {/* Info Box */}
                                    <InfoBox title="Processus de validation :">
                                        <ol>
                                            <li>Vous remplissez le formulaire de création</li>
                                            <li>Vous serez redirigé vers la page de validation</li>
                                            <li>Un code à 6 chiffres vous sera envoyé par email</li>
                                            <li>Saisissez le code pour finaliser la création</li>
                                        </ol>
                                    </InfoBox>

                                    {/* Alert Message */}
                                    {alertMessage.show && (
                                        <Alert 
                                            variant="success" 
                                            className={styles.alert}
                                            onClose={() => setAlertMessage({ show: false, text: '' })}
                                            dismissible
                                        >
                                            <FaCheckCircle className="me-2" />
                                            {alertMessage.text}
                                        </Alert>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={loading}
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Traitement en cours...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane className="me-2" />
                                                Continuer vers la validation
                                            </>
                                        )}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CreationUniversite;