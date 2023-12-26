import { Isteel } from "../../iSteel";

interface IhardwareType {
  idhardware_type: number;
  name_type: string;
  ind: number;
}

interface Ihardware {
  idhardware?: number;
  name_hardware: string;
  d?: number;
  L?: number;
  steel?: string;
  weight: string;
  isEdited?: boolean;
}

interface IaddHardware {
  name_hardware: string,
  idsteel: number,
  idhardware_type: number,
  d?: number,
  weight: number,
  L?: number
}

interface IHardwareMaterial {
  hardware_type:IhardwareType[];
  steels:Isteel[];
  hardwares:Ihardware[];
}
export { IhardwareType, Ihardware, IHardwareMaterial, IaddHardware}