import { Heart, Activity, Droplet, Thermometer, AlertTriangle, X } from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';

// Exact style reproductions for the ER Dashboard
export default function HospitalER() {
  const { status, incidentData, admitPatient, resetEmergency } = useEmergency();
  
  // Create an array mapping to image_1.png
  const incomingPatients = incidentData ? [
    {
       uid: 'p1',
       badgeText: 'CRITICAL',
       badgeColor: 'bg-red',
       borderColor: 'border-red',
       condition: incidentData.history.includes('Cardiac') ? 'Cardiac Emergency' : 'Accident Trauma',
       name: incidentData.name,
       ageGender: `${incidentData.age}y, ${incidentData.gender}`,
       aadhar: incidentData.id,
       ambulance: 'DL-01-AB-1234',
       eta: '2 min ETA',
       vitals: incidentData.vitals
    },
    {
       uid: 'p2',
       badgeText: 'HIGH',
       badgeColor: 'bg-saffron',
       borderColor: 'border-saffron',
       condition: 'Severe Burns',
       name: 'Priya Sharma',
       ageGender: '32y, Female',
       aadhar: '****-****-7891',
       ambulance: 'DL-03-EF-9012',
       eta: '6 min ETA',
       vitals: { hr: 98, bp: '130/85', spo2: 96, temp: 36.8 }
    }
  ] : [];

  const handleAcknowledge = () => {
    admitPatient();
    setTimeout(() => {
      resetEmergency();
    }, 4000);
  };

  return (
    <div className="er-dashboard">
      
      {/* Top 4 Dashboard Resources */}
      <div className="resource-grid-card">
        <h2>Hospital ER Resource Availability</h2>
        <div className="resource-grid">
           <div className="resource-card red">
              <span className="res-label">ICU Beds</span>
              <div className="res-val" style={{color: 'var(--red-sos)'}}>12<span className="res-total">/50</span></div>
              <div className="res-bar-bg"><div className="res-bar-fill" style={{width: '25%', background: 'var(--red-sos)'}}></div></div>
           </div>
           <div className="resource-card green">
              <span className="res-label">General Ward</span>
              <div className="res-val" style={{color: 'var(--green)'}}>78<span className="res-total">/200</span></div>
              <div className="res-bar-bg"><div className="res-bar-fill" style={{width: '40%', background: 'var(--green)'}}></div></div>
           </div>
           <div className="resource-card blue">
              <span className="res-label">O2 Cylinders</span>
              <div className="res-val" style={{color: 'var(--blue-badge)'}}>45<span className="res-total">/150</span></div>
              <div className="res-bar-bg"><div className="res-bar-fill" style={{width: '33%', background: 'var(--blue-badge)'}}></div></div>
           </div>
           <div className="resource-card saffron">
              <span className="res-label">Ventilators</span>
              <div className="res-val" style={{color: 'var(--saffron)'}}>8<span className="res-total">/30</span></div>
              <div className="res-bar-bg"><div className="res-bar-fill" style={{width: '27%', background: 'var(--saffron)'}}></div></div>
           </div>
        </div>
      </div>

      {status === 'IDLE' && (
        <div style={{background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '3rem', textAlign: 'center'}}>
          <p style={{color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '1px'}}>NO INCOMING TRANSPORTS.</p>
        </div>
      )}

      {/* Incoming Patients List */}
      {(status === 'DISPATCHED' || status === 'ARRIVED') && incomingPatients.length > 0 && (
        <div className="incoming-patients-card">
           <div className="incoming-header">
             <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <AlertTriangle size={24} style={{color: 'var(--saffron)'}} />
                <div>
                   <h3>Incoming Patients</h3>
                   <p>Real-time ambulance arrivals with patient vitals</p>
                </div>
             </div>
             <span className="en-route-badge">2 En Route</span>
           </div>

           <div className="incoming-list">
              {incomingPatients.map((patient) => (
                <div key={patient.uid} className={`patient-card ${patient.borderColor}`}>
                   <div className="patient-info-row">
                      
                      <div>
                         <div style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center'}}>
                            <span className={`status-badge ${patient.badgeColor}`}>{patient.badgeText}</span>
                            <span className="patient-cond">{patient.condition}</span>
                         </div>
                         <div>
                            <span className="patient-name">{patient.name}</span>
                            <span className="patient-demo">{patient.ageGender}</span>
                         </div>
                         <p className="patient-meta">
                           Aadhar: {patient.aadhar} &nbsp;|&nbsp; Amb: {patient.ambulance}
                         </p>
                      </div>

                      <div className="eta-block">
                         <span className="eta-val">{patient.eta.split(' ')[0]}</span>
                         <span className="eta-lbl">{patient.eta.split(' ').slice(1).join(' ')}</span>
                         <button className="view-btn">View Details</button>
                      </div>

                   </div>

                   {/* Vitals Blocks */}
                   <div className="vitals-grid">
                      <div className="vital-box">
                        <Heart size={20} style={{color: 'var(--red-sos)', strokeWidth: 2}} />
                        <div>
                           <span className="vital-val">{patient.vitals.hr}</span>
                           <span className="vital-lbl">BPM</span>
                        </div>
                      </div>
                      <div className="vital-box">
                        <Activity size={20} style={{color: '#3B82F6', strokeWidth: 2}} />
                        <div>
                           <span className="vital-val">{patient.vitals.bp}</span>
                           <span className="vital-lbl">BP</span>
                        </div>
                      </div>
                      <div className="vital-box">
                        <Droplet size={20} style={{color: 'var(--green)', strokeWidth: 2}} />
                        <div>
                           <span className="vital-val">{patient.vitals.spo2}%</span>
                           <span className="vital-lbl">SpO2</span>
                        </div>
                      </div>
                      <div className="vital-box">
                        <Thermometer size={20} style={{color: 'var(--saffron)', strokeWidth: 2}} />
                        <div>
                           <span className="vital-val">{patient.vitals.temp || 37.2}°C</span>
                           <span className="vital-lbl">Temp</span>
                        </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* MODAL from image.png */}
      {status === 'ARRIVED' && incomingPatients[0] && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button style={{position: 'absolute', right: '16px', top: '16px', color: '#888'}}><X size={20}/></button>
            
            <div className="modal-header">
               <h2><AlertTriangle size={24} style={{strokeWidth: 2.5}} /> PATIENT ARRIVING NOW</h2>
               <p>Ambulance has arrived at the emergency entrance</p>
            </div>

            <div className="modal-body">
               <h3>{incomingPatients[0].name}</h3>
               <p>{incomingPatients[0].condition}</p>
               <span style={{background: 'var(--red-sos)', color: 'white', fontSize: '12px', fontWeight: 900, padding: '4px 12px', borderRadius: '4px'}}>CRITICAL</span>

               <div className="modal-vitals" style={{marginTop: '2rem'}}>
                  <div className="modal-vital-box">
                    <span className="vital-val">{incomingPatients[0].vitals.hr}</span>
                    <span className="vital-lbl">BPM</span>
                  </div>
                  <div className="modal-vital-box">
                    <span className="vital-val">{incomingPatients[0].vitals.bp}</span>
                    <span className="vital-lbl">BP</span>
                  </div>
                  <div className="modal-vital-box">
                    <span className="vital-val">{incomingPatients[0].vitals.spo2}%</span>
                    <span className="vital-lbl">SpO2</span>
                  </div>
                  <div className="modal-vital-box">
                    <span className="vital-val">{incomingPatients[0].vitals.temp || '37.2'}°C</span>
                    <span className="vital-lbl">Temp</span>
                  </div>
               </div>
            </div>

            <div className="modal-footer">
              <button className="ack-btn" onClick={handleAcknowledge}>Acknowledge & Prepare</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
