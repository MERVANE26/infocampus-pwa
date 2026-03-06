import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (language) => {
    // Change the language and save to localStorage
    i18n.changeLanguage(language);
    localStorage.setItem('app_language', language);
    // Trigger a storage event so other tabs/windows can react
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
  };

  return (
    <Dropdown className="d-inline">
      <Dropdown.Toggle 
        variant="link" 
        id="language-switcher"
        className="navbar-language-toggle"
        title={t('common.language')}
      >
        <FaGlobeAmericas size={18} />
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <Dropdown.Item
          active={i18n.language === 'en'}
          onClick={() => handleLanguageChange('en')}
        >
          <span style={{ marginRight: '8px' }}>🇬🇧</span> English
        </Dropdown.Item>
        <Dropdown.Item
          active={i18n.language === 'fr'}
          onClick={() => handleLanguageChange('fr')}
        >
          <span style={{ marginRight: '8px' }}>🇫🇷</span> Français
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;

