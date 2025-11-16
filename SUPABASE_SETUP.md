# Supabase Database Setup Instructions

## Required Tables and Schemas

You need to create the following tables in your Supabase database:

### 1. `user_profiles` Table

Create this table with the following columns:

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

**Column Details:**
- `id`: Unique identifier
- `user_id`: Reference to Supabase Auth user
- `name`: User's full name
- `email`: User's email
- `avatar`: URL to profile avatar
- `bio`: User biography
- `phone`: Contact phone
- `location`: User's location
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

---

### 2. `itineraries` Table

Create this table with the following columns:

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
   -- store the full AI payload and normalized metadata
   payload JSONB,
   title TEXT,
   source TEXT DEFAULT 'ai-generator-v1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Column Details:**
- `id`: Unique identifier
- `user_id`: Reference to user who created it
- `destination`: Trip destination
- `startLocation`: Starting location
- `budget`: Total budget in INR
- `duration`: Number of days
- `status`: Trip status (draft/upcoming/completed)
- `interests`: Array of interests (adventure, culture, food, etc.)
- `travelStyle`: Travel style (budget/mid-range/luxury)
- `summary`: Trip summary
- `itinerary`: Full daily itinerary as JSON
- `accommodationOptions`: Array of accommodation options
- `transportation`: Transportation details
- `budgetBreakdown`: Budget breakdown by category
- `travelTips`: Array of travel tips
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

---

## Step-by-Step Setup

### Step 1: Go to Supabase Dashboard
1. Visit: https://app.supabase.com
2. Sign in to your project
3. Go to "SQL Editor"

### Step 2: Create `user_profiles` Table
1. Click "New query"
2. Copy and paste the SQL for `user_profiles` table (above)
3. Click "Run"
4. Verify the table appears in the sidebar

### Step 3: Create `itineraries` Table
1. Click "New query"
2. Copy and paste the SQL for `itineraries` table (above)
3. Click "Run"
4. Verify the table appears in the sidebar

### Step 4: Set up Row Level Security (RLS)

**For `user_profiles` table:**
1. Go to Authentication → Policies
2. Click on `user_profiles` table
3. Create policy:
   - Name: "Users can view own profile"
   - USING: `auth.uid() = user_id`
   - WITH CHECK: `auth.uid() = user_id`

**For `itineraries` table:**
1. Go to Authentication → Policies
2. Click on `itineraries` table
3. Create policy:
   - Name: "Users can view own itineraries"
   - USING: `auth.uid() = user_id`
   - WITH CHECK: `auth.uid() = user_id`

Alternatively, run these SQL statements in the SQL editor to enable RLS and create explicit policies:

```sql
-- Enable RLS on the table
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to SELECT their own rows
CREATE POLICY "select_own_itineraries" ON itineraries FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to INSERT only rows with their own user_id
CREATE POLICY "insert_own_itineraries" ON itineraries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to UPDATE only their own rows
CREATE POLICY "update_own_itineraries" ON itineraries FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to DELETE only their own rows
CREATE POLICY "delete_own_itineraries" ON itineraries FOR DELETE USING (auth.uid() = user_id);
```

### Step 5: Create Indexes (Optional but Recommended)

```sql
-- Index for faster user profile lookups
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- Index for faster itinerary lookups
CREATE INDEX idx_itineraries_user_id ON itineraries(user_id);

-- Index for status filtering
CREATE INDEX idx_itineraries_status ON itineraries(status);

-- Index for created_at sorting
CREATE INDEX idx_itineraries_created_at ON itineraries(created_at DESC);
```

---

## Data Flow

### When User Signs Up:
1. User creates account → Stored in `auth.users` (Supabase Auth)
2. Profile data saved → `user_profiles` table
3. Stores: name, email, avatar, bio

### When User Creates Itinerary:
1. User submits itinerary form
2. Data sent to `/api/user/itineraries`
3. Stored in `itineraries` table with user_id
4. Status: "draft"

### Dashboard Display:
1. Fetches `/api/dashboard`
2. Retrieves user profile from `user_profiles`
3. Retrieves all itineraries from `itineraries`
4. Calculates stats from itinerary data
5. Returns combined data to frontend

---

## API Endpoints Created

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/dashboard` | GET | Fetch dashboard data (user, itineraries, stats) |
| `/api/user/profile` | GET | Get user profile |
| `/api/user/profile` | POST | Create/update user profile |
| `/api/user/itineraries` | GET | Get all user itineraries |
| `/api/user/itineraries` | POST | Create new itinerary |
| `/api/user/itineraries/[id]` | DELETE | Delete itinerary |

---

## Testing the Setup

1. **Create a new account** on your app
2. **Go to Supabase Dashboard** → SQL Editor
3. **Check `user_profiles`** table:
   ```sql
   SELECT * FROM user_profiles;
   ```
4. **Create an itinerary** from your app
5. **Check `itineraries`** table:
   ```sql
   SELECT * FROM itineraries;
   ```

### Running automated sanity test (optional)

There is a simple Node script to verify insert + ordering. It uses the Supabase **service role** key to write test rows and read them back. To run it:

1. Create a test user id in your Supabase Auth (get the `id` value from the user row) and set it in your local env as `TEST_USER_ID`.
2. Create a `.env` file in your project root with:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TEST_USER_ID=the-test-user-uuid
```

3. Run the script:

```bash
pnpm run test:itineraries
```

The script will insert three rows for `TEST_USER_ID` and verify ordering (most recent first). It requires the service role key because it performs direct inserts for testing.

---

## Troubleshooting

### "Unauthorized" errors:
- Check if RLS policies are set correctly
- Verify user is authenticated before API calls

### "Table not found" errors:
- Make sure both tables are created
- Check table names match exactly

### Dashboard shows empty:
- Check user is logged in
- Verify profile exists in `user_profiles`
- Check browser console for errors

---

## Optional Enhancements

Add these columns later if needed:
```sql
-- Add to itineraries table for ratings
ALTER TABLE itineraries ADD COLUMN rating INTEGER;
ALTER TABLE itineraries ADD COLUMN review TEXT;

-- Add to user_profiles for preferences
ALTER TABLE user_profiles ADD COLUMN preferred_budget_range TEXT;
ALTER TABLE user_profiles ADD COLUMN preferred_travel_style TEXT;
```

---

**That's it! Your database is ready to store user data and display it on the dashboard.** 🎉
