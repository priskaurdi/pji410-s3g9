import socket

esp_ip = "192.168.1.108"
esp32_port = 555

client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

client_socket.connect((esp_ip, esp32_port))

mensagem = "esp32 gravando temperatura"

client_socket.sendall(mensagem.encode())

data = client_socket.recv(1024)
print("Resposta do ESP:", data.decode())

client_socket.close()

