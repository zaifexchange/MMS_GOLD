# 🚀 MMS Gold Platform Setup Instructions

## ⚠️ **IMPORTANT: Database Setup Required**

Your application is deployed but needs database configuration to work properly. Follow these steps:

## 📋 **Step 1: Connect to Supabase**

1. **Click the "Connect to Supabase" button** in the top-right corner of this interface
2. **Create a new Supabase project** or select an existing one
3. **Copy your project credentials**

## 🔧 **Step 2: Configure Environment Variables**

In your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add these variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🗄️ **Step 3: Set Up Database Schema**

In your Supabase dashboard, go to **SQL Editor** and run these migrations **in order**:

### Migration 1: Main Schema
```sql
-- Copy and paste content from: supabase/migrations/20250630035419_broad_water.sql
```

### Migration 2: Auth Integration
```sql
-- Copy and paste content from: supabase/migrations/20250630041703_young_frost.sql
```

### Migration 3: Policy Fixes
```sql
-- Copy and paste content from: supabase/migrations/20250630042013_gentle_river.sql
```

### Migration 4: Sample Data
```sql
-- Copy and paste content from: supabase/migrations/20250630045939_fragrant_smoke.sql
```

### Migration 5: Admin Features
```sql
-- Copy and paste content from: supabase/migrations/20250705161730_black_glitter.sql
```

### Migration 6: Admin Account Setup
```sql
-- Copy and paste content from: supabase/migrations/20250705162008_solitary_villa.sql
```

### Migration 7: Prediction System
```sql
-- Copy and paste content from: supabase/migrations/20250705171727_soft_coast.sql
```

## 👤 **Step 4: Create Admin Account**

1. **Go to your deployed site**: https://mmsgoldxyz.netlify.app
2. **Click "Sign Up"**
3. **Register with these credentials**:
   - Email: `monirhasan2003@gmail.com`
   - Password: `Zarra-852882`
   - Full Name: `Admin User`

4. **The account will automatically get admin privileges**

## 🔄 **Step 5: Redeploy Site**

After setting environment variables:
1. Go to **Deploys** in Netlify dashboard
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

## ✅ **Step 6: Test Everything**

1. **Visit your site**: https://mmsgoldxyz.netlify.app
2. **Try to sign up/login**
3. **Check admin dashboard access**
4. **Verify all features work**

## 🎯 **Expected Features After Setup**

- ✅ User registration and login
- ✅ Admin dashboard with full functionality
- ✅ Gold trading interface with live charts
- ✅ Gold prediction system
- ✅ Fixed deposits
- ✅ Referral network
- ✅ User profiles and KYC
- ✅ Transaction history
- ✅ Real-time gold price data

## 🚨 **Troubleshooting**

### Issue: "Database not configured" error
**Solution**: Set up environment variables in Netlify and redeploy

### Issue: Can't sign in
**Solution**: Ensure all database migrations are run and admin account is created

### Issue: Features not working
**Solution**: Check browser console for errors and verify database setup

### Issue: Admin access denied
**Solution**: Ensure admin account is created with correct email

## 📞 **Need Help?**

If you encounter issues:
1. Check browser console for error messages
2. Verify all migrations ran successfully
3. Ensure environment variables are set correctly
4. Try creating the admin account manually

## 🎉 **Success!**

Once setup is complete, you'll have a fully functional gold trading platform with:
- Professional user interface
- Complete admin panel
- Real-time trading features
- Secure authentication
- Database-driven functionality

Your MMS Gold platform will be ready for production use!