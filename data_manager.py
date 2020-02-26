import database_common
from datetime import datetime
from psycopg2 import sql


@database_common.connection_hanlder
def add_user(cursor, username, password):
    cursor.execute("""
                INSERT INTO users (username, password)
                VALUES (%(username)s, %(password)s)
                    """,
                   {'username': username,
                    'password': password})


@database_common.connection_hanlder
def get_all_username(cursor):
    cursor.execute("""
                SELECT username FROM users;
                """)
    users = cursor.fetchall()
    return users


@database_common.connection_hanlder
def get_user_password(cursor, username):
    cursor.execute("""
                    SELECT password FROM users
                    WHERE username=%(username)s;
                    """,
                   {
                       'username': username
                   })
    password = cursor.fetchall()[0]
    return password


@database_common.connection_hanlder
def add_to_planet_votes(cursor, planet_id, planet_name, user_id):
    cursor.execute("""
                    INSERT INTO planet_votes (planet_id, 
                                            planet_name,
                                            user_id,
                                            submission_time)
                    VALUES (%(planet_id)s,
                            %(planet_name)s,
                            %(user_id)s,
                            %(submission_time)s)
                    """,
                   {
                       'planet_id': planet_id,
                       'planet_name': planet_name,
                       'user_id': user_id,
                       'submission_time': datetime.now()
                   })


@database_common.connection_hanlder
def get_user_id(cursor, username):
    cursor.execute("""
                    SELECT * FROM users
                    WHERE username = %(username)s
                    """, {'username': username})
    user = cursor.fetchall()[0]
    return user


@database_common.connection_hanlder
def get_all_planet_votes(cursor):
    cursor.execute("""
                    SELECT planet_name, count(planet_id) FROM planet_votes 
                    GROUP BY planet_name ORDER BY count DESC;
                    """)
    votes = cursor.fetchall()
    return votes
