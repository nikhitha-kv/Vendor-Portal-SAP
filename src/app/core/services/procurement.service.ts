import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, retry } from 'rxjs';
import { VendorRFQ, VendorPO, VendorGR } from '../models/vendor.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcurementService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private parseODataDate(dateString: string): string {
    if (!dateString) return dateString;
    const match = dateString.match(/\/Date\((\d+)\)\//);
    if (match) {
      return new Date(parseInt(match[1], 10)).toISOString();
    }
    return dateString;
  }

  getRFQs(): Observable<VendorRFQ[]> {
    const lifnr = this.auth.getLifnr();
    const url = `${this.baseUrl}/VendorRFQSet?$filter=Lifnr eq '${lifnr}'&$top=500`;
    return this.http.get<{d: {results: VendorRFQ[]}}>(url).pipe(
      retry(2),
      map(response => response.d.results.map(item => ({
        ...item,
        Bedat: this.parseODataDate(item.Bedat)
      })))
    );
  }

  getPurchaseOrders(): Observable<VendorPO[]> {
    const lifnr = this.auth.getLifnr();
    const url = `${this.baseUrl}/VendorPOSet?$filter=Lifnr eq '${lifnr}'&$top=500`;
    return this.http.get<{d: {results: VendorPO[]}}>(url).pipe(
      retry(2),
      map(response => response.d.results.map(item => ({
        ...item,
        Bedat: this.parseODataDate(item.Bedat)
      })))
    );
  }

  getGoodsReceipts(): Observable<VendorGR[]> {
    const lifnr = this.auth.getLifnr();
    const url = `${this.baseUrl}/VendorGRSet?$filter=Lifnr eq '${lifnr}'&$top=500`;
    return this.http.get<{d: {results: VendorGR[]}}>(url).pipe(
      retry(2),
      map(response => response.d.results.map(item => ({
        ...item,
        Budat: this.parseODataDate(item.Budat)
      })))
    );
  }
}
