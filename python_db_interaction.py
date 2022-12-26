
import sqlite3
  
def get_all():
    connection = sqlite3.connect('spam_users.db')
    results = connection.execute("SELECT * FROM users")
    print(results)
    for row in results:
        print(row)

def get_emails():
    connection = sqlite3.connect('spam_users.db')
    results = connection.execute("SELECT email FROM users")
    for row in results:
        print(row)