import { IonCol, IonContent, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
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
  setShowModal: (x: boolean) => void;
}

const GroupsList: React.FC<GroupsListProps> = ({ groups, setShowModal }) => {
  return (
    <IonContent>
      <IonGrid className="ion-padding">
        <IonRow className="ion-align-items-center">
          <IonCol size="3">
            <div className="groupCard" onClick={() => setShowModal(true)}>
              <div>
                <IonIcon icon={addOutline} />
              </div>
            </div>
          </IonCol>
          {groups.map((group: any) => (
            <IonCol key={group.id} size="3">
              <GroupCard groupData={group} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default GroupsList;
