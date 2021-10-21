// Core React
import { useEffect, useState } from 'react';

// Context
import { AuthContext } from './context/authContext/authContext';
// React Router Dom
import { Route, Redirect } from 'react-router-dom';

// Ionic Router
import { IonReactRouter } from '@ionic/react-router';

// Ionic Components
import { IonApp, IonLoading, IonRouterOutlet } from '@ionic/react';

// Custom Page Components
import LoggedInApp from './components/LoggedInApp/LoggedInApp';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import axios from 'axios';
import { config } from './constants/config';

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setLoading(true);
      axios
        .get(`${config.apiURL}/auth/logged-in`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        .then(() => {
          setLoggedIn(true);
          setLoading(false);
        })
        .catch(() => {
          setLoggedIn(false);
          localStorage.removeItem('authToken');
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return <IonLoading isOpen translucent={true} />;
  }

  return (
    <IonApp>
      <AuthContext.Provider
        value={{
          loggedIn,
          loading,
          setLoggedIn,
          setLoading,
        }}
      >
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route path="/my">
              <LoggedInApp />
            </Route>
            <Redirect exact path="/" to="/my/account" />
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
};
export default App;
