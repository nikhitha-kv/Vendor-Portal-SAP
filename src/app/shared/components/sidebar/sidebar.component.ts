import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

interface NavSection {
  title: string;
  icon: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  styles: [`
    :host { display: block; }

    aside {
      width: 260px;
      min-height: 100vh;
      background: linear-gradient(180deg, #060c1e 0%, #080e22 60%, #040a18 100%);
      border-right: 1px solid rgba(59,130,246,0.1);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0; top: 0;
      z-index: 40;
      overflow: hidden;
    }

    /* Glow orb inside sidebar */
    aside::before {
      content: '';
      position: absolute;
      top: -100px; left: -100px;
      width: 350px; height: 350px;
      background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .brand {
      padding: 22px 20px;
      border-bottom: 1px solid rgba(59,130,246,0.08);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 40px; height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 1.25rem; color: white;
      box-shadow: 0 0 20px rgba(99,102,241,0.4);
      flex-shrink: 0;
    }

    nav {
      flex: 1;
      overflow-y: auto;
      padding: 16px 12px;
    }

    .section-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      color: rgba(100,116,139,0.7);
      text-transform: uppercase;
      padding: 12px 12px 6px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 10px 14px;
      border-radius: 10px;
      color: #64748b;
      font-size: 13.5px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.22s cubic-bezier(0.4,0,0.2,1);
      position: relative;
      border: 1px solid transparent;
      margin-bottom: 2px;
    }
    .nav-link:hover {
      background: rgba(59,130,246,0.07);
      color: #94a3b8;
      border-color: rgba(59,130,246,0.1);
      transform: translateX(3px);
    }
    .nav-link.active {
      background: rgba(59,130,246,0.12);
      color: #93c5fd;
      border-color: rgba(59,130,246,0.2);
      box-shadow: 0 0 15px rgba(59,130,246,0.1);
    }
    .nav-link.active .nav-icon {
      color: #60a5fa;
    }
    .nav-link.active::before {
      content: '';
      position: absolute;
      left: 0; top: 25%; bottom: 25%;
      width: 3px;
      background: linear-gradient(180deg, #3b82f6, #6366f1);
      border-radius: 0 3px 3px 0;
    }

    .nav-icon {
      font-size: 18px !important;
      transition: color 0.22s;
    }

    .footer {
      padding: 14px 12px;
      border-top: 1px solid rgba(59,130,246,0.08);
    }
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 14px;
      border-radius: 10px;
      color: #64748b;
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.22s;
    }
    .logout-btn:hover {
      background: rgba(239,68,68,0.08);
      border-color: rgba(239,68,68,0.18);
      color: #f87171;
      transform: translateX(3px);
    }
  `],
  template: `
    <aside class="animate-slide-in-left">
      <!-- Brand -->
      <div class="brand">
        <div class="brand-logo">K</div>
        <div>
          <p class="text-white font-bold text-sm leading-tight">KaarTech</p>
          <p class="text-slate-500 text-[11px] font-medium">Vendor Portal</p>
        </div>
      </div>

      <!-- Nav -->
      <nav>
        <!-- Dashboard -->
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"
           class="nav-link" id="nav-dashboard">
          <span class="material-icons nav-icon">dashboard</span>
          <span>Dashboard</span>
        </a>

        <div class="section-label">Procurement</div>
        <a routerLink="/procurement/rfq"  routerLinkActive="active" class="nav-link" id="nav-rfq">
          <span class="material-icons nav-icon">assignment</span>
          <span>RFQ</span>
        </a>
        <a routerLink="/procurement/po"   routerLinkActive="active" class="nav-link" id="nav-po">
          <span class="material-icons nav-icon">shopping_cart</span>
          <span>Purchase Orders</span>
        </a>
        <a routerLink="/procurement/gr"   routerLinkActive="active" class="nav-link" id="nav-gr">
          <span class="material-icons nav-icon">inventory_2</span>
          <span>Goods Receipts</span>
        </a>

        <div class="section-label">Financials</div>
        <a routerLink="/finance/invoices" routerLinkActive="active" class="nav-link" id="nav-invoices">
          <span class="material-icons nav-icon">receipt_long</span>
          <span>Invoices</span>
        </a>
        <a routerLink="/finance/payments" routerLinkActive="active" class="nav-link" id="nav-payments">
          <span class="material-icons nav-icon">payments</span>
          <span>Payments</span>
        </a>
        <a routerLink="/finance/aging"    routerLinkActive="active" class="nav-link" id="nav-aging">
          <span class="material-icons nav-icon">pie_chart</span>
          <span>Aging Analysis</span>
        </a>
        <a routerLink="/finance/memo"     routerLinkActive="active" class="nav-link" id="nav-memo">
          <span class="material-icons nav-icon">account_balance_wallet</span>
          <span>Credit/Debit Memo</span>
        </a>

        <div class="section-label">Account</div>
        <a routerLink="/profile" routerLinkActive="active" class="nav-link" id="nav-profile">
          <span class="material-icons nav-icon">person</span>
          <span>Vendor Profile</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="footer">
        <button class="logout-btn" (click)="logout()" id="logoutBtn">
          <span class="material-icons" style="font-size:18px">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  auth = inject(AuthService);
  logout() { this.auth.logout(); }
}
