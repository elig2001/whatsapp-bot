
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
var commands = {
    "קפה ינואר צוות חרמון": {
        "^!מספרי ברזל$": resetAttendance,
        "^!\\d+$": markAsPresent,
        "^!מי חסר$": sendMissingMembers,
    }
}

var timedMessages = [{'time': {'hours': 8, 'minutes': 40}, 'chatName': 'קפה ינואר צוות חרמון', 'message': '08:45 -  התנסות חינוך מל״מ  \nדו קורסי - https://us02web.zoom.us/j/88080371820?pwd=S0lmL0VFcDdDWWoySW1TamdvVVRBdz09 '}, {'time': {'hours': 10, 'minutes': 55}, 'chatName': 'קפה ינואר צוות חרמון', 'message': '10:00 -  האדם יקר  \nקורסי - https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09 '}, {'time': {'hours': 11, 'minutes': 10}, 'chatName': 'קפה ינואר צוות חרמון', 'message': '11:15 -  שיחת קב״ן \nקורסי - https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09 '}, {'time': {'hours': 13, 'minutes': 25}, 'chatName': 'קפה ינואר צוות חרמון', 'message': '13:30 -  התנסויות 15 דק \nצוותי - https://us02web.zoom.us/j/6728767806 '}, {'time': {'hours': 15, 'minutes': 10}, 'chatName': 'קפה ינואר צוות חרמון', 'message': '15:15 -  התנסויות 15 דק \nצוותי - https://us02web.zoom.us/j/6728767806 '}, {'time': {'hours': 17, 'minutes': 55}, 'chatName': 'קפה ינואר צוות חרמון', 'message': '17:00 -  סימולציה קורסית- חניך אובדני  \nקורסי - https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09 '}]


const ALL_MEMBERS = {
    1: "אלי",
    2: "גל",
    3: "דניאל",
    4: "נמרוד",
    5: "אופיר",
    6: "גבי",
    7: "עדי",
    8: "זואי",
    9: "ספיר",
    10: "ירין",
    11: "תובל",
    12: "נעה",
}

var missingMembers = {...ALL_MEMBERS}


async function resetAttendance(chatName, incomingMessage) {
    missingMembers = {...ALL_MEMBERS}
}

async function markAsPresent(chatName, incomingMessage) {
    delete missingMembers[incomingMessage.replace("!", "")]
    if (!Object.keys(missingMembers).length) {
        await sendMessageToChat(chatName, "כולם כאן :)")
    }
}

async function sendMissingMembers(chatName, incomingMessage) {
    await sendMessageToChat(chatName, Object.values(missingMembers).join(", "))
}


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

async function runGenericBotLogic(chatName, unreadMessageAmount) {
    for (let message of await readChat(chatName, unreadMessageAmount)) {
        if (chatName in autoResponses) {
            for (let response of autoResponses[chatName]) {
                if (message.localeCompare(response.incoming) == 0) {
                    await sendMessageToChat(chatName, response.response)
                }
            }
        }
        if (chatName in commands) {
            for (let [command, responseFunction] of Object.entries(commands[chatName])) {
                if (message.match(command)) {
                    await responseFunction(chatName, message)
                }
            }
        }
    }
}

function isCurrentTime(date) {
    var currentTime = new Date();
    console.log("comparing " +currentTime.getHours()+ " == " + date.hours+  " && " + currentTime.getMinutes() + "==" + date.minutes)
    return (currentTime.getHours() == date.hours && currentTime.getMinutes() == date.minutes)
}

async function sendTimedMessages() {
    for (let message of timedMessages) {
        console.log("checking if current time: " + message.time)
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
        if (chatName in autoResponses or chatName in commands) {
            await runGenericBotLogic(chatName, unreadChats[chatName])
        }
    }
    lastUnread = unreadChats;
}



setInterval(async () => {
    var currentChat = null
    try {
        currentChat = document.querySelector('[title="Profile Details"]').parentElement.children[1].querySelector('[title]').title
    } catch (e) {
        console.log("Couldn't find the current chat", e)
    }
    try {
        await main()
    } finally {
        if (currentChat) {
            try {
                selectChat(currentChat);
            } catch (e) {
                console.log("Couldn't select the previous chat", e)
            }
        }
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


