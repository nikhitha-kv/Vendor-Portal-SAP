import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * SAP Gateway Auth Interceptor
 *
 * This interceptor adds the TECHNICAL SAP Gateway Basic Auth header to every
 * outbound request to the /sap/ path. This is equivalent to setting
 * "Basic Auth" in Postman with:
 *   Username: K902095
 *   Password: Nikhi@2004
 *
 * This is SEPARATE from the vendor's own login (LoginSet API).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Only intercept SAP OData calls (proxied via /sap)
  if (!req.url.startsWith('/sap')) {
    return next(req);
  }

  // Build the fixed SAP Gateway Basic Auth token from environment config
  const sapAuth = 'Basic ' + btoa(`${environment.sapGatewayUser}:${environment.sapGatewayPassword}`);

  // Clone request and attach mandatory SAP headers
  const sapReq = req.clone({
    setHeaders: {
      'Authorization': sapAuth,
      'Accept': 'application/json',
    }
  });

  return next(sapReq);
};
