USE exam_system;

DELIMITER //

CREATE PROCEDURE get_next_adaptive_question(IN p_session_id INT)
BEGIN
    DECLARE v_exam_id INT;
    DECLARE v_current_theta FLOAT;

    SELECT exam_id, current_theta INTO v_exam_id, v_current_theta 
    FROM exam_sessions 
    WHERE session_id = p_session_id;

    SELECT q.*
    FROM questions q
    LEFT JOIN response_log r ON q.question_id = r.question_id AND r.session_id = p_session_id
    WHERE q.exam_id = v_exam_id AND r.question_id IS NULL
    ORDER BY ABS(q.difficulty_b - v_current_theta) ASC
    LIMIT 1;
END //

CREATE PROCEDURE calculate_percentile(IN p_session_id INT)
BEGIN
    DECLARE v_exam_id INT;
    DECLARE v_theta FLOAT;
    DECLARE v_total_takers INT;
    DECLARE v_takers_below INT;

    SELECT e.exam_id, s.current_theta 
    INTO v_exam_id, v_theta
    FROM exam_sessions s JOIN exams e ON s.exam_id = e.exam_id
    WHERE s.session_id = p_session_id;

    SELECT COUNT(DISTINCT session_id) INTO v_total_takers
    FROM exam_sessions 
    WHERE exam_id = v_exam_id AND status = 'completed';

    SELECT COUNT(DISTINCT session_id) INTO v_takers_below
    FROM exam_sessions 
    WHERE exam_id = v_exam_id AND status = 'completed' AND current_theta < v_theta;

    IF v_total_takers > 0 THEN
        SELECT (v_takers_below / v_total_takers) * 100 AS percentile;
    ELSE
        SELECT 100 AS percentile;
    END IF;
END //

CREATE PROCEDURE flag_suspicious_session(
    IN p_session_id INT, 
    IN p_reason VARCHAR(255), 
    IN p_severity VARCHAR(20)
)
BEGIN
    INSERT INTO cheat_flags (session_id, flag_type, severity, notes)
    VALUES (p_session_id, 'SYSTEM_FLAG', p_severity, p_reason);
    
    UPDATE exam_sessions
    SET suspicious_score = suspicious_score + CASE 
        WHEN p_severity = 'low' THEN 10
        WHEN p_severity = 'medium' THEN 20
        WHEN p_severity = 'high' THEN 30
        WHEN p_severity = 'critical' THEN 50
        ELSE 0
    END
    WHERE session_id = p_session_id;
END //

CREATE PROCEDURE get_topic_performance(IN p_student_id INT)
BEGIN
    SELECT 
        q.topic_tag,
        COUNT(r.response_id) as total_attempted,
        SUM(r.is_correct) as total_correct,
        (SUM(r.is_correct) / COUNT(r.response_id)) * 100 as accuracy,
        AVG(r.time_taken_secs) as avg_time_spent
    FROM response_log r
    JOIN questions q ON r.question_id = q.question_id
    JOIN exam_sessions s ON r.session_id = s.session_id
    WHERE s.student_id = p_student_id AND s.status = 'completed'
    GROUP BY q.topic_tag;
END //

CREATE PROCEDURE get_exam_analytics(IN p_exam_id INT)
BEGIN
    SELECT 
        COUNT(s.session_id) as total_sessions,
        SUM(CASE WHEN s.status = 'completed' THEN 1 ELSE 0 END) as completed_sessions,
        AVG(s.current_theta) as avg_class_theta,
        MAX(s.current_theta) as max_theta,
        MIN(s.current_theta) as min_theta
    FROM exam_sessions s
    WHERE s.exam_id = p_exam_id;
END //

DELIMITER ;
