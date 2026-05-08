import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, retry } from 'rxjs';
import { VendorInvoice, VendorPayment, VendorAging, VendorMemo } from '../models/vendor.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private parseODataDate(dateString: string | undefined): string | undefined {
    if (!dateString) return dateString;
    const match = dateString.match(/\/Date\((\d+)\)\//);
    if (match) {
      return new Date(parseInt(match[1], 10)).toISOString();
    }
    return dateString;
  }

  getInvoices(): Observable<VendorInvoice[]> {
    const lifnr = this.auth.getLifnr();
    const url = `${this.baseUrl}/VendorInvoiceSet?$filter=Lifnr eq '${lifnr}'&$top=500`;
    return this.http.get<{d: {results: VendorInvoice[]}}>(url).pipe(
      retry(2),
      map(response => response.d.results.map(item => ({
        ...item,
        Budat: this.parseODataDate(item.Budat),
        Bldat: this.parseODataDate(item.Bldat)
      })))
    );
  }

  getPayments(): Observable<VendorPayment[]> {
    const lifnr = this.auth.getLifnr();
    const url = `${this.baseUrl}/VendorPaymentSet?$filter=Lifnr eq '${lifnr}'&$top=500`;
    return this.http.get<{d: {results: VendorPayment[]}}>(url).pipe(
      retry(2),
      map(response => response.d.results.map(item => ({
        ...item,
        Budat: this.parseODataDate(item.Budat)!
      })))
    );
  }

  getAging(): Observable<VendorAging[]> {
    const lifnr = this.auth.getLifnr();
    const url = `${this.baseUrl}/VendorAgingSet?$filter=Lifnr eq '${lifnr}'&$top=500`;
    return this.http.get<{d: {results: VendorAging[]}}>(url).pipe(
      retry(2),
      map(response => response.d.results.map(item => ({
        ...item,
        Budat: this.parseODataDate(item.Budat)!,
        DueDate: this.parseODataDate(item.DueDate)!
      })))
    );
  }

  getMemos(): Observable<VendorMemo[]> {
    const lifnr = this.auth.getLifnr();
    const url = `${this.baseUrl}/VendorMemoSet?$filter=Lifnr eq '${lifnr}'&$top=500`;
    return this.http.get<{d: {results: VendorMemo[]}}>(url).pipe(
      retry(2),
      map(response => response.d.results.map(item => ({
        ...item,
        Budat: this.parseODataDate(item.Budat)!
      })))
    );
  }

  downloadInvoicePdf(belnr: string): Observable<Blob> {
    const lifnr = this.auth.getLifnr();
    const url = `${this.baseUrl}/InvoicePDFSet(BELNR='${belnr}',LIFNR='${lifnr}')/$value`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      retry(1)
    );
  }
}
