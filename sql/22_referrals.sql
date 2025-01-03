
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id),
  referred_id UUID REFERENCES users(id),
  referral_code VARCHAR(50) NOT NULL,
  first_transaction_completed BOOLEAN DEFAULT FALSE,
  referral_status VARCHAR(20) DEFAULT 'pending', -- e.g., 'pending', 'completed', 'rewarded'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rewarded_at TIMESTAMP,
  is_affiliate BOOLEAN DEFAULT FALSE,
  total_commission NUMERIC DEFAULT 0
);

-- rls policies for referrals
-- allow affiliates to see their own referrals
CREATE POLICY select_own_referrals ON referrals FOR SELECT
  USING (auth.uid() = id);
