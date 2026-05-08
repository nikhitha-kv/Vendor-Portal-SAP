import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorService } from '../../core/services/vendor.service';
import { VendorProfile } from '../../core/models/vendor.model';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  styles: [`
    .info-item {
      background: rgba(15,23,42,0.4);
      border: 1px solid rgba(59,130,246,0.08);
      border-radius: 12px;
      padding: 14px 18px;
      transition: border-color 0.25s, background 0.25s;
    }
    .info-item:hover {
      background: rgba(15,23,42,0.6);
      border-color: rgba(59,130,246,0.18);
    }
  `],
  template: `
    <div class="space-y-6 max-w-3xl mx-auto stagger">

      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Vendor Profile</h1>
        <p class="text-slate-500 text-sm mt-1">Your company details from SAP master data</p>
      </div>

      <app-skeleton-loader *ngIf="isLoading" type="profile"></app-skeleton-loader>

      <ng-container *ngIf="!isLoading && profile">

        <!-- Hero Card -->
        <div class="glass-panel p-8 relative overflow-hidden animate-fade-in-up">
          <!-- decorative gradient -->
          <div class="absolute top-0 right-0 w-72 h-72 pointer-events-none"
               style="background: radial-gradient(circle at top right, rgba(99,102,241,0.12), transparent 70%)"></div>

          <div class="relative z-10 flex items-center gap-6">
            <!-- Avatar -->
            <div class="relative shrink-0">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.35)]">
                <span class="text-4xl font-bold text-white">{{ profile.Name1?.charAt(0) || 'V' }}</span>
              </div>
              <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <span class="material-icons text-white text-[10px]">check</span>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1">
              <h2 class="text-xl font-bold text-white">{{ profile.Name1 || 'Vendor' }}</h2>
              <div class="flex items-center gap-2 mt-1.5">
                <span class="badge-blue">SAP Vendor</span>
                <span class="badge-green">Active</span>
              </div>
              <p class="text-slate-500 text-sm mt-2 font-mono">
                <span class="material-icons text-xs text-slate-600 mr-1 align-middle">badge</span>
                {{ profile.Lifnr }}
              </p>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in-up" style="animation-delay:0.1s">

          <!-- Address -->
          <div class="glass-panel p-6 space-y-4">
            <h3 class="text-sm font-semibold text-slate-300 flex items-center gap-2 border-b border-blue-500/10 pb-3">
              <span class="material-icons text-blue-400 text-lg">location_on</span> Address Information
            </h3>
            <div class="info-item">
              <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Street</p>
              <p class="text-sm text-slate-300 font-medium">{{ profile.Street || '—' }}</p>
            </div>
            <div class="info-item">
              <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">City</p>
              <p class="text-sm text-slate-300 font-medium">{{ profile.City || '—' }}</p>
            </div>
            <div class="info-item">
              <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Country</p>
              <p class="text-sm text-slate-300 font-medium">{{ profile.Country || '—' }}</p>
            </div>
          </div>

          <!-- Business Details -->
          <div class="glass-panel p-6 space-y-4">
            <h3 class="text-sm font-semibold text-slate-300 flex items-center gap-2 border-b border-blue-500/10 pb-3">
              <span class="material-icons text-emerald-400 text-lg">business</span> Business Details
            </h3>
            <div class="info-item">
              <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Company Code</p>
              <p class="text-sm font-mono font-bold text-emerald-400">{{ profile.Company || '—' }}</p>
            </div>
            <div class="info-item">
              <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Reconciliation Account</p>
              <p class="text-sm font-mono text-slate-300">{{ profile.ReconAcc || '—' }}</p>
            </div>
            <div class="info-item">
              <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Vendor Number</p>
              <p class="text-sm font-mono text-slate-300">{{ profile.Lifnr || '—' }}</p>
            </div>
          </div>

        </div>

      </ng-container>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private vendorService = inject(VendorService);
  isLoading = true;
  profile: VendorProfile | null = null;

  ngOnInit() {
    this.vendorService.getProfile().subscribe({
      next:  (data) => { this.profile = data; this.isLoading = false; },
      error: () => {
        this.profile = { Lifnr: '0000000011', Name1: 'KaarTech Solutions', City: 'Chennai', Country: 'IN', Company: '1000', ReconAcc: '160000', Street: 'Guindy Industrial Estate' };
        this.isLoading = false;
      }
    });
  }
}
