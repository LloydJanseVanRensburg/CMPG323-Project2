import { useState } from 'react';
import { useParams, useLocation } from 'react-router';
import axios from 'axios';
import { config } from '../../constants/config';
import { IonButton, IonContent, IonPage, IonToast } from '@ionic/react';
import './JoinGroupPage.css';

const JoinGroupPage = () => {
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const { groupId } = useParams<any>();

  const location = useLocation();

  const query = new URLSearchParams(location.search);

  const token = query.get('token');
  const email = query.get('email');

  const joinGroupHandler = async (e: any) => {
    e.preventDefault();
    try {
      if (groupId && token && email) {
        await axios.post(
          `${config.apiURL}/groups/${groupId}/join${location.search}`
        );

        setShowSuccessToast(true);
        return;
      }
      setShowErrorToast(true);
    } catch (error: any) {
      console.log(error);
      setShowErrorToast(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="joinGroupPage">
        <form onSubmit={joinGroupHandler}>
          <h4>Click To Join Group</h4>
          <IonButton type="submit">Join Group</IonButton>
        </form>

        <IonToast
          isOpen={showSuccessToast}
          onDidDismiss={() => setShowSuccessToast(false)}
          message={'Successfully Join Group'}
          color="success"
          duration={10000}
        />
        <IonToast
          isOpen={showErrorToast}
          onDidDismiss={() => setShowErrorToast(false)}
          message={'Unable To Join Group'}
          color="danger"
          duration={10000}
        />
      </IonContent>
    </IonPage>
  );
};

export default JoinGroupPage;
