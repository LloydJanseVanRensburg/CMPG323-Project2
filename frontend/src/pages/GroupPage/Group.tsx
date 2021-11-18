// Core React
import { useContext, useRef, useState } from 'react';

// React Router Dom
import { useParams, useHistory } from 'react-router-dom';

// Global Context
import { GroupContext } from '../../context/Group/groupContext';

// Ionic Components
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonPopover,
  IonRow,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from '@ionic/react';

// Styling & Assets
import './Group.css';
import { config } from '../../constants/config';
import {
  addOutline,
  ellipsisHorizontal,
  ellipsisVertical,
} from 'ionicons/icons';
import { GroupsContext } from '../../context/Groups/groupsContext';
import GroupCard from '../../components/GroupCard/GroupCard';
import axios from 'axios';

const Group: React.FC = () => {
  const history = useHistory();

  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });
  const [showAlert1, setShowAlert1] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const searchInput: any = useRef('');

  const logoutHandler = async () => {
    console.log('running');
    setShowPopover({
      showPopover: false,
      event: undefined,
    });
    setShowAlert1(true);
  };

  const { groupId }: any = useParams();
  const {
    getGroupData,
    groupData,
    groupDataLoading,
    clearGroupData,
    searchAlbums,
    searchAlbumsHandler,
  } = useContext(GroupContext);

  const { deleteGroup, deleteGroupLoading } = useContext(GroupsContext);

  useIonViewWillEnter(() => {
    getGroupData(groupId);
  });

  useIonViewDidLeave(() => {
    clearGroupData();
  });

  const createNewAlbum = () => {};

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
        `${config.apiURL}/albums/upload`,
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
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/my/groups" />
          </IonButtons>
          <IonTitle>Group Name</IonTitle>

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
                <IonLabel>Edit Group</IonLabel>
              </IonItem>
              <IonItem onClick={logoutHandler}>
                <IonLabel>Delete Group</IonLabel>
              </IonItem>
            </IonList>
          </IonPopover>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonLoading isOpen={deleteGroupLoading} />

        <IonAlert
          isOpen={showAlert1}
          onDidDismiss={() => setShowAlert1(false)}
          cssClass="my-custom-class"
          header={'Confirm!'}
          message={'Message <strong>text</strong>!!!'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                setShowPopover({ showPopover: false, event: undefined });
              },
            },
            {
              text: 'Okay',
              handler: async () => {
                await deleteGroup(groupId);
                history.push('/my/groups');
              },
            },
          ]}
        />

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

            <IonSearchbar
              ref={searchInput}
              value={searchInput.current?.value}
              onIonChange={searchAlbumsHandler}
              debounce={400}
            ></IonSearchbar>

            <IonGrid className="ion-padding">
              <IonRow className="ion-align-items-center">
                <IonCol size="3">
                  <div className="groupCard" onClick={() => setShowModal(true)}>
                    <div>
                      <IonIcon icon={addOutline} />
                    </div>
                  </div>
                </IonCol>

                {searchAlbums.map((album: any) => (
                  <IonCol key={album.id} size="3">
                    <GroupCard groupData={album} />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        )}

        <IonModal isOpen={showModal} cssClass="my-custom-class">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Create New Album</IonTitle>
              <IonButtons slot="end">
                <IonButton color="danger" onClick={() => setShowModal(false)}>
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form onSubmit={createNewAlbum} className="createGroup_form">
              <IonItem>
                <input type="file" onChange={uploadFile} />
              </IonItem>

              {selectedFile && (
                <img
                  src={`${config.apiURL}/image/${selectedFile}`}
                  alt="uploaded album pic"
                />
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
                  onIonChange={(e: any) => setGroupDescription(e.detail.value)}
                ></IonInput>
              </IonItem>

              <IonButton type="submit" expand="full">
                Create
              </IonButton>
            </form>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Group;
