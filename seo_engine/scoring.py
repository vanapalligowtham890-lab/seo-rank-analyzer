def calculate_score(scores):
    """
    scores: list of negative values
    returns final score between 0–100
    """
    base = 100
    final = base + sum(scores)

    if final < 0:
        final = 0
    if final > 100:
        final = 100

    return final
