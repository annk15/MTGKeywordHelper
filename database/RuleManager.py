from unidecode import unidecode
from bs4 import BeautifulSoup
import re
import json
import requests
import os

class RuleManager:

    rules_file = 'rules.json'

    @staticmethod
    def get_rules():

        if os.path.exists(RuleManager.rules_file):
            with open(RuleManager.rules_file, 'r') as file:
                print("Cached file will be used!")
                data = json.load(file)
                return data

        rule_content = RuleManager.get_rule_file("https://magic.wizards.com/en/rules")
        structured_content = RuleManager.parse_rules(rule_content)

        jsonString = json.dumps(structured_content, indent=5)
        with open("rules.json", "w") as file:
            file.write(jsonString)

        return structured_content

    @staticmethod
    def get_rule_file(url):
        response = requests.get(url)

        if response.status_code == 200:
            html_content = response.text

            soup = BeautifulSoup(html_content, 'html.parser')

            for link in soup.find_all('a'):
                href = link.get('href')
                if href and href.endswith('.txt'):
                    txt_link = href
                    print("Found rule file at: " + txt_link)

                    response = requests.get(txt_link)

                    if response.status_code == 200:

                        print("Successfully downloaded text file!")

                        return response.text.splitlines()

                    break
        else:
            print('Failed to download the HTML content. Status code:', response.status_code)

    @staticmethod
    def parse_rules(content):

        first_level_pattern = r'^\d{1,2}\.\s(.*)'
        second_level_pattern = r'^\d{3,}\.\s(.*)'
        third_level_pattern = r'^\d{3,}\.\d+\.\s(.*)'
        fourth_level_pattern = r'^\d{3,}\.\d+[a-zA-Z]\s(.*)'
        glossary_pattern = r'^Glossary'

        current_chapter_name = ""
        current_title_name = ""

        content_structure = {}

        start_parsing = False
        glossary_counter = 0

        for line in content:
            line = line.strip()
            line = unidecode(line)

            first_level = re.findall(first_level_pattern, line, re.MULTILINE)
            second_level = re.findall(second_level_pattern, line, re.MULTILINE)
            third_level = re.findall(third_level_pattern, line, re.MULTILINE)
            fourth_level = re.findall(fourth_level_pattern, line, re.MULTILINE)
            glossary_level = re.findall(glossary_pattern, line, re.MULTILINE)

            # Create the data structure
            if start_parsing:
                if first_level:
                    current_chapter_name = first_level[0]
                    content_structure[current_chapter_name] = {}
                elif second_level:
                    current_title_name = second_level[0]
                    content_structure[current_chapter_name][current_title_name] = []
                elif third_level:
                    content_structure[current_chapter_name][current_title_name].append([third_level[0],[]])
                elif fourth_level:
                    content_structure[current_chapter_name][current_title_name][-1][1].append(fourth_level[0])

            # Count number of times a row start with "Glossary", this marks both the start and end of the rules file
            if glossary_level:
                glossary_counter += 1

            # First time, enable parsing of the following rows
            # Second time, stop parsing rows by exiting the loop
            if glossary_counter == 1:
                start_parsing = True
            if glossary_counter == 2:
                break

        print("File successfully parsed!")

        return content_structure

RuleManager.get_rules()