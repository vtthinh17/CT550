import os
import json
from pymongo import MongoClient
import datetime
# tao fileName tu dong
def create_filename():
    basename = "mylogfile"
    suffix = datetime.datetime.now().strftime("%y%m%d_%H%M%S")
    filename = "_".join([basename, suffix]) # e.g. 'mylogfile_120508_171442'
    return filename

def doesFileExists(fileName):
    return os.path.exists(fileName)

def importDataIntoDB(fileName):
    myclient = MongoClient("mongodb://localhost:27017/")
    mydatabase = myclient["CT550"]
    myCollection = mydatabase["posts"]
    
    if doesFileExists('./mypostscraper/'+fileName):
        # with open('./mypostscraper/'+fileName) as file:
        #     file_data = json.load(file)
        #     myCollection.insert_many(file_data) 
        print ('Insert success!')
    else:
        print ('Not found JSON file!')


if __name__ == '__main__':
    # importDataIntoDB()
    fileName = create_filename()+".json"
    os.chdir("./mypostscraper/postscraper/spiders")
    os.sys("python crawl posts")
    print(os.getcwd())
    # importDataIntoDB(fileName)
# See PyCharm help at https://www.jetbrains.com/help/pycharm/


