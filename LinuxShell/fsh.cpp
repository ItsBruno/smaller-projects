#include <iostream>
#include <unistd.h>
#include <string>
#include <sys/wait.h>
#include <cstring>
#include <signal.h>
#include <stdio.h>

using namespace std;

void parseCommand(string* parsedPath, char** arguments, string command);
void runProgram(string path, char* const* arguments);
bool isEmbedded(string command);
void cd(char* dir);
void exit();
string getPath(string commandName);

int PID = -1;
struct sigaction act = {0};
string embededCommands[] = {"cd", "exit"};

void handle_int(int sig_num){

    if(PID == -1) {
        cout << "\n";
    }
    else{
        kill(PID, SIGINT);
        //the first wait was killed by sigint so the parent should wait again;
        wait(NULL);
        //reset the PID 
        PID = -1;
    }
    return;
}

int main(int argc, char* argv[], char* env[]) {

    act.sa_handler = &handle_int;
    sigemptyset(&act.sa_mask);
    sigaction(SIGINT, &act, NULL);
    
    string parsedPath[2]; //[0] = path, [1] = command name
    //cout << sysconf(_SC_ARG_MAX) << endl;
    
    while(true){
        cout << "fsh> ";
        char* arguments[100];

        string command;

        getline(cin, command);
        cin.clear();
        
        if(command.length() > 0) {
            parseCommand(parsedPath, arguments, command);
            string path = parsedPath[0];
            string commandName = parsedPath[1];

            char* const* argumentsConst = arguments;        

            if(!isEmbedded(commandName)) {
                //if the path and the commandName are the same and the command is not embedded search the path
        
                if(path == commandName) { 
                    path = getPath(commandName);
                }
                switch (PID = fork())
                {
                case -1:
                    cerr << "Program execution failed!" << endl;
                    break;
                case 0:
                    setpgid(0,0);
                    runProgram(path, argumentsConst);
                    exit(0);
                default:
                    break;
                }
                wait(NULL);
                PID = -1;
            }
            else {
                if(commandName == "cd") cd(arguments[1]);
                else if(commandName == "exit") exit();
            }
        }
    }
}
 
void cd(char* dir) {
    if(chdir(dir) == -1) {
        cerr << "fsh: Directory " << dir << " does not exist." << endl;
    }
}

void exit() {
    exit(0);
}

bool isEmbedded(string command) {
    for(string cmd : embededCommands){
        if(cmd == command) return true;
    }
    return false;
}

void runProgram(string path, char* const* arguments) {
    if(execve(path.c_str(), arguments, NULL) == -1) {
        cerr << "fsh: Unknown command: " << path << endl;
    }
}

void parseCommand(string* parsedPath, char** arguments, string command) {

    //remove leading whitespaces
    command = command.substr(command.find_first_not_of(" "));


    //get the path from the command 
    parsedPath[0] = command.substr(0, command.find(" "));
    //get the command name from the path
    parsedPath[1] = parsedPath[0].substr(parsedPath[0].find_last_of("/") + 1);

    string temp = "";

    //the first argument should be the filename
    char * cstr = new char [parsedPath[0].length()+1]; //make a char * string
    strcpy(cstr, parsedPath[1].c_str());               //copy the parsedPath[1] to the char * string
    *arguments = cstr;                                 
    arguments++;
    //if a white space is present there are arguments
    if(command.find(" ") != string::npos){
        //arguments start after a white space
        string args = command.substr(command.find(" "));
        args = args.substr(args.find_first_not_of(' '));

        int i = 0;
        while(args[i] != '\0'){
            if(args[i] != ' ') {
                temp += args[i];
            }
            //if the current and the previus characters where a whitespace continue
            else if(args[i] == ' ' && args[i-1] == ' ');
            else {
                char * cstr = new char [temp.length()+1]; //make a char * string
                strcpy(cstr, temp.c_str());
               
                *arguments = cstr;
                temp = "";
                arguments++;
            }
            i++;
        }
        
        //store the last argument into the array since the while loop got terminated by \0
        char * cstr = new char [temp.length()+1]; //make a char * string
        strcpy(cstr, temp.c_str());
        *arguments = cstr;
        arguments++;
    }
    //end the array with a null pointer
    *arguments = nullptr;
}

string getPath(string commandName) {
    string PATH = string(getenv("PATH"));
    //add a colon to the end of the path string so that the while loop below functions as expected

    int i = 0;
    string path = "";
    do {
        if(PATH[i] != ':' && PATH[i] != '\0'){
            path += PATH[i];
        } 
        else {
            //access returns 0 if the file specified exists
            if(access((path+ "/" + commandName).c_str(), F_OK) == 0){
                //return the path + / + commandName as the absolute path to the file
                return(path+ "/" + commandName);
            }
            path = "";
        }
        i++;
    } while(PATH[i] != '\0');
    //command was not found in the path, return only the commandName since it might be in the working directory
    return(commandName);
}
