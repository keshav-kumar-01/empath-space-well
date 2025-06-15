
-- Add missing columns to appointments table for tracking status changes
ALTER TABLE public.appointments 
ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN cancellation_reason TEXT;
