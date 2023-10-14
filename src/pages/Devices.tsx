import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonToolbar,
  IonList,
  IonItem,
  IonModal,
  IonInput,
  IonAlert,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonCardHeader,
  IonCardTitle,
  IonCard,
  IonCardContent,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react';
import { add, heart } from 'ionicons/icons';

import { useInterval } from 'usehooks-ts'
import { Device } from '../components/Device';
import { saveDevices, getDevices, getReports } from '../components/Shared';
import './Devices.css';
import RenderReport from '../components/RenderReport';

async function fetchData(devices: Device[]) {
  const newData = await Promise.all(
    devices?.map(async (device) => {
      const reports = await getReports(device);
      return { ...device, reports: await reports.reports };
    })
  );
  console.log(newData);
  saveDevices(newData as Device[]);
}

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [newDevice, setNewDevice] = useState<Device>({
    label: '',
    address: '',
    reports: [],
  });

  useInterval(
    async () => {
      await fetchData(devices);
    },
    60000
  );

  const onAddDevice = () => {
    setShowModal(true);
  };

  const onSaveDevice = () => {
    const newDevices = [...devices, newDevice];
    saveDevices(newDevices);
    setShowModal(false);
    setNewDevice({ label: '', address: '', reports: [] });
    fetchData(newDevices);
  };

  const onCancelDevice = () => {
    setShowModal(false);
    setNewDevice({ label: '', address: '', reports: [] });
  };

  const onDeleteDevice = (device: Device) => {
    setSelectedDevice(device);
    setShowAlert(true);
  };

  const onConfirmDelete = () => {
    const newDevices = devices.filter((device) => device.address !== selectedDevice?.address);
    console.log(newDevices);
    saveDevices(newDevices);
    setShowAlert(false);
    fetchData(newDevices);
  };

  const onCancelDelete = () => {
    setShowAlert(false);
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await fetchData(devices);
    event.detail.complete();
  }

  useEffect(() => {
    getDevices().then((devices) => setDevices(devices));
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle size="large">Devices</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onAddDevice}>
              <IonIcon slot="icon-only" icon={add}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonList>
          {devices?.map((device, index) => (
            <IonItemSliding key={index}>
              <IonItem>
                <IonCard style={{ "width": "100%" }}>
                  <IonCardHeader>
                    <IonItem>
                      <IonCardTitle>{device.label}</IonCardTitle>
                      <IonIcon slot="end" icon={heart} color="danger"></IonIcon>
                    </IonItem>

                  </IonCardHeader>
                  <IonCardContent>
                    <RenderReport device={device} />
                  </IonCardContent>
                </IonCard>
              </IonItem>

              <IonItemOptions>
                <IonItemOption color="danger" onClick={() => { onDeleteDevice(device) }}>Delete</IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
      </IonContent>
      <IonModal isOpen={showModal} onDidDismiss={onCancelDevice}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add Device</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={onCancelDevice}>Cancel</IonButton>
              <IonButton disabled={
                newDevice.label === '' || newDevice.address === ''
              } onClick={onSaveDevice}>Save</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonItem>
            <IonInput
              value={newDevice.label}
              label='Device Name'
              required={true}
              onIonInput={(ev) =>
                setNewDevice({ ...newDevice, label: ev.target.value?.toString() ?? "" })
              }
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonInput
              value={newDevice.address}
              label='Device Address'
              required={true}
              onIonInput={(ev) =>
                setNewDevice({ ...newDevice, address: ev.target.value?.toString() ?? "" })
              }
            ></IonInput>
          </IonItem>
        </IonContent>
      </IonModal>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => onCancelDelete()}
        header={'Delete Device'}
        message={`Are you sure you want to delete ${selectedDevice?.address}?`}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: onCancelDelete,
          },
          {
            text: 'Delete',
            handler: onConfirmDelete,
          },
        ]}
      />
    </IonPage >
  );
};

export default Devices;

