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
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-800/50 border-b border-slate-700">
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Material Doc</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Year</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">PO Number</th>
                <th class="py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Posting Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr *ngFor="let gr of grs" class="hover:bg-slate-800/30 transition-colors group">
                <td class="py-4 px-6 text-sm font-bold text-amber-400 group-hover:text-amber-300">{{ gr.Mblnr }}</td>
                <td class="py-4 px-6 text-sm text-slate-400">{{ gr.Mjahr }}</td>
                <td class="py-4 px-6 text-sm font-medium text-blue-400 hover:underline cursor-pointer">{{ gr.Ebeln }}</td>
                <td class="py-4 px-6 text-sm text-slate-300">{{ gr.Budat | date:'mediumDate' }}</td>
              </tr>
              <tr *ngIf="grs.length === 0">
                <td colspan="4" class="py-12 text-center text-slate-500">
                  <span class="material-icons text-4xl mb-3 block opacity-50">inventory</span>
                  No Goods Receipts found
                </td>
              </tr>
            </tbody>
          </table>
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
          { Lifnr: '11', Mblnr: '5000000123', Mjahr: '2023', Ebeln: '4500000010', Budat: '2023-11-02' },
        ];
        this.isLoading = false;
      }
    });
  }
}
