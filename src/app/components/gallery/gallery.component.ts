import { Component, Input } from '@angular/core';
import { NgxImageZoomModule } from 'ngx-image-zoom';

@Component({
  standalone:true,
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
  imports:[NgxImageZoomModule]
})
export class GalleryComponent  {
 @Input() myThumbnail!:string;
 @Input() myFullresImage!:string;



}
