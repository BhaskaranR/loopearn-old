CREATE TABLE coupon_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the configuration
    business_id UUID REFERENCES business(id) ON DELETE CASCADE, -- Business-specific configuration
    reward_type TEXT CHECK (reward_type IN ('points', 'free_product', 'free_shipping', 'fixed_discount', 'percentage_discount')) NOT NULL, -- Type of reward
    discount_value NUMERIC(10, 2) CHECK (discount_value >= 0), -- Discount percentage or fixed amount
    min_order_value NUMERIC(10, 2) CHECK (min_order_value >= 0), -- Minimum order amount required
    prefix TEXT, -- Prefix for coupon codes (e.g., "NEWYEAR")
    global_usage_limit INT CHECK (global_usage_limit >= 0), -- Total max times this coupon type can be redeemed
    per_user_limit INT CHECK (per_user_limit >= 0), -- Limit per customer
    expiry_days INT CHECK (expiry_days >= 0), -- Days after issuance before the coupon expires
    auto_generate BOOLEAN DEFAULT FALSE, -- Should coupons be automatically generated?
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);


CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique coupon ID
    coupon_config_id UUID REFERENCES coupon_configurations(id) ON DELETE CASCADE, -- Links coupon to its configuration
    business_id UUID REFERENCES business(id) ON DELETE CASCADE, -- Business issuing the coupon
    code TEXT UNIQUE NOT NULL, -- Unique coupon code assigned to customer
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL, -- If personalized, links to a customer
    order_id UUID, -- If redeemed, links to an order
    qr_code TEXT UNIQUE, -- QR code data (a link or encoded string)
    status TEXT CHECK (status IN ('active', 'redeemed', 'expired')) DEFAULT 'active', -- Coupon status
    issued_at TIMESTAMP DEFAULT now(), -- When the coupon was generated
    expiry_date TIMESTAMP, -- Expiry date of the coupon
    is_redeemed BOOLEAN DEFAULT FALSE, -- Whether the coupon has been used
    redeemed_at TIMESTAMP, -- Timestamp when it was redeemed
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE, -- The coupon being redeemed
    business_id UUID REFERENCES business(id) ON DELETE CASCADE, -- Where it was redeemed
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL, -- Which customer redeemed it
    redeemed_by_user UUID, -- (Optional) The employee/user who scanned it
    redeemed_at TIMESTAMP DEFAULT now(), -- When it was redeemed
    UNIQUE (coupon_id) -- Ensures each coupon is redeemed only once
);

CREATE INDEX idx_coupons_business_id ON coupons(business_id);
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupon_redemptions_customer ON coupon_redemptions(customer_id);
CREATE INDEX idx_coupon_configurations_business_id ON coupon_configurations(business_id);


ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;


CREATE POLICY select_coupons ON coupons
    FOR SELECT
    USING (is_user_in_business(business_id));

CREATE POLICY insert_coupons ON coupons
    FOR INSERT
    WITH CHECK (is_user_in_business(business_id));

CREATE POLICY update_coupons ON coupons
    FOR UPDATE
    USING (is_user_in_business(business_id))
    WITH CHECK (is_user_in_business(business_id));

CREATE POLICY delete_coupons ON coupons
    FOR DELETE
    USING (is_user_in_business(business_id));



-- ✅ Businesses can manage coupons they create.
-- ✅ Customers can view and redeem their own coupons.
-- ✅ Coupons can only be redeemed once.


-- ✅ Allows customers to see their own coupons.

CREATE POLICY customer_select_own_coupons ON coupons
    FOR SELECT
    USING (customer_id = auth.uid());

-- ✅ Businesses can manage coupons they create.
CREATE POLICY business_manage_coupons ON coupons
    FOR ALL
    USING (is_user_in_business(business_id))
    WITH CHECK (is_user_in_business(business_id));

-- ✅ Customers can redeem their own coupons, but only once per coupon
CREATE POLICY customer_redeem_own_coupons ON coupon_redemptions
    FOR INSERT
    WITH CHECK (
        customer_id = auth.uid() 
        AND NOT EXISTS (
            SELECT 1 
            FROM coupon_redemptions r
            WHERE r.coupon_id = coupon_redemptions.coupon_id
        )
    );


-- ✅ Businesses can view coupon redemptions.
CREATE POLICY business_view_coupon_redemptions ON coupon_redemptions
    FOR SELECT
    USING (
        is_user_in_business(business_id)
    );

-- ✅ Customers can view their own coupon redemptions.
GRANT SELECT, INSERT, UPDATE, DELETE ON coupons TO authenticated;
GRANT SELECT, INSERT ON coupon_redemptions TO authenticated;
