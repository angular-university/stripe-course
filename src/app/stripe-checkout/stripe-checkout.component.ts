import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'stripe-checkout',
  templateUrl: './stripe-checkout.component.html',
  styleUrls: ['./stripe-checkout.component.scss']
})
export class StripeCheckoutComponent implements OnInit {

  message = "Waiting for purchase to complete...";

  constructor() {

  }

  ngOnInit() {


  }

}
