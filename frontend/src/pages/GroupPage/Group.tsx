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
import axios from 'axios';
import { AuthContext } from '../../context/Auth/authContext';

const Group: React.FC = () => {
  const history = useHistory();

  // SEARCH INPUT REF
  const searchInput: any = useRef('');

  // DELETE GROUP ALERT & POPOVER STATE
  const [showAlert1, setShowAlert1] = useState(false);
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

  // CREATE ALBUM STATE
  const [showModal, setShowModal] = useState(false);
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // EDIT GROUP STATE
  const [showEditModal, setShowEditModal] = useState(false);
  const [newGroupProfileImage, setNewGroupProfileImage] = useState(null);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteUsersList, setInviteUsersList] = useState('');

  // CURRENT GROUPID FROM URL
  const { groupId }: any = useParams();

  // GLOBAL AUTH CONTENT
  const { userData } = useContext(AuthContext);

  // GLOBAL GROUPS CONTEXT
  const { deleteGroup, deleteGroupLoading } = useContext(GroupsContext);

  // GLOBAL GROUP CONTEXT
  const {
    getGroupData,
    groupData,
    groupDataLoading,
    clearGroupData,
    searchAlbums,
    searchAlbumsHandler,
    createNewAlbum,
    albumDataLoading,
    getGroupAlbumData,
    addAlbumLoading,
    albumData,
    editGroup,
    editGroupLoading,
    inviteToGroup,
    inviteToGroupLoading,
  } = useContext(GroupContext);

  // IONIC LIFECYCLE METHODS
  useIonViewDidEnter(async () => {
    await getGroupData(groupId);
    await getGroupAlbumData(groupId);
  }, [groupId]);

  useIonViewDidLeave(() => {
    clearGroupData();
  });

  // CUSTOM COMPONENT METHOD
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
    setNewGroupTitle(groupData?.title);
    setNewGroupDescription(groupData?.description);
    setShowEditModal(true);
    setShowPopover({ showPopover: false, event: undefined });
  };

  const onGroupEditSubmit = async (e: any) => {
    e.preventDefault();

    const newGroupData = {
      title: newGroupTitle,
      description: newGroupDescription,
      image: newGroupProfileImage,
    };

    await editGroup(groupId, newGroupData);

    setShowEditModal(false);
    setNewGroupDescription('');
    setNewGroupTitle('');
    setNewGroupProfileImage(null);
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

      setNewGroupProfileImage(result.data.data.imageKey);
    } catch (error) {
      console.log(error);
    }
  };

  const inviteToGroupHandler = () => {
    setShowPopover({ showPopover: false, event: undefined });
    setShowInviteModal(true);
  };

  const onInviteUserSubmitHandler = async (e: any) => {
    e.preventDefault();

    const inviteList = inviteUsersList.split(',');

    const inviteData = {
      emailInviteList: inviteList,
    };

    await inviteToGroup(groupId, inviteData);

    setShowInviteModal(false);
    setInviteUsersList('');
  };

  const leaveGroupHandler = () => {
    console.log('Leaving Group');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="page__iontoolbartitle">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/my/groups" />
          </IonButtons>
          <IonTitle className="page__Title">Group</IonTitle>

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
              {userData?.id === groupData?.owner ? (
                <>
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

                  <IonItem onClick={inviteToGroupHandler}>
                    <IonLabel>Invite To Group</IonLabel>
                  </IonItem>
                </>
              ) : (
                <IonItem onClick={leaveGroupHandler}>
                  <IonLabel>Leave Group</IonLabel>
                </IonItem>
              )}
            </IonList>
          </IonPopover>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="content__container">
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
            <div className="loading_spinner">
              <IonSpinner name="circles" />
            </div>
          )}

          {!groupDataLoading && groupData && (
            <div className="group__maincontainer">
              <div className="group__groupPicture">
                <img
                  src={`${config.apiURL}/image/${groupData.groupPicture}`}
                  alt=""
                />
              </div>

              <div className="group__info">
                <h2>{groupData.title}</h2>
                <p>{groupData.description}</p>
              </div>

              <div className="group__statsInfo">
                <div>
                  <p>{groupData?.memberCount}</p>
                  <p>members</p>
                </div>
                <div>
                  <p>{albumData.length}</p>
                  <p>albums</p>
                </div>
              </div>

              <IonSearchbar
                ref={searchInput}
                value={searchInput.current?.value}
                onIonChange={searchAlbumsHandler}
                debounce={400}
              ></IonSearchbar>

              <IonGrid className="ion-padding">
                <IonRow className="ion-align-items-center">
                  {albumDataLoading ? (
                    <div className="loading_spinner">
                      <IonSpinner name="circles" />
                    </div>
                  ) : (
                    <>
                      <IonCol size="3">
                        <div
                          className="albumCard"
                          onClick={() => setShowModal(true)}
                        >
                          <div>
                            <IonIcon size="large" icon={addOutline} />
                          </div>
                        </div>
                      </IonCol>

                      {searchAlbums.map((album: any) => (
                        <IonCol key={album.id} size="3">
                          <AlbumCard albumData={album} />
                        </IonCol>
                      ))}
                    </>
                  )}
                </IonRow>
              </IonGrid>
            </div>
          )}
        </div>

        <IonModal onDidDismiss={() => setShowModal(false)} isOpen={showModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle className="page__Title">Create Album</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  disabled={addAlbumLoading}
                  color="danger"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form onSubmit={createAblum} className="createAlbum_form">
              <CirclePicker
                className="createAlbum__modal__colorpicker"
                color={selectedColor}
                onChangeComplete={(color: ColorResult, e: any) => {
                  setSelectedColor(color.hex);
                }}
              />

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

              <IonButton disabled={addAlbumLoading} type="submit" expand="full">
                {addAlbumLoading ? <IonSpinner name="circles" /> : 'Create'}
              </IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonModal
          onDidDismiss={() => setShowEditModal(false)}
          isOpen={showEditModal}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle className="page__Title">Edit Group</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  disabled={editGroupLoading}
                  color="danger"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form onSubmit={onGroupEditSubmit} className="createGroup_form">
              <input type="file" onChange={uploadFile} />

              {newGroupProfileImage ? (
                <div className="createGroup__modal__imageplaceholder">
                  <img
                    src={`${config.apiURL}/image/${newGroupProfileImage}`}
                    alt="uploaded group profile"
                  />
                </div>
              ) : (
                <div className="createGroup__modal__imageplaceholder">
                  <img
                    src={`${config.apiURL}/image/${groupData?.groupPicture}`}
                    alt="uploaded group profile"
                  />
                </div>
              )}

              <IonItem>
                <IonLabel position="floating">Title</IonLabel>
                <IonInput
                  value={newGroupTitle}
                  onIonChange={(e: any) => setNewGroupTitle(e.detail.value)}
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Description</IonLabel>
                <IonInput
                  multiple
                  value={newGroupDescription}
                  onIonChange={(e: any) =>
                    setNewGroupDescription(e.detail.value)
                  }
                ></IonInput>
              </IonItem>

              <IonButton
                disabled={editGroupLoading}
                type="submit"
                expand="full"
              >
                {editGroupLoading ? <IonSpinner name="circles" /> : 'Edit'}
              </IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonModal
          backdropDismiss={!inviteToGroupLoading}
          onDidDismiss={() => setShowInviteModal(false)}
          isOpen={showInviteModal}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle className="page__Title">Invite Users To Group</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  disabled={inviteToGroupLoading}
                  color="danger"
                  onClick={() => setShowInviteModal(false)}
                >
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form
              onSubmit={onInviteUserSubmitHandler}
              className="createAlbum_form"
            >
              <IonItem>
                <IonLabel position="floating">Title</IonLabel>
                <IonInput
                  value={inviteUsersList}
                  onIonChange={(e: any) => setInviteUsersList(e.detail.value)}
                ></IonInput>
              </IonItem>

              <IonButton
                disabled={inviteToGroupLoading}
                type="submit"
                expand="full"
              >
                {inviteToGroupLoading ? (
                  <IonSpinner name="circles" />
                ) : (
                  'Invite'
                )}
              </IonButton>
            </form>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Group;
