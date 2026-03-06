import React from 'react';
import { useTranslation } from 'react-i18next';
import LegalLayout from '../composants/LegalLayout/LegalLayout';
import { FaUsers, FaGlobeAfrica, FaRocket, FaHandshake } from 'react-icons/fa';

const About = () => {
    const { t } = useTranslation();
    return (
        <LegalLayout 
            title={t('about.title')}
            lastUpdated="23 février 2026"
        >
            <section>
                <h2>{t('about.missionTitle')}</h2>
                <p>{t('about.missionText1')}</p>
                <p>{t('about.missionText2')}</p>
            </section>

            <section>
                <h2>{t('about.valuesTitle')}</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', margin: '40px 0' }}>
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                        <FaUsers style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                        <h3 style={{ marginBottom: '10px' }}>{t('about.value1Title')}</h3>
                        <p style={{ color: '#64748b' }}>{t('about.value1Text')}</p>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                        <FaGlobeAfrica style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                        <h3 style={{ marginBottom: '10px' }}>{t('about.value2Title')}</h3>
                        <p style={{ color: '#64748b' }}>{t('about.value2Text')}</p>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                        <FaRocket style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                        <h3 style={{ marginBottom: '10px' }}>{t('about.value3Title')}</h3>
                        <p style={{ color: '#64748b' }}>{t('about.value3Text')}</p>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                        <FaHandshake style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                        <h3 style={{ marginBottom: '10px' }}>{t('about.value4Title')}</h3>
                        <p style={{ color: '#64748b' }}>{t('about.value4Text')}</p>
                    </div>
                </div>
            </section>

            <section>
                <h2>{t('about.teamTitle')}</h2>
                <p>
                    {t('about.teamText1')}
                </p>
                <p>
                    {t('about.teamText2')}
                </p>
            </section>

            <section>
                <h2>{t('about.contactTitle')}</h2>
                <p>
                    {t('about.contactText')}
                </p>
                <ul>
                    <li>{t('about.contactEmail')}</li>
                    <li>{t('about.contactPhone')}</li>
                    <li>{t('about.contactAddress')}</li>
                </ul>
            </section>
        </LegalLayout>
    );
};

export default About;