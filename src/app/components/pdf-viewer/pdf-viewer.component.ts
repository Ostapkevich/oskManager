import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ActivatedRoute } from "@angular/router";
import { AppService } from '../../app.service';
@Component({
  standalone: true,
  selector: 'pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxExtendedPdfViewerModule]
})
export class PdfViewerComponent implements OnInit {
  url: string = '';
  pdfUrl: any;
  constructor(private route: ActivatedRoute, private pdfService: NgxExtendedPdfViewerService, private appService: AppService) {
    pdfDefaultOptions.doubleTapZoomFactor = '150%'; // The default value is '200%'
    pdfDefaultOptions.maxCanvasPixels = 4096 * 4096 * 5; // The default value is 4096 * 4096 pixels,
    this.route.params.subscribe(params => {
      this.url = decodeURIComponent(params['url']);
      // this.url =`http://localhost:3000/viewDrawing/download/${path}`;
      console.log("this.url ", this.url)
    });

  }
  //private pdfService: NgxExtendedPdfViewerService


  async ngOnInit() {
    try {
      const filePath = 'relative/path/to/pdf/file.pdf'; // Путь к файлу на сервере
      let blob: any;
       blob = await this.appService.query('blob', 'http://localhost:3000/viewDrawing/download', this.url);
       console.log('blob', blob)
       this.pdfUrl = blob;
    } catch (error) {
      alert('error is '+ error)
    }
  
  }

}
