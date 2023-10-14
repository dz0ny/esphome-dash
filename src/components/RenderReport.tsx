import React from 'react';
import {
    IonIcon, IonItem,
    IonLabel
} from '@ionic/react';
import { Device, stringToIcon } from './Device';

interface ContainerProps {
    device: Device;
}

const RenderReport: React.FC<ContainerProps> = ({ device }) => {
    return (
        <>
            {device.reports?.map((report, index) => (
                <IonItem key={index}>
                    <IonIcon slot="start" icon={stringToIcon(report.icon)}></IonIcon>
                    <IonLabel>{report.name}</IonLabel>
                    <IonLabel slot="end">{report.value}</IonLabel>
                </IonItem>
            ))}
        </>
    );
}


export default RenderReport;