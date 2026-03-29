from typing import List
from app.models.question import Question

def select_next_question(theta: float, available_questions: List[Question]) -> Question:
    """
    Pick question where |difficulty_b - theta| is minimized.
    """
    if not available_questions:
        return None
        
    available_questions.sort(key=lambda q: abs(q.difficulty_b - theta))
    
    return available_questions[0]
