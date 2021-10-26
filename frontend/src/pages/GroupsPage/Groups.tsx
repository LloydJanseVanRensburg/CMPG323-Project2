// Core React
import { useEffect, useRef, useContext, useState } from 'react';

// Ionic Components
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
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
    searchResults,
    getUserGroupsData,
    setGroupsDataError,
    searchGroupsHandler,
    createNewGroup,
    addGroupLoading,
  } = useContext(GroupsContext);

  const [showModal, setShowModal] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const searchInput: any = useRef('');

  useEffect(() => {
    getUserGroupsData();
  }, [getUserGroupsData]);

  const createGroupHandler = async (e: any) => {
    e.preventDefault();
    let groupData = {
      title: groupTitle,
      description: groupDescription,
      image: selectedFile,
    };
    await createNewGroup(groupData);
    setGroupTitle('');
    setGroupDescription('');
    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Groups</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* TOAST FOR ERROR WITH LOADING GROUPS */}
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
          ref={searchInput}
          value={searchInput.current.value}
          onIonChange={searchGroupsHandler}
          debounce={400}
        ></IonSearchbar>

        {groupsDataLoading && (
          <div className="groups_spinner">
            <IonSpinner />
          </div>
        )}

        {!groupsDataLoading && (
          <GroupsList setShowModal={setShowModal} groups={searchResults} />
        )}

        <IonModal isOpen={showModal} cssClass="my-custom-class">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Create New Group</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  disabled={addGroupLoading}
                  color="danger"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form onSubmit={createGroupHandler} className="createGroup_form">
              <IonItem>
                <IonLabel position="floating">Title</IonLabel>
                <IonInput
                  value={groupTitle}
                  onIonChange={(e: any) => setGroupTitle(e.detail.value)}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Description</IonLabel>
                <IonInput
                  multiple
                  value={groupDescription}
                  onIonChange={(e: any) => setGroupDescription(e.detail.value)}
                ></IonInput>
              </IonItem>
              <IonItem>
                <input
                  type="file"
                  onChange={(e: any) => setSelectedFile(e.target.files[0])}
                />
              </IonItem>

              <IonButton disabled={addGroupLoading} type="submit" expand="full">
                {addGroupLoading ? <IonSpinner name="circles" /> : 'Create'}
              </IonButton>
            </form>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Groups;
