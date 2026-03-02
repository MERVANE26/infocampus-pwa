import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './AccessDenied.module.css';

const AccessDenied = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container className="access-denied-container d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={8} lg={6} className="mx-auto text-center">
          <div className="access-denied-content">
            <FaLock className="access-denied-icon mb-4" />
            <h1 className="h2 mb-3">{t('errors.accessDenied')}</h1>
            <p className="lead text-muted mb-4">
              {t('errors.onlyTeachersAndAdmins')}
            </p>
            <div className="d-flex gap-2 justify-content-center">
              <Button
                variant="primary"
                onClick={() => navigate('/profile')}
                className="d-flex align-items-center gap-2"
              >
                <FaArrowLeft /> {t('common.back')}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
              >
                {t('nav.home')}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AccessDenied;
