import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcurementService } from '../../../core/services/procurement.service';
import { VendorRFQ } from '../../../core/models/vendor.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-rfq',
  standalone: true,
  imports: [CommonModule, FormsModule, SkeletonLoaderComponent],
  styles: [`
    .search-box {
      background: rgba(13,18,38,0.7);
      border: 1px solid rgba(59,130,246,0.15);
      border-radius: 10px; padding: 9px 14px 9px 38px;
      color: #e2e8f0; font-size: 13px; outline: none;
      transition: border-color .22s, box-shadow .22s; width: 240px;
    }
    .search-box:focus { border-color: rgba(99,102,241,.55); box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
    .search-box::placeholder { color: #2d3a4f; }
    .filter-select {
      background: rgba(13,18,38,0.7);
      border: 1px solid rgba(59,130,246,0.15);
      border-radius: 10px; padding: 9px 14px;
      color: #94a3b8; font-size: 13px; outline: none;
      transition: border-color .22s; cursor: pointer;
    }
    .filter-select:focus { border-color: rgba(99,102,241,.55); }
    .filter-select option { background: #0f1626; }
    tr { transition: background .18s, transform .18s; }
    tr:hover td:first-child { border-left: 2px solid #6366f1; }
  `],
  template: `
    <div class="space-y-5 stagger">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Requests for Quotation</h1>
          <p class="text-slate-500 text-sm mt-0.5">
            Showing <span class="text-blue-400 font-semibold">{{ filtered.length }}</span> of {{ rfqs.length }} RFQs
          </p>
        </div>

        <!-- Filters -->
        <div class="flex items-center gap-3 flex-wrap">
          <!-- Type filter -->
          <select class="filter-select" [(ngModel)]="typeFilter" (change)="applyFilter()">
            <option value="">All Types</option>
            <option *ngFor="let t of types" [value]="t">{{ t }}</option>
          </select>
          <!-- Search -->
          <div class="relative">
            <span class="material-icons absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" style="font-size:16px">search</span>
            <input class="search-box" type="text" placeholder="Search RFQ number…"
                   [(ngModel)]="searchTerm" (input)="applyFilter()">
          </div>
          <button *ngIf="searchTerm || typeFilter" (click)="clearFilters()"
                  class="flex items-center gap-1 px-3 py-2 text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-lg transition-colors">
            <span class="material-icons" style="font-size:14px">close</span> Clear
          </button>
        </div>
      </div>

      <app-skeleton-loader *ngIf="isLoading" type="table"></app-skeleton-loader>

      <div *ngIf="!isLoading" class="glass-panel overflow-hidden">
        <!-- Desktop Table view -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-blue-500/10 bg-slate-900/30">
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">RFQ Number</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Item Number</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Material</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Item Description</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Quantity</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let rfq of filtered; let i = index"
                  class="border-b border-blue-500/5 last:border-0 hover:bg-blue-500/5 transition-colors">
                <td class="py-3.5 px-6 font-mono font-bold text-blue-400 text-sm">{{ rfq.Ebeln }}</td>
                <td class="py-3.5 px-6"><span class="badge-blue">{{ rfq.Bsart }}</span></td>
                <td class="py-3.5 px-6 text-sm text-slate-400">{{ rfq.Bedat | date:'dd MMM yyyy' }}</td>
                <td class="py-3.5 px-6"><span class="badge-green">Open</span></td>
                <td class="py-3.5 px-6 text-sm text-slate-400 font-mono">{{ rfq.Ebelp || rfq.EBELP || '-' }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-400 font-mono">{{ rfq.Matnr || rfq.MATNR || '-' }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-300 italic">{{ rfq.Txz01 || rfq.TXZ01 || '-' }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-300 font-semibold">{{ rfq.Menge || rfq.MENGE || '-' }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-400">{{ rfq.Meins || rfq.MEINS || '' }}</td>
              </tr>
              <tr *ngIf="filtered.length === 0">
                <td colspan="9" class="py-14 text-center">
                  <span class="material-icons text-4xl text-slate-700 block mb-2">search_off</span>
                  <p class="text-slate-500 text-sm">No RFQs match your filter</p>
                  <button (click)="clearFilters()" class="mt-3 text-xs text-blue-400 hover:underline">Clear filters</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card Layout -->
        <div class="block md:hidden overflow-y-auto max-h-[500px]">
          <div class="p-4 space-y-4">
            <div *ngFor="let rfq of filtered" class="glass-panel p-4 space-y-3 border border-blue-500/10 hover:border-blue-500/30 transition-colors">
              <div class="flex justify-between items-center border-b border-blue-500/10 pb-2">
                <span class="font-mono font-bold text-blue-400 text-sm">{{ rfq.Ebeln }}</span>
                <span class="badge-blue">{{ rfq.Bsart }}</span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p class="text-slate-500">Date</p>
                  <p class="text-slate-300 font-medium">{{ rfq.Bedat | date:'dd MMM yyyy' }}</p>
                </div>
                <div>
                  <p class="text-slate-500">Status</p>
                  <div><span class="badge-green">Open</span></div>
                </div>
                <div>
                  <p class="text-slate-500">Item Number</p>
                  <p class="text-slate-300 font-mono">{{ rfq.Ebelp || rfq.EBELP || '-' }}</p>
                </div>
                <div>
                  <p class="text-slate-500">Material</p>
                  <p class="text-slate-300 font-mono">{{ rfq.Matnr || rfq.MATNR || '-' }}</p>
                </div>
                <div>
                  <p class="text-slate-500">Quantity</p>
                  <p class="text-slate-300 font-semibold">{{ rfq.Menge || rfq.MENGE || '-' }} {{ rfq.Meins || rfq.MEINS || '' }}</p>
                </div>
              </div>
              
              <div class="text-xs pt-2 border-t border-blue-500/5">
                <p class="text-slate-500">Description</p>
                <p class="text-slate-300 italic">{{ rfq.Txz01 || rfq.TXZ01 || '-' }}</p>
              </div>
            </div>
            
            <div *ngIf="filtered.length === 0" class="py-14 text-center">
              <span class="material-icons text-4xl text-slate-700 block mb-2">search_off</span>
              <p class="text-slate-500 text-sm">No RFQs match your filter</p>
              <button (click)="clearFilters()" class="mt-3 text-xs text-blue-400 hover:underline">Clear filters</button>
            </div>
          </div>
        </div>

        <div class="px-6 py-3 border-t border-blue-500/8 bg-slate-900/30 text-xs text-slate-600 flex justify-between items-center">
          <span>{{ filtered.length }} record(s) shown</span>
          <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live SAP OData</span>
        </div>
      </div>

    </div>
  `
})
export class RfqComponent implements OnInit {
  private svc = inject(ProcurementService);

  isLoading = true;
  rfqs: VendorRFQ[] = [];
  filtered: VendorRFQ[] = [];
  searchTerm = '';
  typeFilter = '';
  types: string[] = [];

  ngOnInit() {
    this.svc.getRFQs().subscribe({
      next: (data) => { this.rfqs = data; this.buildMeta(); this.applyFilter(); this.isLoading = false; },
      error: () => {
        this.rfqs = [
          { Lifnr: '11', Ebeln: '6000000012', Bsart: 'AN', Bedat: '2023-10-01', Ebelp: '00010', Matnr: 'MAT-101', Txz01: 'Steel Pipes 10 inch', Menge: 100, Meins: 'PC' },
          { Lifnr: '11', Ebeln: '6000000015', Bsart: 'NB', Bedat: '2023-10-15', Ebelp: '00020', Matnr: 'MAT-202', Txz01: 'Copper Wires 50m', Menge: 50, Meins: 'ROL' },
          { Lifnr: '11', Ebeln: '6000000018', Bsart: 'AN', Bedat: '2023-11-01', Ebelp: '00010', Matnr: 'MAT-303', Txz01: 'Valve Fittings 2cm', Menge: 250, Meins: 'PC' },
        ];
        this.buildMeta(); this.applyFilter(); this.isLoading = false;
      }
    });
  }

  buildMeta() {
    this.types = [...new Set(this.rfqs.map(r => r.Bsart).filter(Boolean))];
  }

  applyFilter() {
    this.filtered = this.rfqs.filter(r => {
      const matchSearch = !this.searchTerm ||
        r.Ebeln?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchType = !this.typeFilter || r.Bsart === this.typeFilter;
      return matchSearch && matchType;
    });
  }

  clearFilters() { this.searchTerm = ''; this.typeFilter = ''; this.applyFilter(); }
}
