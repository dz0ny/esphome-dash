import { useFetch } from "usehooks-ts";
import { Device, Report, ResponseReport } from "./Device";
import { Storage } from '@ionic/storage';

export async function getDevices(): Promise<Array<Device>> {
    const storage = new Storage();
    await storage.create();

    const devices = await storage.get('devices') as Array<Device>;
    return devices || [];
}

export async function saveDevices(devices: Array<Device>) {
    const storage = new Storage();
    await storage.create();

    await storage.set('devices', devices);
}


export async function getReports(device: Device): Promise<ResponseReport> {
    let url = new URL(document.location.toString());
    url.pathname = '/topic/' + device.address;

    const report = await fetch(url.toString(), {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    if (!report.ok) {
        return { reports: [], status: false };
    }
    return { reports: report.json() as unknown as Array<Report> || [], status: false };
}