import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {CourseComponent} from "./course/course.component";
import {CourseResolver} from "./services/course.resolver";
import {LoginComponent} from './login/login.component';
import {StripeCheckoutComponent} from './stripe-checkout/stripe-checkout.component';

const routes: Routes = [
    {
        path: "",
        component: HomeComponent

    },
    {
        path: "about",
        component: AboutComponent
    },
    {
      path: "login",
      component: LoginComponent
    },
    {
        path: 'courses/:courseUrl',
        component: CourseComponent,
        resolve: {
            course: CourseResolver
        }
    },
    {
      path:"stripe-checkout",
      component: StripeCheckoutComponent
    },
    {
        path: "**",
        redirectTo: '/'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
