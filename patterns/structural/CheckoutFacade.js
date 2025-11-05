import { InventoryService } from "../../services/InventoryService.js";
import { PaymentService } from "../../services/PaymentService.js";
import { ShippingService } from "../../services/ShippingService.js";

class CheckoutFacade {
  constructor() {
    this.inventoryService = new InventoryService();
    this.paymentService = new PaymentService();
    this.shippingService = new ShippingService();
  }

  placeOrder(orderDetails) {
    // 1. Check if all products are in stock using `inventoryService.checkStock()`.
    const inStock = this.inventoryService.checkStock(orderDetails.productIds);
    if (!inStock) {
      console.log("[Checkout] Not enough stock for products");
      return;
    }

    // 2. If they are, process the payment using `paymentService.processPayment()`.
    const paymentSuccessful = this.paymentService.processPayment(
      orderDetails.userId,
      orderDetails.amount
    );
    if (!paymentSuccessful) {
      console.log("[Checkout] Payment failed");
      return;
    }

    // 3. If payment is successful, arrange shipping using `shippingService.arrangeShipping()`.
    const shippingResult = this.shippingService.arrangeShipping(
      orderDetails.userId,
      orderDetails.shippingInfo
    );
    const trackingId = shippingResult.trackingId;
    if (!trackingId) {
      console.log("[Checkout] Shipping failed");
      return;
    }

    console.log(
      "[Checkout] Order placed successfully with tracking id: " + trackingId
    );
    // 4. Log the result of each step. If a step fails, log it and stop.
  }
}

export { CheckoutFacade };
