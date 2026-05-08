import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  styles: [`
    .header-bar {
      height: 64px;
      background: rgba(5, 9, 20, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(59,130,246,0.1);
    }
    .vendor-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 14px 6px 6px;
      border-radius: 9999px;
      background: rgba(59,130,246,0.08);
      border: 1px solid rgba(59,130,246,0.15);
      transition: all 0.25s;
      cursor: default;
    }
    .vendor-chip:hover {
      background: rgba(59,130,246,0.14);
      border-color: rgba(99,102,241,0.3);
    }
    .avatar {
      width: 34px; height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 12px rgba(99,102,241,0.4);
    }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 6px #34d399;
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,100%{ opacity:1; transform:scale(1); }
      50%    { opacity:.6; transform:scale(1.3); }
    }
  `],
  template: `
    <header class="header-bar flex items-center justify-between px-6 sticky top-0 z-30">

      <!-- Left: Page context breadcrumb placeholder -->
      <div class="flex items-center gap-3">
        <div class="flex gap-1.5">
          <div class="w-2 h-2 rounded-full bg-blue-500/50 animate-pulse"></div>
          <div class="w-2 h-2 rounded-full bg-indigo-500/50 animate-pulse" style="animation-delay:0.3s"></div>
          <div class="w-2 h-2 rounded-full bg-violet-500/50 animate-pulse" style="animation-delay:0.6s"></div>
        </div>
        <span class="text-slate-500 text-xs font-medium tracking-widest uppercase">KaarTech Vendor Portal</span>
      </div>

      <!-- Right: Vendor Info Chip & Logout -->
      <div class="flex items-center gap-4">
        <div class="vendor-chip">
          <div class="avatar">
            <span class="material-icons text-white text-sm">business</span>
          </div>
          <div>
            <p class="text-xs font-semibold text-white leading-tight">Vendor {{ lifnr }}</p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <div class="status-dot"></div>
              <p class="text-[10px] text-emerald-400 font-medium">Active Session</p>
            </div>
          </div>
        </div>
        
        <button (click)="logout()" class="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.05)] hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]" title="Logout">
          <span class="material-icons" style="font-size: 18px; margin-left: 2px">logout</span>
        </button>
      </div>

    </header>
  `
})
export class HeaderComponent {
  private auth = inject(AuthService);
  lifnr = this.auth.getLifnr();

  logout() {
    this.auth.logout();
  }
}
