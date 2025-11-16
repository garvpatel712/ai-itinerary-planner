# User Dashboard Setup - Complete Implementation Guide

## ✅ What Has Been Implemented

### 1. Database Layer (`lib/database.ts`)
- ✅ User profile operations (get, create, update)
- ✅ Itinerary CRUD operations (create, read, update, delete)
- ✅ Statistics calculation (total trips, total spent, trip status counts)

### 2. API Endpoints Created

#### Dashboard Endpoint
- **Route**: `/api/dashboard`
- **Method**: GET
- **Returns**: User data, all itineraries, and statistics
- **Auth**: Required

#### User Profile Endpoints
- **Route**: `/api/user/profile`
- **Methods**: GET (fetch), POST (create/update)
- **Auth**: Required

#### Itineraries Endpoints
- **Route**: `/api/user/itineraries`
- **Methods**: GET (fetch all), POST (create new)
- **Auth**: Required

- **Route**: `/api/user/itineraries/[id]`
- **Methods**: DELETE (remove)
- **Auth**: Required

### 3. Dashboard UI Updated (`app/dashboard/page.tsx`)
- ✅ Real-time data fetching from database
- ✅ User welcome message with actual name
- ✅ Live statistics cards showing:
  - Total trips
  - Total spent (formatted currency)
  - Completed trips
  - Upcoming trips
  - Draft trips
- ✅ Itineraries list with:
  - Destination, duration, budget, status
  - View details link
  - Edit link
  - Delete with confirmation
- ✅ Settings tab for account management
- ✅ Loading states and error handling
- ✅ Empty state when no itineraries

### 4. Signup Process Enhanced (`app/signup/page.tsx`)
- ✅ Captures user name
- ✅ Auto-creates user profile on signup
- ✅ Stores name in database

---

## 🗄️ Supabase Database Setup Required

You **MUST** create these two tables in Supabase:

### Table 1: `user_profiles`
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

### Table 2: `itineraries`
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

---

## 📋 Supabase Setup Steps

### 1. Create Tables
1. Go to: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Create new query and paste the `user_profiles` table SQL above
5. Run it
6. Create another query and paste the `itineraries` table SQL above
7. Run it

### 2. Enable Row Level Security (RLS)
1. Go to **Authentication** → **Policies**
2. For `user_profiles` table:
   - Click "New Policy"
   - Name: "Users can view own profile"
   - USING: `auth.uid() = user_id`
   - WITH CHECK: `auth.uid() = user_id`
   - Create policy
3. For `itineraries` table:
   - Click "New Policy"
   - Name: "Users can view own itineraries"
   - USING: `auth.uid() = user_id`
   - WITH CHECK: `auth.uid() = user_id`
   - Create policy

### 3. (Optional) Create Indexes for Performance
```sql
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_itineraries_user_id ON itineraries(user_id);
CREATE INDEX idx_itineraries_status ON itineraries(status);
CREATE INDEX idx_itineraries_created_at ON itineraries(created_at DESC);
```

---

## 🔄 Data Flow

```
User Sign Up
    ↓
Create Supabase Auth Account
    ↓
Store Profile in user_profiles table
    (name, email, avatar, etc.)
    ↓
User Views Dashboard
    ↓
Fetch /api/dashboard
    ↓
API queries user_profiles + itineraries
    ↓
Calculate stats from itineraries
    ↓
Return all data to frontend
    ↓
Display dashboard with real data
```

---

## 🧪 Testing the Setup

### 1. After Supabase Setup
```bash
# In your Supabase SQL Editor, verify tables exist:
SELECT * FROM user_profiles;
SELECT * FROM itineraries;
```

### 2. Test Signup
- Go to `/signup`
- Create an account with full name
- Check Supabase: Should see new user profile in `user_profiles` table

### 3. Test Dashboard
- Go to `/dashboard`
- Should see your name in the welcome message
- Stats should show 0 trips (no itineraries yet)

### 4. Test Creating Itinerary
- Go to home page `/`
- Generate an itinerary
- The itinerary data should be saved to database
- Go back to `/dashboard`
- Should see the itinerary in the list

### 5. Test Delete
- Click delete on any itinerary
- Confirm deletion
- It should be removed from dashboard

---

## 📊 Real Data Displayed

The dashboard now shows:

### User Information
- ✅ User's actual name
- ✅ User's email
- ✅ Avatar placeholder (ready for profile pictures)

### Statistics
- ✅ Total trips (count of all itineraries)
- ✅ Total spent (sum of all budgets)
- ✅ Completed trips (count with status='completed')
- ✅ Upcoming trips (count with status='upcoming')
- ✅ Draft trips (count with status='draft')

### Itineraries List
- ✅ Destination name
- ✅ Duration (in days)
- ✅ Budget (formatted as Indian Rupees)
- ✅ Status badge (color-coded)
- ✅ Creation date
- ✅ Action buttons (view, edit, delete)

---

## 🚀 Next Steps (Optional Enhancements)

1. **Update Itinerary Status**
   - Add endpoint to change trip status
   - Update when user marks trip as "completed"

2. **Rate Trips**
   - Add rating column to itineraries
   - Allow users to rate completed trips

3. **Favorite Destinations**
   - Create favorites table
   - Show favorites on dashboard

4. **Profile Avatar Upload**
   - Integrate Supabase Storage
   - Allow users to upload profile pictures

5. **Trip Statistics**
   - Show trips by destination
   - Show budget trends over time
   - Show month-by-month trip history

---

## ⚙️ Configuration Files

All configuration is already set up in:
- `.env.local` - Supabase credentials (already configured)
- `lib/supabaseClient.ts` - Supabase client initialized
- `lib/auth.ts` - Authentication functions
- `lib/database.ts` - Database operations (NEW)

---

## 🛠️ Troubleshooting

### Issue: "Unauthorized" on dashboard
**Solution**: 
- Verify you're logged in
- Check Supabase auth is working
- Check RLS policies are enabled

### Issue: Empty dashboard
**Solution**:
- Create user profile (happens on signup)
- Check user_profiles table has your record
- Check itineraries table has any records

### Issue: "Table not found" error
**Solution**:
- Go to Supabase SQL Editor
- Verify both tables exist
- Check table names match exactly (lowercase)

### Issue: Can't delete itinerary
**Solution**:
- Check RLS policy allows DELETE
- Verify itinerary belongs to logged-in user
- Check browser console for error details

---

## 📝 Summary

**Frontend:** ✅ Ready  
**Backend API:** ✅ Ready  
**Database Layer:** ✅ Ready  
**Supabase Setup:** ⏳ **ACTION REQUIRED** - Follow the "Supabase Setup Steps" above

Once you create the two tables in Supabase, the entire system will work perfectly! 🎉
