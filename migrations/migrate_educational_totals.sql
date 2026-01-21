-- Migration: Update educational_qualifications table to use JSON arrays for totals
-- This migration replaces flat total fields with JSON array fields

-- Step 1: Add new JSON columns for total attempts
ALTER TABLE educational_qualifications 
ADD COLUMN totalPlusOneAttempts JSON COMMENT 'Array of total attempts for Plus One [{maxMarks, score, percentage}]';

ALTER TABLE educational_qualifications 
ADD COLUMN totalPlusTwoAttempts JSON COMMENT 'Array of total attempts for Plus Two [{maxMarks, score, percentage}]';

-- Step 2: Migrate existing data from flat fields to JSON arrays (if any data exists)
-- This converts the old flat structure to the new array structure
UPDATE educational_qualifications
SET 
  totalPlusOneAttempts = JSON_ARRAY(
    JSON_OBJECT(
      'maxMarks', totalPlusOneMaxMarks,
      'score', totalPlusOneScore,
      'percentage', totalPlusOnePercentage
    )
  ),
  totalPlusTwoAttempts = JSON_ARRAY(
    JSON_OBJECT(
      'maxMarks', totalPlusTwoMaxMarks,
      'score', totalPlusTwoScore,
      'percentage', totalPlusTwoPercentage
    )
  )
WHERE totalPlusOneMaxMarks IS NOT NULL OR totalPlusTwoMaxMarks IS NOT NULL;

-- Step 3: Drop old flat columns
ALTER TABLE educational_qualifications 
DROP COLUMN totalPlusOneMaxMarks,
DROP COLUMN totalPlusOneScore,
DROP COLUMN totalPlusOnePercentage,
DROP COLUMN totalPlusTwoMaxMarks,
DROP COLUMN totalPlusTwoScore,
DROP COLUMN totalPlusTwoPercentage;

-- Migration complete!
-- The table now stores totals as JSON arrays matching the frontend structure
