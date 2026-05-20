import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Order = Tables<"orders">;

export interface CheckoutData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes?: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export const orderService = {
  async createOrder(
    checkoutData: CheckoutData,
    items: OrderItem[],
    total: number
  ): Promise<Order> {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: checkoutData.customer_name,
        customer_email: checkoutData.customer_email,
        customer_phone: checkoutData.customer_phone,
        shipping_address: checkoutData.shipping_address,
        notes: checkoutData.notes || null,
        total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Attempt to delete the order since items failed
      await supabase.from("orders").delete().eq("id", order.id);
      throw itemsError;
    }

    return order;
  },
};