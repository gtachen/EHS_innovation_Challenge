import os
os.system("cls")

import logging
loglvl = logging.INFO
logging.basicConfig(level=loglvl)

import requests

FORMAT = "UTF-8"




while True:
    #(requests.get("https://api.beanstreet.me"))
    os.system("cls")
    
    
    items = requests.get("https://api.beanstreet.me").content.decode(FORMAT)
    
    print(f"Current items: {items}")
    
    action = input("Would you like to add an item, or take an item? (add, take): ")
    
    if (action == "add"):
        selection = input("What is the name of the item you would like to add?")
        seller = input("What is your name?")
        cost = input("What is item cost?")
        
        print(1)
        requests.post("https://api.beanstreet.me", data=f"{action}: {selection}:{seller}:{cost}")
        print(2)
        
    if (action == "take"):
        selection = input("What is the name of the item you would like to take?")
        
        print(1)
        requests.post("https://api.beanstreet.me", data=f"{action}: {selection}")
        print(2)