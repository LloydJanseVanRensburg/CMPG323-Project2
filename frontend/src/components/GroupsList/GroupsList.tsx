import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import axios from 'axios';
import { addOutline, closeOutline } from 'ionicons/icons';
import { useState } from 'react';
import { config } from '../../constants/config';
import GroupCard from '../GroupCard/GroupCard';
import './GroupsList.css';

export type Group = {
  title: string;
  description: string;
  groupPicture: string;
  id: string;
};

interface GroupsListProps {
  groups: any[];
}

const GroupsList: React.FC<GroupsListProps> = ({ groups }) => {
  const [showModal, setShowModal] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [toastAlert, setToastAlert] = useState({
    message: '',
    type: 'danger',
  });

  const createNewGroupHandler = async (e: any) => {
    e.preventDefault();

    try {
      let token = localStorage.getItem('authToken');
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = new FormData();

      formData.append('title', groupTitle);
      formData.append('description', groupDescription);
      formData.append('image', selectedFile);

      const response: any = await axios.post(
        `${config.apiURL}/groups`,
        formData,
        axiosConfig
      );

      if (response.data.success) {
        setGroupTitle('');
        setGroupDescription('');
        setSelectedFile(null);
        setShowModal(false);
      }
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';
      setToastAlert(message);
    }
  };

  return (
    <IonContent>
      <IonToast
        isOpen={toastAlert.message !== ''}
        onDidDismiss={() =>
          setToastAlert({
            message: '',
            type: 'danger',
          })
        }
        message={toastAlert.message}
        color={toastAlert.type}
        duration={5000}
        buttons={[
          {
            side: 'end',
            role: 'cancel',
            icon: closeOutline,
            handler: () => {
              setToastAlert({
                message: '',
                type: 'danger',
              });
            },
          },
        ]}
      />

      <IonModal isOpen={showModal} cssClass="my-custom-class">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Create New Group</IonTitle>
            <IonButtons slot="end">
              <IonButton color="danger" onClick={() => setShowModal(false)}>
                Close
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <form onSubmit={createNewGroupHandler} className="createGroup_form">
            <IonItem>
              <IonLabel position="floating">Title</IonLabel>
              <IonInput
                value={groupTitle}
                onIonChange={(e: any) => setGroupTitle(e.detail.value)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Description</IonLabel>
              <IonInput
                multiple
                value={groupDescription}
                onIonChange={(e: any) => setGroupDescription(e.detail.value)}
              ></IonInput>
            </IonItem>
            <IonItem>
              <input
                type="file"
                onChange={(e: any) => setSelectedFile(e.target.files[0])}
              />
            </IonItem>

            <IonButton type="submit" expand="full">
              Create
            </IonButton>
          </form>
        </IonContent>
      </IonModal>

      <div className="groupsList__flexContainer">
        <div className="groupCard" onClick={() => setShowModal(true)}>
          <div>
            <IonIcon icon={addOutline} />
          </div>
        </div>
        {groups.map((group) => (
          <GroupCard key={group.id} groupData={group} />
        ))}
      </div>
    </IonContent>
  );
};

export default GroupsList;
