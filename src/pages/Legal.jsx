import React from 'react';
import LegalLayout from '../composants/LegalLayout/LegalLayout';

const Legal = () => {
    return (
        <LegalLayout 
            title="Mentions légales" 
            lastUpdated="23 février 2026"
        >
            <section>
                <h2>1. Éditeur de la plateforme</h2>
                <p>
                    <strong>INFOcAMPUS</strong> est une plateforme éditée par :
                </p>
                <ul>
                    <li><strong>Raison sociale :</strong> INFOcAMPUS </li>
                    <li><strong>Forme juridique :</strong> Société à Responsabilité Limitée</li>
                    <li><strong>Téléphone :</strong> +237 652 22 98 00</li>
                    <li><strong>Email :</strong> ndemenlaurenda@gmail.com</li>
                </ul>
            </section>

            <section>
                <h2>Responsable</h2>
                <p>
                    La responsable de la publication est <strong>Laurenda Ndemen</strong>, en qualité de 
                    CEO d'INFOCAMPUS.
                </p>
                <p>
                    Email : ndemenlaurenda@gmail.com
                </p>
            </section>

            <section>
                <h2>3. Hébergement</h2>
                <p>
                    La plateforme INFOcampus est hébergée par :
                </p>
                <ul>
                    <li><strong>Société :</strong></li>
                    <li><strong>Adresse :</strong> </li>
                    <li><strong>Site web :</strong> <a href="https://www.ovhcloud.com" target="_blank" rel="noopener noreferrer">www.ovhcloud.com</a></li>
                    <li><strong>Téléphone :</strong></li>
                </ul>
                <p>
                   
                </p>
            </section>

            <section>
                <h2>4. Propriété intellectuelle</h2>
                <h3>4.1 Droits d'auteur</h3>
                <p>
                    L'ensemble du contenu de la plateforme INFOcAMPUS (structure, design, textes, images, 
                    logos, icônes, etc.) est protégé par le droit d'auteur. Toute reproduction, représentation, 
                    modification ou adaptation, totale ou partielle, sans autorisation préalable est interdite.
                </p>

                <h3>4.2 Marques</h3>
                <p>
                    Le nom "INFOcAMPUS", le logo et les slogans sont des marques déposées. Leur utilisation 
                    sans autorisation expresse est interdite.
                </p>

                <h3>4.3 Contenu utilisateur</h3>
                <p>
                    Les utilisateurs conservent la propriété intellectuelle de leurs publications. En publiant 
                    sur INFOcAMPUS, ils accordent à la plateforme une licence non exclusive pour héberger et 
                    afficher ce contenu.
                </p>
            </section>

            <section>
                <h2>5. Conditions générales de vente (CGV)</h2>
                <p>
                    INFOcAMPUS propose des services gratuits pour les étudiants et les enseignants. 
                    Pour les établissements souhaitant des fonctionnalités avancées, des formules 
                    d'abonnement sont disponibles :
                </p>
                
                <h3>5.1 Formule Basic</h3>
                <ul>
                    <li>Jusqu'à 1000 utilisateurs</li>
                    <li>Fonctionnalités de base</li>
                    <li>Support email</li>
                    <li><strong>Tarif :</strong> 250 000 F CFA / an</li>
                </ul>

                <h3>5.2 Formule Pro</h3>
                <ul>
                    <li>Jusqu'à 5000 utilisateurs</li>
                    <li>Toutes les fonctionnalités</li>
                    <li>Support prioritaire</li>
                    <li>Formation incluse</li>
                    <li><strong>Tarif :</strong> 750 000 F CFA / an</li>
                </ul>

                <h3>5.3 Formule Campus</h3>
                <ul>
                    <li>Utilisateurs illimités</li>
                    <li>Fonctionnalités sur mesure</li>
                    <li>Support dédié 24/7</li>
                    <li>Hébergement personnalisé</li>
                    <li><strong>Tarif :</strong> Sur devis</li>
                </ul>
            </section>

            <section>
                <h2>6. Médiation</h2>
                <p>
                    Conformément à la réglementation, tout consommateur a le droit de recourir gratuitement 
                    à un médiateur de la consommation en vue de la résolution amiable d'un litige l'opposant 
                    à un professionnel.
                </p>
                <p>
                    <strong>Médiateur compétent :</strong> <br />
                    <strong>Adresse :</strong> Douala - Cameroun<br />
                    <strong>Email :</strong> 
                </p>
            </section>

            <section>
                <h2>7. Loi applicable et juridiction</h2>
                <p>
                    Les présentes mentions légales sont régies par le droit camerounais. En cas de litige 
                    et après échec de toute tentative de solution amiable, les tribunaux de Douala sont 
                    seuls compétents.
                </p>
            </section>

            <section>
                <h2>8. Crédits</h2>
                <ul>
                    <li><strong>Développement :</strong> Équipe INFOcAMPUS</li>
                    <li><strong>Design :</strong> Équipe INFOcAMPUS</li>
                    <li><strong>Icônes :</strong> React Icons (Font Awesome, Bootstrap Icons)</li>
                    <li><strong>Framework :</strong> React.js, React Bootstrap</li>
                </ul>
            </section>

            <section>
                <h2>9. Accessibilité</h2>
                <p>
                    INFOcAMPUS s'engage à rendre sa plateforme accessible à tous, y compris aux personnes 
                    en situation de handicap. Nous travaillons continuellement à améliorer l'accessibilité 
                    de nos services.
                </p>
            </section>
        </LegalLayout>
    );
};

export default Legal;