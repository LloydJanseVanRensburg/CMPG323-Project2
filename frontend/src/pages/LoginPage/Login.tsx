// React Core
import { useContext, useState, useRef } from 'react';

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
import { AuthContext } from '../../context/Auth/authContext';

const Login = () => {
  const {
    isLoggedIn,
    loginUser,
    loginUserLoading,
    loginUserError,
    setLoginUserError,
  } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailInputRef = useRef<HTMLIonInputElement>(null);
  const passwordInputRef = useRef<HTMLIonInputElement>(null);

  const loginHandler = () => {
    if (!validateEmail(email)) {
      emailInputRef.current?.setFocus();
      return setLoginUserError('Invalid Email');
    }

    if (!validatePassword(password)) {
      passwordInputRef.current?.setFocus();
      return setLoginUserError('Password should be min of 6 characters');
    }

    let data = {
      email,
      password,
    };

    loginUser(data);
  };

  if (isLoggedIn) {
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
          isOpen={loginUserError !== ''}
          onDidDismiss={() => setLoginUserError('')}
          message={loginUserError}
          color="danger"
          duration={5000}
          buttons={[
            {
              side: 'end',
              role: 'cancel',
              icon: closeOutline,
              handler: () => {
                setLoginUserError('');
              },
            },
          ]}
        />

        <form className="form">
          <IonItem className="ion-margin-top">
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              ref={emailInputRef}
            ></IonInput>
          </IonItem>

          <IonItem className="ion-margin-top">
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              ref={passwordInputRef}
            ></IonInput>
          </IonItem>

          <IonButton
            disabled={loginUserLoading}
            expand="full"
            color="primary"
            onClick={loginHandler}
            className="ion-margin-top"
          >
            {loginUserLoading ? <IonSpinner name="circles" /> : 'Login'}
          </IonButton>

          <div className="form_or">
            <p className="form_or-text">OR</p>
            <p className="form_or-line"></p>
          </div>

          <IonButton
            disabled={loginUserLoading}
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
