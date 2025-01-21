-- Create Categories table
CREATE TABLE public.Categories (
    CategoryID SERIAL PRIMARY KEY, -- Automatically generate unique IDs
    CategoryName VARCHAR(255) NOT NULL UNIQUE -- Category name, must be unique
);

-- Create Subcategories table
CREATE TABLE public.Subcategories (
    SubcategoryID SERIAL PRIMARY KEY, -- Automatically generate unique IDs
    CategoryID INT NOT NULL, -- Foreign key to reference Categories table
    SubcategoryName VARCHAR(255) NOT NULL,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE -- Establish relationship with Categories
);

-- Insert into Categories table with explicit IDs
INSERT INTO public.Categories (CategoryID, CategoryName)
VALUES 
(1, 'Services'),
(2, 'Retail and Wholesale'),
(3, 'Manufacturing'),
(4, 'Technology'),
(5, 'Agriculture and Natural Resources'),
(6, 'Hospitality and Tourism'),
(7, 'Real Estate'),
(8, 'Education and Training'),
(9, 'Entertainment and Media'),
(10, 'Transportation and Logistics'),
(11, 'Non-Profit Organizations'),
(12, 'Arts and Crafts'),
(13, 'Local Deals'),
(14, 'Goods'),
(15, 'Travel'),
(16, 'Coupons'),
(17, 'Educational Services'),
(18, 'Health & Wellness'),
(19, 'Beauty'),
(20, 'Experiences');

-- Insert into Subcategories table
INSERT INTO public.Subcategories (CategoryID, SubcategoryName)
VALUES 
-- Subcategories from Service-Based
(1, 'Professional Services'),
(1, 'Personal Services'),
(1, 'IT and Tech Services'),
(1, 'Healthcare Services'),
(1, 'Financial Services'),
-- Subcategories from Retail and Wholesale
(2, 'Retail'),
(2, 'Wholesale'),
(2, 'E-Commerce'),
-- Subcategories from Manufacturing
(3, 'Heavy Industry'),
(3, 'Light Industry'),
(3, 'Food and Beverage'),
-- Subcategories from Technology
(4, 'Software Development'),
(4, 'Hardware'),
(4, 'Tech-Enabled Services'),
-- Subcategories from Agriculture and Natural Resources
(5, 'Agriculture'),
(5, 'Natural Resources'),
(5, 'Agri-Business'),
-- Subcategories from Hospitality and Tourism
(6, 'Accommodation'),
(6, 'Food and Beverage'),
(6, 'Travel Services'),
(6, 'Event Management'),
-- Subcategories from Real Estate
(7, 'Development'),
(7, 'Brokerage'),
(7, 'Property Management'),
-- Subcategories from Education and Training
(8, 'Schools and Colleges'),
(8, 'Skill Development'),
(8, 'Test Prep and Coaching'),
-- Subcategories from Entertainment and Media
(9, 'Content Production'),
(9, 'Media Platforms'),
(9, 'Gaming'),
(9, 'Event Production'),
-- Subcategories from Transportation and Logistics
(10, 'Freight and Logistics'),
(10, 'Passenger Services'),
(10, 'Supply Chain Management'),
-- Subcategories from Non-Profit Organizations
(11, 'Charities'),
(11, 'Advocacy Groups'),
(11, 'Educational NGOs'),
-- Subcategories from Arts and Crafts
(12, 'Fine Arts'),
(12, 'Crafts'),
(12, 'Design Services'),
-- Subcategories from Local Deals
(13, 'Dining'),
(13, 'Spas'),
(13, 'Fitness'),
-- Subcategories from Goods
(14, 'Electronics'),
(14, 'Fashion'),
(14, 'Home Essentials'),
-- Subcategories from Travel
(15, 'Vacation Packages'),
(15, 'Hotel Stays'),
(15, 'Travel Services'),
-- Subcategories from Coupons
(16, 'Promo Codes'),
(16, 'Discounts for Retailers'),
-- Subcategories from Health & Wellness
(17, 'Yoga Classes'),
(17, 'Nutrition Counseling'),
(17, 'Gym Memberships'),
(17, 'Wellness Retreats'),
-- Subcategories from Beauty
(18, 'Hair Salons'),
(18, 'Nail Salons'),
(18, 'Skincare Services'),
(18, 'Makeup Classes'),
-- Subcategories from Experiences
(19, 'Adventure Tours'),
(19, 'Concerts'),
(19, 'Theater Shows'),
(19, 'Cooking Classes');

-- Enable row-level security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Allow all users to read
CREATE POLICY "Allow all read access" ON public.categories
  FOR SELECT
  USING (true);

CREATE POLICY "Allow all read access" ON public.subcategories
  FOR SELECT
  USING (true);

-- Restrict insert to specific roles (e.g., admin)
CREATE POLICY "Restrict insert access" ON public.categories
  FOR INSERT
  WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Restrict insert access" ON public.subcategories
  FOR INSERT
  WITH CHECK (auth.role() = 'admin');

-- Restrict update to specific roles (e.g., admin)
CREATE POLICY "Restrict update access" ON public.categories
  FOR UPDATE
  USING (auth.role() = 'admin');

CREATE POLICY "Restrict update access" ON public.subcategories
  FOR UPDATE
  USING (auth.role() = 'admin');

-- Restrict delete to specific roles (e.g., admin)
CREATE POLICY "Restrict delete access" ON public.categories
  FOR DELETE
  USING (auth.role() = 'admin');

CREATE POLICY "Restrict delete access" ON public.subcategories
  FOR DELETE
  USING (auth.role() = 'admin');

