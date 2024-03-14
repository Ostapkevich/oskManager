import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { IBlank, IMaterial, Ispecification } from './interfaceDrawingSP';

@Injectable({
  providedIn: 'root'
})
export class DrawingsDatabaseService {

  constructor(private appService: AppService) { }


  showBlankInfo(blankInfo: any, type_blank: number | null): Partial<IBlank> {
    const blank: Partial<IBlank> = {};
    blank!.typeBlank = type_blank!;
    blank!.id = blankInfo.id;
    blank!.idBlank = blankInfo.id_item;
    blank!.blankWeight = blankInfo.weight;
    blank!.nameBlank = blankInfo.name_item;
    switch (blank!.typeBlank) {
      case 1:
        blank!.uselength = blankInfo.uselength;
        blank!.len = blankInfo.L;
        blank!.dw = blankInfo.d_b;
        blank!.h = blankInfo.h;
        blank!.plasma = Boolean(blankInfo.plasma);
        blank!.percentBlank = blankInfo.allowance
        break;
      case 3:
        blank!.len = blankInfo.L;
        blank!.h = blankInfo.h;
        blank!.percentBlank = blankInfo.percent;
        blank!.valueBlank = blankInfo.value;
        blank!.specificUnitsBlank = blankInfo.specific_units;
        blank!.unitsBlank = blankInfo.units;
        break;
    }
    return blank;

  }

  showMaterialInfo(materials:Partial<IMaterial>[], materialInfo: any) {
    if (materialInfo) {
      for (const item of materialInfo) {
        materials.push({
          id: item.id,
          idDrawing: item.idDrawing,
          idItem: item.id_item,
          name_material: item.name_item,
          unitsMaterial: item.units,
          percent: item.percent,
          valueMaterial: item.value,
          specific_units: item.specific_units,
          lenMaterial: item.L,
          hMaterial: item.h,
        })
      }
    }
  }


}
