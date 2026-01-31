# Inventory Database – Part B (SQLite)

## Database Schema
The system uses two tables: suppliers and inventory.
Each supplier can have multiple inventory items, enforced using foreign keys.

## Why SQL (SQLite)
SQLite was chosen for simplicity and zero setup while still using relational SQL concepts.
The same schema works for MySQL or PostgreSQL in production systems.

## Required Query
The GET /inventory endpoint groups inventory by supplier and sorts results
by total inventory value calculated as quantity × price.

## Optimization Suggestion
Indexes on inventory.supplier_id would improve join performance.
For large datasets, aggregation can be optimized at the database level.
#
