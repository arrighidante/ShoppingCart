import { Component, Input } from '@angular/core';
import { Course } from '@interfaces/course.interface';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowRedoOutline,
  cartOutline,
  eyeOutline,
  star,
  starOutline,
} from 'ionicons/icons';

const CURRENCY_SYMBOL = '₹';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class CourseCardComponent {
  @Input() course!: Course;
  constructor() {
    addIcons({
      starOutline,
      star,
      cartOutline,
      eyeOutline,
      arrowRedoOutline,
    });
  }

  cleanNumber(value: string): number {
    return parseFloat(value.replace(/[^0-9.]/g, ''));
  }

  get prizeToShow() {
    const actualPrize = this.cleanNumber(this.course.actualPrice);
    const discount = this.cleanNumber(this.course.discountPercentage);

    if (discount > 0) {
      const discountedPrize = actualPrize - actualPrize * (discount / 100);
      return `${CURRENCY_SYMBOL}${discountedPrize.toFixed(2)}`;
    } else {
      return this.course.actualPrice;
    }
  }

  goToCourse() {
    console.log('Go to course');
  }
}
