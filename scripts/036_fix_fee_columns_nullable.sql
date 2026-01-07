-- 요금 관련 컬럼을 nullable로 변경
-- 요금은 기사와 고객이 직접 협의하므로 플랫폼이 요금에 관여하지 않음

-- base_fee와 total_fee를 nullable로 변경
ALTER TABLE deliveries 
  ALTER COLUMN base_fee DROP NOT NULL,
  ALTER COLUMN total_fee DROP NOT NULL;

-- 기본값 제거 (선택사항)
ALTER TABLE deliveries 
  ALTER COLUMN base_fee DROP DEFAULT,
  ALTER COLUMN total_fee DROP DEFAULT;

-- 변경 사항 확인
SELECT 
  column_name, 
  is_nullable, 
  column_default,
  data_type
FROM information_schema.columns 
WHERE table_name = 'deliveries' 
  AND column_name IN ('base_fee', 'distance_fee', 'total_fee', 'driver_fee', 'platform_fee')
ORDER BY ordinal_position;

