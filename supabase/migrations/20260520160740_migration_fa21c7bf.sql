-- Create the products storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for products bucket
-- Allow public read access to all files
CREATE POLICY "Public Access for Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'products' AND auth.role() = 'authenticated');