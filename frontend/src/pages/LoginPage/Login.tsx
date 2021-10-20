// React Core
import { useContext, useState } from 'react';

// React Router Dom
import { Redirect } from 'react-router-dom';

// Ionic Components
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';

// Ionic Icons
import { closeOutline } from 'ionicons/icons';

// Styling & assets
import './Login.css';
import { validateEmail, validatePassword } from '../../utils/functions';

// Axios & Modules
import axios from 'axios';
import { config } from '../../constants/config';
import { AuthContext } from '../../context/authContext/authContext';

const Login = () => {
  const { loggedIn, setLoggedIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loginHandler = async () => {
    if (!validateEmail(email)) {
      return setError('Invalid Email');
    }

    if (!validatePassword(password)) {
      return setError('Password should be min of 6 characters');
    }

    let data = {
      email,
      password,
    };

    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      setLoading(true);

      const result: any = await axios.post(
        `${config.apiURL}/auth/login`,
        data,
        axiosConfig
      );

      if (result.data.success) {
        setLoading(false);
        localStorage.setItem('authToken', result.data.data.token);
        setLoggedIn(true);
      }
    } catch (error: any) {
      console.trace(error);
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong please try again later');
      }
      setLoading(false);
    }
  };

  if (loggedIn) {
    return <Redirect to="/my/account" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToast
          isOpen={error !== ''}
          onDidDismiss={() => setError('')}
          message={error}
          color="danger"
          duration={5000}
          buttons={[
            {
              side: 'end',
              role: 'cancel',
              icon: closeOutline,
              handler: () => {
                setError('');
              },
            },
          ]}
        />

        <form className="form">
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            ></IonInput>
          </IonItem>

          <IonButton
            disabled={loading}
            expand="full"
            color="primary"
            onClick={loginHandler}
          >
            {loading ? <IonSpinner name="circles" /> : 'Login'}
          </IonButton>

          <div className="form_or">
            <p className="form_or-text">OR</p>
            <p className="form_or-line"></p>
          </div>

          <IonButton
            disabled={loading}
            routerLink="/register"
            expand="full"
            color="dark"
          >
            Register
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
