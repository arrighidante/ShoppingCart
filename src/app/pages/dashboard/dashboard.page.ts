import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Course } from "@interfaces/course.interface";
import { IonicModule } from "@ionic/angular";
import { CourseCardComponent } from "@shared/components/course-card/course-card.component";
import { CoursesService } from "app/data/courses.service";
import { addIcons } from "ionicons";
import { chevronBackOutline, chevronForwardOutline, refreshOutline } from "ionicons/icons";

@Component({
  selector: "app-home",
  templateUrl: "dashboard.page.html",
  styleUrls: ["dashboard.page.scss"],
  standalone: true,
  imports: [RouterModule, CommonModule, IonicModule, CourseCardComponent],
})
export class DashboardPage {
  // DATA
  _coursesService = inject(CoursesService);

  // CONSTANTS
  SORTING_OPTIONS = [
    { label: "Price: Low to High", value: "lowFirst" },
    { label: "Price: High to Low", value: "highFirst" },
  ];

  // VARIABLES AND SIGNALS
  currentPageIndex = signal(0);
  visibleCourses = signal(4);
  searchTerm = signal("");
  selectedSort = signal<any>(null);

  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline, refreshOutline });
  }

  filteredCourses = computed(() => {
    const lowerCasedSearchTerm = this.searchTerm().toLowerCase();
    return this._coursesService
      .courses()
      .filter(
        (course) =>
          course.courseName.toLowerCase().includes(lowerCasedSearchTerm) ||
          course.author.toLowerCase().includes(lowerCasedSearchTerm) ||
          course.tags.some((tag) => tag.toLowerCase().includes(lowerCasedSearchTerm))
      );
  });

  sortChanged = effect(
    () => {
      if (this.selectedSort() === "lowFirst") {
        this._coursesService.courses.update((prev) => prev.sort((a, b) => this.getFinalPrice(a) - this.getFinalPrice(b)));
      } else {
        this._coursesService.courses.update((prev) => prev.sort((a, b) => this.getFinalPrice(b) - this.getFinalPrice(a)));
      }
    },
    { allowSignalWrites: true }
  );

  coursesToShow = computed(() => {
    const start = this.currentPageIndex() * this.visibleCourses();
    const end = start + this.visibleCourses();
    const filteredCourses = this.filteredCourses();

    if (this.selectedSort()) {
      switch (this.selectedSort()) {
        case "lowFirst":
          return filteredCourses.sort((a, b) => this.getFinalPrice(a) - this.getFinalPrice(b)).slice(start, end);
        case "highFirst":
          return filteredCourses.sort((a, b) => this.getFinalPrice(b) - this.getFinalPrice(a)).slice(start, end);
      }
    }

    return filteredCourses.slice(start, end);
  });

  getFinalPrice(course: Course): number {
    const cleanNumber = (value: string): number => parseFloat(value.replace(/[^0-9.]/g, ""));

    const actualPrice = cleanNumber(course.actualPrice);
    const discount = cleanNumber(course.discountPercentage);

    const discountedPrice = actualPrice - actualPrice * (discount / 100);
    return discount > 0 ? discountedPrice : actualPrice;
  }

  nextPage() {
    const nextPageIndex = this.currentPageIndex() + 1;
    const nextCoursesStartIndex = nextPageIndex * this.visibleCourses();

    if (nextCoursesStartIndex < this.filteredCourses().length) {
      this.currentPageIndex.set(nextPageIndex);
    }
  }

  previousPage() {
    this.currentPageIndex() > 0 ? this.currentPageIndex.update((prev) => prev - 1) : 0;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm.set(filterValue);
  }

  handleSortChanged(event: Event) {
    const selectedSort = (event.target as HTMLSelectElement).value;
    this.selectedSort.set(selectedSort);
  }

  visibleCoursesChanged(event: Event) {
    const selectedQty = Number((event.target as HTMLInputElement).value);
    this.visibleCourses.set(selectedQty);
  }

  resetSearch() {
    this.searchTerm.set("");
    this.visibleCourses.set(4);
    this.selectedSort.set(null);
  }
}
