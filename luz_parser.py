import random

START_TIME = 5
TIME_END = 11
PREP_TIME = 5
HOUR = 60

raw = """
08:30-08:45- זמן אקטואליה (קורסי)
08:45-10:15 - קפ״ה דילמה (דו קורסי)
10:15-10:30- הפסקה
10:30-11:15- הבחירה בחיים (דו קורסי)
11:15-12:15 - שיחת יוהל״מ (קורסי)
12:15-13:30- הפסקת צהריים
13:30-14:00-  טכנולוגיות למידה (קורסי)
* 14:00-14:20* - הפסקה
14:20-14:30 - התארגנות לקראת שיעור מפקד המערך 
14:30-15:30- שיעור מפקד מערך ההדרכה (קורסי)
15:30-15:45- הפסקה
15:45-17:00 - סימולציות (צוותי)
17:00-17:15- התארגנות לא״ג
17:15-18:00 - א״ג (קורסי)
18:00 עיבוד יום
"""

group_to_zoom_link = {
    "צוותי": "https://us02web.zoom.us/j/6728767806",
    "קורסי": "https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09",
    "דו קורסי": "https://us02web.zoom.us/j/88080371820?pwd=S0lmL0VFcDdDWWoySW1TamdvVVRBdz09",
    "לפי הקישור של המפקדת שנרשמתם לשיעור שלה": "Couldn't find needed response"
}
names = ["מלי מוסרת", "לאון רען הדרכה מוסר", "רב הדרכה > רב טוראי מוסר", "עדיאל מוסר",
         "להיות ממצ זה קאדר? תחשוב מה זה להיות הבוט שלו בוואצאפ... מוסר"]


def get_parenthesis_index(string):
    """
    :return: parenthesis index start
    """
    index = 0
    for char in string:
        if char != "(":
            index += 1
        else:
            return index


def parse_time(time):
    hours = int(time[:2])
    minutes = int(time[3:])
    if minutes - 5 < 0:
        minutes = minutes + HOUR
        hours -= 1

    minutes = minutes - PREP_TIME
    return hours, minutes


def build_json_message(time, message, chatName="קפה ינואר צוות חרמון"):
    return {
        "time": {
            "hours": parse_time(time)[0],
            "minutes": parse_time(time)[1]
        },
        "chatName": chatName,
        "message": message
    }


def build_json_action(time, message, chatName="קפה ינואר צוות חרמון", action_name="declareCounting"):
    return {
        "time": {
            "hours": parse_time(time)[0],
            "minutes": parse_time(time)[1]
        },
        "action_name": action_name,
        "chatName": chatName,
        "message": message
    }


def main():
    lines = (raw.split("\n"))
    messages = []
    actions = []
    for line in lines:
        start_time = line[:START_TIME]
        action = line[TIME_END:get_parenthesis_index(line)]
        finish_time = line[START_TIME + 1:START_TIME * 2 + 1]
        print(finish_time)
        if "(" not in line:
            continue

        group = (line[get_parenthesis_index(line) + 1:-1])
        message = f"{random.choice(names)}: \n {start_time} - {finish_time} {action} \n{group} - {group_to_zoom_link[group]} "
        messages.append(build_json_message(start_time, message))
        actions.append(build_json_action(start_time, "ספירת מספרי הברזל החלה!"))
    messages.append(build_json_message("08:00",
                                       "נו באמת מי עדיין לא מילא דוח 1 ??? אנחנו כבר בחודש 7 של הקורס ואתם עדיין שוכחים..."))
    print(messages)
    print(actions)


if __name__ == '__main__':
    main()
