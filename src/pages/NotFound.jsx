import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FiAlertTriangle } from 'react-icons/fi';
import { LOGO } from '../assets';
import styles from './NotFound.module.css';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.pageContainer}>
      <Container className={styles.container}>
        <Row className="justify-content-center">
          <Col xs={12} md={10} lg={8}>
            <Card className={styles.card}>
              <Card.Body className={styles.cardBody}>
                <div className={styles.header}>
                  <div className={styles.iconWrapper} aria-hidden="true">
                    <FiAlertTriangle className={styles.icon} />
                    <span className={styles.code}>404</span>
                  </div>

                  <div className={styles.textGroup}>
                    <img src={LOGO} alt={t('common.appName')} className={styles.logo} />
                    <div>
                      <h1 className={styles.title}>{t('common.notFoundTitle')}</h1>
                      <p className={styles.subtitle}>{t('common.notFoundSubtitle')}</p>
                    </div>
                  </div>
                </div>

                <p className={styles.message}>{t('common.notFoundMessage')}</p>

                <div className={styles.actions}>
                  <Button as={Link} to="/" variant="primary" className={styles.button}>
                    {t('common.goHome')}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
