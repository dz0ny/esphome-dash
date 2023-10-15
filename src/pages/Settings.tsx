import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/react';

import { useDarkMode } from 'usehooks-ts';

function Settings() {
  const { isDarkMode, toggle, enable, disable } = useDarkMode()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="large">Options</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonListHeader>Appearance</IonListHeader>
        <IonList inset={true}>
          <IonItem>
            <IonToggle checked={isDarkMode} onIonChange={toggle} justify="space-between">
              Dark Mode
            </IonToggle>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
export default Settings;