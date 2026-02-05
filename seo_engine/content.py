def analyze_content(soup):
    issues = []
    passed = []
    score = 0

    text = soup.get_text(separator=" ")
    words = text.split()
    word_count = len(words)

    if word_count < 300:
        issues.append("Content length is low")
        score -= 10
    else:
        passed.append("Content length is good")

    images = soup.find_all("img")
    missing_alt = [img for img in images if not img.get("alt")]

    if missing_alt:
        issues.append(f"{len(missing_alt)} images missing alt text")
        score -= 5
    else:
        passed.append("All images have alt text")

    return {
        "score": score,
        "issues": issues,
        "passed": passed
    }
