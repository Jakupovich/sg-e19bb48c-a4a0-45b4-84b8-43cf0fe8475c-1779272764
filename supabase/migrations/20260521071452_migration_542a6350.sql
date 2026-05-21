-- Fix RLS policies for anonymous checkout (T3 pattern)

-- DROP existing restrictive policies
DROP POLICY IF EXISTS "authenticated_insert_orders" ON orders;
DROP POLICY IF EXISTS "authenticated_insert_order_items" ON order_items;

-- CREATE new anonymous-friendly policies for orders
CREATE POLICY "anon_insert_orders" ON orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admin_read_all_orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Keep existing user read policy
-- users_read_own_orders already exists

-- CREATE new anonymous-friendly policy for order_items
CREATE POLICY "anon_insert_order_items" ON order_items
  FOR INSERT
  WITH CHECK (true);

-- Keep existing read policy
-- users_read_own_order_items already exists