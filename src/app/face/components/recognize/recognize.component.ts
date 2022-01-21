import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { filter, map, switchMap } from 'rxjs';
import { AzureRequest } from '../../interfaces/azure';
import { Person } from '../../interfaces/person';
import { FaceService } from '../../services/face.service';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-recognize',
  templateUrl: './recognize.component.html',
  styleUrls: ['./recognize.component.css']
})
export class RecognizeComponent implements OnInit {

  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('videoElement2') videoElement2!: ElementRef;
  @ViewChild('canva') canva!: ElementRef;

  public stream: any;
  faceId!: string;
  names!: string;
  isVideo: boolean = true;
  result: string = '';

  constructor(
    private faceService: FaceService,
    private personService: PersonService
  ) {
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
    this.videoElement2.nativeElement.play();
  }

  onCapture() {
    this.canva.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0, 640, 480);

    this.isVideo = false;
  }
  onClean() {
    this.isVideo = true;
    this.canva.nativeElement.getContext('2d').clearRect(0, 0, 640, 480);
  }

  onSave() {
    const photo = this.canva.nativeElement.toDataURL("image/jpeg");
    this.detection(photo).subscribe(data => {
      let request: Person = {
        names: this.names,
        codeFace: data[0].faceId
      }
      this.personService.create(request).subscribe(res => {
        if (res.success) {
          console.log("Operacion exitosa!");
        }
        this.onClean();
      })
    })
  }

  onSearch() {
    this.canva.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0, 640, 480);
    const photo = this.canva.nativeElement.toDataURL("image/jpeg");
    this.detection(photo)
      .pipe(switchMap(data1 => {
        return this.personService.findAll()
          .pipe(map(d => {
            return d.map(a => { return a.codeFace })
          }))
          .pipe(map(data2 => {
            return { faceId: data1[0].faceId, faceIds: data2, maxNumOfCandidatesReturned: 10, mode: 'matchPerson' } as AzureRequest;
          }))
      })).subscribe(res => {
        this.comparation(res);
      })
  }

  detection = (photo: any) => {
    return this.faceService.detection(photo);
  }

  comparation = (request: AzureRequest) => {
    this.faceService.comparation(request)
      .pipe(switchMap(data => {
        console.log(data);
        return this.personService.findAll()
          .pipe(map(d => {
            return d.filter(x => x.codeFace == data[0].faceId)[0];
          }))
          .pipe(map(r => {
            return { names: r.names, confidence: data[0].confidence };
          }))
      })).subscribe(res => {
        console.log(res);
        this.result = `Bienvenido ${res.names} (${res.confidence * 100}%)`
      })
    //this.name = "Juan Gutierrez";
    //this.confidence = (data[0].confidence * 100).toString() + '%';
  }


}
