// Core React
import { useContext, useEffect } from 'react';

// Context
import { AuthContext } from './context/Auth/authContext';
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

const App: React.FC = () => {
  const { getUserLoading, getCurrentUserFromToken } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      getCurrentUserFromToken();
    }
  }, [getCurrentUserFromToken]);

  if (getUserLoading) {
    return <IonLoading isOpen />;
  }

  return (
    <IonApp>
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
    </IonApp>
  );
};
export default App;
