import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen,
    MessageSquare,
    Share2,
    Settings,
    ChevronRight,
    ChevronLeft,
    Play,
    Pause,
    Globe,
    Users,
    Zap,
    Shield,
    X,
    PlayCircleIcon,
} from 'lucide-react';
import styles from './Home.module.css';
import Footer from '../composants/Footer';
import Header from '../composants/Header';
import { motion, AnimatePresence } from "framer-motion";


const HERO_BG =
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070";

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
    { label: 'Universités', value: '1+', icon: Globe },
    { label: 'Étudiants', value: '200+', icon: Users },
    { label: 'Publications', value: '0+', icon: Zap },
    { label: 'Sécurité', value: '99.9%', icon: Shield },
];

// Tutorial Modal Component
const TutorialModal = ({ tutorial, isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.modalOverlay}
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ scale: 0.8, y: 40 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 40 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <button className={styles.modalClose} onClick={onClose}>
                            <X size={24} />
                        </button>

                        <div className={styles.modalHeader}>
                            <img src={tutorial.image} alt={tutorial.title} className={styles.modalImage} />
                        </div>

                        <div className={styles.modalBody}>
                            <h2 className={styles.modalTitle}>{tutorial.title}</h2>
                            <p className={styles.modalDescription}>{tutorial.details}</p>

                            <div className={styles.iframeContainer}> <iframe width="100%" height="315" src={tutorial.iframeUrl} title={tutorial.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className={styles.iframe} /> </div>

                            <button
                                className={`${styles.btn} ${styles.btnPrimary} ${styles.btnFull}`}
                                onClick={onClose}
                            >
                                Fermer
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Flip Card Component
const FlipCard = ({ tutorial, index, onOpen }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => {
        if (isFlipped) {
            onOpen(tutorial);
        } else {
            setIsFlipped(true);
        }
    };

    return (
        <motion.div
            className={styles.flipCard}
            onClick={handleClick}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
        >
            <motion.div
                className={`${styles.flipCardInner} ${isFlipped ? styles.flipped : ''}`}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* FRONT */}
                <div className={styles.flipCardFront}>
                    <img src={tutorial.image} alt={tutorial.title} className={styles.cardImage} />

                    <div
                        className={styles.cardIcon}
                        style={{ backgroundColor: `${tutorial.color}20` }}
                    >
                        <tutorial.icon size={32} color={tutorial.color} />
                    </div>

                    <h3 className={styles.cardTitle}>{tutorial.title}</h3>
                    <p className={styles.cardDescription}>{tutorial.description}</p>

                    <div className={styles.flipHint}>
                        Cliquez pour en savoir plus
                    </div>
                </div>

                {/* BACK */}
                <div className={styles.flipCardBack}>
                    <p className={styles.cardDetails}>{tutorial.details}</p>
                    <PlayCircleIcon size={80} />

                    <motion.div
                        className={styles.flipButton}
                        whileHover={{ x: 5 }}
                    >
                        <ChevronRight size={20} />
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
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
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlay, items.length]);

    const handleDragEnd = (e, info) => {
        if (info.offset.x < -100) {
            setCurrentIndex((prev) => (prev + 1) % items.length);
            setIsAutoPlay(false);
        } else if (info.offset.x > 100) {
            setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
            setIsAutoPlay(false);
        }
    };

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
                <motion.div
                    className={styles.carouselTrack}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    animate={{ x: `-${currentIndex * 100}%` }}
                // transition={{ type: "", stiffness: 120 }}
                >
                    {items.map((item, idx) => (
                        <div key={idx} className={styles.carouselSlide}>
                            <img src={item.image} alt={item.title} className={styles.slideImage} />

                            <div className={styles.slideContent}>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>

                                <button
                                    className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSmall}`}
                                    onClick={() => onCardClick(item)}
                                >
                                    Regarder le tutoriel
                                </button>
                            </div>
                        </div>
                    ))}
                </motion.div>
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
export default function Home() {

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
            <Header />
            {/* Hero Section */}


            <section className={styles.hero}>
                {/* Background */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: `url(${HERO_BG})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "brightness(0.4)",
                    }}
                />

                {/* Gradient overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(circle at 30% 30%, rgba(102,126,234,0.4), transparent 60%)",
                    }}
                />

                {/* Content */}
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className={styles.heroTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Bienvenue sur <span className={styles.highlight}>INFOcAMPUS</span>
                    </motion.h1>

                    <motion.p
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Une plateforme SaaS moderne pour connecter les universités africaines
                    </motion.p>

                    <motion.div
                        className={styles.heroButtons}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={styles.glassBtn}
                            onClick={() => navigate("/get-started")}
                        >
                            {localStorage.getItem("user") ? " Voir les publications" : "Commencer"} <ChevronRight size={18} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            className={styles.outlineBtn}
                        >
                            <a style={{ textDecoration: "none" }} href="#features">En savoir plus</a>
                        </motion.button>
                    </motion.div>
                </motion.div>
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
            <Footer />

            {/* Tutorial Modal */}
            <TutorialModal
                tutorial={selectedTutorial}
                isOpen={!!selectedTutorial}
                onClose={() => setSelectedTutorial(null)}
            />
        </div>
    );
}
