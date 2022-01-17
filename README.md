# whatsapp-bot

## How does it work?

The Bot works by entering the wanted via the function selectChat(chatName)
Then it either Reads or Writes a message by the functions:
- asnyc readChat(chatName, messageAmount)
- asnyc sendMessageToChat(chatName, message)

## Program Flow 

Two main function are ran in an Interval. Main and sendTimedMessages. 
this is how it checks each minutes for timed message and checks for messages for the automatic response



### A bit more details

#### simulateMouseEvents

Why does the function simulateMouseEvents(element, eventName) exists?
it exists because if we use element.click() an event won't be fired and whatsapp's ui won't update
I use it to mainly simulate mouse presses

#### Accessing elements (for reading and writing)

Here all I did was finding an element with a persistent parameter and from it I accesses the wanted parameter.
Thats how I got all the unread message amounts, chat names, current chat name and writing inside the textbox to send messages. 


## How can I add messages

In the file whatsappUtility.js there are two important variables:

- autoResponses: 
  array that contains a json, its structure is the following:
  contact_name: [{"incoming" : message, "response" : message}]

- timesMessages:
  array that contains jsons with the following structure:
  [{time: {hours: 0, minutes: 0}, "chatName" : chatName, message: message}]
  
  

