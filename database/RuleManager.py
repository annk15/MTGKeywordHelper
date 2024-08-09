from unidecode import unidecode
import fitz
import re
import json

def processText(text):
    return text.replace('\u201c', '“').replace('\u201d','”').replace('\u2019','’')

def readPDF(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    startPage = 4
    for page in doc:

        if page.number < startPage:
            continue
        elif re.findall("^Glossary", page.get_text(), re.MULTILINE):
            break

        text += page.get_text()

    return text

def parseText(text):
    lines = text.splitlines()

    firstLevelPattern = r'^\d{1,2}\.\s(.*)'
    secondLevelPattern = r'^\d{3,}\.\s(.*)'
    thirdLevelPattern = r'^\d{3,}\.\d+\.\s(.*)'
    fourthLevelPattern = r'^\d{3,}\.\d+[a-zA-Z]\s(.*)'

    currentChapterName = ""
    currentTitleName = ""
    currentSubTitleName = ""

    contentStructure = {}
    currentTitleDict = None

    toWrite = None

    for line in lines:
        line = line.strip()
        line = unidecode(line)

        firstLevel = re.findall(firstLevelPattern, line, re.MULTILINE)
        secondLevel = re.findall(secondLevelPattern, line, re.MULTILINE)
        thirdLevel = re.findall(thirdLevelPattern, line, re.MULTILINE)
        fourthLevel = re.findall(fourthLevelPattern, line, re.MULTILINE)

        if line == "":
            toWrite = None
            continue

        if toWrite == None:
            if firstLevel:
                currentChapterName = firstLevel[0]
                contentStructure[currentChapterName] = {}
                continue
            elif secondLevel:
                currentTitleName = secondLevel[0]
                currentTitleDict = {}
                contentStructure[currentChapterName][currentTitleName] = []
                continue
            elif thirdLevel:
                contentStructure[currentChapterName][currentTitleName].append([thirdLevel[0],[]])
                continue
            elif fourthLevel:
                contentStructure[currentChapterName][currentTitleName][-1][1].append(fourthLevel[0])
                continue

        toWrite = True

        if len(contentStructure[currentChapterName][currentTitleName][-1][1]) > 0:
            contentStructure[currentChapterName][currentTitleName][-1][1][-1] += line
        else:
            contentStructure[currentChapterName][currentTitleName][-1][0] += line

    return contentStructure

# Main code
text = readPDF('MagicCompRules 20240802.pdf')
structured_content = parseText(text)

jsonString = json.dumps(structured_content, indent=5)
with open("rules.json", "w") as file:
    file.write(jsonString)