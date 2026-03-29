import math
from typing import List, Tuple

def irt_probability(theta: float, b: float, a: float = 1.0) -> float:
    """
    Formula: P = 1 / (1 + e^(-1.7 * a * (theta - b)))
    """
    exponent = -1.7 * a * (theta - b)
    if exponent > 50:
        return 0.0
    if exponent < -50:
        return 1.0
    return 1.0 / (1.0 + math.exp(exponent))

def update_theta(theta: float, responses: List[Tuple[bool, float, float]]) -> float:
    """
    Use Newton-Raphson MLE with up to 20 iterations.
    responses: list of (is_correct, b, a)
    """
    if not responses:
        return theta
        
    for _ in range(20):
        numerator_sum = 0.0
        denominator_sum = 0.0
        
        for is_correct, b, a in responses:
            P = irt_probability(theta, b, a)
            u = 1.0 if is_correct else 0.0
            
            numerator_sum += a * (u - P)
            denominator_sum += - (a ** 2) * P * (1 - P) * 1.7
            
        if abs(denominator_sum) < 0.0001:
            break
            
        delta = numerator_sum / denominator_sum
        theta -= delta
        
        theta = max(-4.0, min(4.0, theta))
        
        if abs(delta) < 0.01:
            break
            
    return theta

def theta_to_grade(theta: float) -> str:
    if theta >= 2.0: return "A+"
    if theta >= 1.5: return "A"
    if theta >= 0.8: return "B+"
    if theta >= 0.0: return "B"
    if theta >= -0.8: return "C"
    if theta >= -1.5: return "D"
    return "F"

def theta_to_percentile(theta: float, all_thetas: List[float]) -> float:
    if not all_thetas:
        return 50.0
    below = sum(1 for t in all_thetas if t < theta)
    return (below / len(all_thetas)) * 100.0
