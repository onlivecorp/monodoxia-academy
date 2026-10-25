import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminDatabaseTab() {
  const {
    sqlConfig,
    updateSqlConfig,
    testSqlConnection,
    migrateDatabaseTables,
    syncAllLocalDataToDatabase,
    usersList = [],
    coursesList = [],
    applicationsList = [],
    categoriesList = [],
    testimonialsList = [],
    clubTiersList = [],
    eventsList = [],
    communityTopics = [],
    showToast
  } = useApp();

  const defaultSql = {
    engine: "MySQL / MariaDB (cPanel / DirectAdmin / Plesk)",
    host: "localhost",
    port: "3306",
    database: "monodoxia_academy_db",
    username: "monodoxia_user",
    password: "",
    charset: "utf8mb4_unicode_ci",
    ssl: false,
    tablePrefix: "mdx_",
    status: "Qoşulub",
    lastTested: new Date().toLocaleTimeString('az-AZ')
  };

  const [dbForm, setDbForm] = useState(() => ({ ...defaultSql, ...(sqlConfig || {}) }));
  const [showPassword, setShowPassword] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (sqlConfig) {
      setDbForm(prev => ({ ...defaultSql, ...prev, ...sqlConfig }));
    }
  }, [sqlConfig]);

  const handlePing = async () => {
    setIsTesting(true);
    await testSqlConnection();
    setIsTesting(false);
  };

  const handleMigrate = async () => {
    setIsMigrating(true);
    await migrateDatabaseTables();
    setIsMigrating(false);
  };

  const handleSyncAll = async () => {
    if (typeof syncAllLocalDataToDatabase === 'function') {
      setIsSyncing(true);
      await syncAllLocalDataToDatabase();
      setIsSyncing(false);
    }
  };

  const handleExportBackup = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    let sql = `-- Monodoxia Academy Database Backup (${dateStr})\n-- Server: ${dbForm.host} | DB: ${dbForm.database}\n\nSET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\nSTART TRANSACTION;\n\n`;

    usersList.forEach(u => {
      sql += `INSERT INTO mdx_users (id, name, email, role, tier, status, joined_date) VALUES ('${u.id}', '${(u.name || '').replace(/'/g, "''")}', '${u.email}', '${u.role || 'Tələbə'}', '${u.tier || 'Free'}', '${u.status || 'Aktiv'}', '${u.joinedDate || dateStr}') ON DUPLICATE KEY UPDATE name=VALUES(name);\n`;
    });
    coursesList.forEach(c => {
      sql += `INSERT INTO mdx_courses (id, category, badge, duration, title, description, instructor, instructor_role, status, occupancy, price) VALUES ('${c.id}', '${c.category}', '${(c.badge || '').replace(/'/g, "''")}', '${c.duration}', '${(c.title || '').replace(/'/g, "''")}', '${(c.description || '').replace(/'/g, "''")}', '${(c.instructor || '').replace(/'/g, "''")}', '${(c.instructorRole || '').replace(/'/g, "''")}', '${c.status}', ${c.occupancy || 0}, '${c.price}') ON DUPLICATE KEY UPDATE title=VALUES(title);\n`;
    });
    (applicationsList || []).forEach(a => {
      sql += `INSERT INTO mdx_applications (id, user_id, user_name, user_email, user_phone, target_type, target_id, target_title, status, payment_status, attendance_status, price, applied_at) VALUES ('${a.id}', '${a.userId}', '${(a.userName || '').replace(/'/g, "''")}', '${a.userEmail}', '${a.userPhone || ''}', '${a.targetType}', '${a.targetId}', '${(a.targetTitle || '').replace(/'/g, "''")}', '${a.status}', '${a.paymentStatus}', '${a.attendanceStatus}', '${a.price}', '${a.appliedAt || dateStr}') ON DUPLICATE KEY UPDATE status=VALUES(status);\n`;
    });
    sql += `\nCOMMIT;\n`;

    const blob = new Blob([sql], { type: 'application/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `monodoxia_backup_${dateStr}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('SQL Backup faylı uğurla endirildi (monodoxia_backup.sql)', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h4 className="admin-section-title">Hosting SQL Verilənlər Bazası Əlaqəsi</h4>
          <p className="admin-section-subtitle">
            cPanel, DirectAdmin, Plesk, VPS və ya bulud hostingdə (AWS RDS / Supabase / DigitalOcean) yaradılmış SQL bazasının bağlantı parametrlərini tənzimləyin
          </p>
        </div>
        <span className="admin-count-badge">
          MySQL 8.0+ Enterprise
        </span>
      </div>

      {/* Connection Health Status Banner */}
      <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="admin-live-dot" style={{ width: '10px', height: '10px' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Status: <strong style={{ color: '#15803d' }}>{sqlConfig?.status || dbForm?.status || 'Qoşulub'}</strong></span>
              <span className="admin-badge-gold">
                {(dbForm?.engine || 'MySQL').split(' ')[0]} 8.0+
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              Server: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{dbForm?.host || 'localhost'}:{dbForm?.port || '3306'}</strong> • Baza: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{dbForm?.database || 'monodoxia_db'}</strong> • Son yoxlama: {sqlConfig?.lastTested || dbForm?.lastTested || 'İndi'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            disabled={isTesting}
            onClick={handlePing}
            className="admin-btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>sync</span>
            <span>{isTesting ? 'Yoxlanılır...' : 'Bağlantını Sına (Ping)'}</span>
          </button>
          <button
            type="button"
            disabled={isMigrating}
            onClick={handleMigrate}
            className="admin-btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: isMigrating ? 0.7 : 1 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>database</span>
            <span>{isMigrating ? 'Miqrasiya edilir...' : 'Cədvəlləri Miqrasiya Et'}</span>
          </button>
          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncAll}
            className="admin-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: isSyncing ? 0.7 : 1 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>cloud_upload</span>
            <span>{isSyncing ? 'Sinxronlaşdırılır...' : 'Lokal Məlumatları SQL-ə Sinxronlaşdır'}</span>
          </button>
        </div>
      </div>

      {/* Configuration Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateSqlConfig(dbForm);
          showToast('SQL konfiqurasiyası yadda saxlanıldı', 'success');
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '780px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div>
            <label className="admin-label">Verilənlər Bazası Mühərriki (RDBMS)</label>
            <select
              value={dbForm.engine}
              onChange={(e) => setDbForm({ ...dbForm, engine: e.target.value })}
              className="admin-select"
            >
              <option value="MySQL / MariaDB (cPanel / DirectAdmin / Plesk)">MySQL / MariaDB (Standart cPanel / Plesk)</option>
              <option value="PostgreSQL (Supabase / AWS RDS / Neon)">PostgreSQL (Supabase / AWS RDS)</option>
              <option value="Microsoft SQL Server (MSSQL)">Microsoft SQL Server (MSSQL)</option>
              <option value="SQLite 3 (Lokal Embedded)">SQLite 3 (Lokal fayl)</option>
            </select>
          </div>

          <div>
            <label className="admin-label">Cədvəl Prefiksi (Table Prefix)</label>
            <input
              type="text"
              value={dbForm.tablePrefix}
              onChange={(e) => setDbForm({ ...dbForm, tablePrefix: e.target.value })}
              placeholder="mdx_"
              className="admin-input"
              style={{ fontFamily: 'monospace' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="admin-label">SQL Server Host / IP Ünvanı</label>
            <input
              type="text"
              required
              value={dbForm.host}
              onChange={(e) => setDbForm({ ...dbForm, host: e.target.value })}
              placeholder="localhost və ya sql.hosting.com"
              className="admin-input"
              style={{ fontFamily: 'monospace' }}
            />
            <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', display: 'block' }}>
              Əksər hostinglərdə: <code style={{ color: '#c5a059' }}>localhost</code> və ya <code style={{ color: '#c5a059' }}>127.0.0.1</code>
            </span>
          </div>

          <div>
            <label className="admin-label">Port</label>
            <input
              type="text"
              required
              value={dbForm.port}
              onChange={(e) => setDbForm({ ...dbForm, port: e.target.value })}
              placeholder="3306"
              className="admin-input"
              style={{ fontFamily: 'monospace' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div>
            <label className="admin-label">Verilənlər Bazasının Adı (Database Name)</label>
            <input
              type="text"
              required
              value={dbForm.database}
              onChange={(e) => setDbForm({ ...dbForm, database: e.target.value })}
              placeholder="monodoxi_academy_db"
              className="admin-input"
              style={{ fontFamily: 'monospace' }}
            />
          </div>

          <div>
            <label className="admin-label">İstifadəçi Adı (DB Username)</label>
            <input
              type="text"
              required
              value={dbForm.username}
              onChange={(e) => setDbForm({ ...dbForm, username: e.target.value })}
              placeholder="monodoxi_user"
              className="admin-input"
              style={{ fontFamily: 'monospace' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div>
            <label className="admin-label">Baza İstifadəçi Şifrəsi (Password)</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={dbForm.password}
                onChange={(e) => setDbForm({ ...dbForm, password: e.target.value })}
                placeholder="DB Şifrəsi"
                className="admin-input"
                style={{ paddingRight: '36px', fontFamily: 'monospace' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="admin-label">Şrift Kodlaşdırması (Charset / Collation)</label>
            <select
              value={dbForm.charset}
              onChange={(e) => setDbForm({ ...dbForm, charset: e.target.value })}
              className="admin-select"
            >
              <option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci (Tövsiyə olunan, tam UTF-8)</option>
              <option value="utf8mb4_general_ci">utf8mb4_general_ci</option>
              <option value="utf8_general_ci">utf8_general_ci</option>
            </select>
          </div>
        </div>

        {/* SSL Setting */}
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Təhlükəsiz SSL / TLS Şifrələməsi</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Uzaq serverlər və bulud bazaları (AWS / DigitalOcean / Supabase) üçün tövsiyə edilir</div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(dbForm.ssl)}
            onChange={(e) => setDbForm({ ...dbForm, ssl: e.target.checked })}
            style={{ accentColor: '#c5a059', width: '16px', height: '16px', cursor: 'pointer' }}
          />
        </div>

        {/* Connection String Preview */}
        <div className="admin-code-block">
          <span style={{ color: '#b45309', fontWeight: 700, userSelect: 'none' }}>.env / DATABASE_URL: </span>
          <span>
            mysql://{dbForm.username || 'user'}:{dbForm.password ? '••••••••' : ''}@{dbForm.host || 'localhost'}:{dbForm.port || '3306'}/{dbForm.database || 'db'}?ssl={dbForm.ssl ? 'true' : 'false'}&charset={dbForm.charset}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '4px', flexWrap: 'wrap' }}>
          <button type="submit" className="admin-btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>save</span>
            <span>SQL Konfiqurasiyasını Yadda Saxla</span>
          </button>
          <button
            type="button"
            onClick={handleExportBackup}
            className="admin-btn-secondary"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
            <span>SQL Backup İxrac Et</span>
          </button>
        </div>
      </form>

      {/* Database Tables Overview */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          Aktiv SQL Cədvəllər Sxemi (InnoDB Engine)
        </h5>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {[
            { name: `${dbForm?.tablePrefix || 'mdx_'}users`, count: `${(usersList || []).length} sətir`, desc: 'Tələbələr, rollar, icazələr' },
            { name: `${dbForm?.tablePrefix || 'mdx_'}courses`, count: `${(coursesList || []).length} sətir`, desc: 'Akademiya kursları, qiymətlər' },
            { name: `${dbForm?.tablePrefix || 'mdx_'}applications`, count: `${(applicationsList || []).length} sətir`, desc: 'Kurs və tədbir müraciətləri' },
            { name: `${dbForm?.tablePrefix || 'mdx_'}categories`, count: `${(categoriesList || []).length} sətir`, desc: 'Kurs və məqalə kateqoriyaları' },
            { name: `${dbForm?.tablePrefix || 'mdx_'}testimonials`, count: `${(testimonialsList || []).length} sətir`, desc: 'Müştəri və tələbə rəyləri' },
            { name: `${dbForm?.tablePrefix || 'mdx_'}club_tiers`, count: `${(clubTiersList || []).length} sətir`, desc: 'Üzvlük paketləri' },
            { name: `${dbForm?.tablePrefix || 'mdx_'}events`, count: `${(eventsList || []).length} sətir`, desc: 'Vebinarlar və qeydiyyatlar' },
            { name: `${dbForm?.tablePrefix || 'mdx_'}community_posts`, count: `${(communityTopics || []).length} sətir`, desc: 'İcma mövzuları və şərhlər' },
          ].map(table => (
            <div key={table.name} className="admin-card" style={{ padding: '10px 12px' }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                <span className="material-symbols-outlined" style={{ color: '#b45309', fontSize: '14px' }}>table_rows</span>
                <span>{table.name}</span>
              </div>
              <div style={{ fontSize: '10px', color: '#b45309', fontWeight: 700, marginTop: '4px' }}>{table.count}</div>
              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{table.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
