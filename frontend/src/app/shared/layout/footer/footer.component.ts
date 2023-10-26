import {Component} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  // Модальное окно
  active: boolean = false;
  type: string = 'consultation';

  // Открываем модальное окно
  modalOpen(): void {
    this.active = true;
  }

  // Обновляем значение active
  updateStatusActive(): void {
    this.active = false;
  }

}
