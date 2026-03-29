USE exam_system;

CREATE OR REPLACE VIEW student_performance_view AS
SELECT 
    s.student_id,
    s.name,
    COUNT(res.result_id) as exams_completed,
    AVG(res.theta_score) as avg_theta,
    MAX(res.theta_score) as best_theta,
    AVG(res.percentile) as avg_percentile
FROM students s
LEFT JOIN exam_sessions es ON s.student_id = es.student_id AND es.status = 'completed'
LEFT JOIN results res ON es.session_id = res.session_id
GROUP BY s.student_id, s.name;

CREATE OR REPLACE VIEW exam_difficulty_distribution_view AS
SELECT 
    e.exam_id,
    e.title,
    q.difficulty_level,
    COUNT(q.question_id) as total_questions,
    AVG(q.times_correct / NULLIF(q.times_used, 0)) as average_pass_rate
FROM exams e
JOIN questions q ON e.exam_id = q.exam_id
GROUP BY e.exam_id, e.title, q.difficulty_level;

CREATE OR REPLACE VIEW daily_exam_activity_view AS
SELECT 
    DATE(start_time) as activity_date,
    COUNT(session_id) as total_sessions,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completions,
    SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspensions
FROM exam_sessions
GROUP BY DATE(start_time);

CREATE OR REPLACE VIEW topic_weakness_view AS
SELECT 
    s.student_id,
    s.name,
    q.topic_tag,
    AVG(r.time_taken_secs) as avg_time,
    (SUM(r.is_correct) / COUNT(r.response_id)) * 100 as accuracy
FROM students s
JOIN exam_sessions es ON s.student_id = es.student_id
JOIN response_log r ON es.session_id = r.session_id
JOIN questions q ON r.question_id = q.question_id
GROUP BY s.student_id, s.name, q.topic_tag;
