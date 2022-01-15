



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

//send a message after already being on a specific chat
async function sendMessage(text) {
    var event = new InputEvent('input', {bubbles: true}); 
    await sleep(10)

    var textbox = document.querySelector('[title="Type a message"]');
    textbox.textContent = text

    textbox.dispatchEvent(event);

    var sendButton = document.querySelector('[data-testid="send"]');
    sendButton.click()
}


// trigger mouse events that can't be easily triggered
function simulateMouseEvents(element, eventName) {
    var mouseEvent= document.createEvent ('MouseEvents');
    mouseEvent.initEvent (eventName, true, true);
    element.dispatchEvent (mouseEvent);
}

// open specific chat
function selectChat(chatName) {
    var chatTitle= document.querySelector('[title="' + chatName + '"]');
    simulateMouseEvents(chatTitle, 'mousedown')

}


function getUnreadChats() {
    var unreadChats = document.querySelectorAll('[aria-label*="unread message"]')
    var chatMessageAmount = {}
    for (let chat of unreadChats) {
        var chatName = chat.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector("[title]").title
        var unreadMessageAmount = chat.innerText    
        chatMessageAmount[chatName] = unreadMessageAmount
    }
    return chatMessageAmount;    
}

// this function should run when already openned wanted chat
function getLastMessages(messageAmount) {
    messages  = []
    var messageList =  document.querySelector('[aria-label*="Message list"]')
    for (let i = 1; i < messageAmount+1; i++) {
        var message = messageList.children[messageList.children.length-i]
        if ( message.querySelector('[class*="selectable-text copyable-text"]') != null ) {
            var text = message.querySelector('[class*="selectable-text copyable-text"]').innerText
        messages.push(text)
        console.log("Message number " + i + ". : " + text)
        }
        
      }
    return messages.reverse()
}



async function readChat(chatName,messageAmount) {
    selectChat(chatName);
    await sleep(10)
    return getLastMessages(messageAmount);
}

readChat("ססיל ולדילן", 3)
