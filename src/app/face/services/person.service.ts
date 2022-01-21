import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Person } from "../interfaces/person";

@Injectable({
    providedIn: 'root'
})
export class PersonService {

    url = `${environment.URI_BACKEND}/person`;

    constructor(private _httpClient: HttpClient) {
    }

    create(request: Person) {
        return this._httpClient.post<any>(this.url, request);
    }

    findAll() {
        return this._httpClient.get<Person[]>(this.url);
    }
}