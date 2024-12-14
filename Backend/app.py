from flask import Flask, request, Response
from flask_cors import CORS
from bedrock_server import generate_quiz_questions
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the Limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/generate-quiz', methods=['POST', 'GET'])
@limiter.limit("10 per minute") 
def generate_quiz():
    if request.method == 'POST':
        data = request.get_json()
        input_topic = data.get('topic')
    else:  # GET request
        input_topic = request.args.get('topic')

    if not input_topic:
        return Response('{"error": "Topic is required"}', status=400, mimetype='application/json')

    result = generate_quiz_questions(input_topic)
    return Response(result, mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)