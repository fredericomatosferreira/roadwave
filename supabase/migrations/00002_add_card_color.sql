-- Add color column to cards table
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS color text;
