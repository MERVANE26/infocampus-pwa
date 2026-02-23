import React from 'react';
import LegalLayout from '../components/LegalLayout/LegalLayout';

const Terms = () => {
    return (
        <LegalLayout 
            title="Conditions générales d'utilisation" 
            lastUpdated="23 février 2026"
        >
            <section>
                <h2>1. Acceptation des conditions</h2>
                <p>
                    En accédant à la plateforme INFOcAMPUS, vous acceptez d'être lié par les présentes 
                    conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez 
                    ne pas utiliser nos services.
                </p>
            </section>

            <section>
                <h2>2. Description du service</h2>
                <p>
                    INFOcAMPUS est une plateforme de communication universitaire permettant :
                </p>
                <ul>
                    <li>La publication d'annonces et de communications officielles</li>
                    <li>Le partage de documents et de supports de cours</li>
                    <li>Les échanges entre étudiants, enseignants et administration</li>
                    <li>La gestion des informations académiques</li>
                </ul>
            </section>

            <section>
                <h2>3. Inscription et comptes</h2>
                <h3>3.1 Création de compte</h3>
                <p>
                    Pour utiliser nos services, vous devez créer un compte en fournissant des informations 
                    exactes et complètes. Chaque utilisateur ne peut détenir qu'un seul compte.
                </p>
                
                <h3>3.2 Sécurité du compte</h3>
                <p>
                    Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les 
                    activités effectuées sur votre compte. En cas de suspicion d'utilisation non autorisée, 
                    vous devez nous en informer immédiatement.
                </p>
                
                <h3>3.3 Types de comptes</h3>
                <p>
                    Trois types de comptes existent sur la plateforme :
                </p>
                <ul>
                    <li><strong>Étudiants :</strong> Accès aux publications, possibilité de commenter et réagir</li>
                    <li><strong>Enseignants :</strong> Publication de contenus, partage de documents</li>
                    <li><strong>Administration :</strong> Gestion des utilisateurs, publications officielles</li>
                </ul>
            </section>

            <section>
                <h2>4. Utilisation de la plateforme</h2>
                <h3>4.1 Contenu publié</h3>
                <p>
                    Vous êtes seul responsable du contenu que vous publiez sur INFOcAMPUS. Vous garantissez 
                    que ce contenu :
                </p>
                <ul>
                    <li>Respecte les lois et règlements en vigueur</li>
                    <li>N'est pas diffamatoire, obscène ou offensant</li>
                    <li>Ne porte pas atteinte aux droits des tiers</li>
                    <li>Est approprié dans le cadre universitaire</li>
                </ul>

                <h3>4.2 Interactions</h3>
                <p>
                    Les interactions entre utilisateurs doivent rester courtoises et respectueuses. 
                    Tout comportement inapproprié (harcèlement, insultes, spam) peut entraîner la 
                    suspension du compte.
                </p>

                <h3>4.3 Propriété intellectuelle</h3>
                <p>
                    Vous conservez tous vos droits sur le contenu que vous publiez. En publiant sur 
                    INFOcAMPUS, vous nous accordez une licence non exclusive pour héberger et afficher 
                    ce contenu sur notre plateforme.
                </p>
            </section>

            <section>
                <h2>5. Rôles et responsabilités</h2>
                
                <h3>5.1 Responsabilités des étudiants</h3>
                <ul>
                    <li>Consulter régulièrement les publications</li>
                    <li>Maintenir à jour leurs informations personnelles</li>
                    <li>Respecter le règlement intérieur de leur établissement</li>
                </ul>

                <h3>5.2 Responsabilités des enseignants</h3>
                <ul>
                    <li>Publier des informations pertinentes et exactes</li>
                    <li>Modérer les commentaires sur leurs publications</li>
                    <li>Respecter la charte de confidentialité</li>
                </ul>

                <h3>5.3 Responsabilités de l'administration</h3>
                <ul>
                    <li>Gérer les comptes utilisateurs</li>
                    <li>Assurer la modération générale de la plateforme</li>
                    <li>Communiquer les informations officielles</li>
                </ul>
            </section>

            <section>
                <h2>6. Limitations de responsabilité</h2>
                <p>
                    INFOcAMPUS s'efforce de fournir un service de qualité, mais ne peut garantir :
                </p>
                <ul>
                    <li>Une disponibilité ininterrompue du service</li>
                    <li>L'exactitude absolue des informations publiées par les utilisateurs</li>
                    <li>L'absence de bugs ou d'erreurs techniques</li>
                </ul>
                <p>
                    Dans toute la mesure permise par la loi, notre responsabilité est limitée au montant 
                    payé (le cas échéant) pour l'utilisation du service.
                </p>
            </section>

            <section>
                <h2>7. Suspension et résiliation</h2>
                <p>
                    Nous nous réservons le droit de suspendre ou résilier tout compte en cas de :
                </p>
                <ul>
                    <li>Violation des présentes conditions</li>
                    <li>Comportement inapproprié sur la plateforme</li>
                    <li>Inactivité prolongée (plus d'un an)</li>
                    <li>Demande de l'établissement d'affiliation</li>
                </ul>
            </section>

            <section>
                <h2>8. Modifications des conditions</h2>
                <p>
                    Nous pouvons modifier ces conditions à tout moment. Les modifications prennent effet 
                    dès leur publication sur la plateforme. Votre utilisation continue du service après 
                    ces modifications constitue votre acceptation des nouvelles conditions.
                </p>
            </section>

            <section>
                <h2>9. Contact</h2>
                <p>
                    Pour toute question concernant ces conditions, contactez-nous à :<br />
                    <strong>Email :</strong> legal@infocampus.africa
                </p>
            </section>
        </LegalLayout>
    );
};

export default Terms;