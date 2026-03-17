import React from 'react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(nextLng);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'var(--glass)',
      backdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid var(--border)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{
        fontSize: '1.5rem',
        fontWeight: 800,
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontFamily: 'Outfit, sans-serif'
      }}>
        DisasterLens
      </div>
      
      <ul style={{
        display: 'flex',
        gap: '2.5rem',
        fontSize: '0.95rem',
        fontWeight: 500
      }}>
        <li><a href="/" style={{ color: 'var(--text-main)' }}>{t('dashboard')}</a></li>
        <li><a href="/map" style={{ color: 'var(--text-muted)' }}>{t('map')}</a></li>
        <li><a href="/reports" style={{ color: 'var(--text-muted)' }}>{t('reports')}</a></li>
        <li><a href="/settings" style={{ color: 'var(--text-muted)' }}>{t('settings')}</a></li>
      </ul>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <button 
          onClick={toggleLanguage}
          style={{
            color: 'var(--primary)',
            fontSize: '0.9rem',
            fontWeight: 700,
            border: '1px solid var(--primary)',
            padding: '0.4rem 0.8rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)'
          }}
        >
          {i18n.language === 'en' ? 'বাংলা' : 'English'}
        </button>
        <button style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>{t('help')}</button>
        <button style={{
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          padding: '0.6rem 1.4rem',
          borderRadius: '10px',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          transition: 'var(--transition)'
        }}>{t('login')}</button>
      </div>
    </nav>
  );
};

export default Navbar;
