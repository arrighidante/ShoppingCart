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
  goToCourse() {
    console.log('Go to course');
  }
}
