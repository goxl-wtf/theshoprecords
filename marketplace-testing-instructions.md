# Marketplace Testing Instructions

This document provides step-by-step instructions for testing the marketplace functionality after fixing the schema issues.

## 1. Fix the Database Schema

The marketplace feature requires several database tables that were missing or had incorrect column names. We've created SQL scripts to fix these issues.

### Option A: Using the Supabase SQL Editor

1. Open your Supabase project dashboard
2. Go to the SQL Editor section
3. Create a new query
4. Copy and paste the contents of `marketplace-schema-fix-final.sql` into the editor
5. Run the query to apply the schema fixes

### Option B: Using the Run Schema Fix Script

```bash
node run-schema-fix.js
```

This script will connect to your Supabase database using the credentials in `.env.local` and apply the schema fixes.

## 2. Create Test Data

After fixing the schema, you'll need test data to properly test the marketplace functionality.

### Option A: Using the Supabase SQL Editor (Recommended)

1. Open your Supabase project dashboard
2. Go to the SQL Editor section
3. Create a new query
4. Copy and paste the contents of `create-test-data-import.sql` into the editor
5. Run the query to create test data

This method bypasses RLS policies by executing the SQL directly in the Supabase dashboard.

### Option B: Using the SQL Function Method

If you're planning to programmatically create test data, you need to create a SQL execution function first:

1. Open your Supabase project dashboard
2. Go to the SQL Editor section
3. Create a new query
4. Copy and paste the contents of `create-execute-sql-function.sql` into the editor
5. Run the query to create the function
6. Now run the test data creation script:

```bash
node create-test-data-sql.js
```

**Note:** The SQL execution function is potentially dangerous in production as it allows arbitrary SQL execution. Use it only in development/testing environments.

## 3. Verify the Setup

After applying the schema fixes and creating test data, you should verify everything is working:

```bash
node verify-marketplace-schema.js
```

This script will check if all required tables exist and if test data has been created.

## 4. Test the Marketplace Features

Now you can test the marketplace functionality:

1. Browse the shop to see listings from multiple sellers
2. View a product detail page to see available listings comparison
3. Add items from multiple sellers to your cart
4. Proceed through checkout to test the multi-seller checkout flow
5. Test the seller dashboard functionality if you have access

## 5. Performance Optimization

We've also created SQL scripts to optimize the database performance:

```bash
# Apply performance optimizations (run in Supabase SQL Editor)
marketplace-performance-optimizations.sql
```

These optimizations add indexes to frequently queried columns to improve query performance.

## 6. Common Issues and Solutions

### Row-Level Security (RLS) Issues

If you encounter RLS policy errors when trying to create or update data, you have a few options:

1. Use the Supabase SQL Editor method which bypasses RLS
2. Create and use the SQL execution function as described above
3. Temporarily disable RLS for the tables (not recommended for production)

### Missing Tables or Columns

If you still see errors about missing tables or columns:

1. Run the schema verification script to check what's missing
2. Apply the schema fixes again as described in section 1
3. Check the error messages for specific details about what's missing

### Relationship Errors

If you see errors about relationships between tables:

1. Make sure all the required tables exist
2. Verify that the foreign key constraints are properly set up
3. Check if the reference columns are of the correct type

## 7. Clean Up After Testing

When you're done testing, you may want to clean up the test data:

```sql
-- Run in Supabase SQL Editor
DELETE FROM listing_images WHERE listing_id IN (
  SELECT id FROM listings WHERE seller_id = '550e8400-e29b-41d4-a716-446655440000'
);
DELETE FROM listings WHERE seller_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM seller_profiles WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
```

## 8. Additional Resources

- Check `MARKETPLACE-IMPLEMENTATION-COMPLETED.md` for details on the implemented features
- See the `utils/marketplaceService.ts` file for backend service functionality
- Review the React components in `components/marketplace/` for UI implementation 