// Core React
import { useState, useContext } from 'react';

// Ionic Components
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

// Ionic Icons
import {
  notifications,
  ellipsisHorizontal,
  ellipsisVertical,
  camera,
} from 'ionicons/icons';

// Context
import { AuthContext } from '../../context/Auth/authContext';

// Styling & Assets
import './Home.css';

const Home: React.FC = () => {
  const { userData, logoutUser } = useContext(AuthContext);

  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });
  const [showModal, setShowModal] = useState(false);

  const logoutHandler = () => {
    logoutUser();
  };

  const onEditClickHandler = () => {
    setShowModal(true);
    setShowPopover({ showPopover: false, event: undefined });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="page__iontoolbartitle">
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

          <IonTitle className="page__Title">Profile</IonTitle>

          <IonPopover
            cssClass="my-custom-class"
            event={popoverState.event}
            isOpen={popoverState.showPopover}
            onDidDismiss={() =>
              setShowPopover({ showPopover: false, event: undefined })
            }
          >
            <IonList>
              <IonItem onClick={onEditClickHandler}>
                <IonLabel>Edit Account</IonLabel>
              </IonItem>
            </IonList>
          </IonPopover>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="content__container">
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
              <IonIcon size="small" icon={notifications} />
              <p>Notifications</p>
            </div>
          </div>

          <IonModal onDidDismiss={() => setShowModal(false)} isOpen={showModal}>
            <IonHeader>
              <IonToolbar>
                <IonTitle className="home__modal__headertitle">
                  Edit Profile
                </IonTitle>
                <IonButtons slot="end">
                  <IonButton color="danger" onClick={() => setShowModal(false)}>
                    Close
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <div className="home__modal__accountPfp">
                <div className="home__modal__avatarpfp">
                  <img src={`/user-default-pfp.png`} alt="user profile" />
                  <div className="home__modal__editpfpBtn">
                    <IonIcon size="large" icon={camera} />
                  </div>
                </div>
              </div>

              <div className="home__modal__inputs">
                <IonItem>
                  <IonLabel position="floating">Username</IonLabel>
                  <IonInput></IonInput>
                </IonItem>

                <IonItem>
                  <IonLabel position="floating">Bio</IonLabel>
                  <IonInput multiple></IonInput>
                </IonItem>

                <IonButton type="submit" expand="full">
                  Update Profile
                </IonButton>
              </div>
            </IonContent>
          </IonModal>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
