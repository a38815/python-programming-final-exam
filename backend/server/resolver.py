from ariadne import QueryType, MutationType, ObjectType
import pymongo
from database import db
from bson.objectid import ObjectId
from model import Category, Product, User
import jwt
from graphql import GraphQLError

query = QueryType()
mutation = MutationType()
category = ObjectType("Category")
product = ObjectType("Product")
user = ObjectType("User")

# pagination and filtering 
@query.field("categories")
def resolve_categories(*_, input):
    limit = input.get("limit", 10) 
    page = input.get("page", 1)
    order = input.get("order", "asc")
    sortBy = input.get("sortBy", "name") 
    return db.categories.find().skip((page - 1) * limit).limit(limit).sort([(sortBy, pymongo.ASCENDING if order == "asc" else pymongo.DESCENDING)])

@query.field("category")
def resolve_category(_, info, _id):
    return db.categories.find_one({"_id": ObjectId(_id)})

@category.field("products")
def resolve_category_products(category, info):
    return db.products.find({"categoryId": category["_id"]})
    
@query.field("products")
def resolve_products(*_, input):
    limit = input.get("limit", 10)
    page = input.get("page", 1)
    order = input.get("order", "asc")
    sortBy = input.get("sortBy", "name")
    return db.products.find().skip((page - 1) * limit).limit(limit).sort([(sortBy, pymongo.ASCENDING if order == "asc" else pymongo.DESCENDING)])

@query.field("product")
def resolve_product(_, info, _id):
    return db.products.find_one({"_id": ObjectId(_id)})

@product.field("category")
def resolve_product_category(product, info):
    return db.categories.find_one({"_id": product["categoryId"]})

@query.field("user")
def resolve_user(_, info, _id):
    return db.users.find_one({"_id": ObjectId(_id)})

@query.field("users")
def resolve_users(*_, input):
    limit = input.get("limit", 10)
    page = input.get("page", 1)
    order = input.get("order", "asc")
    sortBy = input.get("sortBy", "name")
    return db.users.find().skip((page - 1) * limit).limit(limit).sort([(sortBy, pymongo.ASCENDING if order == "asc" else pymongo.DESCENDING)])

@mutation.field("createCategory")
def resolve_create_category(_, info, input):
    current_user_id = info.context.get("user_id")
    if not current_user_id:
        raise GraphQLError("You must be logged to create user!")
    category = Category(input["name"])
    db.categories.insert_one(category.__dict__)
    return category

@mutation.field("createProduct")
def resolve_create_product(_, info, input):
    current_user_id = info.context.get("user_id")
    if not current_user_id:
        raise GraphQLError("You must be logged to create user!")
    product = Product(**input)
    db.products.insert_one(product.__dict__)
    return product

@mutation.field("createUser")
def resolve_create_user(_, info, input):
    current_user_id = info.context.get("user_id")
    if not current_user_id:
        raise GraphQLError("You must be logged to create user!")
    user = User(**input)
    # When a document is inserted a special key, "_id", is automatically added if the document doesn’t already contain an "_id" key.
    db.users.insert_one(user.__dict__) 
    
    return {
        "user": user,
        "token": jwt.encode({"user_id": str(user._id)}, "secret", algorithm="HS256")
    }
    
@mutation.field("login")
def resolve_login(_, info, input):
    user = db.users.find_one(input)
    if user:
        return {
            "user": user,
            "token": jwt.encode({"user_id": str(user["_id"])}, "secret", algorithm="HS256")
        }
    return None

@mutation.field("updateProduct")   
def resolve_update_product(_, info, _id, input):
    current_user_id = info.context.get("user_id")
    categoryId = input.get("categoryId")
    if categoryId:
        input["categoryId"] = ObjectId(categoryId)
    if not current_user_id:
        raise GraphQLError("You must be logged to create user!")
    try:
        db.products.update_one({"_id": ObjectId(_id)}, {"$set": input})
    except Exception as e:
        print(e)
    return db.products.find_one({"_id": ObjectId(_id)}) 

@mutation.field("updateCategory")
def resolve_update_category(_, info, _id, input):
    current_user_id = info.context.get("user_id")
    if not current_user_id:
        raise GraphQLError("You must be logged to create user!")
    
    try:
        db.categories.update_one({"_id": ObjectId(_id)}, {"$set": input})
    except Exception as e:
        print(e)
    return db.categories.find_one({"_id": ObjectId(_id)})

@mutation.field("deleteProduct")
def resolve_delete_product(_, info, _id):
    current_user_id = info.context.get("user_id")
    if not current_user_id:
        raise GraphQLError("You must be logged to create user!")
    p = db.products.find_one({"_id": ObjectId(_id)})
    try:
        if p:
            db.products.delete_one({"_id": ObjectId(_id)})
    except Exception as e:
        print(e)
    return p

@mutation.field("deleteCategory")
def resolve_delete_category(_, info, _id):
    current_user_id = info.context.get("user_id")
    if not current_user_id:
        raise GraphQLError("You must be logged to create user!")
    c = db.categories.find_one({"_id": ObjectId(_id)})
    # delete all products in the category
    try:
        if c:
            db.products.delete_many({"categoryId": ObjectId(_id)})
            db.categories.delete_one({"_id": ObjectId(_id)})
    except Exception as e:
        print(e)
    return c