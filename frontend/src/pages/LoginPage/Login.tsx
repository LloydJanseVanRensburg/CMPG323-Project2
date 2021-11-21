// React Core
import { useContext, useState, useRef } from 'react';

// React Router Dom
import { Redirect } from 'react-router-dom';

// Ionic Components
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRouterLink,
  IonSpinner,
  IonToast,
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

  const loginHandler = async () => {
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

    await loginUser(data);
  };

  if (isLoggedIn) {
    return <Redirect to="/my/account" />;
  }

  return (
    <IonPage>
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

        <div className="login__container">
          <img
            className="login__backgroundimage"
            src="/background-image.png"
            alt=""
          />
          <div className="login__layover"></div>
          <img className="login__applogo" src="/app-logo.png" alt="" />
          <h2 className="login__welcome">Welcome to</h2>
          <h1 className="login__appname">Digital Share</h1>
          <form className="login__form">
            <div className="login__form-background"></div>
            <h2 className="login__title">Login</h2>
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
              onClick={loginHandler}
              className="login__actionbtn"
            >
              {loginUserLoading ? <IonSpinner name="circles" /> : 'Login'}
            </IonButton>

            <div className="login__registerActions">
              <p>Don't have an account?</p>
              <IonRouterLink routerLink="/register">Sign up</IonRouterLink>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
