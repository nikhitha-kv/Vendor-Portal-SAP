import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UserSession } from '../models/vendor.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;

  // Reactive session state via Angular Signals
  currentUser = signal<UserSession | null>(this.getStoredSession());

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Normalize Vendor ID: pads with leading zeros to 10 digits.
   * '11' -> '0000000011'
   */
  normalizeVendorId(id: string): string {
    return id.trim().padStart(10, '0');
  }

  /**
   * Vendor Application Login
   *
   * Calls LoginSet(Lifnr, Password) on the SAP OData service.
   * The SAP Gateway Basic Auth (K902095:Nikhi@2004) is automatically
   * added to this request by the authInterceptor.
   */
  login(lifnr: string, password: string): Observable<any> {
    const paddedLifnr = this.normalizeVendorId(lifnr);
    const url = `${this.baseUrl}/LoginSet(Lifnr='${paddedLifnr}',Password='${password}')`;

    // Note: SAP Gateway Basic Auth is injected by authInterceptor automatically.
    // This call only validates the VENDOR's business credentials.
    return this.http.get(url).pipe(
      tap(() => {
        const session: UserSession = { lifnr: paddedLifnr };
        this.setSession(session);
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    sessionStorage.removeItem('vendor_session');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getLifnr(): string | null {
    return this.currentUser()?.lifnr || null;
  }

  private setSession(session: UserSession): void {
    this.currentUser.set(session);
    sessionStorage.setItem('vendor_session', JSON.stringify(session));
  }

  private getStoredSession(): UserSession | null {
    const stored = sessionStorage.getItem('vendor_session');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as UserSession;
    } catch {
      return null;
    }
  }
}
