import { Component, OnInit } from '@angular/core';
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
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit() {

  }

}
