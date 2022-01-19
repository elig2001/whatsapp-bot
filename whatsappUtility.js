
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
    ],
    "קפה ינואר צוות חרמון": [{
        "incoming": "לוז",
        "response": `
        לוז יום רביעי 19.1
    8:30-8:45- זמן אקטואליה (שיעור קורסי)
    8:45-10:15 - קפ״ה דילמה (דו קורסי, מעבר בין הצוותים בחצי הקורס-נסביר גם בתום זמן האקטואליה)
    10:15-10:30- הפסקה
    10:30-11:15- הבחירה בחיים (שיעור קורסי)
    11:15-12:15 - שיחת יוהל״מ (שיעור קורסי)
    12:15-13:30- הפסקת צהריים
    13:30-14:00-  טכנולוגיות למידה (שיעור קורסי)
    * 14:00-14:20* - הפסקה
    14:20-14:30 - התארגנות לקראת שיעור מפקד המערך 
    14:30-15:30- שיעור מפקד מערך ההדרכה (שיעור קורסי)
    15:30-15:45- הפסקה
    15:45-17:00 - סימולציות (שיעור צוותי)
    17:00-17:15- התארגנות לא״ג
    17:15-18:00 - א״ג (שיעור קורסי)
    18:00 עיבוד יום`
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

var timedMessages = [{ 'time': { 'hours': 8, 'minutes': 25 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': 'לאון רען הדרכה מוסר: \n 08:30 - 08:45 - זמן אקטואליה  \nקורסי - https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09 ' }, { 'time': { 'hours': 8, 'minutes': 40 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': 'רב הדרכה > רב טוראי מוסר: \n 08:45 - 10:15  - קפ״ה דילמה  \nדו קורסי - https://us02web.zoom.us/j/88080371820?pwd=S0lmL0VFcDdDWWoySW1TamdvVVRBdz09 ' }, { 'time': { 'hours': 10, 'minutes': 25 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': 'רב הדרכה > רב טוראי מוסר: \n 10:30 - 11:15 - הבחירה בחיים  \nדו קורסי - https://us02web.zoom.us/j/88080371820?pwd=S0lmL0VFcDdDWWoySW1TamdvVVRBdz09 ' }, { 'time': { 'hours': 11, 'minutes': 10 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': 'לאון רען הדרכה מוסר: \n 11:15 - 12:15  - שיחת יוהל״מ  \nקורסי - https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09 ' }, { 'time': { 'hours': 13, 'minutes': 25 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': 'עדיאל מוסר: \n 13:30 - 14:00 -  טכנולוגיות למידה  \nקורסי - https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09 ' }, { 'time': { 'hours': 14, 'minutes': 25 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': 'להיות ממצ זה קאדר? תחשוב מה זה להיות הבוט שלו בוואצאפ... מוסר: \n 14:30 - 15:30 - שיעור מפקד מערך ההדרכה  \nקורסי - https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09 ' }, { 'time': { 'hours': 15, 'minutes': 40 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': 'מלי מוסרת: \n 15:45 - 17:00  - סימולציות  \nצוותי - https://us02web.zoom.us/j/6728767806 ' }, { 'time': { 'hours': 17, 'minutes': 10 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': 'רב הדרכה > רב טוראי מוסר: \n 17:15 - 18:00  - א״ג  \nקורסי - https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09 ' }, { 'time': { 'hours': 7, 'minutes': 55 }, 'chatName': 'קפה ינואר צוות חרמון', 'message': 'נו באמת מי עדיין לא מילא דוח 1 ??? אנחנו כבר בחודש 7 של הקורס ואתם עדיין שוכחים...' }]

var timedActions = [{'time': {'hours': 8, 'minutes': 25}, 'action_name': 'declareCounting', 'chatName': 'קפה ינואר צוות חרמון', 'message': 'ספירת מספרי הברזל החלה!'}, {'time': {'hours': 8, 'minutes': 40}, 'action_name': 'declareCounting', 'chatName': 'קפה ינואר צוות חרמון', 'message': 'ספירת מספרי הברזל החלה!'}, {'time': {'hours': 10, 'minutes': 25}, 'action_name': 'declareCounting', 'chatName': 'קפה ינואר צוות חרמון', 'message': 'ספירת מספרי הברזל החלה!'}, {'time': {'hours': 11, 'minutes': 10}, 'action_name': 'declareCounting', 'chatName': 'קפה ינואר צוות חרמון', 'message': 'ספירת מספרי הברזל החלה!'}, {'time': {'hours': 13, 'minutes': 25}, 'action_name': 'declareCounting', 'chatName': 'קפה ינואר צוות חרמון', 'message': 'ספירת מספרי הברזל החלה!'}, {'time': {'hours': 14, 'minutes': 25}, 'action_name': 'declareCounting', 'chatName': 'קפה ינואר צוות חרמון', 'message': 'ספירת מספרי הברזל החלה!'}, {'time': {'hours': 15, 'minutes': 40}, 'action_name': 'declareCounting', 'chatName': 'קפה ינואר צוות חרמון', 'message': 'ספירת מספרי הברזל החלה!'}, {'time': {'hours': 17, 'minutes': 10}, 'action_name': 'declareCounting', 'chatName': 'קפה ינואר צוות חרמון', 'message': 'ספירת מספרי הברזל החלה!'}]

var actions = {
    "declareCounting": declareCounting
}

var everyonesHere = ["אחרי מאמצים כבירים צוות חרמון זוכה בפרס - כל צוות חרמון פה תשלח את זה כבר בזום", "כולם כאן, מטורפים! הנה 400 אסימונים תתחלקו", "וואו כולם התחברו כל כך מהר בזום, אתם ממש חדים לאון היה גאה בכם"]




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

var missingMembers = { ...ALL_MEMBERS }


async function resetAttendance(chatName, incomingMessage) {
    missingMembers = { ...ALL_MEMBERS }
}

async function markAsPresent(chatName, incomingMessage) {
    delete missingMembers[incomingMessage.replace("!", "")]
    if (!Object.keys(missingMembers).length) {
        await sendMessageToChat(chatName, everyonesHere[Math.floor(Math.random() * everyonesHere.length)])
    }
}

async function sendMissingMembers(chatName, incomingMessage) {
    await sendMessageToChat(chatName, Object.values(missingMembers).join(", "))
}

async function declareCounting(chatName, incomingMessage) {
    await resetAttendance(chatName, incomingMessage);
    await sendMessageToChat(chatName, incomingMessage);
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
                console.log(message + " == " + response.incoming + " ? " + message.localeCompare(response.incoming) == 0)
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
    console.log("comparing " + currentTime.getHours() + " == " + date.hours + " && " + currentTime.getMinutes() + "==" + date.minutes)
    return (currentTime.getHours() == date.hours && currentTime.getMinutes() == date.minutes)
}

async function sendTimedMessages() {
    for (let message of timedMessages) {
        if (isCurrentTime(message.time)) {
            await sendMessageToChat(message.chatName, message.message)
            await sleep(10)
        }
    }
    for (let action of timedActions) {
        if (isCurrentTime(action.time)) {
            await actions[action.action_name](action.chatName, action.message)
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
        if (chatName in autoResponses || chatName in commands) {
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


