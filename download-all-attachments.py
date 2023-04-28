# downloads attachments from a database view running off of a CSV file of incidents

import requests
import os
import csv
from time import sleep

SERVICENOW_USER = ''
SERVICENOW_PWD = ''
CSV_FILE = 'nameOfYourCSVFile.csv'


ATTACHMENT_API = "/api/now/attachment"
TABLE_API = "/api/now/table"
SERVICENOW_URL = "https://fcbtexasdev2.service-now.com/"
TABLE_NAME = "incident"
COLUMN_HEADER = "inc_number"
ROWS_BEFORE_SLEEP = 120
SLEEP_SECONDS = 360


REQUEST_HEADER = {
    "json": {"Content-Type": "application/xml", "Accept": "application/json"},
    "png": {"Content-Type": "application/xml", "Accept": "application/png"},
    "xml": {"Content-Type": "application/xml", "Accept": "application/xml"},
}


def get_table_data(table_name, param):
    url = SERVICENOW_URL + TABLE_API + "/" + table_name + "?" + param
    response = requests.get(
        url, auth=(SERVICENOW_USER,
                   SERVICENOW_PWD), headers=REQUEST_HEADER.get("json")
    )
    if response.status_code != 200:  # if error, then exit
        print(
            "Status:",
            response.status_code,
            "Headers:",
            response.headers,
            "Error Response:",
            response.json(),
        )
        exit()
    return response.json()


def get_attachment_info(sys_id):
    url = SERVICENOW_URL + ATTACHMENT_API + "/" + sys_id
    response = requests.get(
        url, auth=(SERVICENOW_USER,
                   SERVICENOW_PWD), headers=REQUEST_HEADER.get("json")
    )
    if response.status_code != 200:  # if error, then exit
        print(f"Status:  {response.status_code}, Headers:{response.headers}")
        exit()
    return response.json()


def get_attachment(att_sys_id, file_type, download_dir):
    url = SERVICENOW_URL + "/" + ATTACHMENT_API + "/" + att_sys_id + "/file"
    response = requests.get(
        url,
        auth=(SERVICENOW_USER, SERVICENOW_PWD),
        headers=REQUEST_HEADER.get(file_type),
    )
    if response.status_code != 200:  # if error, then exit
        print(
            "Status:",
            response.status_code,
            "Headers:",
            response.headers,
            "Error Response:",
            response.json(),
        )
        exit()
    with open(download_dir, "wb") as f:
        for chunk in response:
            f.write(chunk)


def get_file_attachment(record_number):
    param = "sysparm_query=number=" + record_number + "&sysparam_limit=1"

    # get the non-attachment record info
    file_info = get_table_data(TABLE_NAME, param).get("result")
    if len(file_info) < 1:
        print(f"There is no attachment to sys_id:{record_number}")
        return
    attachment_sys_id = file_info[0].get("sys_id")

    param = "sysparm_query=table_sys_id=" + attachment_sys_id + "&sysparam_limit=1"
    kb_attachments = get_table_data("sys_attachment", param)
    result = kb_attachments.get("result")
    for attach_file in result:
        attach_sys_id = attach_file.get("sys_id")
        content_type = attach_file.get("content_type").split("/")
        file_ext = content_type[1]
        file_name = attach_file.get("file_name")
        get_attachment(attach_sys_id, file_ext, DOWNLOAD_DIR + "/" + file_name)


def loop_over_csv():
    global DOWNLOAD_DIR

    rowNum = 1
    with open(CSV_FILE, "r", encoding="utf-8") as inp:
        for row in csv.reader(inp, delimiter=","):
            while True:
                try:
                    # window["-OUTPUT-"].update(
                    #     "Downloading attachments for: {}".format(row[3]))

                    # if (rowNum % ROWS_BEFORE_SLEEP == 0):
                    #     print('Sleeping...')
                    #     sleep(SLEEP_SECONDS)

                    incNumber = row[3]
                    print("Row " + str(rowNum) + ": " + incNumber)
                    if incNumber == COLUMN_HEADER:
                        pass
                    path = os.path.join("./downloads/", incNumber)
                    pathExists = os.path.exists(path)

                    if not pathExists:
                        os.mkdir(path)

                    DOWNLOAD_DIR = path
                    # get_file_attachment('KB0010062')  # knowledge base number
                    get_file_attachment(incNumber)
                    rowNum += 1
                except:
                    print('Need to take a break. Sleeping now.')
                    print('Completed download for rows 1 through ' + str(rowNum))
                    sleep(SLEEP_SECONDS)
                    continue
                break


if __name__ == "__main__":
    loop_over_csv()


# # Define the window's contents
# layout = [
#     [sg.Text("ServiceNow URL"), sg.Input(key="-SNURL-")],
#     [sg.Text("User"), sg.Input(key="-SNUSER-")],
#     [sg.Text("Password"), sg.Input(key="-SNPASS-")],
#     [sg.Text("Table Name"), sg.Input(key="-SNTABLE-")],
#     [sg.Text("CSV Filename (incident.csv)"), sg.Input(key="-SNCSV-")],
#     [sg.Button("Ok"), sg.Button("Quit")],
#     [sg.Text(size=(40, 1), key="-OUTPUT-")],
# ]
# # Create the window
# window = sg.Window("AttachmentDownloader", layout)

# # Display and interact with the Window using an Event Loop
# while True:
#     event, values = window.read()
#     # See if user wants to quit or window was closed
#     if event == sg.WINDOW_CLOSED or event == "Quit":
#         break
#     if event == "Ok":
#         SERVICENOW_URL = values["-SNURL-"]
#         SERVICENOW_USER = values["-SNUSER-"]
#         SERVICENOW_PWD = values["-SNPASS-"]
#         ATTACHMENT_API = "/api/now/attachment"
#         TABLE_API = "/api/now/table"
#         TABLE_NAME = values["-SNTABLE-"]
#         CSV_FILE = values["-SNCSV-"]
#         window["-OUTPUT-"].update("Downloading...")
#         loop_over_csv()
#         window["-OUTPUT-"].update("Done")


# # Finish up by removing from the screen
# window.close()
