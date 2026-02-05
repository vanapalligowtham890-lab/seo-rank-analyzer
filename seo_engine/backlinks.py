from bs4 import BeautifulSoup
import requests

def analyze_backlinks(url, soup):
    tests = []

    links = soup.find_all("a", href=True)
    external_links = [
        l for l in links
        if l["href"].startswith("http") and url not in l["href"]
    ]

    # Test 1: External links exist
    if len(external_links) > 0:
        tests.append({
            "name": "External links present",
            "status": "pass",
            "message": f"{len(external_links)} external links found",
            "impact": 1
        })
    else:
        tests.append({
            "name": "External links present",
            "status": "warning",
            "message": "No external links found",
            "impact": 1
        })

    # Test 2: Nofollow links
    nofollow = [l for l in external_links if "nofollow" in str(l)]
    if nofollow:
        tests.append({
            "name": "Nofollow links",
            "status": "pass",
            "message": "Nofollow links detected",
            "impact": 1
        })
    else:
        tests.append({
            "name": "Nofollow links",
            "status": "warning",
            "message": "No nofollow links detected",
            "impact": 1
        })

    return tests
