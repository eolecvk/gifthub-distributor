## How to run

1. Pull repo 
2. Make sure JDK is installed: `java --version`
2. Make sure NPM is installed `npm --version`
3. Set execution flag on gradlew file: `chmod +x gradlew`
3. `./gradlew clean build run`
5. When you see that the `:run` task is going server should now be available at http://localhost:8080

## Where to add front end files
Front end files are hosted in `/src/main/resources/public`  
Anything in this folder will be statically accessible from the server

## How to update code
1. `git checkout master && git pull` to pull down master at head
1. `git checkout -b <branchname>` to make a new branch
2. make changes
2. run `./gradlew spotlessJavaApply` to format the code
3. `git commit -a -m <commit message>` to commit changes locally
4. `git push` to push to remote
5. come to notabug.org UI to make and merge pull request