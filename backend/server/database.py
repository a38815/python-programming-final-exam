from pymongo import MongoClient 

client = MongoClient('localhost', 27017, username='root', password='password')
db = client['store']

# create admin user if not exists
user_admin = db.users.find_one({"email": "admin@gmail.com", "password": "admin"})
if not user_admin:
    db.users.insert_one({
        "name": "admin",
        "email": "admin@gmail.com",
        "password": "admin",
        "age": 20})