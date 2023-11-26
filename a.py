import flask

app=flask.Flask("a")

@app.route("/")
def index():
    return flask.Response("Hello World",900)

app.run("localhost",8000)