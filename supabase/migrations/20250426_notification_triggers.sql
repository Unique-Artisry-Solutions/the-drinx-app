
-- First, add new notification categories
INSERT INTO public.notification_categories (name, description)
VALUES
('recipe_submission', 'Notifications for mocktail recipe submissions'),
('mocktail_review', 'Notifications for reviews on mocktails'),
('marketing_material', 'Notifications for promotional marketing material'),
('new_mocktail', 'Notifications for newly created mocktails')
ON CONFLICT (name) DO NOTHING;

-- Create the trigger function for mocktail suggestions (recipe submissions)
CREATE OR REPLACE FUNCTION public.generate_recipe_submission_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.notifications (
    recipient_id,
    recipient_type,
    title,
    content,
    priority,
    category_id,
    metadata
  )
  VALUES (
    NEW.establishment_id,
    'establishment',
    'New Mocktail Recipe Suggestion',
    'A user has submitted a new mocktail recipe suggestion: ' || NEW.name,
    'medium',
    (SELECT id FROM notification_categories WHERE name = 'recipe_submission'),
    jsonb_build_object(
      'suggestion_id', NEW.id,
      'user_id', NEW.user_id,
      'recipe_name', NEW.name,
      'submission_time', NEW.created_at
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for mocktail suggestions
DROP TRIGGER IF EXISTS mocktail_suggestion_notification_trigger ON public.mocktail_suggestions;
CREATE TRIGGER mocktail_suggestion_notification_trigger
  AFTER INSERT ON public.mocktail_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_recipe_submission_notification();

-- Create the trigger function for mocktail reviews
CREATE OR REPLACE FUNCTION public.generate_mocktail_review_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  establishment_id uuid;
  mocktail_name text;
BEGIN
  -- Get the establishment ID for the cocktail being reviewed
  SELECT e.id, c.name INTO establishment_id, mocktail_name
  FROM public.cocktails c
  JOIN public.establishments e ON e.id = c.establishment_id
  WHERE c.id = NEW.cocktail_id::uuid;
  
  IF establishment_id IS NULL THEN
    RETURN NEW; -- Exit if we can't find the establishment
  END IF;
  
  -- Create notification for the establishment owner
  INSERT INTO public.notifications (
    recipient_id,
    recipient_type,
    title,
    content,
    priority,
    category_id,
    metadata
  )
  VALUES (
    establishment_id,
    'establishment',
    'New Review for ' || mocktail_name,
    'A user has left a ' || NEW.rating || '-star review on your mocktail.',
    CASE
      WHEN NEW.rating <= 2 THEN 'high'
      WHEN NEW.rating = 3 THEN 'medium'
      ELSE 'low'
    END,
    (SELECT id FROM notification_categories WHERE name = 'mocktail_review'),
    jsonb_build_object(
      'review_id', NEW.id,
      'user_id', NEW.user_id,
      'cocktail_id', NEW.cocktail_id,
      'cocktail_name', mocktail_name,
      'rating', NEW.rating,
      'review_text', NEW.text
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for mocktail reviews
DROP TRIGGER IF EXISTS mocktail_review_notification_trigger ON public.cocktail_reviews;
CREATE TRIGGER mocktail_review_notification_trigger
  AFTER INSERT ON public.cocktail_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_mocktail_review_notification();

-- Create the trigger function for new mocktails
CREATE OR REPLACE FUNCTION public.generate_new_mocktail_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  favorite_user record;
  establishment_name text;
BEGIN
  -- Get the establishment name
  SELECT name INTO establishment_name
  FROM public.establishments
  WHERE id = NEW.establishment_id;
  
  -- Create notifications for users who have favorited this establishment
  FOR favorite_user IN
    SELECT f.user_id
    FROM public.favorites f
    WHERE f.establishment_id = NEW.establishment_id
  LOOP
    INSERT INTO public.notifications (
      recipient_id,
      recipient_type,
      title,
      content,
      priority,
      category_id,
      metadata
    )
    VALUES (
      favorite_user.user_id,
      'individual',
      'New Mocktail at ' || establishment_name,
      establishment_name || ' has added a new mocktail: ' || NEW.name,
      'medium',
      (SELECT id FROM notification_categories WHERE name = 'new_mocktail'),
      jsonb_build_object(
        'cocktail_id', NEW.id,
        'establishment_id', NEW.establishment_id,
        'establishment_name', establishment_name,
        'cocktail_name', NEW.name,
        'created_at', NEW.created_at
      )
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new mocktails
DROP TRIGGER IF EXISTS new_mocktail_notification_trigger ON public.cocktails;
CREATE TRIGGER new_mocktail_notification_trigger
  AFTER INSERT ON public.cocktails
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_new_mocktail_notification();

-- Create tables for promoter marketing materials if they don't exist
CREATE TABLE IF NOT EXISTS public.bar_crawl_marketing_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bar_crawl_id uuid REFERENCES public.bar_crawls(id) NOT NULL,
  promoter_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  material_type text NOT NULL,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create the trigger function for marketing materials
CREATE OR REPLACE FUNCTION public.generate_bar_crawl_marketing_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  estab record;
  bar_crawl_name text;
BEGIN
  -- Get the bar crawl name
  SELECT name INTO bar_crawl_name
  FROM public.bar_crawls
  WHERE id = NEW.bar_crawl_id;
  
  -- Create notifications for establishments in this bar crawl
  FOR estab IN
    SELECT bce.establishment_id
    FROM public.bar_crawl_establishments bce
    WHERE bce.bar_crawl_id = NEW.bar_crawl_id
  LOOP
    INSERT INTO public.notifications (
      recipient_id,
      recipient_type,
      title,
      content,
      priority,
      category_id,
      metadata
    )
    VALUES (
      estab.establishment_id,
      'establishment',
      'New Marketing Material for ' || bar_crawl_name,
      'A promoter has added new marketing material for ' || bar_crawl_name || ': ' || NEW.title,
      'high',
      (SELECT id FROM notification_categories WHERE name = 'marketing_material'),
      jsonb_build_object(
        'material_id', NEW.id,
        'bar_crawl_id', NEW.bar_crawl_id,
        'bar_crawl_name', bar_crawl_name,
        'promoter_id', NEW.promoter_id,
        'material_type', NEW.material_type
      )
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger for marketing materials
DROP TRIGGER IF EXISTS marketing_material_notification_trigger ON public.bar_crawl_marketing_materials;
CREATE TRIGGER marketing_material_notification_trigger
  AFTER INSERT ON public.bar_crawl_marketing_materials
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_bar_crawl_marketing_notification();

-- Create or replace function to auto-update 'updated_at' columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Add trigger for bar_crawl_marketing_materials updated_at
DROP TRIGGER IF EXISTS update_bar_crawl_marketing_materials_updated_at ON public.bar_crawl_marketing_materials;
CREATE TRIGGER update_bar_crawl_marketing_materials_updated_at
  BEFORE UPDATE ON public.bar_crawl_marketing_materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
