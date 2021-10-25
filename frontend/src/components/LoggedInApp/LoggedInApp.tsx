// Core React
import { useContext } from 'react';

// React Router Dom
import { Redirect, Route } from 'react-router-dom';

// Ionic Components
import {
  IonBadge,
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

const LoggedInApp = () => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/my/account" component={Home} />
        <Route exact path="/my/groups" component={Groups} />
        <Route exact path="/my/groups/:groupId" component={Group} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="account" href="/my/account">
          <IonIcon icon={personOutline} />
          <IonLabel>Account</IonLabel>
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
