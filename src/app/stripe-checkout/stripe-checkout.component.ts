import { Component, OnInit } from '@angular/core';
import {CheckoutService} from '../services/checkout.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'stripe-checkout',
  templateUrl: './stripe-checkout.component.html',
  styleUrls: ['./stripe-checkout.component.scss']
})
export class StripeCheckoutComponent implements OnInit {

  message = "Waiting for purchase to complete...";

  waiting = true;

  constructor(
    private checkout: CheckoutService,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit() {

    const result = this.route.snapshot.queryParamMap.get('purchaseResult');

    if (result == "success") {

      const ongoingPurchaseSessionId = this.route.snapshot.queryParamMap.get('ongoingPurchaseSessionId');

      this.checkout.waitForPurchaseToComplete(ongoingPurchaseSessionId)
        .subscribe(
          () => {
            this.waiting = false;
            this.message = "Purchase SUCCESSFUL, redirecting...";
            setTimeout(() => this.router.navigateByUrl("/courses"), 3000);
          });
    }
    else {
      this.waiting = false;
      this.message = "Purchase CANCELED or FAILED, redirecting...";
      setTimeout(() => this.router.navigateByUrl("/courses"), 3000);
    }

  }

}
