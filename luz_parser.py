START_TIME = 5
TIME_END = 11
PREP_TIME = 5
HOUR = 60


raw = """
08:30-08:45 זמן אקטואליה
08:45-09:45 התנסות חינוך מל״מ (דו קורסי)
09:45-10:00 הפסקה
10:00-11:00 האדם יקר (קורסי)
11:00-11:15 הפסקה
11:15-12:15 שיחת קב״ן(קורסי)
12:15-13:30 הפסקת צהריים
13:30-14:45 התנסויות 15 דק(צוותי)
14:45-15:15 הפסקה
15:15-16:45 התנסויות 15 דק(צוותי)
16:45-17:00 הפסקה
17:00-18:00 סימולציה קורסית- חניך אובדני (קורסי)
18:00 עיבוד יום
"""

group_to_zoom_link = {
    "צוותי": "https://us02web.zoom.us/j/6728767806",
    "קורסי": "https://zoom.us/j/94191737726?pwd=ZWtham5tYzNlQ1B3djgxelpsV0w5Zz09",
    "דו קורסי": "https://us02web.zoom.us/j/88080371820?pwd=S0lmL0VFcDdDWWoySW1TamdvVVRBdz09"
}


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
    
    minutes = minutes - PREP_TIME
    return hours, minutes


def build_json(time, message, chatName="קפה ינואר צוות חרמון"):
    return {
        "time": {
            "hours": parse_time(time)[0],
            "minutes": parse_time(time)[1]
        },
        "chatName": chatName,
        "message": message
    }


def main():
    lines = (raw.split("\n"))
    jsons = []
    for line in lines:
        start_time = line[:START_TIME]
        action = line[TIME_END:get_parenthesis_index(line)]

        if "(" not in line:
            continue

        group = (line[get_parenthesis_index(line) + 1:-1])
        message = f"{start_time} - {action} \n{group} - {group_to_zoom_link[group]} "
        jsons.append(build_json(start_time, message))


    print(jsons)


if __name__ == '__main__':
    main()
