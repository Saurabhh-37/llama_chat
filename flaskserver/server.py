from flask import Flask, render_template, request, jsonify
import socket

app = Flask(__name__)
current_value = "stop"

# Configuration for the socket
HOST = 'localhost'
PORT = 65434

@app.route('/')
def serve():
    return render_template("index.html")

@app.route('/api', methods=['POST'])
def api():
    user_text = request.json.get('text')

    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((HOST, PORT))
        s.sendall(user_text.encode('utf-8'))
        tts_response = s.recv(1024).decode('utf-8')  # Receive the response from the TTS service

    print(f"Received TTS response: {tts_response}")  # Print the received response

    response_message = f'You sent: {user_text}'
    print(user_text)

    return jsonify({'message': tts_response, 'tts_response': tts_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
