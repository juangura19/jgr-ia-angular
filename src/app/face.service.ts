import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from './azure';

@Injectable({
  providedIn: 'root'
})
export class FaceService {

  url = environment.URI_AZURE;

  constructor(private _httpClient: HttpClient) {
  }

  detection(file: any) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/octet-stream')
      .set('Ocp-Apim-Subscription-Key', 'efe493f15c6b421b8262e4b516e5d0cf');

    const params: HttpParams = new HttpParams()
      .set('detectionModel', 'detection_03')
      .set('returnFaceId', 'true')
      .set('returnFaceLandmarks', 'false');

    return this._httpClient.post<any>(`${this.url}detect`, this.makeblob(file), { headers, params });
  }

  comparation(request: Request) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Ocp-Apim-Subscription-Key', 'efe493f15c6b421b8262e4b516e5d0cf');

    return this._httpClient.post<any>(`${this.url}findsimilars`, request, { headers });
  }

  public makeblob(dataURL: any) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }
}
