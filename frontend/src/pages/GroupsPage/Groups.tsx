// Core React
import { useEffect, useState } from 'react';

// Axios & Modules
import axios from 'axios';

// Ionic Components
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

// Styling & Assets
import './Groups.css';
import { config } from '../../constants/config';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroupData();
  }, []);

  const fetchGroupData = async () => {
    try {
      let axiosConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      setLoading(true);
      const { data }: any = await axios.get(
        `${config.apiURL}/groups`,
        axiosConfig
      );
      const groups = data.data;

      setGroups(groups);
      setLoading(false);
    } catch (error: any) {
      let message = error.response
        ? error.response.data.message
        : 'Something went wrong please try again';
      setError(message);
      setLoading(false);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Groups</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {loading ? (
          <IonSpinner />
        ) : (
          <ul>
            {groups.map((group: any) => (
              <li key={group.id}>
                <img
                  src={`${config.apiURL}/image/${group.groupPicture}`}
                  alt="group profile"
                />
                <p>{group.title}</p>
                <p>{group.description}</p>
              </li>
            ))}
          </ul>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Groups;
