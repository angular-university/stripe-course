import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CoursesService} from '../services/courses.service';
import {CheckoutService} from '../services/checkout.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    courses$: Observable<Course[]>;

    beginnersCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;

    processingOngoing = false;

    constructor(
      private coursesService: CoursesService,
      private checkout: CheckoutService) {

    }

    ngOnInit() {

        this.reloadCourses();

    }

    reloadCourses() {

        this.courses$ = this.coursesService.loadAllCourses();

        this.beginnersCourses$ = this.courses$.pipe(
            map(courses => courses.filter(
                course => course.categories.includes("BEGINNER"))));

        this.advancedCourses$ = this.courses$.pipe(
            map(courses => courses.filter(
                course => course.categories.includes("ADVANCED"))));
    }


  subscribeToPlan() {
        this.checkout.startSubscriptionCheckoutSession("STRIPE_MONTHLY")
            .subscribe(
                session => this.checkout.redirectToCheckout(session),
                err => {
                    console.log("Error creating checkout session", err);
                    this.processingOngoing = false;
                }
            );
  }

}
