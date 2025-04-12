
-- This SQL adds a mood field to the community_posts table
alter table "public"."community_posts" 
add column "mood" text;
