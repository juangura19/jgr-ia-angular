import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Request } from './azure';
import { FaceService } from './face.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canva') canva!: ElementRef;

  public stream: any;
  faceId!: string;
  name!: string;
  confidence!: string;

  constructor(private faceService: FaceService) {

  }
  ngOnInit(): void {
    this.checkMediaSource();
  }

  checkMediaSource = () => {
    if (navigator && navigator.mediaDevices) {

      navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
      }).then(stream => {
        this.stream = stream;
      }).catch(() => {
        console.log('**** ERROR NOT PERMISSIONS *****');
      });

    } else {
      console.log('******* ERROR NOT FOUND MEDIA DEVICES');
    }
  };

  loadedMetaData(): void {
    this.videoElement.nativeElement.play();
  }

  onCapture() {
    this.canva.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0, 640, 480);
    const photo = this.canva.nativeElement.toDataURL("image/jpeg");
    this.detection(photo);

  }

  detection = (photo: any) => {
    this.faceService.detection(photo).subscribe(data => {
      this.comparation(data[0].faceId);
    })
  }

  comparation = (id: string) => {
    let request: Request = {
      faceId: id,
      faceIds: [
        "9b697755-2532-4948-b736-b7979a48d93b"
      ],
      maxNumOfCandidatesReturned: 10,
      mode: "matchPerson"
    }
    this.faceService.comparation(request).subscribe(data => {
      console.log(data);
      this.name = "Juan Gutierrez";
      this.confidence = (data[0].confidence * 100).toString() + '%';
    })
  }

}
