import time
import requests

def analyze_technical(url, response):
    issues = []
    passed = []
    score = 0

    # HTTPS
    if not url.startswith("https"):
        issues.append("Website not using HTTPS")
        score -= 10
    else:
        passed.append("HTTPS enabled")

    # Status code
    if response.status_code != 200:
        issues.append(f"Page returned status code {response.status_code}")
        score -= 5
    else:
        passed.append("Page returns 200 status")

    # Page load time
    start = time.time()
    requests.get(url, timeout=10)
    load_time = time.time() - start

    if load_time > 3:
        issues.append("Page load time is slow")
        score -= 5
    else:
        passed.append("Page load time is good")

    return {
        "score": score,
        "issues": issues,
        "passed": passed
    }
