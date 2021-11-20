import { IonItem, IonLabel, IonList } from '@ionic/react';

const AlbumActionControllers = () => {
  return (
    <IonList>
      <IonItem>
        <IonLabel>Edit Album</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Delete Album</IonLabel>
      </IonItem>
      <IonItem>
        <IonLabel>Add Post</IonLabel>
      </IonItem>
    </IonList>
  );
};

export default AlbumActionControllers;
