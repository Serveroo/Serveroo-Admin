import {Injectable} from "@angular/core";
import Stripe from "stripe";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StripeAPI {
  private stripe = new Stripe(environment.stripe_api_key);
  constructor() {
  }

  getListCustomersWithMail(mail: string) {
    return this.stripe.customers.list({email: mail});
  }

  getInvoice(invoiceId: string) {
    return this.stripe.invoices.retrieve(invoiceId);
  }

  cancelSubscription(subscriptionId: string) {
    return this.stripe.subscriptions.cancel(subscriptionId);
  }
}
