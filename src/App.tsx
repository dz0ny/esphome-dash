import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { options, hardwareChip } from 'ionicons/icons';
import Devices from './pages/Devices';
import Settings from './pages/Settings';

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
import { useDarkMode } from 'usehooks-ts';
import { useEffect } from 'react';

setupIonicReact({
  mode: 'md',
});

const App: React.FC = () => {
  const { isDarkMode, toggle, enable, disable } = useDarkMode()

  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  });

  return (<IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/devices">
            <Devices />
          </Route>
          <Route exact path="/options">
            <Settings />
          </Route>
          <Route exact path="/">
            <Redirect to="/devices" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="Devices" href="/devices">
            <IonIcon aria-hidden="true" icon={hardwareChip} />
            <IonLabel>Devices</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Settings" href="/options">
            <IonIcon aria-hidden="true" icon={options} />
            <IonLabel>Options</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>);
};

export default App;

