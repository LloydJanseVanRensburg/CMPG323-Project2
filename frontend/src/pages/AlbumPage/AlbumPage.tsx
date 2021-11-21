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

import {
  addOutline,
  ellipsisHorizontal,
  ellipsisVertical,
} from 'ionicons/icons';
import { useRef, useState, useContext } from 'react';
import { useParams } from 'react-router';
import AlbumActionControllers from '../../components/AlbumActionControllers/AlbumActionControllers';
import PostCard from '../../components/PostCard/PostCard';
import { config } from '../../constants/config';
import { AlbumContext } from '../../context/Album/albumContext';
import './AlbumPage.css';

const AlbumPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  const [showAlert1, setShowAlert1] = useState(false);
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

  const searchInput: any = useRef('');
  const { albumId }: any = useParams();

  const {
    currentAlbum,
    getAlbumData,
    getAlbumPostData,
    clearAlbumData,
    albumDataLoading,
    postsDataLoading,
    albumPosts,
    createNewPost,
  } = useContext(AlbumContext);

  useIonViewDidEnter(async () => {
    await getAlbumData(albumId);
    await getAlbumPostData(albumId);
  }, [albumId]);

  useIonViewDidLeave(() => {
    clearAlbumData();
  });

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
            <AlbumActionControllers />
          </IonPopover>
        </IonToolbar>
      </IonHeader>

      <IonContent className="albumpage__content">
        <div className="content__container">
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
                handler: () => {},
              },
            ]}
          />

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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AlbumPage;
