import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalTab, setAuthModalTab, login, register } = useApp();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regCountry, setRegCountry] = useState('Azərbaycan');

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    register({
      firstName: regFirstName,
      lastName: regLastName,
      email: regEmail,
      password: regPassword,
      birthDate: regBirthDate,
      city: regCity,
      country: regCountry
    });
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="bg-surface-bright rounded-lg border border-outline-variant shadow-2xl max-w-md w-full overflow-hidden relative">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <div className="flex border-b border-outline-variant/60 pt-4 px-6 gap-6">
          <button
            onClick={() => setAuthModalTab('login')}
            className={`pb-3 text-sm font-semibold transition-all ${
              authModalTab === 'login'
                ? 'border-b-2 border-secondary text-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Daxil ol
          </button>
          <button
            onClick={() => setAuthModalTab('register')}
            className={`pb-3 text-sm font-semibold transition-all ${
              authModalTab === 'register'
                ? 'border-b-2 border-secondary text-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Yeni Hesab Aç
          </button>
        </div>

        <div className="p-6">
          {authModalTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Elektron Poçt</label>
                <input
                  required
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="adınız@monodoxia.academy"
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm text-primary focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="mt-3">
                <label className="block text-xs font-semibold text-primary mb-1">Şifrə</label>
                <input
                  required
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm text-primary focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-5 py-2.5 bg-primary-container text-on-primary hover:bg-[#112240] rounded text-sm font-semibold tracking-wide transition-colors"
              >
                Giriş Et
              </button>
              <div className="pt-2 text-center text-xs text-outline">
                Tez sınaq üçün: <span className="text-secondary font-mono">admin@monodoxia.academy</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Ad</label>
                  <input
                    required
                    type="text"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="Aysel"
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm text-primary focus:border-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Soyad</label>
                  <input
                    required
                    type="text"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Məcidova"
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm text-primary focus:border-secondary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Elektron Poçt</label>
                <input
                  required
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="aysel@example.com"
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm text-primary focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-primary mb-1">Şifrə</label>
                <input
                  required
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-sm text-primary focus:border-secondary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Doğum Tarixi</label>
                  <input
                    type="date"
                    value={regBirthDate}
                    onChange={(e) => setRegBirthDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-primary mb-1">Şəhər</label>
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Bakı"
                    className="w-full px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-primary"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-4 py-2.5 bg-secondary text-surface-bright hover:bg-secondary-container hover:text-on-secondary-fixed rounded text-sm font-semibold tracking-wide transition-colors"
              >
                Qeydiyyatdan Keç və Onboarding-ə Başla
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
