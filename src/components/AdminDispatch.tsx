import { useState, useEffect } from 'react';
import { Activity, Siren, Navigation2, CheckCircle, Database } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEmergency } from '../context/EmergencyContext';

const createIcon = (color: string, iconHtml: string) => L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="background: ${color}; padding: 6px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white; width: 32px; height: 32px;">${iconHtml}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const incidentSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
const dispatchSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>';

const hourlyData = [
  { time: '6AM', calls: 12 }, { time: '8AM', calls: 45 }, { time: '10AM', calls: 38 },
  { time: '12PM', calls: 52 }, { time: '2PM', calls: 41 }, { time: '4PM', calls: 48 },
  { time: '6PM', calls: 65 }, { time: '8PM', calls: 58 }, { time: '10PM', calls: 35 },
];

const hospitalBeds = [
  { name: 'City General (Trauma)', bedsAvailable: 12, percentage: 85, color: '#ef4444' },
  { name: 'Safdarjung', bedsAvailable: 78, percentage: 72, color: '#f59e0b' },
  { name: 'AIIMS', bedsAvailable: 24, percentage: 91, color: '#ef4444' },
  { name: 'Max Saket', bedsAvailable: 95, percentage: 68, color: '#22c55e' },
  { name: 'Fortis', bedsAvailable: 62, percentage: 75, color: '#f59e0b' }
];

function MapSetter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom(), { animate: true }); }, [center, map]);
  return null;
}

export default function AdminDispatch() {
  const { status, incidentData, routePoints, currentAmbPos, dispatchAmbulance } = useEmergency();
  
  const mapCenter: [number, number] = [28.5245, 77.1555];
  const incidentPos: [number, number] = incidentData ? incidentData.location : mapCenter;
  
  const [isOptimizing, setIsOptimizing] = useState(false);

  const executeDisptach = () => {
    dispatchAmbulance();
    toast.success('Ambulance ALS-42 Dispatched via Green Corridor!');
    setIsOptimizing(false);
  };

  return (
    <div className="admin-dispatch-view">
      <div className="dispatch-top-row">
        
        <div className="dispatch-left-pane">
          <div className="command-card">
            <h2><Siren size={20} style={{color: 'var(--red-sos)'}}/> Active Incident Command</h2>
            
            {status === 'IDLE' && (
              <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>
                <CheckCircle size={48} style={{color: 'var(--green)', margin: '0 auto 1rem', opacity: 0.3}} />
                <p>No active emergencies.</p>
              </div>
            )}

            {status === 'TRIGGERED' && !isOptimizing && (
              <div className="alert-box">
                 <h3>SOS Received</h3>
                 <p>{incidentData?.name || "Citizen"} reported life-threatening incident.</p>
                 <button onClick={() => setIsOptimizing(true)} className="primary-btn">
                   <Database size={18} /> Open AI Dispatch Matrix
                 </button>
              </div>
            )}

            {isOptimizing && (
              <div className="optimizer-panel">
                <div className="opt-header">
                  <h3><Activity size={18} /> Dispatch AI Matrix</h3>
                  <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Scanning real-time traffic and hospital APIs</p>
                </div>
                <table className="opt-table">
                  <thead>
                    <tr>
                      <th>Unit</th>
                      <th>ETA</th>
                      <th>Target ER</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="best-match">
                      <td><span className="live-badge" style={{display:'inline-flex', background:'transparent'}}>ALS-42</span><br/><span style={{fontSize:'0.75rem', color:'var(--green)'}}>Traffic: Light</span></td>
                      <td><strong>2 min</strong></td>
                      <td><strong>City General</strong><br/><span style={{fontSize:'0.75rem'}}>12 ICU Free</span></td>
                      <td><button onClick={executeDisptach} className="dispatch-action-btn">DISPATCH</button></td>
                    </tr>
                    <tr>
                      <td>BLS-19<br/><span style={{fontSize:'0.75rem', color:'var(--saffron)'}}>Traffic: Moderate</span></td>
                      <td>5 min</td>
                      <td>AIIMS<br/><span style={{fontSize:'0.75rem'}}>24 ICU Free</span></td>
                      <td><button onClick={executeDisptach} className="dispatch-action-btn" style={{background:'var(--bg-main)', color:'var(--text-main)', border:'1px solid var(--border-color)'}}>Select</button></td>
                    </tr>
                    <tr>
                      <td>ALS-07<br/><span style={{fontSize:'0.75rem', color:'var(--red-sos)'}}>Traffic: Heavy</span></td>
                      <td>8 min</td>
                      <td>Safdarjung<br/><span style={{fontSize:'0.75rem'}}>78 ICU Free</span></td>
                      <td><button onClick={executeDisptach} className="dispatch-action-btn" style={{background:'var(--bg-main)', color:'var(--text-main)', border:'1px solid var(--border-color)'}}>Select</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {['DISPATCHED', 'ARRIVED', 'ADMITTED'].includes(status) && (
               <div className="transit-box">
                 <Navigation2 size={32} style={{color: 'var(--blue-badge)', margin: '0 auto'}} />
                 <h3>Unit In Transit</h3>
                 <p>ALS-42 en route to origin.</p>
               </div>
            )}
          </div>
        </div>

        <div className="map-pane">
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
            {currentAmbPos && <MapSetter center={currentAmbPos} />}
            {status !== 'IDLE' && incidentData && (
              <Marker position={incidentPos} icon={createIcon('#e53935', incidentSvg)}><Popup>Incident Origin</Popup></Marker>
            )}
            {['DISPATCHED', 'ARRIVED', 'ADMITTED'].includes(status) && routePoints.length > 0 && currentAmbPos && (
              <>
                <Polyline positions={routePoints} pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.6 }} />
                <Marker position={currentAmbPos} icon={createIcon('#f59e0b', dispatchSvg)}><Popup>ALS-42 En Route</Popup></Marker>
              </>
            )}
          </MapContainer>
        </div>
      </div>

      <div className="analytics-section">
        <div className="hospital-beds-list">
           {hospitalBeds.map((h, i) => (
             <div key={i} className="hospital-row">
               <div className="hospital-row-header">
                 <span className="hospital-name">{h.name}</span>
                 <span className="hospital-avail">{h.bedsAvailable} beds available</span>
               </div>
               <div className="hospital-bar-bg">
                  <div style={{ width: `${h.percentage}%`, backgroundColor: h.color }} className="hospital-bar-fill"></div>
                  <span className="hospital-percentage">{h.percentage}%</span>
               </div>
             </div>
           ))}
        </div>

        <div>
           <h3>Hourly Request Distribution</h3>
           <p className="subtitle">Emergency calls throughout the day</p>
           <div className="chart-container">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e2e8f0" />
                   <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dx={-10} />
                   <Tooltip />
                   <Line type="monotone" dataKey="calls" stroke="#0284c7" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#0284c7' }} activeDot={{ r: 6 }} />
                </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
