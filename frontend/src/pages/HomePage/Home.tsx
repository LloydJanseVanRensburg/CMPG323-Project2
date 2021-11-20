// Core React
import { useState, useContext } from 'react';

// Ionic Components
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';

// Ionic Icons
import {
  notifications,
  ellipsisHorizontal,
  ellipsisVertical,
} from 'ionicons/icons';

// Context
import { AuthContext } from '../../context/Auth/authContext';

// Styling & Assets
import './Home.css';

// Axios & Modules
import { config } from '../../constants/config';

const Home: React.FC = () => {
  const { userData, logoutUser } = useContext(AuthContext);

  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

  const logoutHandler = async () => {
    logoutUser();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start" onClick={logoutHandler}>
            <IonButton>Logout</IonButton>
          </IonButtons>

          <IonButtons slot="end">
            <IonButton
              onClick={(e: any) => {
                e.persist();
                setShowPopover({ showPopover: true, event: e });
              }}
            >
              <IonIcon
                slot="icon-only"
                ios={ellipsisHorizontal}
                md={ellipsisVertical}
              ></IonIcon>
            </IonButton>
          </IonButtons>

          <IonTitle className="homepage__profileTitle">Profile</IonTitle>

          <IonPopover
            cssClass="my-custom-class"
            event={popoverState.event}
            isOpen={popoverState.showPopover}
            onDidDismiss={() =>
              setShowPopover({ showPopover: false, event: undefined })
            }
          >
            <IonList>
              <IonItem>
                <IonLabel>Edit Account</IonLabel>
              </IonItem>
            </IonList>
          </IonPopover>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="home__accountPfp">
          <div className="home__avatarpfp">
            <img src={`/user-default-pfp.png`} alt="user profile" />
          </div>
        </div>

        <div className="home__account-info">
          <div className="home__account-info1">
            <h2>{userData?.username}</h2>
            <p>Something about me.</p>
          </div>

          <div className="home__account-info2">
            <p>Email</p>
            <p>{userData?.email}</p>
          </div>

          <div className="home__account-info3">
            <IonIcon icon={notifications} />
            <p>Notifications</p>
          </div>
        </div>

        <IonList></IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
