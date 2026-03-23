import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    MessageSquare,
    Share2,
    Settings,
    CheckCircle,
    PlusCircle,
    ChevronRight,
    ChevronLeft,
    Play,
    Pause,
    Globe,
    Users,
    Zap,
    Shield,
    X,
} from 'lucide-react';
import styles from './Home.module.css';
import { HERO } from '../assets';

/**
 * InfoCampus Home Page - Chrome Design Style
 * 
 * Features:
 * - Clean, minimalist hero section
 * - Bold typography with clear hierarchy
 * - Interactive flip card animations with images
 * - Embedded tutorial iframes
 * - Carousel with navigation
 * - Smooth transitions and animations
 * - Modern color scheme
 * - Responsive grid layouts
 * - Mobile-optimized design
 */

// Tutorial data with images and iframe URLs
const TUTORIALS = [
    {
        id: 1,
        icon: BookOpen,
        title: 'S\'inscrire',
        description: 'Rejoignez notre communauté',
        details: 'Créez votre compte en quelques secondes et commencez à explorer.',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663438571371/jSEoauQPmYQXn8pMc2ncEv/tutorial-register-Zyrw9HpUxVisW6JEoBW2nH.webp',
        color: '#667eea',
        iframeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0',
    },
    {
        id: 2,
        icon: MessageSquare,
        title: 'Commenter',
        description: 'Engagez-vous avec la communauté',
        details: 'Partagez vos pensées et vos idées avec d\'autres étudiants.',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663438571371/jSEoauQPmYQXn8pMc2ncEv/tutorial-comment-cy3WKRUx43hm6ev29SZCtx.webp',
        color: '#764ba2',
        iframeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0',
    },
    {
        id: 3,
        icon: Share2,
        title: 'Publier',
        description: 'Partagez vos annonces',
        details: 'Publiez des mises à jour et des informations importantes.',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663438571371/jSEoauQPmYQXn8pMc2ncEv/tutorial-post-D3iiuxrJUqSbLNXMyX7Zyy.webp',
        color: '#f093fb',
        iframeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0',
    },
    {
        id: 4,
        icon: Settings,
        title: 'Configurer',
        description: 'Personnalisez votre profil',
        details: 'Ajustez vos préférences et vos paramètres de notification.',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663438571371/jSEoauQPmYQXn8pMc2ncEv/tutorial-setup-Yv5gcaoQtZh9ysJhftgT4P.webp',
        color: '#4facfe',
        iframeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0',
    },
];

// Statistics data
const STATISTICS = [
    { label: 'Universités', value: '150+', icon: Globe },
    { label: 'Étudiants', value: '50K+', icon: Users },
    { label: 'Publications', value: '2.5K+', icon: Zap },
    { label: 'Sécurité', value: '99.9%', icon: Shield },
];

// Tutorial Modal Component
const TutorialModal = ({ tutorial, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.modalHeader}>
                    <img
                        src={tutorial.image}
                        alt={tutorial.title}
                        className={styles.modalImage}
                    />
                </div>

                <div className={styles.modalBody}>
                    <h2 className={styles.modalTitle}>{tutorial.title}</h2>
                    <p className={styles.modalDescription}>{tutorial.details}</p>

                    <div className={styles.iframeContainer}>
                        <iframe
                            width="100%"
                            height="315"
                            src={tutorial.iframeUrl}
                            title={tutorial.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={styles.iframe}
                        />
                    </div>

                    <button
                        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull}`}
                        onClick={onClose}
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

// Flip Card Component
const FlipCard = ({ tutorial, index, onOpen }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => {
        if (isFlipped) {
            onOpen(tutorial);
        } else {
            setIsFlipped(!isFlipped);
        }
    };

    return (
        <div
            className={styles.flipCard}
            onClick={handleClick}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className={`${styles.flipCardInner} ${isFlipped ? styles.flipped : ''}`}>
                {/* Front */}
                <div className={styles.flipCardFront}>
                    <img
                        src={tutorial.image}
                        alt={tutorial.title}
                        className={styles.cardImage}
                    />
                    <div
                        className={styles.cardIcon}
                        style={{ backgroundColor: `${tutorial.color}20` }}
                    >
                        <tutorial.icon size={32} color={tutorial.color} />
                    </div>
                    <h3 className={styles.cardTitle}>{tutorial.title}</h3>
                    <p className={styles.cardDescription}>{tutorial.description}</p>
                    <div className={styles.flipHint}>
                        <span>Cliquez pour en savoir plus</span>
                    </div>
                </div>

                {/* Back */}
                <div className={styles.flipCardBack}>
                    <p className={styles.cardDetails}>{tutorial.details}</p>
                    <div className={styles.flipButton}>
                        <ChevronRight size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Carousel Component
const Carousel = ({ items, onCardClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlay, items.length]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        setIsAutoPlay(false);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        setIsAutoPlay(false);
    };

    return (
        <div className={styles.carousel}>
            <div className={styles.carouselContent}>
                <div
                    className={styles.carouselTrack}
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {items.map((item, idx) => (
                        <div key={idx} className={styles.carouselSlide}>
                            <img
                                src={item.image}
                                alt={item.title}
                                className={styles.slideImage}
                            />
                            <div className={styles.slideContent}>
                                <h3 className={styles.slideTitle}>{item.title}</h3>
                                <p className={styles.slideDescription}>{item.description}</p>
                                <button
                                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
                                    onClick={() => onCardClick(item)}
                                >
                                    Regarder le tutoriel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.carouselControls}>
                <button
                    className={styles.carouselBtn}
                    onClick={handlePrev}
                    aria-label="Previous"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className={styles.carouselIndicators}>
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            className={`${styles.indicator} ${idx === currentIndex ? styles.active : ''
                                }`}
                            onClick={() => {
                                setCurrentIndex(idx);
                                setIsAutoPlay(false);
                            }}
                            aria-label={`Slide ${idx + 1}`}
                        />
                    ))}
                </div>

                <button
                    className={styles.carouselBtn}
                    onClick={handleNext}
                    aria-label="Next"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <button
                className={styles.playPauseBtn}
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                aria-label={isAutoPlay ? 'Pause' : 'Play'}
            >
                {isAutoPlay ? <Pause size={18} /> : <Play size={18} />}
            </button>
        </div>
    );
};

// Main Component
export default function InfoCampusHomeChrome() {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const [selectedTutorial, setSelectedTutorial] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        // Handle window resize
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Parallax effect on scroll
        const handleScroll = () => {
            if (heroRef.current && !isMobile) {
                const scrollY = window.scrollY;
                heroRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile]);

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.hero} >
                <div className={styles.heroBackground} ref={heroRef} />

                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <span className={styles.badgeIcon}>🎓</span>
                        <span className={styles.badgeText}>Connecting African Universities</span>
                    </div>

                    <h1 className={styles.heroTitle}>
                        Bienvenue sur <span className={styles.highlight}>InfoCampus</span>
                    </h1>

                    <p className={styles.heroSubtitle}>
                        La plateforme intelligente pour connecter les universités africaines
                    </p>

                    <div className={styles.heroButtons}>
                        <button
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            onClick={() => navigate('/register')}
                        >
                            <span>Commencer Maintenant</span>
                            <ChevronRight size={20} />
                        </button>
                        <button
                            className={`${styles.btn} ${styles.btnSecondary}`}
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                        >
                            <span>En Savoir Plus</span>
                        </button>
                    </div>

                    {/* Hero Features */}
                    <div className={styles.heroFeatures}>
                        {['Fast', 'Smart', 'Secure', 'Connected'].map((feature, idx) => (
                            <div
                                key={idx}
                                className={styles.heroFeature}
                                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
                            >
                                <span className={styles.featureTitle}>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className={styles.scrollIndicator}>
                    <div className={styles.scrollDot} />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className={styles.features}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            Pourquoi <span className={styles.highlight}>InfoCampus</span>?
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Découvrez les fonctionnalités qui rendent notre plateforme unique
                        </p>
                    </div>

                    {/* Flip Cards */}
                    <div className={styles.flipCardsGrid}>
                        {TUTORIALS.map((tutorial, idx) => (
                            <FlipCard
                                key={tutorial.id}
                                tutorial={tutorial}
                                index={idx}
                                onOpen={setSelectedTutorial}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Carousel Section */}
            <section className={styles.carouselSection}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Tutoriels Vidéo</h2>
                        <p className={styles.sectionSubtitle}>
                            Apprenez comment utiliser InfoCampus en quelques minutes
                        </p>
                    </div>

                    <Carousel items={TUTORIALS} onCardClick={setSelectedTutorial} />
                </div>
            </section>

            {/* Statistics Section */}
            <section className={styles.statistics}>
                <div className={styles.sectionContainer}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            Nos <span className={styles.highlight}>Statistiques</span>
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Rejoignez une communauté en pleine croissance
                        </p>
                    </div>

                    <div className={styles.statsGrid}>
                        {STATISTICS.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={idx}
                                    className={styles.statCard}
                                    style={{ animationDelay: `${idx * 0.1}s` }}
                                >
                                    <div className={styles.statIcon}>
                                        <Icon size={32} />
                                    </div>
                                    <div className={styles.statValue}>{stat.value}</div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className={styles.sectionContainer}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>Prêt à Commencer?</h2>
                        <p className={styles.ctaSubtitle}>
                            Rejoignez des milliers d'étudiants et d'institutions
                        </p>
                        <button
                            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}
                            onClick={() => navigate('/register')}
                        >
                            <span>Créer un Compte Maintenant</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.sectionContainer}>
                    <p className={styles.footerText}>
                        © 2024 InfoCampus. Fait avec ❤️ pour les universités africaines
                    </p>
                </div>
            </footer>

            {/* Tutorial Modal */}
            <TutorialModal
                tutorial={selectedTutorial}
                isOpen={!!selectedTutorial}
                onClose={() => setSelectedTutorial(null)}
            />
        </div>
    );
}
