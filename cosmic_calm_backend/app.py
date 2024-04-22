from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
import spacy


app = Flask(__name__)
CORS(app) 

nlp = spacy.load("en_core_web_md")

@app.route('/api/recommendations', methods=['POST'])
def get_user_data():
    try:
        data = request.json
        request_data = request.json
        answers = request_data.get('answers')
        meditations_data = request_data.get('meditations')
        answers = data.get('answers', [])


        # Perform data processing
        user_query = ' '.join(answers)
        user_embedding = nlp(user_query).vector

        meditations_embeddings = []
        for meditation in meditations_data:
            meditation_text = f"{meditation['name']} {meditation['tag']} {meditation['duration']}"
            meditation_embedding = nlp(meditation_text).vector
            meditations_embeddings.append(meditation_embedding)

        meditations_embeddings = np.array(meditations_embeddings)

        similarities = np.dot(meditations_embeddings, user_embedding) / (
                np.linalg.norm(meditations_embeddings, axis=1) * np.linalg.norm(user_embedding))

        top_indices = np.argsort(similarities)[::-1][:3]

        similar_meditations_names = [meditations_data[i]['name'] for i in top_indices]

        return jsonify({
            'similar_meditations_names': similar_meditations_names
        })

    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({'error': 'Internal Server Error'}), 500

if __name__ == '__main__':
    # Set Flask app configurations for production
    app.config['ENV'] = 'production'
    app.config['DEBUG'] = False

    # Run Flask app
    app.run(host='0.0.0.0', port=5000)
