# Project Diagrams for Interpreter Marketplace

## 1. Context Diagram (Level 0 DFD)
This diagram shows the system as a single process and its interactions with external entities.

```mermaid
graph TD
    Client((Client)) <-->|Request Service / Payment| System[Interpreter Marketplace System]
    System <-->|Job Alerts / Availability| Interpreter((Interpreter))
    Admin((System Admin)) <-->|Monitor Sessions / Manage Users| System
```

---

## 2. NoSQL Schema (Logical ERD)
While MongoDB is schema-less, the following logical relationships are maintained between collections. (Rendered as a left-to-right diagram to enforce a balanced layout).

```mermaid
graph LR
    USER["**USER**<br/>------------<br/>PK: ObjectID _id<br/>string email<br/>string password_hash<br/>string role"]
    
    INTERPRETER["**INTERPRETER**<br/>------------<br/>PK: ObjectID _id<br/>FK: ObjectID userId<br/>array languages<br/>string bio<br/>float rating<br/>float hourly_rate"]
    
    BOOKING["**BOOKING**<br/>------------<br/>PK: ObjectID _id<br/>FK: ObjectID clientId<br/>FK: ObjectID interpreterId<br/>datetime startTime<br/>string status"]
    
    SESSION["**SESSION**<br/>------------<br/>PK: ObjectID _id<br/>FK: ObjectID bookingId<br/>datetime actualStartTime<br/>datetime actualEndTime<br/>string recordingLink"]
    
    MESSAGE["**MESSAGE**<br/>------------<br/>PK: ObjectID _id<br/>FK: ObjectID sessionId<br/>FK: ObjectID senderId<br/>text content<br/>datetime timestamp"]

    USER -->|is a| INTERPRETER
    USER -->|makes| BOOKING
    INTERPRETER -->|receives| BOOKING
    BOOKING -->|initiates| SESSION
    SESSION -->|contains| MESSAGE
```

---

## 3. System Architecture
This diagram shows the technology stack and how the components communicate.

```mermaid
graph LR
    subgraph App_Framework [Full-Stack Next.js Framework]
        subgraph Client_Layer [Client-Side React]
            UI[User Interface / Tailwind]
            WebRTC[WebRTC Media Client]
        end
        
        subgraph Server_Layer [Server-Side API and Actions]
            API[API Endpoints]
            Signaling[WebRTC Signaling]
            Auth[Auth Logic]
        end
    end

    subgraph Data_Layer [Persistence]
        DB[(MongoDB Atlas / NoSQL)]
    end

    UI <--> API
    WebRTC <--> Signaling
    API <--> DB
    Signaling <--> DB
```

---

## 4. Use Case Diagram
This diagram shows the high-level functionality available to each user type.

```mermaid
graph TD
    subgraph Actors
        C[Client]
        I[Interpreter]
        A[Admin]
    end

    subgraph System_Use_Cases [Interpreter Marketplace]
        UC1(Register / Profile)
        UC2(Search Interpreters)
        UC3(Request Instant Call)
        UC4(Schedule Booking)
        UC5(Join Video Session)
        UC6(Send Chat Messages)
        UC7(Manage Users/Disputes)
    end

    C --> UC1
    C --> UC2
    C --> UC3
    C --> UC4
    C --> UC5
    C --> UC6

    I --> UC1
    I --> UC5
    I --> UC6

    A --> UC7
```
---

## 5. Sequence Diagram (UML)
This diagram shows the step-by-step process of a real-time interpretation request.

```mermaid
sequenceDiagram
    participant C as Client
    participant S as System/API
    participant I as Interpreter

    C->>S: Search for "French" Interpreters
    S-->>C: Returns available list
    C->>S: Request Instant Call
    S->>I: Send Push Notification/Socket Alert
    I->>S: Accept Request
    S-->>C: Matching Successful
    S-->>I: Open Video Room ID
    C->>I: Establish WebRTC Connection
    I-->>C: Interpretation Started
    C->>S: End Session
    S->>S: Log Session Data
```

---

## 6. Matching Algorithm Flowchart
This illustrates the logic used to pair a client with the correct interpreter.

```mermaid
flowchart TD
    Start([Client clicks Call Now]) --> Input[Get Requested Language]
    Input --> Query{Query DB for Role=Interpreter}
    Query --> Filter1{Is Language Match?}
    Filter1 -- No --> Next[Check Next Interpreter]
    Filter1 -- Yes --> Filter2{Is Status 'Online'?}
    Filter2 -- No --> Next
    Filter2 -- Yes --> Match[Send Alert to Interpreter]
    Match --> Response{Accepted?}
    Response -- No --> Next
    Response -- Yes --> Success([Establish Connection])
    Next --> Loop{End of List?}
    Loop -- Yes --> Fail([No Interpreters Available])
    Loop -- No --> Filter1
```

---

# Final Pre-Conversion Checklist
Before you convert your Markdown to Word, ensure you have done the following:

1.  **Fill Placeholders**: Search for `[USER NAME]`, `[REG. No]`, and `[SUPERVISOR NAME]` in the report and replace them with your actual details.
2.  **Generate TOC**: If you use Word, delete the manual Table of Contents I wrote and use Word's **References > Table of Contents** so it has clickable page numbers.
3.  **Insert Figures**:
    -   Copy the Mermaid code from this file into the [Mermaid Live Editor](https://mermaid.live/).
    -   Download the diagrams as PNG/SVG.i have about 6 
    -   Insert them into the corresponding sections of your Word document.
4.  **Check Page Breaks**: Ensure the "Declaration," "Abstract," and "Chapter 1" each start on a fresh page.
5.  **Alignment**: In Word, select all text (Ctrl+A) and use **Justify** alignment as per the MMU guideline.
