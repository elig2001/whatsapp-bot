
var unreadChats;
var lastUnread;
var autoResponses = {
    "ססיל ולדילן": [
        {
            "name": "ססיל ולדילן",
            "incoming": "!bot",
            "response": "למאו מי שמדבר"
        },
        {
            "name": "ססיל ולדילן",
            "incoming": "אלי",
            "response": "שתוק"
        }
    ]
}

var timedMessages = [{ 'time': { 'hours': 13, 'minutes': 25 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': "13:30 -  התנסויות 15 דק  \nצוותי - {'צוותי': 'https://us02web.zoom.us/j/6728767806', 'קורסי': 'https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09', 'דו קורסי': 'https://us02web.zoom.us/j/88080371820?pwd=S0lmL0VFcDdDWWoySW1TamdvVVRBdz09'} " }, { 'time': { 'hours': 15, 'minutes': 10 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': "15:15 -  סימולציות  \nצוותי - {'צוותי': 'https://us02web.zoom.us/j/6728767806', 'קורסי': 'https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09', 'דו קורסי': 'https://us02web.zoom.us/j/88080371820?pwd=S0lmL0VFcDdDWWoySW1TamdvVVRBdz09'} " }, { 'time': { 'hours': 16, 'minutes': -5 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': "16:00 -  א׳ ב׳ בהדרכה  \nקורסי - {'צוותי': 'https://us02web.zoom.us/j/6728767806', 'קורסי': 'https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09', 'דו קורסי': 'https://us02web.zoom.us/j/88080371820?pwd=S0lmL0VFcDdDWWoySW1TamdvVVRBdz09'} " }, { 'time': { 'hours': 16, 'minutes': 30 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': "16:35 -  חניכה ומשוב  \nקורסי - {'צוותי': 'https://us02web.zoom.us/j/6728767806', 'קורסי': 'https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09', 'דו קורסי': 'https://us02web.zoom.us/j/88080371820?pwd=S0lmL0VFcDdDWWoySW1TamdvVVRBdz09'} " }]


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//send a message after already being on a specific chat
async function sendMessage(text) {
    var event = new InputEvent('input', { bubbles: true });
    await sleep(10)

    var textbox = document.querySelector('[title="Type a message"]');
    textbox.textContent = text

    textbox.dispatchEvent(event);

    var sendButton = document.querySelector('[data-testid="send"]');
    sendButton.click()
}


// trigger mouse events that can't be easily triggered
function simulateMouseEvents(element, eventName) {
    var mouseEvent = document.createEvent('MouseEvents');
    mouseEvent.initEvent(eventName, true, true);
    element.dispatchEvent(mouseEvent);
}

// open specific chat
function selectChat(chatName) {
    var chatTitle = document.querySelector('[title="' + chatName + '"]');
    simulateMouseEvents(chatTitle, 'mousedown')

}

// returns json that looks like this:
// {"chat name" : amount of unread messages}
function getUnreadChats() {
    var unreadChats = document.querySelectorAll('[aria-label*="unread message"]')
    var chatMessageAmount = {}
    for (let chat of unreadChats) {
        var chatName = chat.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector("[title]").title
        var unreadMessageAmount = parseInt(chat.innerText)
        chatMessageAmount[chatName] = unreadMessageAmount

    }
    return chatMessageAmount;
}

// this function should run when already openned wanted chat
function getLastMessages(messageAmount) {
    messages = []
    var messageList = document.querySelector('[aria-label*="Message list"]')
    for (let i = 1; i < messageAmount + 1; i++) {
        var message = messageList.children[messageList.children.length - i]
        if (message.querySelector('[class*="selectable-text copyable-text"]') != null) {
            var text = message.querySelector('[class*="selectable-text copyable-text"]').innerText
            messages.push(text)
        }

    }
    return messages.reverse()
}

async function readChat(chatName, messageAmount) {
    selectChat(chatName);
    await sleep(10)
    return getLastMessages(messageAmount);
}

async function sendMessageToChat(chatName, message) {
    selectChat(chatName);
    await sleep(10)
    await sendMessage(message)
}

async function runGenericBotLogic(autoResponses, chatName, unreadMessageAmount) {
    for (let response of autoResponses) {
        for (let message of await readChat(chatName, unreadMessageAmount)) {
            if (message.localeCompare(response.incoming) == 0) {
                await sendMessageToChat(chatName, response.response)
            }
        }
    }
}

function isCurrentTime(date) {
    var currentTime = new Date();
    return (currentTime.getHours() == date.hours && currentTime.getMinutes() == date.minutes)
}

async function sendTimedMessages() {
    for (let message of timedMessages) {
        if (isCurrentTime(message.time)) {
            await sendMessageToChat(message.chatName, message.message)
            await sleep(10)
        }
    }
}

async function main() {
    unreadChats = getUnreadChats()
    if (JSON.stringify(unreadChats) == JSON.stringify(lastUnread)) {
        return;
    }
    for (let chatName of Object.keys(unreadChats)) {
        if (Object.keys(autoResponses).includes(chatName)) {
            await runGenericBotLogic(autoResponses[chatName], chatName, unreadChats[chatName])
        }
    }
    lastUnread = unreadChats;
}



setInterval(async () => {
    try {
        var currentChat = document.querySelector('[title="Profile Details"]').parentElement.children[1].querySelector('[title]').title
        await main()
        selectChat(currentChat);
    } catch (e) {
        await main()
    }
}, 500);


setInterval(async () => {
    try {
        var currentChat = document.querySelector('[title="Profile Details"]').parentElement.children[1].querySelector('[title]').title
        await sendTimedMessages()
        selectChat(currentChat);
    } catch (e) {
        await sendTimedMessages()
    }
}, 60000);


