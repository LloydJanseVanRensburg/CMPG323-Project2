// Core React
import { useState, useContext } from 'react';

// Ionic Components
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';

// Ionic Icons
import { closeOutline } from 'ionicons/icons';

// Context
import { AuthContext } from '../../context/authContext/authContext';

// Styling & Assets
import './Home.css';

// Axios & Modules
import axios from 'axios';
import { config } from '../../constants/config';

const Home: React.FC = () => {
  const { setLoggedIn } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logoutHandler = async () => {
    let token = localStorage.getItem('authToken');
    try {
      setLoading(true);
      await axios.get(`${config.apiURL}/auth/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('authToken');
      setLoading(false);
      setLoggedIn(false);
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      }
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton color="primary" menu="main-content"></IonMenuButton>
          </IonButtons>
          <IonTitle>Account</IonTitle>
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

        <div className="home__accountPfp">
          <IonAvatar slot="start">
            <img src="./avatar-finn.png" alt="" />
          </IonAvatar>
        </div>

        <div className="home__accountInfo">
          <p>Lloyd Janse van Rensburg</p>
          <p>lloydjvrensburg@gmail.com</p>
          <p>083 444 6352</p>
        </div>

        <div className="home__accountLogout">
          <IonButton disabled={loading} color="primary">
            Edit
          </IonButton>
          <IonButton disabled={loading} color="danger" onClick={logoutHandler}>
            {loading ? <IonSpinner name="circles" /> : 'Logout'}
          </IonButton>
        </div>

        <IonList>
          <IonListHeader>
            <IonLabel>Notifications</IonLabel>
          </IonListHeader>

          <IonItem>
            <IonAvatar slot="start">
              <img src="./avatar-finn.png" alt="" />
            </IonAvatar>
            <IonLabel>
              <h2>Finn</h2>
              <h3>I'm a big deal</h3>
              <p>Listen, I've had a pretty messed up day...</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonAvatar slot="start">
              <img src="avatar-finn.png" alt="" />
            </IonAvatar>
            <IonLabel>
              <h2>Han</h2>
              <h3>Look, kid...</h3>
              <p>I've got enough on my plate as it is, and I...</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonAvatar slot="start">
              <img src="avatar-finn.png" alt="" />
            </IonAvatar>
            <IonLabel>
              <h2>Rey</h2>
              <h3>I can handle myself</h3>
              <p>You will remove these restraints and leave...</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonAvatar slot="start">
              <img src="avatar-finn.png" alt="" />
            </IonAvatar>
            <IonLabel>
              <h2>Luke</h2>
              <h3>Your thoughts betray you</h3>
              <p>I feel the good in you, the conflict...</p>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
