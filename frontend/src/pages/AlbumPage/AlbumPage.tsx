import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonPopover,
  IonSearchbar,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewDidLeave,
} from '@ionic/react';

import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import { useRef, useState, useContext } from 'react';
import { useParams } from 'react-router';
import AlbumActionControllers from '../../components/AlbumActionControllers/AlbumActionControllers';
import PostCard from '../../components/PostCard/PostCard';
import { AlbumContext } from '../../context/Album/albumContext';
import './AlbumPage.css';

const AlbumPage: React.FC = () => {
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
  } = useContext(AlbumContext);

  useIonViewDidEnter(async () => {
    await getAlbumData(albumId);
    await getAlbumPostData(albumId);
  }, [albumId]);

  useIonViewDidLeave(() => {
    clearAlbumData();
  });

  const searchPostsHandler = () => {};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/my/groups" />
          </IonButtons>

          <IonTitle>Album</IonTitle>

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

      <IonContent>
        {albumDataLoading && (
          <div>
            <IonSpinner name="circles" />
          </div>
        )}

        {!albumDataLoading && currentAlbum && (
          <>
            <div
              className="albumpage__colorbar"
              style={{ backgroundColor: `${currentAlbum?.color}` }}
            >
              {currentAlbum?.title}
            </div>

            <div>
              <div></div>
              <div></div>
              <div></div>
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
                albumPosts.map((el: any) => <PostCard key={el.id} />)
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
      </IonContent>
    </IonPage>
  );
};

export default AlbumPage;
