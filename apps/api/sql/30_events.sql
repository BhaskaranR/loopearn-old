-- Send events to capture customer actions, enabling targeted rewards and engagement. 
-- These events help build personalized experiences and drive customer interaction based on their behavior.

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    event_properties JSONB,
    created_at TIMESTAMP DEFAULT now()
);

-- {
--   "customerId": "1848877205",
--   "events": {
--     "write_review": {
--       "product_id": "1653503260",
--       "review": "5 Stars Product"
--     }
--   }
-- }

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS manage_customer_events ON events;

-- Create policy for customer_events based on customer's business
CREATE POLICY manage_customer_events ON events
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 
            FROM customers c
            JOIN business_users bu ON bu.business_id = c.business_id
            WHERE c.id = events.customer_id
            AND bu.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM customers c
            JOIN business_users bu ON bu.business_id = c.business_id
            WHERE c.id = events.customer_id
            AND bu.user_id = auth.uid()
        )
    );

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON events TO authenticated;

-- -- Add a comment to document the event_properties JSONB structure
-- COMMENT ON COLUMN events.event_properties IS 
-- $$ Event properties in JSONB format. Common structures include:

-- 1. E-commerce events example:
-- {
--   "product_id": "231402",
--   "product_title": "iPhone 12",
--   "price": 1350.00,
--   "category": "Mobile Phones",
--   "vendor": "Apple"
-- }

-- 2. Music app events example:
-- {
--   "song_id": "231402",
--   "title": "Coping",
--   "album_id": "95621",
--   "artist_id": "4773",
--   "tags": ["Pop", "R&B"]
-- }

-- 3. Physical events example:
-- {
--   "session_id": "231402",
--   "title": "Using Artificial Intelligence for Marketing Analytics",
--   "event_id": "15",
--   "session_duration": 90,
--   "category": "AI"
-- }
-- $$;

-- -- Create an optional trigger to validate event_properties structure
-- CREATE OR REPLACE FUNCTION validate_event_properties()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     -- Ensure event_properties is a valid JSON object
--     IF NEW.event_properties IS NOT NULL AND jsonb_typeof(NEW.event_properties) != 'object' THEN
--         RAISE EXCEPTION 'event_properties must be a JSON object';
--     END IF;

--     -- Common fields validation
--     IF NEW.event_properties ? 'price' AND jsonb_typeof(NEW.event_properties->'price') NOT IN ('number') THEN
--         RAISE EXCEPTION 'price must be a number';
--     END IF;

--     -- Array fields validation
--     IF NEW.event_properties ? 'tags' AND jsonb_typeof(NEW.event_properties->'tags') != 'array' THEN
--         RAISE EXCEPTION 'tags must be an array';
--     END IF;

--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER validate_event_properties_trigger
--     BEFORE INSERT OR UPDATE ON events
--     FOR EACH ROW
--     EXECUTE FUNCTION validate_event_properties();


