import json
import csv
import pandas as pd

inputFile = open("data.json")
data = json.load(inputFile)
inputFile.close()
dataFrame = pd.DataFrame(data = data)


#DataFrame with time features
dataFrame_withtime = dataFrame.loc[:,["postId","workerId","pageId","conditionVersion","s1","s2","s3","s4","s5","s6","age","gender","degree","monitor","comments",
                                     "time_start_experiment","time_end_experiment","time_start_tutorial","time_end_tutorial","time_start_test",
                                     "time_end_test","time_start_demographics","time_end_demographics"]]
dataFrame_withtime.to_csv("data_with_time.csv", index = False)

#DataFrame without time features
dataFrame_notime = dataFrame.loc[:,["postId","workerId","pageId","conditionVersion","s1","s2","s3","s4","s5","s6","age","gender","degree","monitor","comments"]]
dataFrame_notime.to_csv("data_no_time.csv", index = False)
