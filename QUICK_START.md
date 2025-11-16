# 🎯 Quick Start - User Dashboard with Real Data

## What's Ready
✅ Dashboard displays real user data from database  
✅ All API endpoints created  
✅ Database layer configured  
✅ Auto-save itineraries to database  

## ⏳ What You Need to Do (5 minutes)

### 1. Create `user_profiles` Table
Go to: https://app.supabase.com → Your Project → SQL Editor

Paste this and click "Run":
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar TEXT,
  bio TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Create `itineraries` Table
Paste this and click "Run":
```sql
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  startLocation TEXT,
  budget NUMERIC NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'upcoming', 'completed')),
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  travelStyle TEXT,
  summary TEXT,
  itinerary JSONB,
  accommodationOptions JSONB[],
  transportation JSONB,
  budgetBreakdown JSONB,
  travelTips TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Enable Row Level Security
Go to: Authentication → Policies

For `user_profiles`:
- Click "New Policy"
- Name: "Users can view own profile"
- USING: `auth.uid() = user_id`
- WITH CHECK: `auth.uid() = user_id`

For `itineraries`:
- Click "New Policy"
- Name: "Users can view own itineraries"
- USING: `auth.uid() = user_id`
- WITH CHECK: `auth.uid() = user_id`

## ✅ Done!

Now test it:

1. **Sign up** on your app
2. **Go to dashboard** - Should see your name
3. **Create itinerary** - Data auto-saves to database
4. **Refresh dashboard** - Itinerary appears in the list
5. **Delete itinerary** - Gets removed from database

## 📊 What You Get

### Dashboard Shows:
- User's actual name
- Total trips (count)
- Total spent (formatted currency)
- Completed trips
- Upcoming trips
- Draft trips
- List of all itineraries with actions

### Each Itinerary Shows:
- Destination
- Duration (days)
- Budget (₹)
- Status badge
- Creation date
- View, Edit, Delete buttons

## 🔗 File Structure

```
lib/
  ├── database.ts (NEW) - Database operations
  └── supabaseClient.ts - Already configured

app/api/
  ├── dashboard/route.ts (NEW) - Get dashboard data
  └── user/
      ├── profile/route.ts (NEW) - Manage profiles
      └── itineraries/
          ├── route.ts (NEW) - List & create
          └── [id]/route.ts (NEW) - Delete

app/
  ├── page.tsx (UPDATED) - Auto-save itineraries
  ├── dashboard/page.tsx (UPDATED) - Real data display
  └── signup/page.tsx (UPDATED) - Create user profile
```

## 📝 SQL Quick Reference

```sql
-- Verify tables exist
SELECT * FROM user_profiles;
SELECT * FROM itineraries;

-- Check your profile
SELECT * FROM user_profiles WHERE email = 'your@email.com';

-- Check your itineraries
SELECT destination, budget, status, created_at 
FROM itineraries 
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC;

-- Check stats
SELECT 
  COUNT(*) as total_trips,
  SUM(budget) as total_spent,
  COUNT(CASE WHEN status='completed' THEN 1 END) as completed
FROM itineraries 
WHERE user_id = 'your-user-id';
```

## 🆘 Need Help?

Check `DASHBOARD_SETUP.md` and `SUPABASE_SETUP.md` for detailed documentation.

---

**You're all set!** Start using your dashboard with real data. 🚀
