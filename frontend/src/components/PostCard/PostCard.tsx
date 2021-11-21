import {
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
import { useState } from 'react';
import { ellipsisHorizontal, ellipsisVertical } from 'ionicons/icons';
import axios from 'axios';

interface Props {
  postData: any;
}

const PostCard: React.FC<Props> = ({ postData }) => {
  const [showAlert1, setShowAlert1] = useState(false);
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

  const editPostHandler = () => {
    console.log('Editing post...');
  };

  const deletePostHandler = async () => {
    try {
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.authToken}`,
        },
      };

      const result = await axios.delete(
        `${config.apiURL}/posts/${postData.id}`,
        axiosConfig
      );
      console.log(result);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <IonCard className="postCard">
      <Swiper slidesPerView={1} className="postCard__swiper">
        {postData.files.map((file: any, idx: number) => (
          <SwiperSlide key={idx}>
            <img src={`${config.apiURL}/image/${file}`} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
      <IonCardHeader>
        <IonCardSubtitle>Destination</IonCardSubtitle>
        <IonCardTitle>Madison, WI</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        Founded in 1829 on an isthmus between Lake Monona and Lake Mendota,
        Madison was named the capital of the Wisconsin Territory in 1836.
      </IonCardContent>
    </IonCard>
  );
};

export default PostCard;
