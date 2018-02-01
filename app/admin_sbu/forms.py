from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Length, Email, Regexp, EqualTo
from wtforms import ValidationError


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Length(1, 64), Email()],
                        render_kw={'placeholder': 'Enter Your Email'})
    password = PasswordField('Password', validators=[DataRequired()],
                             render_kw={'placeholder': 'Enter Your password'})
    remember_me = BooleanField('Keep me logged in')
    submit = SubmitField('Log In')
