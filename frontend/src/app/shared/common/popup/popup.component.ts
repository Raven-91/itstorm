import {
  AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges,
  Output, Renderer2, SimpleChanges, ViewChild
} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {TypeOrderType} from "../../../../types/type-order.type";
import {OrderType} from "../../../../types/order.type";
import {OrderService} from "../../services/order.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnChanges, AfterViewInit {

  @Input() active: boolean = false;
  @Input() type: string = '';
  @Input() service: string = '';
  @Output() onChanged: EventEmitter<boolean> = new EventEmitter;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private orderService: OrderService,
    private _snackBar: MatSnackBar) {
    // Закрытие секции c опциями к select по клику вне данного блока
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target !== this.selectOptions.nativeElement && e.target !== this.select.nativeElement) {
        this.openSelect = false;
      }
    });
  }

  // Закрытие popup при клике вне данного блока
  @ViewChild('popupWrapper') popupWrapper!: ElementRef;

  @HostListener('document:click', ['$event'])
  documentClick(event: Event) {
    if (this.popupWrapper.nativeElement.contains(event.target)) {
      if ((event.target as HTMLElement).classList.contains('popup')) {
        this.modalClose();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Присваиваем полученные значения из родительского компонента в форму
    if (this.type) this.orderForm.get('type')?.setValue(this.type);
    if (this.service) {
      this.orderForm.get('service')?.setValidators(Validators.required);
      this.orderForm.get('service')?.setValue(this.service);
    } else {
      this.orderForm.get('service')?.clearValidators();
    }
  }

  // Форма заказа услуги
  orderForm = this.fb.group({
    service: [''],
    name: ['', [Validators.required, Validators.pattern(/^([А-ЯЁ][а-яё]+)?( [А-ЯЁ][а-яё]+){0,3}$/)]],
    phone: ['', [Validators.required, Validators.pattern(/[0-9]/)]],
    type: ['', Validators.required]
  });


  // Закрываем модальное окно
  modalClose(): void {
    this.active = false;
    this.onChanged.emit(this.active);
    if (this.successMessageOpen || this.errorMessageOpen) {
      this.successMessageOpen = false;
      this.errorMessageOpen = false;
    }
    this.orderForm.reset();
  }

  // Опции по предлагаемым услугам для select
  options: string[] = [
    'Создание сайтов', 'Продвижение', 'Реклама', 'Копирайтинг'
  ];

  openSelect: boolean = false;
  @ViewChild('selectOptions') selectOptions!: ElementRef;
  @ViewChild('select') select!: ElementRef;


  ngAfterViewInit(): void {
    // Открываем секцию с опциями к select
    let select = this.renderer.selectRootElement('#select');
    this.renderer.listen(select, "focus", (): void => {
      this.openSelect = true;
    });
  }

  // Выбор опции/услуги из секции с опциями к select
  selectOption(event: Event): void {
    if (event.target && (event.target as HTMLElement).classList.contains('form-item__option')) {
      this.orderForm.get('service')?.setValue((event.target as HTMLElement).innerHTML);
      this.openSelect = false;
    }
  }

  // error message
  errorMessageOpen: boolean = false;
  successMessageOpen: boolean = false;

  sendRequest(): void {
    if (this.orderForm.valid && this.orderForm.value.name && this.orderForm.value.phone && this.orderForm.value.type) {

      let paramsObject: OrderType = {
        name: '',
        phone: '',
        type: '',
        service: '',
      }

      if (this.orderForm.value.type === TypeOrderType.order && this.orderForm.value.service) {
        paramsObject = {
          name: this.orderForm.value.name,
          phone: this.orderForm.value.phone,
          type: this.orderForm.value.type,
          service: this.orderForm.value.service
        }
      }

      if (this.orderForm.value.type === TypeOrderType.consultation) {
        paramsObject = {
          name: this.orderForm.value.name,
          phone: this.orderForm.value.phone,
          type: this.orderForm.value.type,
        }
      }

      this.orderService.sendOrder(paramsObject).subscribe({
        next: (data: DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            if ((data as DefaultResponseType).error) {
              this.errorMessageOpen = true;
              this._snackBar.open((data as DefaultResponseType).message);
            } else if (!(data as DefaultResponseType).error) {
              this.active = false;
              this.successMessageOpen = true;
            }
          }
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          }
        }
      });
    }
  };
}
