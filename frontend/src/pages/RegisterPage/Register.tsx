// Core React
import { useState, useContext } from 'react';

// Context
import { AuthContext } from '../../context/Auth/authContext';

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
  const {
    isLoggedIn,
    registerUser,
    registerUserLoading,
    registerUserError,
    setRegisterUserError,
  } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerHandler = async () => {
    if (!validateEmail(email)) {
      return setRegisterUserError('Invalid Email');
    }

    if (!validatePassword(password)) {
      return setRegisterUserError('Password should be min of 6 characters');
    }

    if (!checkPasswordMatch(password, confirmPassword)) {
      return setRegisterUserError('Passwords does not match');
    }

    let data = {
      username,
      email,
      password,
    };

    await registerUser(data);
  };

  if (isLoggedIn) {
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
          isOpen={registerUserError !== ''}
          onDidDismiss={() => setRegisterUserError('')}
          message={registerUserError}
          color="danger"
          duration={5000}
          buttons={[
            {
              side: 'end',
              role: 'cancel',
              icon: closeOutline,
              handler: () => {
                setRegisterUserError('');
              },
            },
          ]}
        />

        <form className="form">
          <IonItem className="ion-margin-top">
            <IonLabel position="floating">Username</IonLabel>
            <IonInput
              type="text"
              value={username}
              onIonChange={(e) => setUsername(e.detail.value!)}
            ></IonInput>
          </IonItem>

          <IonItem className="ion-margin-top">
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            ></IonInput>
          </IonItem>

          <IonItem className="ion-margin-top">
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            ></IonInput>
          </IonItem>

          <IonItem className="ion-margin-top">
            <IonLabel position="floating">Confirm Password</IonLabel>
            <IonInput
              type="password"
              value={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value!)}
            ></IonInput>
          </IonItem>

          <IonButton
            disabled={registerUserLoading}
            expand="full"
            color="primary"
            onClick={registerHandler}
            className="ion-margin-top"
          >
            {registerUserLoading ? <IonSpinner name="circles" /> : 'Register'}
          </IonButton>

          <div className="form_or">
            <p className="form_or-text">OR</p>
            <p className="form_or-line"></p>
          </div>

          <IonButton
            disabled={registerUserLoading}
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
