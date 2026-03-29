USE exam_system;

DELIMITER //

CREATE TRIGGER after_response_insert
AFTER INSERT ON response_log
FOR EACH ROW
BEGIN
    UPDATE questions
    SET times_used = times_used + 1,
        times_correct = times_correct + NEW.is_correct
    WHERE question_id = NEW.question_id;

    UPDATE exam_sessions
    SET current_theta = NEW.theta_after
    WHERE session_id = NEW.session_id;
END //

CREATE TRIGGER after_session_complete
AFTER UPDATE ON exam_sessions
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO results (session_id, theta_score, percentile, grade, topic_breakdown, result_hash)
        VALUES (
            NEW.session_id, 
            NEW.current_theta, 
            0.0, 
            'TBD', 
            '{}', 
            SHA2(CONCAT(NEW.session_id, NEW.current_theta, NOW()), 256)
        );
    END IF;
END //

CREATE TRIGGER after_cheat_flag_insert
AFTER INSERT ON cheat_flags
FOR EACH ROW
BEGIN
    DECLARE v_flag_count INT;
    
    SELECT COUNT(*) INTO v_flag_count
    FROM cheat_flags
    WHERE session_id = NEW.session_id;
    
    IF v_flag_count > 3 THEN
        UPDATE exam_sessions
        SET status = 'suspended'
        WHERE session_id = NEW.session_id AND status = 'active';
    END IF;
END //

DELIMITER ;
