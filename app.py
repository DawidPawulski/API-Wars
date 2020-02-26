from flask import Flask, render_template, request, redirect, session, url_for, jsonify
import data_manager
import os
import util


app = Flask(__name__)

app.secret_key = b'lubie!@#$%^placky%#$#'


@app.route('/')
def show_planets():
    return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login_user():
    if request.method == 'POST':
        username = request.form.get('login-username')
        password = request.form.get('login-password')
        if not util.check_if_username_exists(username):
            return render_template('index.html', incorrect_login=True)
        user_database_password = data_manager.get_user_password(username)
        if util.verify_password(password, user_database_password['password']):
            session['username'] = username
            return redirect(url_for('show_planets'))
        else:
            return render_template('index.html', incorrect_login=True)
    else:
        return redirect(url_for('show_planets'))


@app.route('/register', methods=['GET', 'POST'])
def register_user():
    if request.method == "POST":
        username = request.form['register-username']
        if util.check_if_username_exists(username):
            return render_template('index.html', username_taken=True)
        password = request.form['register-password']
        hashed_password = util.hash_password(password)
        data_manager.add_user(username, hashed_password)
        return redirect(url_for('show_planets'))
    else:
        return redirect(url_for('show_planets'))


@app.route('/logout')
def logout_user():
    session.pop('username', None)
    return redirect(url_for('show_planets'))


@app.route('/vote', methods=['GET', 'POST'])
def save_user_vote():
    if request.method == 'POST':
        planet_id = request.form.get('planet-id')
        planet_name = request.form.get('planet-name')
        username = session['username']
        user_id = data_manager.get_user_id(username)['id']
        data_manager.add_to_planet_votes(planet_id, planet_name, user_id)
        return redirect(url_for('show_planets'))
    else:
        return redirect(url_for('show_planets'))


@app.route('/stats')
def vote_statistics():
    all_votes = data_manager.get_all_planet_votes()
    response = jsonify(all_votes)
    return response


if __name__ == '__main__':
    app.run(debug=True)
