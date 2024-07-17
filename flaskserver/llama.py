import ollama
import socket

# Configuration for the socket
HOST = 'localhost'
PORT = 65434

# Set up the server socket
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    print("Text-to-Speech service is running...")

    while True:
        conn, addr = s.accept()
        with conn:
            print('Connected by', addr)
            data = conn.recv(1024)
            if not data:
                break
            message = data.decode('utf-8')
            print(f"Received message: {message}")

            response = ollama.chat(model='llama3', messages=[
                {
                    'role': 'user',
                    'content': message,
                },
            ])
            response_message = response['message']['content']
            print(response_message)

            # Send the response back through the socket
            conn.sendall(response_message.encode('utf-8'))