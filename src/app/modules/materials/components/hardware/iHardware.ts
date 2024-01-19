import { Isteel } from "../../iSteel";

interface IhardwareType {
  id_type: number;
  name_type: string;
  ind: number;
}

interface Ihardware {
  id_item?: number;
  name_item: string;
  initial_name_item: string;
  d?: number;
  initial_d?: number;
  L?: number;
  initial_L?: number;
  steel?: string;
  weight: number;
  initial_weight: number;
  isEdited?: boolean;
}

interface IaddHardware {
  name_item: string,
  idsteel: number,
  id_type: number,
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