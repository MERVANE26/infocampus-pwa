import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUniversity, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import styles from './LegalLayout.module.css';

const LegalLayout = ({ children, title, lastUpdated }) => {
    return (
        <div className={styles.pageContainer}>
            {/* Header avec navigation */}
            <header className={styles.header}>
                <Container>
                    <nav className={styles.nav}>
                        <Link to="/" className={styles.logo}>
                            <FaUniversity className={styles.logoIcon} />
                            <span className={styles.logoText}>INFO<span>CAMPUS</span></span>
                        </Link>
                        <div className={styles.navLinks}>
                            <Link to="/about" className={styles.navLink}>À propos</Link>
                            <Link to="/terms" className={styles.navLink}>Conditions</Link>
                            <Link to="/privacy" className={styles.navLink}>Confidentialité</Link>
                            <Link to="/legal" className={styles.navLink}>Mentions légales</Link>
                        </div>
                    </nav>
                </Container>
            </header>

            {/* Contenu principal */}
            <main className={styles.main}>
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={10} xl={8}>
                            <article className={styles.content}>
                                <header className={styles.contentHeader}>
                                    <h1>{title}</h1>
                                    {lastUpdated && (
                                        <p className={styles.lastUpdated}>
                                            Dernière mise à jour : {lastUpdated}
                                        </p>
                                    )}
                                </header>
                                
                                <div className={styles.contentBody}>
                                    {children}
                                </div>
                            </article>
                        </Col>
                    </Row>
                </Container>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <Container>
                    <div className={styles.footerContent}>
                        <div className={styles.footerInfo}>
                            <FaUniversity className={styles.footerLogo} />
                            <p className={styles.footerText}>
                                INFOcAMPUS - La plateforme de communication intelligente<br />
                                pour les universités africaines
                            </p>
                        </div>
                        
                        <div className={styles.footerLinks}>
                            <Link to="/about">À propos</Link>
                            <Link to="/terms">Conditions</Link>
                            <Link to="/privacy">Confidentialité</Link>
                            <Link to="/legal">Mentions légales</Link>
                        </div>

                        <div className={styles.footerSocial}>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                <FaGithub />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <FaTwitter />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>
                    
                    <div className={styles.copyright}>
                        <p>&copy; {new Date().getFullYear()} INFOcAMPUS. Tous droits réservés.</p>
                        <p className={styles.credit}>
                            Une solution made in Africa 🌍
                        </p>
                    </div>
                </Container>
            </footer>
        </div>
    );
};

export default LegalLayout;