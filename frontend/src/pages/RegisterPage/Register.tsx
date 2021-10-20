// Core React
import { useState, useContext } from 'react';

// Context
import { AuthContext } from '../../context/authContext/authContext';

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

// Axios & Modules
import axios from 'axios';
import { config } from '../../constants/config';

// Helper Functions
import {
  validatePassword,
  validateEmail,
  checkPasswordMatch,
} from '../../utils/functions';

// Styling & assets
import './Register.css';
import { Redirect } from 'react-router';

const Register = () => {
  const { loggedIn } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const registerHandler = async () => {
    if (!validateEmail(email)) {
      return setError('Invalid Email');
    }

    if (!validatePassword(password)) {
      return setError('Password should be min of 6 characters');
    }

    if (!checkPasswordMatch(password, confirmPassword)) {
      return setError('Passwords does not match');
    }

    let data = {
      username,
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
        `${config.apiURL}/auth/register`,
        data,
        axiosConfig
      );

      if (result.data.success) {
        console.log(result.data.token);
        localStorage.setItem('authToken', result.data.data.token);
      }

      setLoading(false);
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
          <IonTitle>Register</IonTitle>
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
            <IonLabel position="floating">Username</IonLabel>
            <IonInput
              type="text"
              value={username}
              onIonChange={(e) => setUsername(e.detail.value!)}
            ></IonInput>
          </IonItem>

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

          <IonItem>
            <IonLabel position="floating">Confirm Password</IonLabel>
            <IonInput
              type="password"
              value={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value!)}
            ></IonInput>
          </IonItem>

          <IonButton
            disabled={loading}
            expand="full"
            color="primary"
            onClick={registerHandler}
          >
            {loading ? <IonSpinner name="circles" /> : 'Register'}
          </IonButton>

          <div className="form_or">
            <p className="form_or-text">OR</p>
            <p className="form_or-line"></p>
          </div>

          <IonButton
            disabled={loading}
            routerLink="/login"
            expand="full"
            color="dark"
          >
            Login
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register;
