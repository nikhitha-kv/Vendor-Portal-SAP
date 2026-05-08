import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, retry } from 'rxjs';
import { VendorProfile } from '../models/vendor.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getProfile(): Observable<VendorProfile> {
    const lifnr = this.auth.getLifnr();
    const url = `${this.baseUrl}/VendorProfileSet(Lifnr='${lifnr}')`;
    
    return this.http.get<{d: VendorProfile}>(url).pipe(
      retry(2),
      map(response => response.d)
    );
  }
}
