# Database Creator in C++ with React/TS Interface

This is a thread-safe database creation/management system in C++, accessed through an interface written in TypeScript using React.js. It allows for creating and dropping tables; and for each table, creating and dropping columns of variable types. All data is stored, using binary file persistence. 

# Images
<img width="410" height="250" alt="image" src="https://github.com/user-attachments/assets/7a2ecd2f-4943-4e95-bf86-7d8c5915025a" />
<img width="410" height="250" alt="image" src="https://github.com/user-attachments/assets/5b03177d-17cf-4ded-9c92-617c361bc016" />

## Functionalities
- Interface using React and TypeScript
- Creating and dropping tables
- Creating and dropping columns for each table
- Creating, updating and deleting rows for each table
- Automatic data persistence in binary file periodically and upon system shutdown

## Technologies and Applied Concepts
### Backend
- C++ Programming Language
- File I/O in C++ (`std::fstream`)
- Thread safety with `std::mutex, std::shared_mutex, std::atomic, std::condition_variable`
- Usage of STL Containers for maximum performance and automatic RAII implementation
- HTML request handling using `CrowCpp`
- JSON manipulation using `nlohmann::json`

### Frontend
- TypeScript Programming Language
- React Framework
- Simple CSS
- Secure HTML Requests

## How to run
### Backend
**This system runs on Linux only. It requires` nlohmann::json` and `CrowCpp`.**<br>
Update the `#include` clauses to fit your situation.<br><br>
*(in the case of this repository, `nlohmann::json` was installed directly in the OS, and the most recent `crow_all.h` file was included in the ***backend*** folder)*

```bash
cd backend
g++ *.cpp -o db -std=c++17 -lpthread
./db
```

### Frontend
**This system runs in any OS.**
```bash
cd frontend
npm install
npm run dev
```

## Learnings
This project helped me apply both fundamental and advanced concepts in C++, with a focus on:
- Good practices for OOP architecture
- RAII
- Thread-safe operations

This was also my first interaction with TypeScript, so it was a great introduction to the programming language.

# Author
- **Pedro Guilherme Rosa Lutz**
- **Email: pedrolutz@protonmail.com**
- **LinkedIn: https://www.linkedin.com/in/pedro-lutz-4001ba221/**
- **Github: PedroLutz**
