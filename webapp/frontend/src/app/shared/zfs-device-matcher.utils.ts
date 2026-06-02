import { DeviceModel } from 'app/core/models/device-model';
import { ZFSVdevModel } from 'app/core/models/zfs-pool-model';

/**
 * Utility to match a ZFS Vdev against a standard DeviceModel.
 */
export function matchVdevToDevice(vdev: ZFSVdevModel, device: DeviceModel): boolean {
    if (!vdev || !vdev.path || !device) {
        return false;
    }

    const path = vdev.path;

    // Direct match against device name (e.g. sda, /dev/sda)
    if (device.device_name) {
        if (path === device.device_name || path === `/dev/${device.device_name}`) {
            return true;
        }
    }

    // Direct match against device_serial_id (often used in /dev/disk/by-id/)
    if (device.device_serial_id) {
        if (path.includes(device.device_serial_id)) {
            return true;
        }
    }

    // Direct match against device_uuid
    if (device.device_uuid) {
        if (path.includes(device.device_uuid)) {
            return true;
        }
    }

    // Sometimes WWN is included in the path
    if (device.wwn && device.wwn !== '0x0000000000000000') {
        const cleanWwn = device.wwn.replace('0x', '');
        if (path.includes(cleanWwn) || path.includes(device.wwn)) {
            return true;
        }
    }

    return false;
}
