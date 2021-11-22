import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from '@ionic/react';
import { config } from '../../constants/config';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

import './PostCard.css';
import { useContext, useState } from 'react';
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import { AlbumContext } from '../../context/Album/albumContext';

interface Props {
  postData: any;
}

const PostCard: React.FC<Props> = ({ postData }) => {
  const { deletePost } = useContext(AlbumContext);

  const [showAlert1, setShowAlert1] = useState(false);
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

  const editPostHandler = () => {
    console.log('Editing post...');
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
    </IonCard>
  );
};

export default PostCard;
