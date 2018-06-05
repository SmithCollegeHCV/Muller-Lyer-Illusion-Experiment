Müller-Lyer Illustion Experiment 
=========================

About This Project
------------------
The Muller-Lyer Illusion, named after its creator Franz Carl Muller-Lyer, a German psychiatrist and sociologist, is an illusion where different stylized line images may distort people’s measurement of the lines’ actual length. And we are  interested in how the illusion affect people’s measurement of a certain index position on the line. 

In this test, we have 6 slides of images which include both endpoint arrows pointing inwards, both endpoint arrows expanding outwards, one pointing inwards and one point outwards and two slides with normally displayed endpoints. During the test, each line segment has a range from 1 to ten. We will give a number to survey takers and they are expected to match the position of the number on the ranged line by dragging the slider pointer to the “correct” position. Their answers will be recorded automatically via server, and once we get the result data set, we will be able to analyze the shifts between their answers and the actual position of the number.

Getting Started
--------------

This experiment was forked from experimentr which you can view more of below.
In order to run this experiment you must download [Node](https://github.com/codementum/experimentr/blob/master/public/experimentr.js). 
From there you must run npm install and install all the packages that this experiment requires.
You must also download Redis. 


One you have downloaded all packages and redis you can run: 

redis-server redis.conf

nodejs app.js (on an Ubuntu server) or node app.js (elsewhere)

and that should start the app at 'localhost:4000'. 

To add or remove pages to the experimentr module go to the index.html page within public/ and add a module. They are listed by folder name. 


Pulling down results 
---------------------

In order to pull down results you should ssh into the server by using this command 

ssh [enter Ip address here]

You will probably be prompted for a password or a pem. You go into root/StreamingData/analysis  then run the following command 

sh pull.sh 

These results will be saved in the results file. Everytime you pull it will overwrite the old file with the newest data. If you do not wipe clean the database it will contain the results of every experiment run. 

From there you must open a new terminal window and navigate to a folder where you will keep all your results from that folder run the following command 

sftp [enter ip address here]

you will be prompted for a password or a pem. Once you have accessed the server navigate to the following folder:
root/Muller-Lyer-Illusion-Experiment/analysis/results 

to pull down the results file run the following command 

get data.json 

you then can exit and the file will be in the appropriate folder. 


Redis-cli
----------
We rely on redis to save all data from the experiments.  You can download [Redis here](http://redis.io/download). The configuration file is known as redis.conf and the appendonly.aof also is a redis file. 

To start the redis server type: 

'redis-server redis.conf'

This only needs to be started once, and will continue running on the server until it is halted. To monitor all data coming to the backend type:

'redis-cli monitor'

Look at the documentation to find out more on how to query the database. 

Installation
-------
## Before-Clone Installation Dependencies:
### Node.js
To find installation instructions for your operating system (Linux, OSX, and Windows), please visit https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
### Redis
**Note:** Redis is _not_ installed through `npm install` and must be installed separately.
Redis can be manually downloaded at redis.io/download. Please note that Windows is not directly supported, however there is an experimental Windows port maintained by Microsoft. If you are on OSX and have `brew` installed, you can install Redis with the following: `brew install redis`.

## Clone and Post-Clone Installation:
- clone this repo
- cd to this repo and run `npm install`

Testing experiments
-------

You can use `debug` as your workerId when testing live experiments to help make sure your data doesn't end up the experiment data.
See [convert.js](https://github.com/codementum/experimentr/blob/master/analysis/src/convert.js#L24) for details.

Another useful trick is to empty the redis database. To do so, run `redis-cli` to get the redis command line prompt, then type `FLUSHDB` to delete all current keys.

More redis commands can be found at [http://redis.io/commands](http://redis.io/commands).
