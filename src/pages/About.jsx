import React from 'react';
import LegalLayout from '../composants/LegalLayout/LegalLayout';
import { FaUsers, FaGlobeAfrica, FaRocket, FaHandshake } from 'react-icons/fa';

const About = () => {
    return (
        <LegalLayout 
            title="À propos d'INFOcAMPUS" 
            lastUpdated="23 février 2026"
        >
            <section>
                <h2>Notre mission</h2>
                <p>
                    INFOcAMPUS est né pour ameliorer la circulation des informations dans les universités : <strong>connecter intelligemment 
                    les universités africaines</strong> pour faciliter la communication entre les étudiants, les enseignants et l'administration de chaque université. 
                    Nous voulons ameliorer le systéme educatif en apportant notre contribution bien que modeste.
                </p>
                <p>
                    Dans un monde de plus en plus connecté, les universités ont besoin d'outils 
                    modernes, adaptés à leurs réalités et à leurs défis. INFOcAMPUS répond à ce besoin en 
                    offrant une plateforme intuitive, sécurisée et pensée non seulement pour le contexte
                    universitaire africain, mais aussi pour toutes les universités du monde entier.
                </p>
            </section>

            <section>
                <h2>Nos valeurs</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', margin: '40px 0' }}>
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                        <FaUsers style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                        <h3 style={{ marginBottom: '10px' }}>Communauté</h3>
                        <p style={{ color: '#64748b' }}>Créer des liens durables entre tous les acteurs de l'éducation</p>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                        <FaGlobeAfrica style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                        <h3 style={{ marginBottom: '10px' }}>Africanité</h3>
                        <p style={{ color: '#64748b' }}>Des solutions adaptées aux réalités et aux besoins du continent</p>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                        <FaRocket style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                        <h3 style={{ marginBottom: '10px' }}>Innovation</h3>
                        <p style={{ color: '#64748b' }}>Toujours à la pointe de la technologie éducative</p>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
                        <FaHandshake style={{ fontSize: '3rem', color: '#667eea', marginBottom: '15px' }} />
                        <h3 style={{ marginBottom: '10px' }}>Intégrité</h3>
                        <p style={{ color: '#64748b' }}>Respect, transparence et confiance au cœur de nos actions</p>
                    </div>
                </div>
            </section>

            <section>
                <h2>Notre équipe</h2>
                <p>
                    INFOcAMPUS est développé par une équipe passionnée de développeurs, NDEMEN LAURENDA
                    et ARTHUR TATCHOU, qui travaillent sans relâche pour vous offrir la meilleure experience possible.
                </p>
                <p>
                    Basés principalement au Cameroun, nous travaillons en étroite collaboration avec 
                    des enseignants et des étudiants pour nous assurer que notre plateforme répond 
                    parfaitement à leurs besoins quotidiens.
                </p>
            </section>

            <section>
                <h2>Nous contacter</h2>
                <p>
                    Vous avez des questions, des suggestions ou souhaitez rejoindre l'aventure INFOcAMPUS ? 
                    N'hésitez pas à nous contacter :
                </p>
                <ul>
                    <li><strong>Email :</strong> ndemenlaurenda@gmail.com</li>
                    <li><strong>Téléphone :</strong> +237 652 22 98 00</li>
                    <li><strong>Adresse :</strong> Douala - Cameroun</li>
                </ul>
            </section>
        </LegalLayout>
    );
};

export default About;