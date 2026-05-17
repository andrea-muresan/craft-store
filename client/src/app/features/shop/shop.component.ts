import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/modules/product';
import { ProductItemComponent } from "./product-item/product-item.component";
import {MatDialog} from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ShopParams } from '../../shared/modules/shopParams';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Pagination } from '../../shared/modules/pagination';
import { FormsModule } from '@angular/forms';
import { LucideSearch, LucideArrowUpDown, LucideChevronDown, LucideSlidersHorizontal, LucideChevronLeft, LucideChevronRight } from '@lucide/angular';


@Component({
  selector: 'app-shop',
  imports: [
    ProductItemComponent,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    FormsModule,
    LucideSearch,
    LucideArrowUpDown,
    LucideChevronDown,
    LucideSlidersHorizontal,
    LucideChevronLeft,
    LucideChevronRight,
    MatPaginator
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  products?: Pagination<Product>;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low-High', value: 'priceAsc'},
    {name: 'Price: High-Low', value: 'priceDesc'},
  ]
  shopParams = new ShopParams();
  pageSizeOptions = [4, 8, 12, 16];

  protected readonly Math = Math;

  ngOnInit(): void {
    this.initializeShop();
  }

  initializeShop() {
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => this.products = response,
      error: error => console.log(error)
    });
  }

  onSearchChange() {
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  handlePageEvent(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  handlePageSizeChange(event: MatSelectionListChange) {
    const selectedSize = event.options[0];
    
    if (selectedSize && selectedSize.value != this.shopParams.pageSize) {
      this.shopParams.pageSize = selectedSize.value;
      this.shopParams.pageNumber = 1;
      
      this.getProducts();
    }
  }

  get totalPages(): number {
    if (!this.products || !this.products.count) return 0;
    return Math.ceil(this.products.count / this.shopParams.pageSize);
  }


  onSortChange(event: MatSelectionListChange) {
    const selectedOption = event.options[0];

    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  openFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, { 
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          console.log(result);
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          this.getProducts();
        }
      }
    })
  }
}
