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
  closeOutline,
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
  // const [showPopover, setShowPopover] = useState(false);

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
          <IonTitle>Account</IonTitle>

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
              <IonItem onClick={logoutHandler}>
                <IonLabel>Logout</IonLabel>
              </IonItem>
            </IonList>
          </IonPopover>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonItemDivider>
          <IonLabel>Account Info</IonLabel>
        </IonItemDivider>

        <div className="home__accountPfp">
          <IonAvatar slot="start">
            <img
              src={`${config.apiURL}/image/${userData?.profilePicture}`}
              alt="user profile"
            />
          </IonAvatar>
        </div>

        <div className="home__accountInfo">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonText>User Name:</IonText>
              </IonCol>
              <IonCol>
                <IonText>{userData.name}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonText>Email Address:</IonText>
              </IonCol>
              <IonCol>
                <IonText>{userData.email}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonText>Phone Number:</IonText>
              </IonCol>
              <IonCol>
                <IonText>{userData.phone}</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        <IonItemDivider>
          <IonLabel>Account Notifications</IonLabel>
        </IonItemDivider>

        <IonList>
          <IonItem>
            <IonAvatar slot="start">
              <img src="./avatar-han.png" alt="" />
            </IonAvatar>
            <IonLabel>
              <h5>Han</h5>
              <h2>Why is this here?</h2>
              <small>2 days ago</small>
            </IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
