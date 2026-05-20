---
title: Database & Auth Setup
status: done
priority: urgent
type: feature
tags: [backend, database, auth]
created_by: agent
created_at: 2026-05-20T10:28:39Z
position: 1
---

## Notes
Complete database schema for HVAC e-commerce with products, categories, orders, and admin role system. RLS policies configured for security.

## Checklist
- [x] Create categories table with HVAC product types
- [x] Create products table with specifications, pricing, stock
- [x] Create orders and order_items tables
- [x] Add admin role to profiles
- [x] Configure RLS policies (public read products, admin CRUD, user orders)
- [x] Seed initial HVAC categories

## Acceptance
- Database schema supports full e-commerce flow
- Admin users can manage inventory
- Customers can browse products and place orders
