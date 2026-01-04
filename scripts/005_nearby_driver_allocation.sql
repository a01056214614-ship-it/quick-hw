-- 가까운 배송원 찾기 및 자동 할당 시스템

-- 가까운 배송원 찾기 함수 (거리순 정렬)
CREATE OR REPLACE FUNCTION find_nearby_drivers(
  pickup_lat FLOAT,
  pickup_lng FLOAT,
  max_distance_km FLOAT DEFAULT 10.0,
  limit_count INT DEFAULT 10
)
RETURNS TABLE(
  driver_id UUID,
  driver_name TEXT,
  driver_phone TEXT,
  current_lat FLOAT,
  current_lng FLOAT,
  distance_km FLOAT,
  rating DECIMAL,
  total_deliveries INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    di.id,
    u.name,
    u.phone,
    di.current_latitude,
    di.current_longitude,
    calculate_distance(
      pickup_lat, 
      pickup_lng, 
      di.current_latitude, 
      di.current_longitude
    ) as distance,
    di.rating,
    di.total_deliveries
  FROM driver_info di
  JOIN auth.users u ON di.id = u.id
  WHERE 
    di.is_available = true
    AND di.current_latitude IS NOT NULL
    AND di.current_longitude IS NOT NULL
    AND calculate_distance(
      pickup_lat, 
      pickup_lng, 
      di.current_latitude, 
      di.current_longitude
    ) <= max_distance_km
  ORDER BY distance ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 배송 생성 시 가까운 배송원들에게 알림 보내기
CREATE OR REPLACE FUNCTION notify_nearby_drivers()
RETURNS TRIGGER AS $$
DECLARE
  nearby_driver RECORD;
  pickup_coords RECORD;
BEGIN
  -- 새로운 배송 요청이 생성되고 상태가 pending일 때만 실행
  IF NEW.status = 'pending' AND OLD.id IS NULL THEN
    -- pickup_location에서 좌표 추출
    SELECT 
      ST_Y(NEW.pickup_location::geometry) as lat,
      ST_X(NEW.pickup_location::geometry) as lng
    INTO pickup_coords;
    
    -- 가까운 배송원들 찾기 (반경 10km 이내)
    FOR nearby_driver IN 
      SELECT * FROM find_nearby_drivers(
        pickup_coords.lat,
        pickup_coords.lng,
        10.0,
        5
      )
    LOOP
      -- 각 배송원에게 알림 생성
      PERFORM create_notification(
        nearby_driver.driver_id,
        NEW.id,
        '새로운 배송 요청',
        format(
          '픽업 위치에서 %.1f km 거리에 새로운 배송 요청이 있습니다. 배송료: %s원',
          nearby_driver.distance_km,
          NEW.total_fee
        ),
        'new_delivery'
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성 (이미 존재하면 먼저 삭제)
DROP TRIGGER IF EXISTS notify_nearby_drivers_trigger ON deliveries;

CREATE TRIGGER notify_nearby_drivers_trigger
AFTER INSERT ON deliveries
FOR EACH ROW
EXECUTE FUNCTION notify_nearby_drivers();

-- 배송원이 배송을 수락할 때 다른 알림들을 읽음 처리
CREATE OR REPLACE FUNCTION mark_other_notifications_read()
RETURNS TRIGGER AS $$
BEGIN
  -- 배송이 수락되면 같은 배송에 대한 다른 배송원들의 알림을 읽음 처리
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    UPDATE notifications
    SET is_read = true
    WHERE delivery_id = NEW.id
    AND user_id != NEW.driver_id
    AND type = 'new_delivery'
    AND is_read = false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS mark_other_notifications_read_trigger ON deliveries;

CREATE TRIGGER mark_other_notifications_read_trigger
AFTER UPDATE ON deliveries
FOR EACH ROW
EXECUTE FUNCTION mark_other_notifications_read();
