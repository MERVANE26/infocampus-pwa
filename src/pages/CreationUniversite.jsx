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
    FaCheckCircle,
    FaPaperPlane,
    FaShieldAlt,
    FaBook
} from 'react-icons/fa';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import ProgressSteps from '../composants/UniversityForm/ProgressSteps';
import FileUpload from '../composants/UniversityForm/FileUpload';
import styles from './CreationUniversite.module.css';
import { api } from '../lib/api';
import { LOGO } from '../assets';

const AVAILABLE_FIELDS = [
    { value: 'gl', label: 'Génie Logiciel' },
    { value: 'res', label: 'Réseaux & Sécurité' },
    { value: 'iia', label: 'Informatique Industrielle et Automatisme' },
    { value: 'genieCivil', label: 'Génie Civil' },
    { value: 'BAT', label: 'Batiment' },
    { value: 'ELT', label: 'Electrotechnique' },
    { value: 'FCL', label: 'Froid & Climatisation' },
    { value: 'GTO', label: 'Géometrie Topographique' },
    { value: 'MSI', label: 'Maintenance Des Systémes Informatiques' },
    { value: 'TEL', label: 'Telecommunication' },
    { value: 'TPU', label: 'Travaux Publics' },
    { value: 'elec', label: 'Génie Électrique' },
    { value: 'mecanique', label: 'Génie Mécanique' },
    { value: 'commerce', label: 'Gestion / Commerce' },
    { value: 'finance', label: 'Finance / Banques' },
    { value: 'lead', label: 'Leadership / Management' },
    { value: 'droit', label: 'Droit' },
    { value: 'medecine', label: 'Médecine / Santé' },
    { value: 'pharmacie', label: 'Pharmacie' },
    { value: 'agriculture', label: 'Agriculture / Agroalimentaire' },
    { value: 'archi', label: 'Architecture' },
    { value: 'design', label: 'Design / Arts' },
    { value: 'sciences', label: 'Sciences Fondamentales' },
    { value: 'software', label: 'Software Engineering' },
    { value: 'computer', label: 'computer systems maintenance' },
    { value: 'civilengineering', label: 'Civil Engineering' }
];

const defaultCampusNames = (count) => Array.from({ length: count }, () => '');

const CreationUniversite = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    // AJOUTE ces nouveaux states en haut

    const [universityId, setUniversityId] = useState(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmed, setConfirmed] = useState(false);

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
        campusNames: defaultCampusNames(2),
        fields: [],
        description: "L'Institut Universitaire du Golfe (IUG) de Douala est un établissement privé d'enseignement supérieur créé en 2005. Il forme des cadres compétents dans les domaines du management, des technologies et des sciences. L'IUG est reconnu pour son excellence académique et son insertion professionnelle.",
        logo: null
    });

    const [fileInfo, setFileInfo] = useState({ message: '', type: '' });
    const [alertMessage, setAlertMessage] = useState({ show: false, text: '' });
    const [loading, setLoading] = useState(false);

    const steps = ['Informations', 'Campus & filières', 'Validation', 'Confirmation'];

    const adjustCampusNames = (count, existingNames = []) => {
        const names = [...existingNames];
        if (count > names.length) {
            return [...names, ...Array(count - names.length).fill('')];
        }
        return names.slice(0, count);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        if (id === 'campus') {
            const numericValue = Number(value) || 1;
            const clamped = Math.min(20, Math.max(1, numericValue));

            setFormData(prev => ({
                ...prev,
                campus: clamped,
                campusNames: adjustCampusNames(clamped, prev.campusNames)
            }));
            return;
        }

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
            return {
                ...prev,
                campus: newValue,
                campusNames: adjustCampusNames(newValue, prev.campusNames)
            };
        });
    };

    const handleCampusNameChange = (index, value) => {
        setFormData(prev => {
            const updatedNames = [...prev.campusNames];
            updatedNames[index] = value;
            return { ...prev, campusNames: updatedNames };
        });
    };

    const handleFieldsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => ({ name: opt.text, value: opt.value }));
        setFormData(prev => ({
            ...prev,
            fields: selectedOptions
        }));
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

    const isProfessionalEmail = (email) => {
        const bannedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'msn.com', 'aol.com'];
        const domain = email.split('@')[1]?.toLowerCase();
        if (!domain) return false;
        return !bannedDomains.some((d) => domain === d || domain.endsWith(`.${d}`));
    };

    const validateStep = (step) => {
        const showError = (text) => {
            setAlertMessage({ show: true, text });
            setTimeout(() => setAlertMessage({ show: false, text: '' }), 3000);
        };

        if (step === 1) {
            const requiredFields = ['universityName', 'country', 'city', 'email', 'phone', 'type'];
            for (const field of requiredFields) {
                if (!formData[field]) {
                    showError('Veuillez remplir tous les champs obligatoires.');
                    return false;
                }
            }

            if (!isProfessionalEmail(formData.email)) {
                showError('Veuillez utiliser une adresse email professionnelle (pas de Gmail/Yahoo/Hotmail/Outlook).');
                return false;
            }

            return true;
        }

        if (step === 2) {
            if (formData.fields.length === 0) {
                showError('Veuillez sélectionner au moins une filière.');
                return false;
            }

            if (formData.campusNames.some((name) => !name || !name.trim())) {
                showError('Veuillez renseigner le nom de chaque campus.');
                return false;
            }

            if (!formData.description) {
                showError('Veuillez renseigner une description.');
                return false;
            }

            return true;
        }

        return true;
    };

    const goToNextStep = () => {
        if (validateStep(currentStep)) {
            setAlertMessage({ show: false, text: '' });
            setCurrentStep((prev) => Math.min(prev + 1, steps.length));
        }
    };

    const goToPreviousStep = () => {
        setAlertMessage({ show: false, text: '' });
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(2)) return;

        setLoading(true);
        console.log("Submitting form with data:", formData);

        try {
            const payload = new FormData();
            payload.append('name', formData.universityName);
            payload.append('country', formData.country);
            payload.append('city', formData.city);
            payload.append('region', formData.region);
            payload.append('address', formData.address);
            payload.append('email', formData.email);
            payload.append('phone', formData.phone);
            payload.append('website', formData.website);
            payload.append('founded', formData.founded);
            payload.append('type', formData.type);
            payload.append('campusCount', formData.campus);
            payload.append('description', formData.description);
            payload.append('fields', JSON.stringify(formData.fields));
            payload.append('campuses', JSON.stringify(formData.campusNames.map((name) => ({ name }))));
            if (formData.logo) {
                payload.append('logo', formData.logo);
            }

            const response = await api.post("/universities/create", payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (!response.data?.message) throw new Error(response.data?.message || "Erreur lors de la création de l'université.");

            setUniversityId(response.data?.universityId);
            setCurrentStep(3);

            setAlertMessage({
                show: true,
                text: "Un code de validation a été envoyé par email."
            });

        } catch (error) {
            setAlertMessage({
                show: true,
                text: error.response?.message || error.message
            });
        } finally {
            setLoading(false);
        }
    };


    const handleVerifyCode = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await api.post("/universities/verify", {
                universityId,
                code: verificationCode,
            });


            if (!response.data.message) throw new Error(response.data?.message || "Erreur lors de la vérification du code de validation.");

            setCurrentStep(4);
            setConfirmed(true);

        } catch (error) {
            setAlertMessage({
                show: true,
                text: error.message
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
            campusNames: defaultCampusNames(2),
            fields: ['gl', 'res'],
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
                            <Card.Body className="p-3 p-md-4">
                                {/* Header */}
                                <div className={styles.header}>
                                    <div className={styles.logoContainer}>
                                        {/* <div className={styles.logoIcon}> */}
                                            <img className={styles.brandLogo} src={LOGO} alt="infocampus-logo" />

                                        {/* </div> */}
                                        <div className={styles.logoText}>
                                            <h1>INFO<span>cAMPUS</span></h1>
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
                                {currentStep === 1 && (
                                    <Form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            goToNextStep();
                                        }}
                                    >
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
                                                        placeholder="contact@votreuniversite.cm"
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

                                        {/* Type d'établissement */}
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

                                        {/* Action Buttons */}
                                        <div className="d-flex justify-content-between mt-4">
                                            <Button variant="outline-secondary" type="button" onClick={fillIUGExample}>
                                                Remplir un exemple
                                            </Button>
                                            <Button type="submit" className={styles.submitButton}>
                                                Suivant
                                            </Button>
                                        </div>
                                    </Form>
                                )}

                                {currentStep === 2 && (
                                    <Form onSubmit={handleSubmit}>
                                        {/* Type et Campus */}
                                        <Row>
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

                                            <Col md={6}>
                                                <Form.Group className={styles.formGroup}>
                                                    <Form.Label className={styles.label}>
                                                        <FaBook className={styles.labelIcon} /> Filières *
                                                    </Form.Label>
                                                    <Form.Select
                                                        multiple
                                                        value={formData.fields.map(field => field.value)}
                                                        onChange={handleFieldsChange}
                                                        className={styles.select}
                                                    >
                                                        {AVAILABLE_FIELDS.map((field) => (
                                                            <option key={field.value} value={field.value}>
                                                                {field.label}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    <Form.Text className={styles.helpText}>
                                                        Maintenez Ctrl (Windows) ou ⌘ (Mac) pour sélectionner plusieurs filières.
                                                    </Form.Text>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Campus Names */}
                                        <Form.Group className={styles.formGroup}>
                                            <Form.Label className={styles.label}>
                                                <FaCity className={styles.labelIcon} /> Noms des campus *
                                            </Form.Label>
                                            {formData.campusNames.map((campusName, index) => (
                                                <Form.Control
                                                    key={index}
                                                    type="text"
                                                    value={campusName}
                                                    onChange={(e) => handleCampusNameChange(index, e.target.value)}
                                                    placeholder={`Nom du campus #${index + 1}`}
                                                    className={`${styles.input} mb-2`}
                                                    required
                                                />
                                            ))}
                                        </Form.Group>

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

                                        <div className="d-flex justify-content-between mt-4">
                                            <Button variant="outline-secondary" type="button" onClick={goToPreviousStep}>
                                                Précédent
                                            </Button>
                                            <Button
                                                type="submit"
                                                className={styles.submitButton}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" />
                                                        Traitement en cours...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaPaperPlane className="me-2" />
                                                        Créer l'établissement
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </Form>
                                )}

                                {/* ================= VERIFICATION STEP ================= */}
                                {currentStep === 3 && (
                                    <Form onSubmit={handleVerifyCode} className="mt-4">
                                        <Form.Group>
                                            <Form.Label>
                                                <FaShieldAlt className="me-2" />
                                                Code de validation
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                placeholder="Entrez le code reçu par email"
                                                required
                                            />
                                        </Form.Group>

                                        <Button
                                            type="submit"
                                            className={styles.submitButton + " mt-3"}
                                            disabled={loading}
                                        >
                                            Vérifier le code
                                        </Button>
                                    </Form>
                                )}

                                {/* ================= CONFIRMATION STEP ================= */}
                                {currentStep === 4 && confirmed && (
                                    <div className="text-center mt-4">
                                        <FaCheckCircle size={60} color="green" />
                                        <h4 className="mt-3">Université validée avec succès 🎉</h4>
                                        <p>Votre établissement est maintenant enregistré.</p>

                                        <Button
                                            onClick={() => navigate("/dashboard")}
                                            className={styles.submitButton}
                                        >
                                            Accéder au tableau de bord
                                        </Button>
                                    </div>
                                )}


                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CreationUniversite;