import { IonAvatar } from '@ionic/react';
import { config } from '../../constants/config';
import { Group } from '../GroupsList/GroupsList';
import { useHistory } from 'react-router';
import './GroupCard.css';

interface GroupData {
  groupData: Group;
}

const GroupCard: React.FC<GroupData> = ({ groupData }) => {
  const history = useHistory();
  return (
    <div
      className="groupCard"
      onClick={() => history.push(`/my/groups/${groupData.id}`)}
    >
      <div className="groupCard__imageContainer">
        <img
          src={`${config.apiURL}/image/${groupData.groupPicture}`}
          alt="group profile"
        />
      </div>

      <p>{groupData.title}</p>
    </div>
  );
};

export default GroupCard;
