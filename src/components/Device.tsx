import { thermometer, water, planet, pin } from 'ionicons/icons';


export interface Device {
    label: string;
    address: string;
    reports: Array<Report>;
}

export function stringToIcon(icon: string) {
    switch (icon) {
        case 'thermometer':
            return thermometer;
        case 'water':
            return water;
        case 'pin':
            return pin;
        case 'planet':
            return planet;
        default:
            return icon.indexOf("http") === 0 ? icon : pin;
    }
}

export interface Report {
    icon: string;
    name: string;
    value: string;
}

export interface ResponseReport {
    reports: Array<Report>;
    status: Boolean;
}