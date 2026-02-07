import os
os.system("cls")

import logging
loglvl = logging.INFO
logging.basicConfig(level=loglvl)

import socket
import threading


def content(input):
    return input[input.find("\r\n\r\n")+4:input.find("\r\n\r\n")+20]
    


def file(path):
    return open(path).read()
    
def handle(conn, addr):
    global response
    global data

    response = f"""HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: {len("".join(data))}

{"".join(data)}
"""

    logging.info(f"- CONNECTED TO: {addr}")
    
    connected = True
    while connected:
        msg = conn.recv(HEADER).decode(FORMAT)
        
        logging.info(f"- {addr} SAYS: \"{msg}\"")
        
        print(f"UFIEGIFGWEUHGIEQWH  {msg[0:4]}")
        
        if (msg[0:3] == "GET"):
            conn.send(response.encode(FORMAT))
            
            logging.info(f"- PAGE SERVED TO {addr}")
            
            connected = False
            
        elif (msg[0:4] == "POST"):
            logging.warn(f"---- INFO POSTED {msg}")
            
            print(content(msg))
            
            if (content(msg)[0:3] == "add"):
                data.append(content(msg)[4:20])
                
            print(f"eeeeeeeeeeeeeeeeeeeeeeeeeee{content(msg)[0:4]}")
            print(f"eeeeeeeeeeeeeeeeeeeeeeeeeee{content(msg)[5:20]}")
            print(data)
            
            if (content(msg)[0:4] == "take"):
                for item in data:
                    name = item.split(":", 1)[0]
                    print(f"thisi s the anme{name}")
                    print(f"thisi s the req{content(msg)[5:20]}")
                    
                    if (name == content(msg)[5:20]):
                        data.remove(f"{item}")
            
            connected = False
    
    conn.close()
        
    
def start():
    server.listen()
    
    logging.info(f"- LISTENING ON: {HOST}:{PORT}")
    
    interactions = 0
    
    while True:
        conn, addr = server.accept()
        
        thread = threading.Thread(target=handle, args=(conn,addr))
        thread.start()
        
        logging.info(f"- ACTIVE CONNECTIONS: {threading.active_count() - 1}")
        
        interactions += 1
        logging.info(f"- INTERACTIONS: {interactions}")




data = ["baseballbat", "ladder"]


HEADER = 128 * 8

FORMAT = "UTF-8"

PORT = 2327
HOST = socket.gethostbyname(socket.gethostname())

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

server.bind((HOST, PORT))



start()