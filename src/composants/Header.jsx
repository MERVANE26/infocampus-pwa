import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LOGO } from "../assets";
import styles from "./LegalLayout/LegalLayout.module.css";
import { useTranslation } from "react-i18next";

const Header = () => {
        const { t } = useTranslation();
    
    return (
        <header className={styles.header}>
            <Container>
                <nav className={styles.nav}>
                    <Link to="/" className={styles.logo}>
                        <img className={styles.brandLogo} src={LOGO} alt="infocampus-logo" />
                        <span className={styles.logoText}>INFO<span>cAMPUS</span></span>
                    </Link>
                    <div className={styles.navLinks}>
                        <Link to="/about" className={styles.navLink}>{t("header.about")}</Link>
                        <Link to="/terms" className={styles.navLink}>{t("header.terms")}</Link>
                        <Link to="/privacy" className={styles.navLink}>{t("header.privacy")}</Link>
                        <Link to="/legal" className={styles.navLink}>{t("header.legal")}</Link>
                    </div>
                </nav>
            </Container>
        </header>
    );
}

export default Header;