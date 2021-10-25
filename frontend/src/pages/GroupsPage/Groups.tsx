// Core React
import { useEffect, useState, useContext } from 'react';

// Ionic Components
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';

// Styling & Assets
import './Groups.css';
import { GroupsContext } from '../../context/Groups/groupsContext';
import GroupsList from '../../components/GroupsList/GroupsList';
import { closeOutline } from 'ionicons/icons';

const Groups = () => {
  const {
    groupsDataLoading,
    groupsDataError,
    groupsData,
    getUserGroupsData,
    setGroupsDataError,
  } = useContext(GroupsContext);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getUserGroupsData();
  }, [getUserGroupsData]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Groups</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonToast
          isOpen={groupsDataError !== ''}
          onDidDismiss={() => setGroupsDataError('')}
          message={groupsDataError}
          color="danger"
          duration={5000}
          buttons={[
            {
              side: 'end',
              role: 'cancel',
              icon: closeOutline,
              handler: () => {
                setGroupsDataError('');
              },
            },
          ]}
        />

        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
        ></IonSearchbar>

        {groupsDataLoading && <IonSpinner />}
        {!groupsDataLoading && <GroupsList groups={groupsData} />}
      </IonContent>
    </IonPage>
  );
};

export default Groups;
