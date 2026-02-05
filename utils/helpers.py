import requests
from bs4 import BeautifulSoup

from seo_engine.onpage import analyze_onpage
from seo_engine.technical import analyze_technical
from seo_engine.content import analyze_content
from seo_engine.scoring import calculate_score


def run_full_audit(url):
    response = requests.get(
        url,
        timeout=10,
        headers={"User-Agent": "Mozilla/5.0"}
    )

    soup = BeautifulSoup(response.text, "html.parser")

    onpage = analyze_onpage(soup)
    technical = analyze_technical(url, response)
    content = analyze_content(soup)

    final_score = calculate_score([
        onpage["score"],
        technical["score"],
        content["score"]
    ])

    return {
        "url": url,
        "score": final_score,
        "bars": {
            "passed": len(onpage["passed"]) + len(content["passed"]),
            "warning": len(onpage["issues"]) + len(content["issues"]),
            "failed": len(technical["issues"])
        },
        "issues": {
            "onPage": onpage["issues"],
            "technical": technical["issues"],
            "content": content["issues"]
        }
    }
