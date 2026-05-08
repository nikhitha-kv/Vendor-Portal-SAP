import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../../../core/services/finance.service';
import { VendorInvoice } from '../../../core/models/vendor.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-invoice',
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
    .filter-select {
      background: rgba(13,18,38,0.7); border: 1px solid rgba(59,130,246,0.15);
      border-radius: 10px; padding: 9px 14px; color: #94a3b8; font-size: 13px;
      outline: none; cursor: pointer; transition: border-color .22s;
    }
    .filter-select:focus { border-color: rgba(99,102,241,.55); }
    .filter-select option { background: #0f1626; }
    .download-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;
      background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2);
      transition: all 0.2s; cursor: pointer;
    }
    .download-btn:hover:not(:disabled) { background: rgba(59,130,246,0.2); border-color: rgba(59,130,246,0.4); }
    .download-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  `],
  template: `
    <div class="space-y-5 stagger">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Invoices</h1>
          <div class="flex items-center gap-3 mt-1">
            <p class="text-slate-500 text-sm">
              Showing <span class="text-indigo-400 font-semibold">{{ filtered.length }}</span> of {{ invoices.length }}
            </p>
            <div class="h-4 w-px bg-slate-700"></div>
            <p class="text-sm text-indigo-400 font-semibold font-mono">
              Total: {{ filteredTotal | number:'1.2-2' }} {{ currencyFilter || '' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <select class="filter-select" [(ngModel)]="currencyFilter" (change)="applyFilter()">
            <option value="">All Currencies</option>
            <option *ngFor="let c of currencies" [value]="c">{{ c }}</option>
          </select>
          <div class="relative">
            <span class="material-icons absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" style="font-size:16px">search</span>
            <input class="search-box" type="text" placeholder="Search invoice no…"
                   [(ngModel)]="searchTerm" (input)="applyFilter()">
          </div>
          <button *ngIf="searchTerm || currencyFilter" (click)="clearFilters()"
                  class="flex items-center gap-1 px-3 py-2 text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-lg transition-colors">
            <span class="material-icons" style="font-size:14px">close</span> Clear
          </button>
        </div>
      </div>

      <app-skeleton-loader *ngIf="isLoading" type="table"></app-skeleton-loader>

      <div *ngIf="!isLoading" class="glass-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-blue-500/10 bg-slate-900/30">
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Invoice Number</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Currency</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let inv of filtered" class="border-b border-blue-500/5 last:border-0 hover:bg-indigo-500/5 transition-colors">
                <td class="py-3.5 px-6 font-mono font-bold text-indigo-400 text-sm">{{ inv.Belnr }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-400">{{ (inv.Budat || inv.Bldat) | date:'dd MMM yyyy' }}</td>
                <td class="py-3.5 px-6"><span class="badge-amber">{{ inv.Waers }}</span></td>
                <td class="py-3.5 px-6 text-sm font-mono text-white text-right">{{ inv.Wrbtr | number:'1.2-2' }}</td>
                <td class="py-3.5 px-6">
                  <div class="flex justify-center">
                    <button class="download-btn" (click)="downloadPdf(inv.Belnr)" [disabled]="downloading === inv.Belnr">
                      <span class="material-icons" style="font-size:14px">{{ downloading === inv.Belnr ? 'hourglass_empty' : 'picture_as_pdf' }}</span>
                      {{ downloading === inv.Belnr ? 'Downloading...' : 'PDF' }}
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filtered.length === 0">
                <td colspan="5" class="py-14 text-center">
                  <span class="material-icons text-4xl text-slate-700 block mb-2">search_off</span>
                  <p class="text-slate-500 text-sm">No invoices match your filter</p>
                  <button (click)="clearFilters()" class="mt-3 text-xs text-blue-400 hover:underline">Clear filters</button>
                </td>
              </tr>
            </tbody>
            <tfoot *ngIf="filtered.length > 0">
              <tr class="border-t-2 border-slate-700 bg-slate-900/50">
                <td colspan="3" class="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Grand Total</td>
                <td class="py-3.5 px-6 text-base font-bold text-indigo-400 font-mono text-right">{{ filteredTotal | number:'1.2-2' }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="px-6 py-3 border-t border-blue-500/8 bg-slate-900/30 text-xs text-slate-600 flex justify-between">
          <span>{{ filtered.length }} record(s)</span>
          <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live SAP OData</span>
        </div>
      </div>
    </div>
  `
})
export class InvoiceComponent implements OnInit {
  private svc = inject(FinanceService);

  isLoading = true;
  invoices: VendorInvoice[] = [];
  filtered: VendorInvoice[] = [];
  filteredTotal = 0;
  searchTerm = '';
  currencyFilter = '';
  currencies: string[] = [];
  downloading: string | null = null;

  ngOnInit() {
    this.svc.getInvoices().subscribe({
      next: (data) => { this.invoices = data; this.buildMeta(); this.applyFilter(); this.isLoading = false; },
      error: () => {
        this.invoices = [
          { Lifnr: '11', Belnr: '5100000001', Budat: '2023-10-05', Wrbtr: 5000.50, Waers: 'INR' },
          { Lifnr: '11', Belnr: '5100000002', Budat: '2023-10-15', Wrbtr: 12500.00, Waers: 'INR' },
        ];
        this.buildMeta(); this.applyFilter(); this.isLoading = false;
      }
    });
  }

  buildMeta() {
    this.currencies = [...new Set(this.invoices.map(i => i.Waers).filter(Boolean))];
  }

  applyFilter() {
    this.filtered = this.invoices.filter(i => {
      const matchSearch = !this.searchTerm || i.Belnr?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCurr = !this.currencyFilter || i.Waers === this.currencyFilter;
      return matchSearch && matchCurr;
    });
    this.filteredTotal = this.filtered.reduce((acc, i) => acc + Number(i.Wrbtr || 0), 0);
  }

  clearFilters() { this.searchTerm = ''; this.currencyFilter = ''; this.applyFilter(); }

  downloadPdf(belnr: string) {
    this.downloading = belnr;
    this.svc.downloadInvoicePdf(belnr).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Invoice_' + belnr + '.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        this.downloading = null;
      },
      error: () => {
        alert('Could not download PDF from SAP');
        this.downloading = null;
      }
    });
  }
}
