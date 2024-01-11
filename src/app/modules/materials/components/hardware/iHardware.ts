import { Isteel } from "../../iSteel";

interface IhardwareType {
  id_type: number;
  name_type: string;
  ind: number;
}

interface Ihardware {
  idhardware?: number;
  name_hardware: string;
  initial_name_hardware: string;
  d?: number;
  initial_d?: number;
  L?: number;
  initial_L?: number;
  steel?: string;
  weight: string;
  initial_weight: string;
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