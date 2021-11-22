import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { config } from '../../constants/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

import './PostCard.css';
import { useContext, useState } from 'react';
import {
  ellipsisHorizontal,
  ellipsisVertical,
  trashOutline,
} from 'ionicons/icons';
import { AlbumContext } from '../../context/Album/albumContext';

interface Props {
  postData: any;
}

const PostCard: React.FC<Props> = ({ postData }) => {
  const { deletePost, editPostLoading, editPost } = useContext(AlbumContext);

  const [showAlert1, setShowAlert1] = useState(false);
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

  // EDIT POST MODAL STATE
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [newSelectedPostFiles, setNewSelectedPostFiles] = useState<any>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  const editPostHandler = () => {
    setShowPopover({ showPopover: false, event: undefined });
    setNewPostBody(postData?.body);
    setNewPostTitle(postData?.title);
    setNewSelectedPostFiles(postData?.files);
    setShowEditPostModal(true);
  };

  const onEditPostHandler = async (e: any) => {
    e.preventDefault();

    const newPostData = {
      title: newPostTitle,
      body: newPostBody,
      files: newSelectedPostFiles,
    };

    await editPost(postData.id, newPostData);

    setShowEditPostModal(false);
    setNewPostTitle('');
    setNewPostBody('');
    setNewSelectedPostFiles(null);
  };

  const removeFileFromPostHandler = (idx: number) => {
    const newFiles = newSelectedPostFiles.filter(
      (file: string, fileIdx: number) => fileIdx !== idx
    );

    setNewSelectedPostFiles(newFiles);
  };

  return (
    <IonCard className="postCard">
      <IonCardHeader className="postCard__header">
        <div>
          <IonCardSubtitle>{postData.createdAt}</IonCardSubtitle>
          <IonCardTitle>{postData.title}</IonCardTitle>
        </div>

        <IonButtons>
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
            <IonItem onClick={editPostHandler}>
              <IonLabel>Edit Post</IonLabel>
            </IonItem>
            <IonItem
              onClick={() => {
                setShowAlert1(true);
                setShowPopover({ showPopover: false, event: undefined });
              }}
            >
              <IonLabel>Delete Post</IonLabel>
            </IonItem>
          </IonList>
        </IonPopover>
      </IonCardHeader>

      <Swiper slidesPerView={1} className="postCard__swiper">
        {postData.files.map((file: any, idx: number) => (
          <SwiperSlide key={idx}>
            <img src={`${config.apiURL}/image/${file}`} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>

      <IonCardContent className="postCard__content">
        {postData.body}
      </IonCardContent>

      <IonAlert
        isOpen={showAlert1}
        onDidDismiss={() => setShowAlert1(false)}
        cssClass="my-custom-class"
        header={'Confirm!'}
        message={'Are you  sure you want to delete post'}
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
              await deletePost(postData.id);
              setShowAlert1(false);
            },
          },
        ]}
      />

      <IonModal
        onDidDismiss={() => setShowEditPostModal(false)}
        isOpen={showEditPostModal}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle className="page__Title">Edit Post</IonTitle>
            <IonButtons slot="end">
              <IonButton
                disabled={editPostLoading}
                color="danger"
                onClick={() => setShowEditPostModal(false)}
              >
                Close
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <form onSubmit={onEditPostHandler} className="createAlbum_form">
            <div className="postCard__editmodal__carousel">
              <Swiper slidesPerView={1} className="postCard__swiper">
                {newSelectedPostFiles?.map((file: any, idx: number) => (
                  <SwiperSlide
                    key={idx}
                    style={{ width: '100%', position: 'relative' }}
                  >
                    <div
                      style={{ padding: '5px', cursor: 'pointer' }}
                      onClick={() => removeFileFromPostHandler(idx)}
                    >
                      <IonIcon size="large" icon={trashOutline} />
                    </div>
                    <img src={`${config.apiURL}/image/${file}`} alt="" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <IonItem>
              <IonLabel position="floating">Title</IonLabel>
              <IonInput
                value={newPostTitle}
                onIonChange={(e: any) => setNewPostTitle(e.detail.value)}
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Body</IonLabel>
              <IonInput
                multiple
                value={newPostBody}
                onIonChange={(e: any) => setNewPostBody(e.detail.value)}
              ></IonInput>
            </IonItem>

            <IonButton disabled={editPostLoading} type="submit" expand="full">
              {editPostLoading ? <IonSpinner name="circles" /> : 'Edit'}
            </IonButton>
          </form>
        </IonContent>
      </IonModal>
    </IonCard>
  );
};

export default PostCard;
