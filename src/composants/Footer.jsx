
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./LegalLayout/LegalLayout.module.css";
import { useTranslation } from "react-i18next";
import { LOGO } from "../assets";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className={styles.footer}>
            <Container>
                <div className={styles.footerContent}>
                    <div className={styles.footerInfo}>
                        <img className={styles.brandLogo} src={LOGO} alt="infocampus-logo" />
                        <p className={styles.footerText}>
                            INFOcAMPUS - {t('footer.desc') || 'Le future de la communication universitaire est ici. Rejoignez-nous dans la révolution du flux d\'informations dans les universités africaines et au-delà. Ensemble, nous pouvons créer une communauté académique plus connectée, informée et puissante.'}
                        </p>
                    </div>

                    <div className={styles.footerLinks}>
                        <Link to="/about">{t('common.about')}</Link>
                        <Link to="/terms">{t('common.terms')}</Link>
                        <Link to="/privacy">{t('common.privacy')}</Link>
                        <Link to="/legal">{t('common.legal')}</Link>
                        <span style={{ marginLeft: '20px' }}>
                            <LanguageSwitcher />
                        </span>
                    </div>

                    <div className={styles.footerSocial2}>
                        <p>{t('footer.followUs') || 'Suivez-nous sur les réseaux sociaux'}</p>
                        <div className={styles.footerSocial}>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                <FaYoutube />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <FaTwitter />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin />
                            </a>
                        </div>

                    </div>
                </div>

                <div className={styles.copyright}>
                    <p>&copy; {new Date().getFullYear()} INFOcAMPUS. {t('common.allRightsReserved') || 'Tous droits réservés'}</p>
                    <p className={styles.credit}>
                        {t('common.madeInAfrica')}
                    </p>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;