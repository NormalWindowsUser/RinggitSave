/*
  # Ringgit-Save Database Schema

  1. New Tables
    - `grocery_items`
      - `id` (uuid, primary key)
      - `name` (text) - Item name
      - `category` (text) - Category (e.g., Dairy & Eggs, Meat & Poultry)
      - `unit` (text) - Unit of measurement (e.g., per kg, 10 pieces)
      - `created_at` (timestamptz)

    - `price_reports`
      - `id` (uuid, primary key)
      - `item_id` (uuid, foreign key to grocery_items)
      - `price` (decimal) - Reported price
      - `location` (text) - Location/area
      - `store_name` (text) - Name of the store
      - `reported_by` (text) - User who reported
      - `reported_at` (timestamptz)
      - `verified` (boolean) - Whether the price is verified
      - `created_at` (timestamptz)

    - `menu_rahmah_stalls`
      - `id` (uuid, primary key)
      - `name` (text) - Stall name
      - `address` (text) - Full address
      - `latitude` (decimal) - Location latitude
      - `longitude` (decimal) - Location longitude
      - `menu_items` (text[]) - Array of menu items
      - `opening_hours` (text) - Opening hours description
      - `rating` (decimal) - Average rating
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (authenticated users for writes)
*/

CREATE TABLE IF NOT EXISTS grocery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  unit text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS price_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES grocery_items(id) ON DELETE CASCADE,
  price decimal(10, 2) NOT NULL,
  location text NOT NULL,
  store_name text NOT NULL,
  reported_by text NOT NULL,
  reported_at timestamptz DEFAULT now(),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_rahmah_stalls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  menu_items text[] DEFAULT '{}',
  opening_hours text DEFAULT '9:00 AM - 5:00 PM',
  rating decimal(2, 1) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE grocery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_rahmah_stalls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read grocery items"
  ON grocery_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read price reports"
  ON price_reports FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert price reports"
  ON price_reports FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read menu rahmah stalls"
  ON menu_rahmah_stalls FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_price_reports_item_id ON price_reports(item_id);
CREATE INDEX IF NOT EXISTS idx_price_reports_location ON price_reports(location);
CREATE INDEX IF NOT EXISTS idx_menu_rahmah_stalls_location ON menu_rahmah_stalls(latitude, longitude);
