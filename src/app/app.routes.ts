import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'procurement',
        children: [
          { path: 'rfq', loadComponent: () => import('./features/procurement/rfq/rfq.component').then(m => m.RfqComponent) },
          { path: 'po', loadComponent: () => import('./features/procurement/po/po.component').then(m => m.PoComponent) },
          { path: 'gr', loadComponent: () => import('./features/procurement/gr/gr.component').then(m => m.GrComponent) }
        ]
      },
      {
        path: 'finance',
        children: [
          { path: 'invoices', loadComponent: () => import('./features/finance/invoice/invoice.component').then(m => m.InvoiceComponent) },
          { path: 'payments', loadComponent: () => import('./features/finance/payment/payment.component').then(m => m.PaymentComponent) },
          { path: 'aging', loadComponent: () => import('./features/finance/aging/aging.component').then(m => m.AgingComponent) },
          { path: 'memo', loadComponent: () => import('./features/finance/memo/memo.component').then(m => m.MemoComponent) }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
