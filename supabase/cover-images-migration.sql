-- Add cover_image column to blog posts
alter table posts add column if not exists cover_image text;

-- Add cover_image column to deals/offers
alter table deals add column if not exists cover_image text;
