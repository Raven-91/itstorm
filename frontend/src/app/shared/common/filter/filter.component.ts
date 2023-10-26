import {Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {CategoryType} from "../../../../types/category.type";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() appliedFilters: AppliedFilterType[] = [];
  @Input() categories: CategoryType[] = [];
  @Output() onSort = new EventEmitter<{ url: string, selected: boolean }>();
  @Output() onRemove = new EventEmitter<string>();

  // Возвращаем данные по выбранной категории
  selectCategoryItem(value: string, selected: boolean): void {
    if (selected) {
      this.onSort.emit({url: value, selected: false});
    } else {
      this.onSort.emit({url: value, selected: true});
    }
  }

  // Возвращаем данные по удаленной категории
  removeSelectedCategory(value: string) {
    this.onRemove.emit(value);
  }

  // Фильтр
  sortingOpen: boolean = false;

  // Раскрываем фильтр
  private toggleSorting(): void {
    this.sortingOpen = !this.sortingOpen;
  }

  // // Закрытие фильтра при клике вне данного блока
  @ViewChild('filter') filter!: ElementRef;

  @HostListener('window:click', ['$event'])
  documentClick(event: Event) {
    if (this.filter.nativeElement.contains(event.target)) {
      this.toggleSorting();
    } else {
      this.sortingOpen = false;
    }
  }
}
