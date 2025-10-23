import {
  currentOrderByUser,
  completedOrdersByUser,
} from "../../data/models/orders";

describe("Order Models", () => {
  const userId = 1; // Using seeded user

  it("DB currentOrderByUser method", async () => {
    expect(currentOrderByUser).toBeDefined();
    const currentOrder = await currentOrderByUser(userId);
    expect(currentOrder).toBeDefined();

    // Check if order has expected structure
    if (Object.keys(currentOrder).length > 0) {
      expect(currentOrder).toEqual(
        jasmine.objectContaining({
          id: jasmine.any(Number),
          user_id: userId,
          active_status: true,
          products: jasmine.any(Array),
        })
      );
    }
  });

  it("DB completedOrdersByUser method", async () => {
    expect(completedOrdersByUser).toBeDefined();
    const completedOrders = await completedOrdersByUser(userId);
    expect(Array.isArray(completedOrders)).toBeTrue();

    // Check if completed orders have expected structure
    if (completedOrders.length > 0) {
      expect(completedOrders[0]).toEqual(
        jasmine.objectContaining({
          id: jasmine.any(Number),
          user_id: userId,
          active_status: false,
          products: jasmine.any(Array),
        })
      );
    }
  });
});
