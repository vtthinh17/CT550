import json
newsJsonData = []
with open("crawler/mypostscraper/postscraper/oldData.json", "r", encoding="utf8") as f1:
    file1 = json.loads(f1.read())
with open("crawler/mypostscraper/postscraper/newData.json", "r", encoding="utf8") as f2:
    file2 = json.loads(f2.read())

for item in file2:
    if item['job_link'] not in [x['job_link'] for x in file1]:
        newsJsonData.append(item)
with open('new_file.json', 'w', encoding="utf8") as f:
  json.dump(newsJsonData, f, indent=1, ensure_ascii=False)