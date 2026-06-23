-- Rou_Tein initial Supabase schema

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  status text DEFAULT 'pending',
  priority text DEFAULT 'medium',
  due_date text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Streaks/gamification table
CREATE TABLE IF NOT EXISTS public.streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_active_date text,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  coins integer DEFAULT 0,
  perfect_days integer DEFAULT 0,
  badges text[] DEFAULT '{}',
  unlocked_themes text[] DEFAULT '{default}',
  active_theme text DEFAULT 'default',
  streak_freeze integer DEFAULT 0,
  total_tasks_completed integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY IF NOT EXISTS "Users can manage own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can manage own tasks"
  ON public.tasks FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can manage own streaks"
  ON public.streaks FOR ALL
  USING (auth.uid() = user_id);

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS handle_tasks_updated_at ON public.tasks;
CREATE TRIGGER handle_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_streaks_updated_at ON public.streaks;
CREATE TRIGGER handle_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
