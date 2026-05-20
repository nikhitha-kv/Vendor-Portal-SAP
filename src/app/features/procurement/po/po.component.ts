import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcurementService } from '../../../core/services/procurement.service';
import { VendorPO } from '../../../core/models/vendor.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-po',
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
  `],
  template: `
    <div class="space-y-5 stagger">

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Purchase Orders</h1>
          <div class="flex items-center gap-3 mt-1">
            <p class="text-slate-500 text-sm">
              Showing <span class="text-emerald-400 font-semibold">{{ filtered.length }}</span> of {{ pos.length }}
            </p>
            <div class="h-4 w-px bg-slate-700"></div>
            <p class="text-sm text-emerald-400 font-semibold font-mono">
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
            <input class="search-box" type="text" placeholder="Search PO number…"
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
        <!-- Desktop Table view -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-blue-500/10 bg-slate-900/30">
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">PO Number</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Currency</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest text-right">Amount</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Item Number</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Material</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Item Description</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Quantity</th>
                <th class="py-3.5 px-6 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let po of filtered" class="border-b border-blue-500/5 last:border-0 hover:bg-emerald-500/4 transition-colors">
                <td class="py-3.5 px-6 font-mono font-bold text-emerald-400 text-sm">{{ po.Ebeln }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-400">{{ po.Bedat | date:'dd MMM yyyy' }}</td>
                <td class="py-3.5 px-6"><span class="badge-amber">{{ po.Waers }}</span></td>
                <td class="py-3.5 px-6 text-sm font-mono text-white text-right">{{ po.Netwr | number:'1.2-2' }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-400 font-mono">{{ po.Ebelp || po.EBELP || '-' }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-400 font-mono">{{ po.Matnr || po.MATNR || '-' }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-300 italic">{{ po.Txz01 || po.TXZ01 || '-' }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-300 font-semibold">{{ po.Menge || po.MENGE || '-' }}</td>
                <td class="py-3.5 px-6 text-sm text-slate-400">{{ po.Meins || po.MEINS || '' }}</td>
              </tr>
              <tr *ngIf="filtered.length === 0">
                <td colspan="9" class="py-14 text-center">
                  <span class="material-icons text-4xl text-slate-700 block mb-2">search_off</span>
                  <p class="text-slate-500 text-sm">No POs match your filter</p>
                  <button (click)="clearFilters()" class="mt-3 text-xs text-blue-400 hover:underline">Clear filters</button>
                </td>
              </tr>
            </tbody>
            <tfoot *ngIf="filtered.length > 0">
              <tr class="border-t-2 border-slate-700 bg-slate-900/50">
                <td colspan="3" class="py-3.5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Grand Total</td>
                <td class="py-3.5 px-6 text-base font-bold text-emerald-400 font-mono text-right">{{ filteredTotal | number:'1.2-2' }}</td>
                <td colspan="5"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Mobile Card Layout -->
        <div class="block md:hidden overflow-y-auto max-h-[500px]">
          <div class="p-4 space-y-4">
            <div *ngFor="let po of filtered" class="glass-panel p-4 space-y-3 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
              <div class="flex justify-between items-center border-b border-blue-500/10 pb-2">
                <span class="font-mono font-bold text-emerald-400 text-sm">{{ po.Ebeln }}</span>
                <span class="badge-amber">{{ po.Waers }}</span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p class="text-slate-500">Date</p>
                  <p class="text-slate-300 font-medium">{{ po.Bedat | date:'dd MMM yyyy' }}</p>
                </div>
                <div>
                  <p class="text-slate-500">Amount</p>
                  <p class="text-slate-300 font-mono font-bold">{{ po.Netwr | number:'1.2-2' }}</p>
                </div>
                <div>
                  <p class="text-slate-500">Item Number</p>
                  <p class="text-slate-300 font-mono">{{ po.Ebelp || po.EBELP || '-' }}</p>
                </div>
                <div>
                  <p class="text-slate-500">Material</p>
                  <p class="text-slate-300 font-mono">{{ po.Matnr || po.MATNR || '-' }}</p>
                </div>
                <div>
                  <p class="text-slate-500">Quantity</p>
                  <p class="text-slate-300 font-semibold">{{ po.Menge || po.MENGE || '-' }} {{ po.Meins || po.MEINS || '' }}</p>
                </div>
              </div>
              
              <div class="text-xs pt-2 border-t border-blue-500/5">
                <p class="text-slate-500">Description</p>
                <p class="text-slate-300 italic">{{ po.Txz01 || po.TXZ01 || '-' }}</p>
              </div>
            </div>
            
            <div *ngIf="filtered.length > 0" class="glass-panel p-4 bg-slate-900/50 border border-slate-700/50 flex justify-between items-center">
              <span class="text-xs font-bold text-slate-400 uppercase">Grand Total</span>
              <span class="text-base font-bold text-emerald-400 font-mono">{{ filteredTotal | number:'1.2-2' }}</span>
            </div>

            <div *ngIf="filtered.length === 0" class="py-14 text-center">
              <span class="material-icons text-4xl text-slate-700 block mb-2">search_off</span>
              <p class="text-slate-500 text-sm">No POs match your filter</p>
              <button (click)="clearFilters()" class="mt-3 text-xs text-blue-400 hover:underline">Clear filters</button>
            </div>
          </div>
        </div>

        <div class="px-6 py-3 border-t border-blue-500/8 bg-slate-900/30 text-xs text-slate-600 flex justify-between">
          <span>{{ filtered.length }} record(s)</span>
          <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Live SAP OData</span>
        </div>
      </div>

    </div>
  `
})
export class PoComponent implements OnInit {
  private svc = inject(ProcurementService);

  isLoading = true;
  pos: VendorPO[] = [];
  filtered: VendorPO[] = [];
  filteredTotal = 0;
  searchTerm = '';
  currencyFilter = '';
  currencies: string[] = [];

  ngOnInit() {
    this.svc.getPurchaseOrders().subscribe({
      next: (data) => { this.pos = data; this.buildMeta(); this.applyFilter(); this.isLoading = false; },
      error: () => {
        this.pos = [
          { Lifnr: '11', Ebeln: '4500000010', Bedat: '2023-11-01', Netwr: 5000.50, Waers: 'INR', Ebelp: '00010', Matnr: 'MAT-101', Txz01: 'Steel Pipes 10 inch', Menge: 100, Meins: 'PC' },
          { Lifnr: '11', Ebeln: '4500000011', Bedat: '2023-11-05', Netwr: 12500.00, Waers: 'INR', Ebelp: '00020', Matnr: 'MAT-202', Txz01: 'Copper Wires 50m', Menge: 50, Meins: 'ROL' },
          { Lifnr: '11', Ebeln: '4500000012', Bedat: '2023-11-10', Netwr: 3200.00, Waers: 'USD', Ebelp: '00010', Matnr: 'MAT-303', Txz01: 'Valve Fittings 2cm', Menge: 250, Meins: 'PC' },
        ];
        this.buildMeta(); this.applyFilter(); this.isLoading = false;
      }
    });
  }

  buildMeta() {
    this.currencies = [...new Set(this.pos.map(p => p.Waers).filter(Boolean))];
  }

  applyFilter() {
    this.filtered = this.pos.filter(p => {
      const matchSearch = !this.searchTerm || p.Ebeln?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCurr = !this.currencyFilter || p.Waers === this.currencyFilter;
      return matchSearch && matchCurr;
    });
    this.filteredTotal = this.filtered.reduce((acc, p) => acc + Number(p.Netwr || 0), 0);
  }

  clearFilters() { this.searchTerm = ''; this.currencyFilter = ''; this.applyFilter(); }
}
