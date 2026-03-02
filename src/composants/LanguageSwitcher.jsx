import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas } from 'react-icons/fa';
import Dropdown from 'react-bootstrap/Dropdown';
import './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

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
          onClick={() => i18n.changeLanguage('en')}
        >
          English
        </Dropdown.Item>
        <Dropdown.Item
          active={i18n.language === 'fr'}
          onClick={() => i18n.changeLanguage('fr')}
        >
          Français
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
