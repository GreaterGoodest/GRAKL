from flask import Flask, render_template, request
from flask_bootstrap import Bootstrap

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
Bootstrap(app)

@app.route('/')
def index():
    return render_template('index.html')
