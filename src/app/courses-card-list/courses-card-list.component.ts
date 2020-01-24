import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Course} from '../model/course';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {CourseDialogComponent} from '../course-dialog/course-dialog.component';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CheckoutService} from '../services/checkout.service';

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
          alert("Please login first.");
      }

      this.purchaseStarted = true;


        this.checkout.startCourseCheckoutSession(course.id)
            .subscribe(
                session => {
                    this.checkout.redirectToCheckout(session);
                },
                err => {
                    console.log('Error creating checkout session', err);
                    this.purchaseStarted = false;
                }
            );


  }

}









