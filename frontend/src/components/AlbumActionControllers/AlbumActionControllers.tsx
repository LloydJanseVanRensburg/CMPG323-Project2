import { IonItem, IonLabel, IonList } from '@ionic/react';

interface Props {
  showModal: any;
  showPopover: any;
  deleteAlbumHandler: any;
  editAlbumHandler: any;
}

const AlbumActionControllers: React.FC<Props> = ({
  showModal,
  showPopover,
  deleteAlbumHandler,
  editAlbumHandler,
}) => {
  const onAddPostHandler = () => {
    showModal(true);
    showPopover({ showPopover: false, event: undefined });
  };

  return (
    <IonList>
      <IonItem onClick={editAlbumHandler}>
        <IonLabel>Edit Album</IonLabel>
      </IonItem>
      <IonItem onClick={deleteAlbumHandler}>
        <IonLabel>Delete Album</IonLabel>
      </IonItem>
      <IonItem onClick={onAddPostHandler}>
        <IonLabel>Add Post</IonLabel>
      </IonItem>
    </IonList>
  );
};

export default AlbumActionControllers;
