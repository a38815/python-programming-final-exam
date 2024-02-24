# Description: This file contains the classes for the database tables.
# The classes are used to create objects for the tables.
# Database: MongoDB
from bson.objectid import ObjectId

class Product():
    def __init__(self, name, categoryId, description = None, image = None, price = None):
        self.name = name
        self.description = description
        self.price = price
        self.image = image
        self.categoryId = ObjectId(categoryId)

class Category():
    def __init__(self, name):
        self.name = name

class User():
    def __init__(self, email, password, age=None, name=None):
        self.name = name
        self.age = age
        self.email = email
        self.password = password