from ariadne import format_error
from graphql import GraphQLError
import jwt

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
def validate_token(token):
    try:
        token = token.split(" ")[1] 
        user_id= jwt.decode(token, "secret", algorithms=["HS256"])      
        return user_id
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except Exception as e:
        return {"error": "Invalid token"}
    
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS