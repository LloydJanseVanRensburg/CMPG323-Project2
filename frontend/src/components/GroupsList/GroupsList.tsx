import { IonCol, IonContent, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useContext } from 'react';
import { AuthContext } from '../../context/Auth/authContext';
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
  const { userData } = useContext(AuthContext);

  return (
    <>
      <IonGrid className="grouplist__grid">
        <h4>Created by you</h4>
        <IonRow className="ion-align-items-center">
          <IonCol size="3">
            <div className="groupCard" onClick={() => setShowModal(true)}>
              <div>
                <IonIcon size="large" icon={addOutline} />
              </div>
            </div>
          </IonCol>
          {groups.map((group: any) => {
            if (group.owner === userData.id) {
              return (
                <IonCol key={group.id} size="3">
                  <GroupCard groupData={group} />
                </IonCol>
              );
            } else {
              return null;
            }
          })}
        </IonRow>
      </IonGrid>

      <hr className="grouplist__divider" />

      <IonGrid className="grouplist__grid">
        <h4>Following</h4>
        <IonRow className="ion-align-items-center">
          {groups.map((group: any) => {
            if (group.owner !== userData.id) {
              return (
                <IonCol key={group.id} size="3">
                  <GroupCard groupData={group} />
                </IonCol>
              );
            } else {
              return null;
            }
          })}
        </IonRow>
      </IonGrid>
    </>
  );
};

export default GroupsList;
