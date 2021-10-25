// Core React
import { useContext, useEffect } from 'react';

// React Router Dom
import { useParams } from 'react-router-dom';

// Global Context
import { GroupContext } from '../../context/Group/groupContext';

// Ionic Components
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

// Styling & Assets
import './Group.css';

const Group: React.FC = () => {
  const { groupId }: any = useParams();
  const { getGroupData, groupData } = useContext(GroupContext);

  useEffect(() => {
    getGroupData(groupId);
  }, [getGroupData, groupId]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/my/groups" />
          </IonButtons>
          <IonTitle>Group Name</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen></IonContent>
    </IonPage>
  );
};

export default Group;
