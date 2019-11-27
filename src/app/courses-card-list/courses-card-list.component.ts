import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Course} from '../model/course';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CheckoutService} from '../services/checkout.service';

declare const Stripe;

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

  @Input()
  courses: Course[];

  @Output()
  courseEdited = new EventEmitter();

  isLoggedIn: boolean;

  purchaseStarted = false;

  constructor(
    private dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private checkout: CheckoutService) {
  }

  ngOnInit() {

    this.afAuth.authState
      .pipe(
        map(user => !!user)
      )
      .subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);

  }

  purchaseCourse(course: Course, isLoggedIn: boolean) {

    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }

    this.purchaseStarted = true;

    this.checkout.startPurchaseCourseCheckoutSession(course.id)
      .subscribe(
        checkoutSession => {

          const stripe = Stripe(checkoutSession.stripePublicKey);

          stripe.redirectToCheckout({
            sessionId: checkoutSession.stripeCheckoutSessionId
          });
        }
      , err => {
          console.log("Error creating checkout session", err);
          this.purchaseStarted = false;
        });

  }

}









