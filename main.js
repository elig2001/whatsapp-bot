



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

//send a message after already being on a specific chat
async function sendMessage() {
    var event = new InputEvent('input', {bubbles: true}); 
    await sleep(10)

    var textbox = document.querySelector('[title="Type a message"]');
    textbox.textContent = "what i want"

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

function selectChat(chatName) {
    var chatTitle= document.querySelector('[title="שחר סוני"]');
    simulateMouseEvents(chatTitle, 'mousedown')

}

selectChat("eli")
sendMessage()
