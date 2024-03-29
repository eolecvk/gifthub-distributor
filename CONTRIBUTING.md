# Contributing as a developer

## How to run

Pull repo
```
git clone https://github.com/eolecvk/gifthub-distributor.git
```

Make sure JDK is installed:
```
java --version
```

Make sure NPM is installed
```
npm --version
```

Set execution flag on gradlew file:
```
chmod +x gradlew
```

Run
```
./gradlew clean build run`
```
When you see that the `:run` task is going server should now be available at http://localhost:8080


## Where to add front end files

Front end files are hosted in `/src/main/resources/public`  
Anything in this folder will be statically accessible from the server

To run the server in iterative front end mode (alternative to `./gradlew clean build run``), run:
```
./gradlew runDebug --parallel`
```

This will run both the front and backend server, and proxy from one to the other, access the correct
server on http://localhost:3000


## How to update code

1. `git checkout master && git pull` to pull down master at head
1. `git checkout -b <branchname>` to make a new branch
2. make changes
2. run `./gradlew spotlessJavaApply` and `./gradlew spotlessJavascriptApply` to format the code
3. `git commit -a -m <commit message>` to commit changes locally
4. `git push` to push to remote
5. Go to [GitHub repo page](https://github.com/eolecvk/gifthub-distributor) to make and merge pull request
