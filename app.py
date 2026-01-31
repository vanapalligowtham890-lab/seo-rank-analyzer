from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/audit")
def audit():
    return render_template("audit.html")

@app.route("/compare")
def compare():
    return render_template("compare.html")

@app.route("/result")
def result():
    return render_template("result.html")

@app.route("/suggestions")
def suggestions():
    return render_template("suggestions.html")

@app.route("/blog")
def blog():
    return render_template("blog.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
