// Core React
import { useRef, useContext, useState } from 'react';

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
  useIonViewDidEnter,
} from '@ionic/react';

// Axios
import axios from 'axios';
import { config } from '../../constants/config';

// Styling & Assets
import { GroupsContext } from '../../context/Groups/groupsContext';
import GroupsList from '../../components/GroupsList/GroupsList';
import { closeOutline } from 'ionicons/icons';
import './Groups.css';

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

  useIonViewDidEnter(() => {
    getUserGroupsData();
  });

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
    setSelectedFile(null);
    setShowModal(false);
  };

  const uploadFile = async (e: any) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };

    try {
      const result: any = await axios.post(
        `${config.apiURL}/groups/upload`,
        formData,
        axiosConfig
      );

      setSelectedFile(result.data.data.imageKey);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="page__iontoolbartitle">
          <IonTitle className="page__Title">Groups</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="content__container">
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
            <div className="loading_spinner">
              <IonSpinner />
            </div>
          )}

          {!groupsDataLoading && (
            <GroupsList setShowModal={setShowModal} groups={searchResults} />
          )}

          <IonModal onDidDismiss={() => setShowModal(false)} isOpen={showModal}>
            <IonHeader>
              <IonToolbar>
                <IonTitle className="page__Title">Create Group</IonTitle>
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
                <input type="file" onChange={uploadFile} />
                {selectedFile ? (
                  <div className="createGroup__modal__imageplaceholder">
                    <img
                      src={`${config.apiURL}/image/${selectedFile}`}
                      alt="uploaded group profile"
                    />
                  </div>
                ) : (
                  <div className="createGroup__modal__imageplaceholder">
                    <p>Choose Image</p>
                  </div>
                )}

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
                    onIonChange={(e: any) =>
                      setGroupDescription(e.detail.value)
                    }
                  ></IonInput>
                </IonItem>

                <IonButton
                  disabled={addGroupLoading}
                  type="submit"
                  expand="full"
                >
                  {addGroupLoading ? <IonSpinner name="circles" /> : 'Create'}
                </IonButton>
              </form>
            </IonContent>
          </IonModal>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Groups;
