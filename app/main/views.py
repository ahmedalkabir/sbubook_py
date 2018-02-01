from flask import render_template, redirect, url_for, abort, flash, request, \
    current_app, make_response
from . import main


# show the main page
@main.route('/', methods=['GET', 'POST'])
def index():
    return 'Home Page'
