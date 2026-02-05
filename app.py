from flask import Flask, render_template, request, redirect, url_for, jsonify
from utils.helpers import run_full_audit   # <-- REAL SEO LOGIC

app = Flask(__name__)

# =========================
# PAGES
# =========================

@app.route("/")
def home():
    return render_template("home.html")


@app.route("/audit", methods=["GET", "POST"])
def audit():
    if request.method == "POST":
        website = request.form.get("url")

        # Basic validation
        if not website.startswith("http"):
            website = "https://" + website

        return redirect(url_for("result", site=website))

    return render_template("audit.html")


@app.route("/result")
def result():
    site = request.args.get("site", "")
    return render_template("result.html", site=site)


@app.route("/compare")
def compare():
    return render_template("compare.html")


@app.route("/suggestions")
def suggestions():
    return render_template("suggestions.html")


@app.route("/blog")
def blog():
    return render_template("blog.html")


# =========================
# SEO AUDIT API (REAL DATA)
# =========================
@app.route("/api/audit", methods=["GET"])
def api_audit():
    site = request.args.get("site")

    if not site:
        return jsonify({"error": "Website URL missing"}), 400

    try:
        seo_result = run_full_audit(site)
        return jsonify(seo_result)

    except Exception as e:
        return jsonify({
            "error": "SEO audit failed",
            "message": str(e)
        }), 500


# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
