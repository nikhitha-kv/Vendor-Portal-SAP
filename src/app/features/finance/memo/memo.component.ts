import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../../core/services/finance.service';
import { VendorMemo } from '../../../core/models/vendor.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-memo',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonLoaderComponent],
  styles: [`
    .search-box {
      background: rgba(13,18,38,0.7); border: 1px solid rgba(59,130,246,0.15);
      border-radius: 10px; padding: 9px 14px 9px 38px;
      color: #e2e8f0; font-size: 13px; outline: none; width: 220px;
      transition: border-color .22s, box-shadow .22s;
    }
    .search-box:focus { border-color: rgba(99,102,241,.55); box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
    .search-box::placeholder { color: #2d3a4f; }
    
    .compact-table th { padding-top: 12px; padding-bottom: 12px; }
    .compact-table td { padding-top: 12px; padding-bottom: 12px; }
  `],
  template: `
    <div class="space-y-6 stagger">

      <!-- Header & Search -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Credit / Debit Memos</h1>
          <div class="flex items-center gap-3 mt-1">
            <p class="text-slate-500 text-sm">
              <span class="text-emerald-400 font-semibold">{{ credits.length }}</span> Credits &bull; 
              <span class="text-red-400 font-semibold">{{ debits.length }}</span> Debits
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <div class="relative">
            <span class="material-icons absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" style="font-size:16px">search</span>
            <input class="search-box" type="text" placeholder="Search Document No…"
                   [(ngModel)]="searchTerm" (input)="applyFilter()">
          </div>
          <button *ngIf="searchTerm" (click)="clearFilters()"
                  class="flex items-center gap-1 px-3 py-2 text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-lg transition-colors">
            <span class="material-icons" style="font-size:14px">close</span> Clear
          </button>
        </div>
      </div>

      <div *ngIf="isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        <app-skeleton-loader type="table" class="h-full"></app-skeleton-loader>
        <app-skeleton-loader type="table" class="h-full"></app-skeleton-loader>
      </div>

      <!-- Partitions -->
      <div *ngIf="!isLoading" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-[550px]">
        
        <!-- CREDIT PARTITION -->
        <div class="glass-panel overflow-hidden flex flex-col border-t-[3px] border-t-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.05)] transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] h-full">
          <div class="px-5 py-4 border-b border-blue-500/10 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-transparent shrink-0">
            <h2 class="text-emerald-400 font-bold tracking-wide flex items-center gap-2">
              <span class="material-icons text-emerald-400" style="font-size:20px">south_west</span> Incoming Credits
            </h2>
            <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {{ creditsTotal | number:'1.2-2' }} Total
            </span>
          </div>
          
          <div class="overflow-y-auto overflow-x-auto flex-1 custom-scrollbar">
            <table class="w-full text-left border-collapse compact-table">
              <thead class="sticky top-0 z-10 bg-[#0f1626]">
                <tr class="border-b border-blue-500/10">
                  <th class="px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors bg-[#0f1626]" (click)="sort('Belnr')">Doc No</th>
                  <th class="px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors bg-[#0f1626]" (click)="sort('Budat')">Date</th>
                  <th class="px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest text-right cursor-pointer hover:text-white transition-colors bg-[#0f1626]" (click)="sort('Dmbtr')">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let memo of paginatedCredits" class="border-b border-emerald-500/5 last:border-0 hover:bg-emerald-500/5 transition-colors">
                  <td class="px-5 font-mono font-bold text-emerald-300 text-[13px]">{{ memo.Belnr }}</td>
                  <td class="px-5 text-[13px] text-slate-400">
                    <div>{{ memo.Budat | date:'dd MMM yyyy' }}</div>
                    <div class="text-[10px] text-slate-500 mt-0.5">FY {{ memo.Gjahr }}</div>
                  </td>
                  <td class="px-5 text-[13px] font-mono text-white text-right">
                    <span class="text-emerald-400 mr-1.5">+</span>{{ memo.Dmbtr | number:'1.2-2' }} <span class="text-slate-500 text-[10px] ml-1">{{ memo.Waers }}</span>
                  </td>
                </tr>
                <tr *ngIf="credits.length === 0">
                  <td colspan="3" class="py-12 text-center">
                    <span class="material-icons text-3xl text-emerald-500/20 block mb-2">task</span>
                    <p class="text-slate-500 text-sm">No credit memos found</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Credit Pagination Footer -->
          <div class="px-5 py-3 border-t border-blue-500/10 flex justify-between items-center bg-slate-900/40 shrink-0">
            <span class="text-[11px] font-medium text-slate-500">Page {{ creditPage }} of {{ totalCreditPages || 1 }}</span>
            <div class="flex gap-2">
              <button (click)="prevCreditPage()" [disabled]="creditPage === 1" class="w-7 h-7 rounded border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-all">
                <span class="material-icons" style="font-size:16px">chevron_left</span>
              </button>
              <button (click)="nextCreditPage()" [disabled]="creditPage >= totalCreditPages" class="w-7 h-7 rounded border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-all">
                <span class="material-icons" style="font-size:16px">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <!-- DEBIT PARTITION -->
        <div class="glass-panel overflow-hidden flex flex-col border-t-[3px] border-t-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.05)] transition-all hover:shadow-[0_0_25px_rgba(239,68,68,0.1)] h-full">
          <div class="px-5 py-4 border-b border-blue-500/10 flex items-center justify-between bg-gradient-to-r from-red-500/10 to-transparent shrink-0">
            <h2 class="text-red-400 font-bold tracking-wide flex items-center gap-2">
              <span class="material-icons text-red-400" style="font-size:20px">north_east</span> Outgoing Debits
            </h2>
            <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              {{ debitsTotal | number:'1.2-2' }} Total
            </span>
          </div>
          
          <div class="overflow-y-auto overflow-x-auto flex-1 custom-scrollbar">
            <table class="w-full text-left border-collapse compact-table">
              <thead class="sticky top-0 z-10 bg-[#0f1626]">
                <tr class="border-b border-blue-500/10">
                  <th class="px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors bg-[#0f1626]" (click)="sort('Belnr')">Doc No</th>
                  <th class="px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors bg-[#0f1626]" (click)="sort('Budat')">Date</th>
                  <th class="px-5 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest text-right cursor-pointer hover:text-white transition-colors bg-[#0f1626]" (click)="sort('Dmbtr')">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let memo of paginatedDebits" class="border-b border-red-500/5 last:border-0 hover:bg-red-500/5 transition-colors">
                  <td class="px-5 font-mono font-bold text-red-300 text-[13px]">{{ memo.Belnr }}</td>
                  <td class="px-5 text-[13px] text-slate-400">
                    <div>{{ memo.Budat | date:'dd MMM yyyy' }}</div>
                    <div class="text-[10px] text-slate-500 mt-0.5">FY {{ memo.Gjahr }}</div>
                  </td>
                  <td class="px-5 text-[13px] font-mono text-white text-right">
                    <span class="text-red-400 mr-1.5">-</span>{{ memo.Dmbtr | number:'1.2-2' }} <span class="text-slate-500 text-[10px] ml-1">{{ memo.Waers }}</span>
                  </td>
                </tr>
                <tr *ngIf="debits.length === 0">
                  <td colspan="3" class="py-12 text-center">
                    <span class="material-icons text-3xl text-red-500/20 block mb-2">task</span>
                    <p class="text-slate-500 text-sm">No debit memos found</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Debit Pagination Footer -->
          <div class="px-5 py-3 border-t border-blue-500/10 flex justify-between items-center bg-slate-900/40 shrink-0">
            <span class="text-[11px] font-medium text-slate-500">Page {{ debitPage }} of {{ totalDebitPages || 1 }}</span>
            <div class="flex gap-2">
              <button (click)="prevDebitPage()" [disabled]="debitPage === 1" class="w-7 h-7 rounded border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-all">
                <span class="material-icons" style="font-size:16px">chevron_left</span>
              </button>
              <button (click)="nextDebitPage()" [disabled]="debitPage >= totalDebitPages" class="w-7 h-7 rounded border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 transition-all">
                <span class="material-icons" style="font-size:16px">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class MemoComponent implements OnInit {
  private svc = inject(FinanceService);

  isLoading = true;
  memos: VendorMemo[] = [];
  
  credits: VendorMemo[] = [];
  debits: VendorMemo[] = [];
  
  creditsTotal = 0;
  debitsTotal = 0;

  searchTerm = '';

  sortColumn: keyof VendorMemo | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  itemsPerPage = 10;
  creditPage = 1;
  debitPage = 1;

  get totalCreditPages() { return Math.ceil(this.credits.length / this.itemsPerPage); }
  get totalDebitPages() { return Math.ceil(this.debits.length / this.itemsPerPage); }

  get paginatedCredits() {
    const start = (this.creditPage - 1) * this.itemsPerPage;
    return this.credits.slice(start, start + this.itemsPerPage);
  }

  get paginatedDebits() {
    const start = (this.debitPage - 1) * this.itemsPerPage;
    return this.debits.slice(start, start + this.itemsPerPage);
  }

  nextCreditPage() { if (this.creditPage < this.totalCreditPages) this.creditPage++; }
  prevCreditPage() { if (this.creditPage > 1) this.creditPage--; }
  
  nextDebitPage() { if (this.debitPage < this.totalDebitPages) this.debitPage++; }
  prevDebitPage() { if (this.debitPage > 1) this.debitPage--; }

  ngOnInit() {
    this.svc.getMemos().subscribe({
      next: (data) => { this.memos = data; this.applyFilter(); this.isLoading = false; },
      error: () => {
        // Fallback for demonstration / offline
        this.memos = [
          { Lifnr: '100000', Belnr: '90000001', Gjahr: '2023', Budat: '2023-11-01', Dmbtr: 1500.50, Waers: 'EUR', MemoType: 'CREDIT' },
          { Lifnr: '100000', Belnr: '90000002', Gjahr: '2023', Budat: '2023-11-15', Dmbtr: 200.00, Waers: 'EUR', MemoType: 'DEBIT' },
          { Lifnr: '100000', Belnr: '90000003', Gjahr: '2024', Budat: '2024-01-10', Dmbtr: 4500.00, Waers: 'USD', MemoType: 'CREDIT' },
          { Lifnr: '100000', Belnr: '90000004', Gjahr: '2024', Budat: '2024-02-14', Dmbtr: 850.75, Waers: 'USD', MemoType: 'DEBIT' }
        ];
        this.applyFilter(); this.isLoading = false;
      }
    });
  }

  applyFilter() {
    let result = this.memos.filter(m => {
      return !this.searchTerm || m.Belnr?.toLowerCase().includes(this.searchTerm.toLowerCase());
    });

    if (this.sortColumn) {
      result.sort((a, b) => {
        let valA = a[this.sortColumn as keyof VendorMemo];
        let valB = b[this.sortColumn as keyof VendorMemo];
        
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.credits = result.filter(m => m.MemoType === 'CREDIT');
    this.debits = result.filter(m => m.MemoType === 'DEBIT');

    this.creditsTotal = this.credits.reduce((acc, curr) => acc + Number(curr.Dmbtr || 0), 0);
    this.debitsTotal = this.debits.reduce((acc, curr) => acc + Number(curr.Dmbtr || 0), 0);
    
    // Reset pagination on filter
    this.creditPage = 1;
    this.debitPage = 1;
  }

  sort(column: keyof VendorMemo) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilter();
  }

  clearFilters() { 
    this.searchTerm = ''; 
    this.sortColumn = '';
    this.applyFilter(); 
  }
}
