CREATE DATABASE IF NOT EXISTS exam_system;
USE exam_system;

CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exams (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    total_questions INT NOT NULL,
    time_limit_mins INT NOT NULL,
    passing_theta FLOAT NOT NULL DEFAULT 0.0,
    created_by INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES admins(admin_id) ON DELETE CASCADE
);

CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL,
    difficulty_level ENUM('easy', 'medium', 'hard') NOT NULL,
    difficulty_b FLOAT NOT NULL,
    discrimination_a FLOAT NOT NULL DEFAULT 1.0,
    topic_tag VARCHAR(100) NOT NULL,
    subtopic_tag VARCHAR(100) NOT NULL,
    times_used INT DEFAULT 0,
    times_correct INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
);

CREATE TABLE question_tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    tag_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

CREATE TABLE exam_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NULL,
    current_theta FLOAT DEFAULT 0.0,
    status ENUM('active', 'completed', 'suspended') DEFAULT 'active',
    ip_address VARCHAR(45),
    browser_fingerprint VARCHAR(255),
    suspicious_score INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE
);

CREATE TABLE response_log (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    question_id INT NOT NULL,
    selected_option CHAR(1),
    is_correct BOOLEAN NOT NULL,
    time_taken_secs INT NOT NULL,
    theta_before FLOAT NOT NULL,
    theta_after FLOAT NOT NULL,
    question_order INT NOT NULL,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES exam_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

CREATE TABLE behavioral_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    event_type ENUM('tab_switch', 'window_blur', 'copy_attempt', 'right_click', 'idle_detected', 'speed_anomaly', 'fullscreen_exit') NOT NULL,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSON,
    FOREIGN KEY (session_id) REFERENCES exam_sessions(session_id) ON DELETE CASCADE
);

CREATE TABLE cheat_flags (
    flag_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    flag_type VARCHAR(100) NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    flagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES exam_sessions(session_id) ON DELETE CASCADE
);

CREATE TABLE results (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    theta_score FLOAT NOT NULL,
    percentile FLOAT NOT NULL,
    grade VARCHAR(5) NOT NULL,
    topic_breakdown JSON NOT NULL,
    result_hash VARCHAR(64) NOT NULL UNIQUE,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES exam_sessions(session_id) ON DELETE CASCADE
);

CREATE TABLE performance_cache (
    cache_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    exam_id INT NOT NULL,
    avg_theta FLOAT DEFAULT 0.0,
    total_exams INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exams(exam_id) ON DELETE CASCADE,
    UNIQUE KEY (student_id, exam_id)
);
