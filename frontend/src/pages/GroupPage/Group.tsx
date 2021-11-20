// Core React
import { useContext, useRef, useState, useEffect } from 'react';

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
  useIonViewDidEnter,
  useIonViewDidLeave,
} from '@ionic/react';

import { CirclePicker, ColorResult } from 'react-color';

// Styling & Assets
import './Group.css';
import { config } from '../../constants/config';
import {
  addOutline,
  ellipsisHorizontal,
  ellipsisVertical,
} from 'ionicons/icons';
import { GroupsContext } from '../../context/Groups/groupsContext';
import AlbumCard from '../../components/AlbumCard/AlbumCard';

const Group: React.FC = () => {
  const history = useHistory();

  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

  const [showAlert1, setShowAlert1] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const searchInput: any = useRef('');

  const { groupId }: any = useParams();

  const {
    getGroupData,
    groupData,
    groupDataLoading,
    clearGroupData,
    searchAlbums,
    searchAlbumsHandler,
    createNewAlbum,
    getGroupAlbumData,
  } = useContext(GroupContext);

  const { deleteGroup, deleteGroupLoading } = useContext(GroupsContext);

  useIonViewDidEnter(async () => {
    await getGroupData(groupId);
    await getGroupAlbumData(groupId);
  }, [groupId]);

  useIonViewDidLeave(() => {
    clearGroupData();
  });

  const createAblum = async (e: any) => {
    e.preventDefault();

    if (!albumTitle) {
      console.log('No album title provided');
      return;
    }

    if (!albumDescription) {
      console.log('No album description provided');
      return;
    }

    const albumData = {
      title: albumTitle,
      description: albumDescription,
      groupId: groupData.id,
      color: selectedColor,
    };

    await createNewAlbum(albumData);

    setAlbumTitle('');
    setAlbumDescription('');
    setSelectedColor('');
    setShowModal(false);
  };

  const editGroupHandler = () => {
    console.log('Editing group...');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/my/groups" />
          </IonButtons>
          <IonTitle>Group</IonTitle>

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
              <IonItem onClick={editGroupHandler}>
                <IonLabel>Edit Group</IonLabel>
              </IonItem>
              <IonItem
                onClick={() => {
                  setShowAlert1(true);
                  setShowPopover({ showPopover: false, event: undefined });
                }}
              >
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
          message={'Are you  sure you want to delete group'}
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
              <p>Members {groupData.memberCount}</p>
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
                    <AlbumCard albumData={album} />
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
            <form onSubmit={createAblum} className="createGroup_form">
              <IonItem>
                <CirclePicker
                  color={selectedColor}
                  onChangeComplete={(color: ColorResult, e: any) => {
                    setSelectedColor(color.hex);
                  }}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Title</IonLabel>
                <IonInput
                  value={albumTitle}
                  onIonChange={(e: any) => setAlbumTitle(e.detail.value)}
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Description</IonLabel>
                <IonInput
                  multiple
                  value={albumDescription}
                  onIonChange={(e: any) => setAlbumDescription(e.detail.value)}
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
