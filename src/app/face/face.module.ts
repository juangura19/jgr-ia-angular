import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaceRoutingModule } from './face-routing.module';
import { FaceService } from './services/face.service';
import { RecognizeComponent } from './components/recognize/recognize.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RecognizeComponent
  ],
  imports: [
    CommonModule,
    FaceRoutingModule,
    FormsModule
  ],
  providers: [
    FaceService
  ]
})
export class FaceModule { }
