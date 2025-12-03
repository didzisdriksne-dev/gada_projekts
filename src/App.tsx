import { useState } from 'react';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { Dashboard } from './components/Dashboard';
import { ReservationForm, ReservationData } from './components/ReservationForm';
import { ConfirmationPage } from './components/ConfirmationPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

type View = 'login' | 'signup' | 'dashboard' | 'form' | 'confirmation';

interface User {
  ssn: string;
  name: string;
  password: string;
}

interface Reservation {
  id: string;
  studentName: string;
  className: string;
  date: string;
  reason: string;
  notes: string;
  status: 'pending' | 'approved' | 'denied';
  submittedDate: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); // Simulated user database
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);

  const handleLogin = (ssn: string, name: string, password: string) => {
    // Check if user exists
    const user = users.find(
      (u) => u.ssn === ssn && u.name === name && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      toast.success(`Laipni lūdzam atpakaļ, ${name}!`);
    } else {
      toast.error('Nederīgi akreditācijas dati. Lūdzu, pārbaudiet informāciju vai izveidojiet kontu.');
    }
  };

  const handleSignUp = (ssn: string, name: string, password: string) => {
    // Check if user already exists
    const existingUser = users.find((u) => u.ssn === ssn);
    if (existingUser) {
      toast.error('Konts ar šo personas kodu jau eksistē. Lūdzu, piesakieties.');
      setCurrentView('login');
      return;
    }

    // Create new user
    const newUser: User = { ssn, name, password };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
    toast.success(`Konts veiksmīgi izveidots! Laipni lūdzam, ${name}!`);
  };

  const handleSwitchToSignUp = () => {
    setCurrentView('signup');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
    setReservations([]);
    toast.info('Jūs esat izrakstījies');
  };

  const handleReserveClick = () => {
    setCurrentView('form');
  };

  const handleFormSubmit = (data: ReservationData) => {
    const newReservation: Reservation = {
      id: `REQ-${String(reservations.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'pending',
      submittedDate: new Date().toISOString(),
    };

    setReservations([...reservations, newReservation]);
    setCurrentReservation(newReservation);
    setCurrentView('confirmation');
    toast.success('Pieprasījums veiksmīgi iesniegts!');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentReservation(null);
  };

  return (
    <>
      {currentView === 'login' && (
        <Login onLogin={handleLogin} onSwitchToSignUp={handleSwitchToSignUp} />
      )}
      {currentView === 'signup' && (
        <SignUp onSignUp={handleSignUp} onSwitchToLogin={handleSwitchToLogin} />
      )}
      {currentView === 'dashboard' && isAuthenticated && (
        <Dashboard 
          onReserveClick={handleReserveClick} 
          reservations={reservations}
          userName={currentUser?.name || ''}
          onLogout={handleLogout}
        />
      )}
      {currentView === 'form' && isAuthenticated && (
        <ReservationForm onSubmit={handleFormSubmit} onBack={handleBackToDashboard} />
      )}
      {currentView === 'confirmation' && currentReservation && isAuthenticated && (
        <ConfirmationPage
          reservation={currentReservation}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
      <Toaster position="top-center" />
    </>
  );
}

export default App;
