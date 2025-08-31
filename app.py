import socket

from flask import Flask, render_template, request

app = Flask(__name__)

esp_ip = "192.168.1.108"
esp32_port = 555

@app.route('/')
def index():
    return render_template('../index.html')

@app.route('/enviar', methods=['POST'])
def enviar():
    try:
        mensagem = request.form['mensagem']

        client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        client_socket.connect((esp_ip, esp32_port))

        client_socket.sendall(mensagem.encode())

        data = client_socket.recv(1024)
        resposta =  data.decode()

    except Exception as e:
        resposta = f"Erro:{str(e)}" 

    finally:
        client_socket.close()

    return render_template('../index.html', resposta = resposta)


if __name__ == '__main__':
    app.run(debug=True)
