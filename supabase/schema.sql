-- Phoenix Holiday Lights schema
-- Run this in your Supabase SQL editor

CREATE TABLE locations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address     TEXT NOT NULL,
  description TEXT,
  lat         DECIMAL(10, 8) NOT NULL,
  lng         DECIMAL(11, 8) NOT NULL,
  verified    BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address       TEXT NOT NULL,
  description   TEXT,
  lat           DECIMAL(10, 8) NOT NULL,
  lng           DECIMAL(11, 8) NOT NULL,
  submitted_by  TEXT,
  email         TEXT,
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feedback (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id   UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  type          TEXT NOT NULL CHECK (type IN ('still_active', 'no_longer_active', 'update_needed', 'note')),
  message       TEXT,
  submitted_by  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Public read access for approved locations
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read locations" ON locations FOR SELECT USING (true);

-- Feedback: public read (for admin), no direct write (use service role via API)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read feedback" ON feedback FOR SELECT USING (true);

-- Submissions: no public read (admin only)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Sample data — replace with real Phoenix addresses
INSERT INTO locations (address, description, lat, lng, verified) VALUES
  ('7034 E Ivyglen St, Mesa, AZ 85207', 'Massive display with synchronized lights and music. Tune to FM 101.5.', 33.4484, -111.7345, true),
  ('2432 E Peach Tree Dr, Chandler, AZ 85249', 'Rooftop sleigh, thousands of lights, animated characters.', 33.2489, -111.7867, true),
  ('1610 W Catclaw Dr, Chandler, AZ 85248', 'Elegant display with nativity and giant candy canes.', 33.2318, -111.8912, true);
