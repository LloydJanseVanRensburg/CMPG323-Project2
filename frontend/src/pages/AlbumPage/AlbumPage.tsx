import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonModal,
  IonPage,
  IonPopover,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewDidLeave,
} from '@ionic/react';
import axios from 'axios';

import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import { useRef, useState, useContext } from 'react';
import { CirclePicker, ColorResult } from 'react-color';
import { useHistory, useParams } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/swiper-react';
import AlbumActionControllers from '../../components/AlbumActionControllers/AlbumActionControllers';
import PostCard from '../../components/PostCard/PostCard';
import { config } from '../../constants/config';
import { AlbumContext } from '../../context/Album/albumContext';
import { GroupContext } from '../../context/Group/groupContext';
import './AlbumPage.css';

const AlbumPage: React.FC = () => {
  const history = useHistory();

  // DELETE ALBUM ALERT & POPOVER STATE
  const [showAlert1, setShowAlert1] = useState(false);
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

  // CREATE POST MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  // EDIT ALBUM MODAL STATE
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [newAlbumSelectedColor, setNewAlbumSelectedColor] = useState('');

  // SEARCH INPUT
  const searchInput: any = useRef('');

  // CURRENT ALBUM ID IN URL
  const { albumId }: any = useParams();

  // GLOBAL GROUP CONTEXT
  const { deleteAlbumLoading, deleteAlbum } = useContext(GroupContext);

  // GLOBAL ALBUM CONTEXT
  const {
    currentAlbum,
    getAlbumData,
    getAlbumPostData,
    clearAlbumData,
    albumDataLoading,
    postsDataLoading,
    albumPosts,
    createNewPost,
    deletePostLoading,
    editAlbum,
    editAlbumLoading,
  } = useContext(AlbumContext);

  // IONIC LIFECYCLE METHODS
  useIonViewDidEnter(async () => {
    await getAlbumData(albumId);
    await getAlbumPostData(albumId);
  }, [albumId]);

  useIonViewDidLeave(() => {
    clearAlbumData();
  });

  // CUSTOM COMPONENT METHODS
  const searchPostsHandler = () => {};

  const uploadFile = async (e: any) => {
    const formData = new FormData();

    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
      formData.append('image', files[i]);
    }

    let axiosConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    };

    try {
      const result: any = await axios.post(
        `${config.apiURL}/posts/upload`,
        formData,
        axiosConfig
      );

      setSelectedFiles(result.data.data.imageKeys);
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async (e: any) => {
    e.preventDefault();

    if (!postTitle) {
      console.log('No title added');
      return;
    }

    if (!postBody) {
      console.log('No body added');
      return;
    }

    if (!selectedFiles) {
      console.log('No file uploaded');
      return;
    }

    let postData = {
      albumId,
      title: postTitle,
      body: postBody,
      files: selectedFiles,
    };

    await createNewPost(postData);

    setPostTitle('');
    setPostBody('');
    setSelectedFiles('');
    setShowModal(false);
  };

  const editAlbumHandler = () => {
    setShowPopover({ showPopover: false, event: undefined });
    setNewAlbumTitle(currentAlbum?.title);
    setNewAlbumDescription(currentAlbum?.description);
    setNewAlbumSelectedColor(currentAlbum?.color);
    setShowEditModal(true);
  };

  const onEditAlbumHandler = async (e: any) => {
    e.preventDefault();

    const newAlbumData = {
      title: newAlbumTitle,
      description: newAlbumDescription,
      color: newAlbumSelectedColor,
    };

    await editAlbum(albumId, newAlbumData);

    setShowEditModal(false);
    setNewAlbumDescription('');
    setNewAlbumTitle('');
    setNewAlbumSelectedColor('');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="page__iontoolbartitle">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/my/groups" />
          </IonButtons>

          <IonTitle className="page__Title">Album</IonTitle>

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
            <AlbumActionControllers
              editAlbumHandler={editAlbumHandler}
              deleteAlbumHandler={() => {
                setShowAlert1(true);
              }}
              showModal={setShowModal}
              showPopover={setShowPopover}
            />
          </IonPopover>
        </IonToolbar>
      </IonHeader>

      <IonContent className="albumpage__content">
        <div className="content__container">
          <IonLoading isOpen={deletePostLoading} />
          <IonLoading isOpen={deleteAlbumLoading} />

          {albumDataLoading && (
            <div className="loading_spinner">
              <IonSpinner name="circles" />
            </div>
          )}

          {!albumDataLoading && currentAlbum && (
            <>
              <div
                className="albumpage__colorbar"
                style={{ backgroundColor: `${currentAlbum?.color}` }}
              >
                <div className="group__info">
                  <h2>{currentAlbum.title}</h2>
                  <p>{currentAlbum.description}</p>
                  <p>{albumPosts.length} Posts</p>
                </div>
              </div>

              <IonSearchbar
                ref={searchInput}
                value={searchInput.current?.value}
                onIonChange={searchPostsHandler}
                debounce={400}
              ></IonSearchbar>

              <div className="albumpage__postslist">
                {postsDataLoading && <IonSpinner name="circles" />}

                {!postsDataLoading && albumPosts.length > 0 ? (
                  albumPosts.map((el: any) => (
                    <PostCard key={el.id} postData={el} />
                  ))
                ) : (
                  <p>No posts</p>
                )}
              </div>
            </>
          )}

          <IonAlert
            isOpen={showAlert1}
            onDidDismiss={() => setShowAlert1(false)}
            cssClass="my-custom-class"
            header={'Confirm!'}
            message={'Are you  sure you want to delete album'}
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  setShowPopover({ showPopover: false, event: undefined });
                },
              },
              {
                text: 'Okay',
                handler: async () => {
                  setShowPopover({ showPopover: false, event: undefined });
                  await deleteAlbum(albumId);
                  setShowAlert1(false);
                  history.push(`/my/groups/${currentAlbum.groupId}`);
                },
              },
            ]}
          />
        </div>

        <IonModal onDidDismiss={() => setShowModal(false)} isOpen={showModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle className="page__Title">Create Post</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  disabled={postsDataLoading}
                  color="danger"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent>
            <form onSubmit={createPost} className="createAlbum_form">
              <input type="file" onChange={uploadFile} multiple />
              <IonItem>
                <IonLabel position="floating">Title</IonLabel>
                <IonInput
                  value={postTitle}
                  onIonChange={(e: any) => setPostTitle(e.detail.value)}
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Body</IonLabel>
                <IonInput
                  multiple
                  value={postBody}
                  onIonChange={(e: any) => setPostBody(e.detail.value)}
                ></IonInput>
              </IonItem>

              <IonButton
                disabled={postsDataLoading}
                type="submit"
                expand="full"
              >
                {postsDataLoading ? <IonSpinner name="circles" /> : 'Create'}
              </IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonModal
          backdropDismiss={!editAlbumLoading}
          onDidDismiss={() => setShowEditModal(false)}
          isOpen={showEditModal}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle className="page__Title">Create Album</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  disabled={editAlbumLoading}
                  color="danger"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <form onSubmit={onEditAlbumHandler} className="createAlbum_form">
              <CirclePicker
                className="createAlbum__modal__colorpicker"
                color={newAlbumSelectedColor}
                onChangeComplete={(color: ColorResult, e: any) => {
                  setNewAlbumSelectedColor(color.hex);
                }}
              />

              <IonItem>
                <IonLabel position="floating">Title</IonLabel>
                <IonInput
                  value={newAlbumTitle}
                  onIonChange={(e: any) => setNewAlbumTitle(e.detail.value)}
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Description</IonLabel>
                <IonInput
                  multiple
                  value={newAlbumDescription}
                  onIonChange={(e: any) =>
                    setNewAlbumDescription(e.detail.value)
                  }
                ></IonInput>
              </IonItem>

              <IonButton
                disabled={editAlbumLoading}
                type="submit"
                expand="full"
              >
                {editAlbumLoading ? <IonSpinner name="circles" /> : 'Edit'}
              </IonButton>
            </form>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AlbumPage;
