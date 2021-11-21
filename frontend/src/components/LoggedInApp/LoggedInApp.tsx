// Core React
import { useContext } from 'react';

// React Router Dom
import { Redirect, Route } from 'react-router-dom';

// Ionic Components
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';

// Ionic Icons
import { personOutline, peopleOutline } from 'ionicons/icons';

// Custom Pages Components
import Group from '../../pages/GroupPage/Group';
import Groups from '../../pages/GroupsPage/Groups';
import Home from '../../pages/HomePage/Home';
import { AuthContext } from '../../context/Auth/authContext';
import AlbumPage from '../../pages/AlbumPage/AlbumPage';

import './LoggedInApp.css';

const LoggedInApp = () => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <IonTabs className="loggedInApp__iotabs">
      <IonRouterOutlet>
        <Route exact path="/my/account" component={Home} />
        <Route exact path="/my/groups" component={Groups} />
        <Route exact path="/my/groups/:groupId" component={Group} />
        <Route exact path="/my/albums/:albumId" component={AlbumPage} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" className="loggedInApp__tabBar">
        <IonTabButton tab="account" href="/my/account">
          <IonIcon icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>

        <IonTabButton tab="groups" href="/my/groups">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Groups</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default LoggedInApp;
