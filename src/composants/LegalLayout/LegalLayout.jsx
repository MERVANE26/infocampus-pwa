import { Container, Row, Col } from 'react-bootstrap';
import styles from './LegalLayout.module.css';
import Footer from '../Footer';
import Header from '../Header';

const LegalLayout = ({ children, title, lastUpdated }) => {
    // const { t } = useTranslation();
    return (
        <div className={styles.pageContainer}>
            <Header/>
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
            <Footer />

        </div>
    );
};

export default LegalLayout;