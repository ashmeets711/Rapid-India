import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type EmergencyStatus = 'IDLE' | 'TRIGGERED' | 'DISPATCHED' | 'ARRIVED' | 'ADMITTED';

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  history: string;
  vitals: {
    hr: number;
    spo2: number;
    bp: string;
    temp?: number;
  };
  location: [number, number];
}

interface EmergencyContextType {
  status: EmergencyStatus;
  incidentData: PatientData | null;
  routePoints: [number, number][];
  currentAmbPos: [number, number] | null;
  triggerEmergency: (location: [number, number]) => void;
  dispatchAmbulance: () => void;
  arriveAmbulance: () => void;
  admitPatient: () => void;
  resetEmergency: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<EmergencyStatus>('IDLE');
  const [incidentData, setIncidentData] = useState<PatientData | null>(null);
  
  const startPos: [number, number] = [28.5350, 77.1450];
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [currentAmbPos, setCurrentAmbPos] = useState<[number, number] | null>(null);

  // Fetch Route Data when triggered
  useEffect(() => {
    if (status !== 'IDLE' && incidentData) {
      const incidentPos = incidentData.location;
      fetch(`https://router.project-osrm.org/route/v1/driving/${startPos[1]},${startPos[0]};${incidentPos[1]},${incidentPos[0]}?geometries=geojson`)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
            setRoutePoints(coords);
            setCurrentAmbPos(coords[0]);
          }
        }).catch(console.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, incidentData]);

  // Handle Animation
  useEffect(() => {
    if (status === 'DISPATCHED' && routePoints.length > 0) {
      let step = 0;
      const intervalMs = Math.max(50, 10000 / routePoints.length);
      const interval = setInterval(() => {
        if (step < routePoints.length) {
          setCurrentAmbPos(routePoints[step]);
          step++;
        } else {
          clearInterval(interval);
          arriveAmbulance();
        }
      }, intervalMs);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, routePoints]);

  const triggerEmergency = (location: [number, number]) => {
    setIncidentData({
      id: "91-XXXX-XXXX-4532",
      name: "Ramesh Kumar",
      age: 42,
      gender: "Male",
      bloodGroup: "O+",
      history: "Hypertension, Type 2 Diabetes",
      vitals: { hr: 142, spo2: 91, bp: "160/95", temp: 37.1 },
      location
    });
    setStatus('TRIGGERED');
  };

  const dispatchAmbulance = () => setStatus('DISPATCHED');
  const arriveAmbulance = () => setStatus('ARRIVED');
  const admitPatient = () => setStatus('ADMITTED');

  const resetEmergency = () => {
    setStatus('IDLE');
    setIncidentData(null);
    setRoutePoints([]);
    setCurrentAmbPos(null);
  };

  return (
    <EmergencyContext.Provider value={{
      status, incidentData, routePoints, currentAmbPos, 
      triggerEmergency, dispatchAmbulance, arriveAmbulance, admitPatient, resetEmergency
    }}>
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
