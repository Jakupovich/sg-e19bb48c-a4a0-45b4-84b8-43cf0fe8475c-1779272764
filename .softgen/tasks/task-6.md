---
title: Admin Dashboard - Product Management
status: done
priority: medium
type: feature
tags: [admin, crud]
created_by: agent
created_at: 2026-05-20T10:28:39Z
position: 6
---

## Notes
Build complete CRUD system for product management with image upload to Supabase Storage and special Pik.ba cross-posting toggle. When toggle is active, syncToPikBa() function is triggered after successful product save.

## Checklist
- [x] Create productAdminService with CRUD + syncToPikBa()
- [x] Build /admin/products list page with search
- [x] Create /admin/products/new form with Pik.ba toggle
- [x] Create /admin/products/[id] edit form
- [x] Test Supabase Storage upload
- [x] Verify Pik.ba toggle triggers sync

## Acceptance
- Admins can create/edit/delete products
- Images upload successfully to Supabase Storage
- Pik.ba toggle triggers cross-posting flow
