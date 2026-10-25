import React from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminOverviewTab({ setActiveTab, onQuickCreate }) {
  const {
    applicationsList = [],
    usersList = [],
    coursesList = [],
    platformSettings = {}
  } = useApp();

  const pendingCount = applicationsList.filter(a => a.status === 'Yeni' && !a.archived).length;

  const totalRevenue = applicationsList.reduce((acc, app) => {
    const isPaid = app.payment_status === 'Ödənilib' || app.paymentStatus === 'Ödənilib';
    if (isPaid && app.price) {
      const num = parseFloat(String(app.price).replace(/[^0-9.]/g, '')) || 0;
      return acc + num;
    }
    return acc;
  }, 0);

  const totalModules = coursesList.reduce((acc, c) => acc + (c.modules ? c.modules.length : 0), 0);
  const activeResidents = usersList.filter(u => u.tier && u.tier !== 'Free' && u.tier !== 'Basic').length;
  const activeUsersCount = usersList.filter(u => u.status === 'Aktiv').length;

  const kpis = [
    {
      label: 'Müraciətlər',
      value: applicationsList.filter(a => !a.archived).length,
      trend: `${pendingCount} yeni daxil olan`,
      trendColor: '#2563eb',
      icon: 'assignment'
    },
    {
      label: 'İstifadəçilər',
      value: usersList.length,
      trend: `${activeUsersCount} aktiv hesab`,
      trendColor: '#15803d',
      icon: 'group'
    },
    {
      label: 'Klub Üzvləri',
      value: activeResidents,
      trend: 'Aktiv Üzvlük',
      trendColor: '#b45309',
      icon: 'card_membership'
    },
    {
      label: 'Ümumi Gəlir',
      value: `₼ ${totalRevenue.toLocaleString()}`,
      trend: `${applicationsList.filter(a => (a.payment_status === 'Ödənilib' || a.paymentStatus === 'Ödənilib')).length} təsdiqlənmiş ödəniş`,
      trendColor: '#b45309',
      icon: 'payments'
    },
    {
      label: 'Aktiv Kurslar',
      value: coursesList.length,
      trend: `${totalModules} modul tədris`,
      trendColor: '#64748b',
      icon: 'school'
    }
  ];

  const systemStatusRows = [
    {
      label: 'Etik Qeyri-Klinik Bildiriş',
      value: platformSettings.showSafetyBanner ? 'AKTİV' : 'DEAKTİV',
      ok: Boolean(platformSettings.showSafetyBanner),
      action: () => setActiveTab('settings')
    },
    {
      label: 'Yeni Qeydiyyat Qəbulu',
      value: platformSettings.allowRegistrations !== false ? 'AÇIQ' : 'BAĞLI',
      ok: platformSettings.allowRegistrations !== false,
      action: () => setActiveTab('settings')
    },
    {
      label: 'Texniki Qulluq Rejimi',
      value: platformSettings.maintenanceMode ? 'AKTİV' : 'SÖNDÜRÜLÜB',
      ok: !platformSettings.maintenanceMode,
      action: () => setActiveTab('maintenance'),
      highlight: true
    }
  ];

  const logs = [];
  applicationsList.slice(0, 5).forEach(app => {
    logs.push({
      text: `${app.user_name || app.userName || 'İstifadəçi'}: ${app.target_title || app.targetTitle || 'Kurs'} (${app.status})`,
      time: app.applied_at || app.appliedAt ? String(app.applied_at || app.appliedAt).slice(0, 16) : 'Yeni'
    });
  });
  if (logs.length === 0) {
    logs.push(
      { text: 'Sistem aktivdir və real müraciətlər üçün hazırdır', time: 'İndi' },
      { text: 'Məlumat bazası təmizləndi və sinxronlaşdırıldı', time: 'İndi' }
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="admin-section-title">Sistem İcmalı & Analitika</h4>
          <p className="admin-section-subtitle">Real vaxt tələbə aktivliyi, gəlir, qeydiyyatlar və tədris modulları statistikası</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <div className="admin-live-dot" />
          <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>Canlı Yeniləmə Aktivdir</span>
        </div>
      </div>

      {/* Pending Applications Alert */}
      {pendingCount > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#2563eb' }}>mark_email_unread</span>
            <div>
              <strong style={{ fontSize: '13px', color: '#1e40af' }}>Gözləyən {pendingCount} yeni müraciət var!</strong>
              <p style={{ fontSize: '11px', color: '#3b82f6', margin: '2px 0 0 0' }}>Kurslar, klublar və ya vebinarlar üçün daxil olmuş yeni müraciətlər administrator təsdiqi gözləyir.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className="admin-btn-primary"
            style={{ background: '#2563eb', padding: '7px 16px', fontSize: '11px' }}
          >
            <span>Müraciətləri Yoxla</span>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_forward</span>
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map((kpi, i) => (
          <div key={i} className="admin-stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="admin-stat-label">{kpi.label}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#b45309' }}>{kpi.icon}</span>
            </div>
            <div className="admin-stat-value">{kpi.value}</div>
            <div style={{ fontSize: '11px', color: kpi.trendColor, fontWeight: 600, marginTop: '6px' }}>{kpi.trend}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div className="admin-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', background: '#fcfbf8', border: '1px solid #f1ece1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '20px' }}>bolt</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Sürətli Əməliyyatlar:</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onQuickCreate ? onQuickCreate('roles') : setActiveTab('roles')}
            className="admin-btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px', background: '#fffbeb', borderColor: '#fde68a' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>shield_person</span>
            <span style={{ fontWeight: 700, color: '#92400e' }}>+ Yeni Rol & Səlahiyyət</span>
          </button>
          <button
            type="button"
            onClick={() => onQuickCreate ? onQuickCreate('club') : setActiveTab('club')}
            className="admin-btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px', background: '#fffbeb', borderColor: '#fde68a' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>card_membership</span>
            <span style={{ fontWeight: 700, color: '#92400e' }}>+ Yeni Abunəlik Paketi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className="admin-btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>add_circle</span>
            <span>Yeni Kurs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className="admin-btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>event</span>
            <span>Yeni Tədbir</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className="admin-btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>person_add</span>
            <span>İstifadəçi Əlavə Et</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('maintenance')}
            className="admin-btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#b45309' }}>construction</span>
            <span>Texniki Qulluq Ekranı</span>
          </button>
        </div>
      </div>

      {/* System Status & Recent Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="admin-card">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#64748b', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Sistem Statusu</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#94a3b8' }}>tune</span>
          </div>
          {systemStatusRows.map((row, i) => (
            <div
              key={i}
              onClick={row.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 8px',
                borderRadius: '6px',
                cursor: row.action ? 'pointer' : 'default',
                background: row.highlight && platformSettings.maintenanceMode ? '#fffbeb' : 'transparent',
                borderBottom: i < systemStatusRows.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'background 0.15s ease'
              }}
              title={row.action ? 'Tənzimləmək üçün klikləyin' : ''}
            >
              <span style={{ fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {row.label}
                {row.action && <span className="material-symbols-outlined" style={{ fontSize: '13px', color: '#b45309' }}>arrow_forward</span>}
              </span>
              <span className={row.ok ? 'admin-badge-green' : 'admin-badge-red'}>{row.value}</span>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#64748b', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Son Müraciət Aktivliyi</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#94a3b8' }}>history</span>
          </div>
          {logs.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 0',
                borderBottom: i < logs.length - 1 ? '1px solid #f1f5f9' : 'none',
                gap: '12px'
              }}
            >
              <span style={{ fontSize: '12px', color: '#334155', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.text}
              </span>
              <span style={{ fontSize: '11px', color: '#64748b', flexShrink: 0, fontFamily: 'monospace' }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
