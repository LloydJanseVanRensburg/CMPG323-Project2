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
  IonRouterLink,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';

// Ionic Icons
import { closeOutline } from 'ionicons/icons';

// Helper Functions
import { validatePassword, validateEmail } from '../../utils/functions';

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

  const registerHandler = async () => {
    if (!validateEmail(email)) {
      return setRegisterUserError('Invalid Email');
    }

    if (!validatePassword(password)) {
      return setRegisterUserError('Password should be min of 6 characters');
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

        <div className="register__container">
          <img
            className="register__backgroundimage"
            src="/background-image.png"
            alt=""
          />
          <div className="register__layover"></div>
          <img className="register__applogo" src="/app-logo.png" alt="" />
          <h2 className="register__welcome">Welcome to</h2>
          <h1 className="register__appname">Digital Share</h1>
          <form className="register__form">
            <div className="register__form-background"></div>
            <h2 className="register__title">Sign Up</h2>
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

            <IonButton
              disabled={registerUserLoading}
              expand="full"
              onClick={registerHandler}
              className="register__actionbtn"
            >
              {registerUserLoading ? <IonSpinner name="circles" /> : 'Sign Up'}
            </IonButton>

            <div className="register__registerActions">
              <p>Already have an account?</p>
              <IonRouterLink routerLink="/login">Login</IonRouterLink>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
