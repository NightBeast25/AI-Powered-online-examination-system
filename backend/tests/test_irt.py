from app.services.irt_engine import irt_probability, theta_to_grade

def test_irt_probability():
    p = irt_probability(theta=0.0, b=0.0, a=1.0)
    assert 0.4 < p < 0.6

def test_theta_to_grade():
    assert theta_to_grade(2.5) == "A+"
    assert theta_to_grade(0.0) == "B"
    assert theta_to_grade(-2.0) == "F"
