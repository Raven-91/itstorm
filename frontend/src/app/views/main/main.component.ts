import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleType} from "../../../types/article.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ArticlesService} from "../../shared/services/articles.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigationService} from "../../shared/services/navigation.service";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private articleService: ArticlesService,
    private _snackBar: MatSnackBar
  ) { }

  // Данные для слайдера на главной странице в блоке main
  mainData = [
    {
      name: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса <span class="blue-text">-15%</span>!',
      description: '',
      image: 'img1.png',
      service: 'Продвижение',
      type: 'order'
    },
    {
      name: 'Акция',
      title: 'Нужен грамотный <span class="blue-text">копирайтер?</span>',
      description: 'Весь декабрь у нас действует акция на работу копирайтера.',
      image: 'img2.png',
      service: 'Копирайтинг',
      type: 'order'
    },
    {
      name: 'Новость дня',
      title: '<span class="blue-text">6 место</span> в ТОП-10 <br> SMM-агенств Москвы!',
      description: 'Мы благодарим каждого, кто голосовал за нас!',
      image: 'img3.png',
      service: 'Продвижение',
      type: 'order'
    }
  ];

  // Данные для слайдера на главной странице в блоке services
  servicesData = [
    {
      image: 'service-img1.png',
      name: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽',
      type: 'order'
    },
    {
      image: 'service-img2.png',
      name: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽',
      type: 'order'
    },
    {
      image: 'service-img3.png',
      name: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽',
      type: 'order'
    },
    {
      image: 'service-img4.png',
      name: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 750₽',
      type: 'order'
    },
  ];

  // Слайдер для блока main
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplaySpeed: 2800,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    dotsSpeed: 2800,
    items: 1,
    margin: 10,
    navSpeed: 2800,
    slideTransition: 'linear',
    autoHeight: false,
  };

  // Слайдер для блока feedbacks
  feedbackOptions: OwlOptions = {
    loop: true,
    // autoplay: true,
    // autoplaySpeed: 2800,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    navSpeed: 2800,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      830: {
        items: 2,
        margin: 15,
      },
      1210: {
        items: 3,
        margin: 25,
      },
    },
  };

  // Популярные статьи
  articles: ArticleType[] = [];

  ngOnInit(): void {
    // Запрос на получение данных о популярных статьях
    this.articleService.getTopArticles().subscribe((data: ArticleType[] | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        this._snackBar.open('Ошибка при получении данных');
        throw new Error((data as DefaultResponseType).message);
      }
      this.articles = data as ArticleType[];
    })
  }

  // Модальное окно
  active: boolean = false;
  type: string = '';
  service: string = '';

  // Открываем модальное окно
  modalOpen(type: string, service: string): void {
    this.active = true;
    this.type = type;
    this.service = service;
  }

  // Обновляем значение active
  updateStatusActive(): void {
    this.active = false;
  }
}
