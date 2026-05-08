import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error (SAP OData specifically)
        if (error.status === 401) {
          router.navigate(['/login']);
          errorMessage = 'Session expired or unauthorized.';
        } else if (error.error && error.error.error && error.error.error.message) {
          // Standard SAP OData error structure
          errorMessage = error.error.error.message.value;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }

      // We could use a ToastService here to display the error globally
      console.error(errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
