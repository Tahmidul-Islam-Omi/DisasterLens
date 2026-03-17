import React from 'react';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{t('dashboard')}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t('welcome')}</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {/* Metric Cards */}
        {[
          { label: t('active_disasters'), value: '12', color: 'var(--error)' },
          { label: t('verified_reports'), value: '1,420', color: 'var(--accent)' },
          { label: t('response_teams'), value: '45', color: 'var(--primary)' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            transition: 'var(--transition)',
            transform: 'translateY(0)'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</p>
            <h3 style={{ fontSize: '2.5rem', color: stat.color }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <section style={{ marginTop: '4rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2>{t('live_feed')}</h2>
          <button style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('see_all')}</button>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '1.5rem',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {[1, 2, 3].map((item) => (
            <div key={item} style={{
              padding: '1.5rem',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h4 style={{ marginBottom: '0.25rem' }}>{t('flood_alert')}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {t('reported_mins', { n: 5, s: 24 })}
                </p>
              </div>
              <span style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--error)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>{t('critical')}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
