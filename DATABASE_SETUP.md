# Database Setup Guide for MMS Gold Platform

## 🔧 **Step 1: Connect to Supabase**

1. **Click the "Connect to Supabase" button** in the top right corner of this interface
2. **Create a new Supabase project** or use an existing one
3. **Copy your project credentials** (URL and anon key)

## 🗄️ **Step 2: Set Up Environment Variables**

Create a `.env` file in your project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Example:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📊 **Step 3: Run Database Migrations**

In your Supabase dashboard, go to the **SQL Editor** and run these migrations in order:

### Migration 1: Main Schema
```sql
-- Run the content from: supabase/migrations/20250630035419_broad_water.sql
```

### Migration 2: Auth Fixes
```sql
-- Run the content from: supabase/migrations/20250630041703_young_frost.sql
```

### Migration 3: Policy Fixes
```sql
-- Run the content from: supabase/migrations/20250630042013_gentle_river.sql
```

### Migration 4: Sample Data
```sql
-- Run the content from: supabase/migrations/20250630045939_fragrant_smoke.sql
```

### Migration 5: Admin Features
```sql
-- Run the content from: supabase/migrations/20250705161730_black_glitter.sql
```

### Migration 6: Admin Account
```sql
-- Run the content from: supabase/migrations/20250705162008_solitary_villa.sql
```

### Migration 7: Prediction System
```sql
-- Run the content from: supabase/migrations/20250705171727_soft_coast.sql
```

## 👤 **Step 4: Create Admin Account**

1. **Go to Supabase Authentication** in your dashboard
2. **Create a new user** with email: `monirhasan2003@gmail.com`
3. **Set password**: `Zarra-852882`
4. **The user will automatically get admin privileges** due to the migration

## 🔐 **Step 5: Enable Row Level Security**

In your Supabase dashboard:
1. Go to **Authentication > Settings**
2. Enable **Row Level Security** for all tables
3. The policies are already created by the migrations

## 🧪 **Step 6: Test the Connection**

1. **Restart your development server**
2. **Try to register a new user**
3. **Try to login with the admin account**
4. **Check if data loads in the dashboard**

## 🚨 **Common Issues & Solutions**

### Issue: "Missing Supabase environment variables"
**Solution:** Make sure your `.env` file is in the project root and contains the correct variables.

### Issue: "RLS policy violation"
**Solution:** Ensure all migrations have been run and RLS policies are properly set up.

### Issue: "User not found"
**Solution:** Create the admin user manually in Supabase Auth dashboard.

### Issue: "Database connection failed"
**Solution:** Check your Supabase URL and anon key are correct.

## 📋 **Quick Setup Checklist**

- [ ] Connect to Supabase
- [ ] Create `.env` file with credentials
- [ ] Run all 7 migrations in order
- [ ] Create admin user in Supabase Auth
- [ ] Test registration and login
- [ ] Verify dashboard loads data

## 🎯 **Expected Result**

After setup, you should have:
- ✅ Working user registration and login
- ✅ Admin dashboard with full functionality
- ✅ Gold prediction system
- ✅ Trading features
- ✅ Fixed deposits system
- ✅ Referral network
- ✅ Complete user profiles

## 📞 **Need Help?**

If you encounter issues:
1. Check the browser console for error messages
2. Verify all migrations ran successfully
3. Ensure environment variables are correct
4. Check Supabase dashboard for any errors