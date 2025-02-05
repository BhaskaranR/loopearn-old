create table coupon_configuration (
  id bigint primary key generated always as identity,
  business_id uuid references auth.users(id) not null,
  
  -- Core configuration
  payload text not null default '', -- Request payload format/template
  coupon_mapping jsonb not null default '{}'::jsonb, -- Mapping of coupon attributes
  platforms jsonb not null default '[]'::jsonb, -- List of supported platforms
  
  -- Feature flags
  enable_free_product boolean default false, -- Free product coupons
  enable_fixed_rate boolean default false,   -- Fixed-rate discount coupons
  enable_free_shipping boolean default false, -- Free shipping coupons
  enable_percentage boolean default false,    -- Percentage-based discount coupons
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Ensure valid JSONB structure
  constraint valid_coupon_mapping check (
    jsonb_typeof(coupon_mapping) = 'object'
  ),
  constraint valid_platforms check (
    jsonb_typeof(platforms) = 'array'
  )
);

-- Add field documentation
comment on column coupon_configuration.payload is 
  'The request payload format or template';
comment on column coupon_configuration.coupon_mapping is $$
type CouponMapping = {
  discount: string;
  minOrderValue: string;
  [key: string]: string;
};
$$;
comment on column coupon_configuration.platforms is $$
type Platform = {
  displayName: string;
  value: string;
}[];
$$;

-- Add updated_at trigger
create trigger set_timestamp
before update on coupon_configuration
for each row
execute procedure trigger_set_timestamp();

-- RLS policy
alter table coupon_configuration enable row level security;

create policy "Users can only view their own coupon configurations"
  on coupon_configuration
  for all
  using (auth.uid() = business_id);



--   -- Insert a new configuration
-- insert into coupon_configuration (
--   business_id,
--   payload,
--   coupon_mapping,
--   platforms,
--   enable_percentage,
--   enable_free_shipping,
--   enable_free_product
-- ) values (
--   auth.uid(),
--   '{ "couponCode": "DISCOUNT10" }',
--   '{
--     "discount": "percentage",
--     "minOrderValue": "100"
--   }',
--   '[
--     {
--       "displayName": "Shopify",
--       "value": "shopify"
--     },
--     {
--       "displayName": "WooCommerce",
--       "value": "woocommerce"
--     }
--   ]',
--   true,
--   true,
--   true
-- );