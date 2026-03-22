import { useState, useEffect } from 'react';
import { Shield, Moon, Sun, Users, Activity, Hospital } from 'lucide-react';
import CitizenPortal from './components/CitizenPortal';
import AdminDispatch from './components/AdminDispatch';
import HospitalER from './components/HospitalER';
import { useEmergency } from './context/EmergencyContext';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'citizen' | 'admin' | 'hospital'>('citizen');
  const { status } = useEmergency();

  useEffect(() => {
    if (status === 'IDLE') setActiveTab('citizen');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // If citizen, use dark theme internally for the portal
  useEffect(() => {
    if (activeTab === 'citizen') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, [activeTab, theme]);

  return (
    <div className={`app-root ${theme}`}>
      <header className="global-topbar">
        <div className="logo-group">
          <div className="shield-wrapper">
            <Shield className="logo-icon text-navy" size={28} />
            <span className="badge-108">108</span>
          </div>
          <div className="logo-text">
            <h1>Rapid India</h1>
            <span>EMERGENCY RESPONSE SYSTEM</span>
          </div>
        </div>

        <div className="tricolor-bar">
           <div className="saffron-bg"></div>
           <div className="white-bg"></div>
           <div className="green-bg"></div>
        </div>

        <div className="topbar-right">
          <div className="digital-india-pill">
            <span className="dot saffron"></span>
            <span className="dot white"></span>
            <span className="dot green"></span>
            <span className="pill-text">Digital India</span>
          </div>
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="theme-toggle">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      <main className="main-content">
         <div className="sub-header-nav">
           <div className="tab-switcher">
              <button className={`tab-btn ${(activeTab as string) === 'citizen' ? 'active' : ''}`} onClick={() => setActiveTab('citizen')}>
                <Users size={16} /> Citizen
              </button>
              <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
                <Activity size={16} /> Admin
              </button>
              <button className={`tab-btn ${activeTab === 'hospital' ? 'active' : ''}`} onClick={() => setActiveTab('hospital')}>
                <Hospital size={16} /> Hospital
              </button>
           </div>
           
           <div className="system-status-indicator">
              <span className="status-text"><span className="pulse-dot-green"></span> System Online</span>
              <span className="live-badge"><Activity size={12}/> Live</span>
           </div>
         </div>

         <div className={`content-container ${activeTab === 'citizen' ? 'full-bleed' : ''}`}>
            {activeTab === 'citizen' && <CitizenPortal />}
            {activeTab === 'admin' && <AdminDispatch />}
            {activeTab === 'hospital' && <HospitalER />}
         </div>
      </main>
    </div>
  );
}

export default App;
