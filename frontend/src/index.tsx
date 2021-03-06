import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css';

import AuthState from './context/Auth/AuthState';
import GroupsState from './context/Groups/GroupsState';
import GroupState from './context/Group/GroupState';
import AlbumState from './context/Album/AlbumState';

ReactDOM.render(
  <AuthState>
    <GroupsState>
      <GroupState>
        <AlbumState>
          <App />
        </AlbumState>
      </GroupState>
    </GroupsState>
  </AuthState>,
  document.getElementById('root')
);

serviceWorkerRegistration.unregister();
reportWebVitals();
