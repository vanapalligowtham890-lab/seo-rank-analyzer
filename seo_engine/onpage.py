def analyze_onpage(soup):
    issues = []
    passed = []
    score = 0

    # Title
    title = soup.title.string.strip() if soup.title else ""
    if not title:
        issues.append("Missing title tag")
        score -= 10
    elif len(title) < 30 or len(title) > 60:
        issues.append("Title length not optimal (30–60 chars)")
        score -= 5
    else:
        passed.append("Title tag optimized")

    # Meta description
    meta = soup.find("meta", attrs={"name": "description"})
    if not meta or not meta.get("content"):
        issues.append("Meta description missing")
        score -= 10
    else:
        passed.append("Meta description present")

    # H1
    h1s = soup.find_all("h1")
    if len(h1s) == 0:
        issues.append("No H1 tag found")
        score -= 10
    elif len(h1s) > 1:
        issues.append("Multiple H1 tags found")
        score -= 5
    else:
        passed.append("H1 tag optimized")

    return {
        "score": score,
        "issues": issues,
        "passed": passed
    }
