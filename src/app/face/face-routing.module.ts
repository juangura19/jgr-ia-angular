import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecognizeComponent } from './components/recognize/recognize.component';

const routes: Routes = [
  {
    path: '', component: RecognizeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaceRoutingModule { }
