import requests
from bs4 import BeautifulSoup

def analyze_competitor(main_url, competitor_url):
    tests = []

    try:
        main = BeautifulSoup(requests.get(main_url).text, "html.parser")
        comp = BeautifulSoup(requests.get(competitor_url).text, "html.parser")

        main_words = len(main.get_text().split())
        comp_words = len(comp.get_text().split())

        if main_words >= comp_words:
            tests.append({
                "name": "Content length vs competitor",
                "status": "pass",
                "message": "Your content is longer than competitor",
                "impact": 2
            })
        else:
            tests.append({
                "name": "Content length vs competitor",
                "status": "fail",
                "message": "Competitor has more content",
                "impact": 2
            })

    except:
        tests.append({
            "name": "Competitor analysis",
            "status": "warning",
            "message": "Competitor data unavailable",
            "impact": 0
        })

    return tests
