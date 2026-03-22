import { MapPin, Phone, Activity, AlertTriangle, Navigation, CheckCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';

const createIcon = (color: string, iconHtml: string) => L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div style="background: ${color}; padding: 6px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white; width: 32px; height: 32px;">${iconHtml}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const incidentSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
const dispatchSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>';

function MapSetter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, map.getZoom(), { animate: true }); }, [center, map]);
  return null;
}

export default function CitizenPortal() {
  const { status, triggerEmergency, incidentData, routePoints, currentAmbPos } = useEmergency();
  const [showSchedule, setShowSchedule] = useState(false);

  if (status === 'IDLE') {
    return (
      <div className="citizen-wrapper">
        <div className="citizen-top-alert">
          <div className="citizen-alert-icon">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h2>Emergency Response</h2>
            <p>Fast. Reliable. Life-Saving.</p>
          </div>
        </div>
        
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.25rem', borderRadius: '20px' }}>
           <button style={{ padding: '0.4rem 1rem', borderRadius: '16px', background: 'white', color: 'black', fontWeight: 700, fontSize: '0.85rem' }}>EN</button>
           <button style={{ padding: '0.4rem 1rem', borderRadius: '16px', background: 'transparent', color: 'white', fontWeight: 700, fontSize: '0.85rem' }} onClick={() => toast.success("Hindi text loaded")}>HI</button>
        </div>
  
        <div className="citizen-main">
          <h1>Medical Emergency?</h1>
          <p className="sub">Tap the button below to request immediate assistance</p>
  
          <button 
            onClick={() => triggerEmergency([28.5245, 77.1555])}
            className="sos-mega-btn"
          >
            <Phone size={64} style={{strokeWidth: 2}} color="white" />
            <span className="big">sos</span>
            <span className="sml">Emergency</span>
          </button>
  
          <p className="sub" style={{marginTop: '3rem', fontSize: '1rem', color: '#999', maxWidth: '500px'}}>
            By pressing this button, your GPS location will be captured and an<br/>
            ambulance will be dispatched to your location immediately.
          </p>
          
          <button 
            onClick={() => setShowSchedule(true)} 
            className="secondary-action-btn"
          >
             <Calendar size={18} /> Schedule Non-Emergency Ambulance
          </button>
  
          <div className="citizen-info-cards">
             <div className="citizen-card" style={{borderColor: '#3B82F650'}}>
                <div className="c-icon"><MapPin color="#3B82F6" size={24} /></div>
                <h3>GPS Tracking</h3>
                <p>Precise location capture</p>
             </div>
             <div className="citizen-card" style={{borderColor: '#28A71D50'}}>
                <div className="c-icon"><Activity color="#28A71D" size={24} /></div>
                <h3>Real-Time Dispatch</h3>
                <p>Nearest ambulance</p>
             </div>
             <div className="citizen-card" style={{borderColor: '#FF993350'}}>
                <div className="c-icon"><AlertTriangle color="#FF9933" size={24} /></div>
                <h3>Hospital Ready</h3>
                <p>Optimal hospital</p>
             </div>
          </div>
        </div>

        {showSchedule && (
          <div className="modal-overlay">
            <div className="modal-content" style={{background: '#1a1a1a', border: '1px solid #333', color: 'white', maxWidth: '450px'}}>
              <div className="modal-header" style={{background: 'transparent', borderBottom: '1px solid #333', padding: '1.5rem'}}>
                <h2 style={{color: 'white', margin: 0, justifyContent: 'flex-start', fontSize: '1.25rem'}}><Calendar size={24} style={{color: 'var(--blue-badge)'}}/> Schedule Transport</h2>
                <p style={{textAlign: 'left', marginTop: '0.5rem', color: '#aaa'}}>For dialysis, checkups, or inter-hospital transfer.</p>
              </div>
              <div className="modal-body" style={{background: 'transparent', boxShadow: 'none', padding: '1.5rem', textAlign: 'left', border: 'none', margin: 0}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#aaa'}}>Patient Name</label>
                    <input type="text" placeholder="Enter patient name" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0a0a0a', border: '1px solid #333', color: 'white'}} />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#aaa'}}>Purpose</label>
                    <select style={{width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0a0a0a', border: '1px solid #333', color: 'white'}}>
                      <option>Dialysis Scheduling</option>
                      <option>Routine Checkup</option>
                      <option>Hospital Transfer</option>
                    </select>
                  </div>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <div style={{flex: 1}}>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#aaa'}}>Date</label>
                      <input type="date" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0a0a0a', border: '1px solid #333', color: 'white'}} />
                    </div>
                    <div style={{flex: 1}}>
                      <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#aaa'}}>Time</label>
                      <input type="time" style={{width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0a0a0a', border: '1px solid #333', color: 'white'}} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{display: 'flex', gap: '1rem'}}>
                <button onClick={() => setShowSchedule(false)} style={{flex: 1, padding: '1rem', borderRadius: '8px', background: 'transparent', border: '1px solid #555', color: 'white', cursor: 'pointer', fontWeight: 600}}>Cancel</button>
                <button onClick={() => { toast.success('Ambulance Scheduled Successfully!'); setShowSchedule(false); }} style={{flex: 1, padding: '1rem', borderRadius: '8px', background: 'var(--blue-badge)', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 600}}>Confirm Booking</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // TRIGGERED or DISPATCHED or ARRIVED
  return (
    <div className="citizen-wrapper" style={{background: '#0d090f'}}>
      <div className="tracking-view">
         <div className="tracking-header">
            <div>
               <h2 style={{fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.25rem'}}>
                 {status === 'TRIGGERED' ? 'SOS Received' : status === 'ARRIVED' ? 'Ambulance Arrived' : 'Ambulance Dispatched'}
               </h2>
               <p style={{color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                 <Navigation size={16} />
                 {status === 'TRIGGERED' 
                   ? 'Waiting for AI dispatcher network to assign unit...' 
                   : 'Unit ALS-42 is heading to your live location.'}
               </p>
            </div>
            
            <div className="tracking-eta">
               {status === 'TRIGGERED' && <div className="sos-ping-ring" style={{position:'relative', width:'30px', height:'30px', margin:'0 auto'}}></div>}
               {status === 'DISPATCHED' && (
                 <>
                   <span className="time">2</span><br/><span className="lbl">MIN ETA</span>
                 </>
               )}
               {status === 'ARRIVED' && (
                 <>
                   <span className="time"><CheckCircle color="var(--green-light)" size={32} /></span><br/><span className="lbl">ARRIVED</span>
                 </>
               )}
            </div>
         </div>

         <div className="tracking-map-container" style={{ position: 'relative' }}>
            {incidentData && (
              <MapContainer center={incidentData.location} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                {/* Dark matter map tiles for the Citizen dark mode view */}
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                
                {currentAmbPos && <MapSetter center={currentAmbPos} />}
                
                <Marker position={incidentData.location} icon={createIcon('#e53935', incidentSvg)}>
                  <Popup>Your Location</Popup>
                </Marker>

                {status !== 'TRIGGERED' && routePoints.length > 0 && currentAmbPos && (
                  <>
                    <Polyline positions={routePoints} pathOptions={{ color: '#28A71D', weight: 4, opacity: 0.8 }} />
                    <Marker position={currentAmbPos} icon={createIcon('#28A71D', dispatchSvg)}>
                      <Popup>Your Ambulance</Popup>
                    </Marker>
                  </>
                )}
              </MapContainer>
            )}

            {status !== 'TRIGGERED' && (
              <div style={{
                position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 1000,
                background: 'rgba(20, 20, 20, 0.9)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem',
                borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)', color: 'white'
              }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={24} color="white" />
                </div>
                <div>
                  <h3 style={{fontSize: '1.2rem', fontWeight: 800, margin: 0}}>Unit ALS-42</h3>
                  <p style={{fontSize: '0.85rem', color: '#aaa', margin: '4px 0 0 0'}}>
                    Driver: Raj Sharma <br/> Plate: DL-1C-AB-1234
                  </p>
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
