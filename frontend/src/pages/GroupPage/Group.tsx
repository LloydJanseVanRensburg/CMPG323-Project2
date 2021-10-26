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
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewDidLeave,
} from '@ionic/react';

// Styling & Assets
import './Group.css';
import { config } from '../../constants/config';

const Group: React.FC = () => {
  const { groupId }: any = useParams();
  const { getGroupData, groupData, groupDataLoading, clearGroupData } =
    useContext(GroupContext);

  useEffect(() => {
    getGroupData(groupId);
  }, [getGroupData, groupId]);

  useIonViewDidLeave(() => {
    clearGroupData();
  });

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
      <IonContent fullscreen>
        {groupDataLoading && (
          <div>
            <IonSpinner name="circles" />
          </div>
        )}

        {!groupDataLoading && groupData && (
          <div>
            <div className="group__groupPicture">
              <img
                src={`${config.apiURL}/image/${groupData.groupPicture}`}
                alt=""
              />
            </div>

            <div className="group__info">
              <h3>{groupData.title}</h3>
              <p>{groupData.description}</p>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Group;
