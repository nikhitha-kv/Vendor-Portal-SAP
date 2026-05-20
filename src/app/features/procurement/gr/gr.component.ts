import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcurementService } from '../../../core/services/procurement.service';
import { VendorGR } from '../../../core/models/vendor.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-gr',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="space-y-6">
      <div class="mb-8 flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Goods Receipts</h1>
          <p class="text-slate-400 mt-1">Track delivered materials and posting dates</p>
        </div>
      </div>

      <app-skeleton-loader *ngIf="isLoading" type="table"></app-skeleton-loader>

      <div *ngIf="!isLoading" class="glass-panel overflow-hidden animate-stagger">
        <!-- Desktop Table view -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-800/50 border-b border-slate-700">
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Material Doc</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Year</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">PO Number</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Posting Date</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Material</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Item Description</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quantity</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Unit</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr *ngFor="let gr of grs" class="hover:bg-slate-800/30 transition-colors group">
                <td class="py-4 px-6 text-sm font-bold text-amber-400 group-hover:text-amber-300">{{ gr.Mblnr }}</td>
                <td class="py-4 px-6 text-sm text-slate-400">{{ gr.Mjahr }}</td>
                <td class="py-4 px-6 text-sm font-medium text-blue-400 hover:underline cursor-pointer">{{ gr.Ebeln }}</td>
                <td class="py-4 px-6 text-sm text-slate-300">{{ gr.Budat | date:'mediumDate' }}</td>
                <td class="py-4 px-6 text-sm text-slate-400 font-mono">{{ gr.Matnr || gr.MATNR || '-' }}</td>
                <td class="py-4 px-6 text-sm text-slate-300 italic">{{ gr.Txz01 || gr.TXZ01 || '-' }}</td>
                <td class="py-4 px-6 text-sm text-slate-300 font-semibold">{{ gr.Menge || gr.MENGE || '-' }}</td>
                <td class="py-4 px-6 text-sm text-slate-400">{{ gr.Meins || gr.MEINS || '' }}</td>
              </tr>
              <tr *ngIf="grs.length === 0">
                <td colspan="8" class="py-12 text-center text-slate-500">
                  <span class="material-icons text-4xl mb-3 block opacity-50">inventory</span>
                  No Goods Receipts found
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card Layout -->
        <div class="block md:hidden overflow-y-auto max-h-[500px]">
          <div class="p-4 space-y-4">
            <div *ngFor="let gr of grs" class="glass-panel p-4 space-y-3 border border-slate-700/50 hover:border-amber-500/20 transition-colors">
              <div class="flex justify-between items-center border-b border-blue-500/10 pb-2">
                <span class="font-mono font-bold text-amber-400 text-sm">{{ gr.Mblnr }}</span>
                <span class="text-xs text-slate-400">Year: {{ gr.Mjahr }}</span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p class="text-slate-500">PO Number</p>
                  <p class="text-blue-400 font-mono font-bold hover:underline cursor-pointer">{{ gr.Ebeln }}</p>
                </div>
                <div>
                  <p class="text-slate-500">Posting Date</p>
                  <p class="text-slate-300 font-medium">{{ gr.Budat | date:'mediumDate' }}</p>
                </div>
                <div>
                  <p class="text-slate-500">Material</p>
                  <p class="text-slate-300 font-mono">{{ gr.Matnr || gr.MATNR || '-' }}</p>
                </div>
                <div>
                  <p class="text-slate-500">Quantity</p>
                  <p class="text-slate-300 font-semibold">{{ gr.Menge || gr.MENGE || '-' }} {{ gr.Meins || gr.MEINS || '' }}</p>
                </div>
              </div>
              
              <div class="text-xs pt-2 border-t border-blue-500/5">
                <p class="text-slate-500">Description</p>
                <p class="text-slate-300 italic">{{ gr.Txz01 || gr.TXZ01 || '-' }}</p>
              </div>
            </div>
            
            <div *ngIf="grs.length === 0" class="py-14 text-center">
              <span class="material-icons text-4xl text-slate-700 block mb-2">inventory</span>
              <p class="text-slate-500 text-sm">No Goods Receipts found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class GrComponent implements OnInit {
  private procurementService = inject(ProcurementService);
  
  isLoading = true;
  grs: VendorGR[] = [];

  ngOnInit() {
    this.procurementService.getGoodsReceipts().subscribe({
      next: (data) => {
        this.grs = data;
        this.isLoading = false;
      },
      error: () => {
        this.grs = [
          { Lifnr: '11', Mblnr: '5000000123', Mjahr: '2023', Ebeln: '4500000010', Budat: '2023-11-02', Matnr: 'MAT-101', Txz01: 'Steel Pipes 10 inch', Menge: 100, Meins: 'PC' },
        ];
        this.isLoading = false;
      }
    });
  }
}
