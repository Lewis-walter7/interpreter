# MULTIMEDIA UNIVERSITY OF KENYA
## FACULTY OF COMPUTING & INFORMATION TECHNOLOGY

**DESIGN AND IMPLEMENTATION OF A REAL-TIME INTERPRETER MARKETPLACE AND MANAGEMENT SYSTEM**

**BY**

**NAME:** [USER NAME]  
**REG. No:** [REGISTRATION NUMBER]

**SUPERVISOR:** [SUPERVISOR NAME]

**MAY, 2026**

---

Submitted in partial fulfillment of the requirements of Third Year Bachelor of Science in Software Engineering of Multimedia University of Kenya.

\pagebreak

# DECLARATION

I hereby declare that this Project is my own work and has, to the best of my knowledge, not been submitted to any other institution of higher learning.

**Student:** _________________________  
**Registration Number:** _________________________

**Signature:** ...........................................................  
**Date:** .....................................................................

This project has been submitted as a partial fulfillment of requirements for the Bachelor of Science in Software Engineering of Multimedia University of Kenya with my approval as the University supervisor.

**Supervisor:** _________________________

**Signature:** .....................................................................  
**Date:** ...............................................................

\pagebreak

# DEDICATION

I dedicate this project to my family and friends who have supported me throughout my academic journey. Their encouragement and belief in my abilities have been the driving force behind the successful completion of this work.

\pagebreak

# ACKNOWLEDGEMENTS

I would like to express my sincere gratitude to my supervisor for the invaluable guidance, patience, and technical insights provided throughout the duration of this project. Their expertise was instrumental in shaping the architecture and implementation of this system.

I also thank the faculty members of the Faculty of Computing & Information Technology at Multimedia University of Kenya for providing a conducive learning environment. Special thanks to my colleagues for their peer support and to my family for their unwavering encouragement.

\pagebreak

# ABSTRACT

This project presents the design and implementation of a real-time interpreter marketplace and management system, a digital platform engineered to bridge the communication gap between clients and professional interpreters globally. As globalization increases the demand for immediate linguistic services, traditional manual booking methods have become insufficient. This system addresses these inefficiencies by providing a centralized marketplace where users can request instant or scheduled interpretation services. The platform features role-based access control, a robust booking and matching engine, and integrated real-time communication tools, including high-fidelity video and chat interfaces. 

Developed using an Agile methodology, the implementation utilizes a modern technology stack comprising Next.js for the frontend, Node.js and Express for the backend, and a MongoDB database for reliable data persistence. The system's architecture prioritizes scalability, security, and user experience. Results from the testing phase indicate that the platform successfully manages complex booking workflows and maintains stable real-time connections. This project concludes that digitalizing interpretation services significantly enhances accessibility and efficiency. Future recommendations include the integration of AI-driven interpreter matching and advanced session analytics to further optimize service delivery.

*(Word Count: 184 words)*

\pagebreak

# TABLE OF CONTENTS

1.  **CHAPTER 1: INTRODUCTION** ................................................. 1
    1.1 Background of Study ........................................................ 1
    1.2 Problem Statement ........................................................... 2
    1.3 Aim of the Study ............................................................ 2
    1.4 Significance of the Study ................................................... 3
    1.5 Scope ....................................................................... 3
    1.6 Assumptions ................................................................. 4
    1.7 Limitations ................................................................. 4
2.  **CHAPTER 2: LITERATURE REVIEW** ........................................... 5
    2.1 Introduction ................................................................ 5
    2.2 Related Systems ............................................................. 5
    2.3 Limitations of Existing Systems ............................................. 6
    2.4 Proposed Solution ........................................................... 6
3.  **CHAPTER 3: METHODOLOGY** ................................................. 7
    3.1 Introduction ................................................................ 7
    3.2 Methodology Selection ....................................................... 7
    3.3 Data Collection Methods ..................................................... 8
4.  **CHAPTER 4: SYSTEM ANALYSIS** .............................................. 9
    4.1 Current System Analysis ..................................................... 9
    4.2 System Requirements ......................................................... 10
5.  **CHAPTER 5: SYSTEM DESIGN** ................................................ 11
    5.1 Architectural Design ........................................................ 11
    5.2 Database Design ............................................................. 12
    5.3 User Interface Design ....................................................... 13
6.  **CHAPTER 6: IMPLEMENTATION AND TESTING** ................................... 14
    6.1 Development Environment ..................................................... 14
    6.2 System Components ........................................................... 15
    6.3 Test Plan ................................................................... 16
7.  **CHAPTER 7: RESULTS & CONCLUSION** ......................................... 17
    7.1 Achievements and Lessons Learnt ............................................. 17
    7.2 Conclusion .................................................................. 18
    7.3 Recommendations ............................................................. 18
**REFERENCES** .................................................................. 19
**APPENDIX** .................................................................... 20

\pagebreak

# LIST OF ABBREVIATIONS

| Abbreviation | Meaning |
|--------------|---------|
| IMS          | Interpreter Management System |
| UI           | User Interface |
| API          | Application Programming Interface |
| DB           | Database |
| JWT          | JSON Web Token |
| MVC          | Model-View-Controller |
| ERD          | Entity Relationship Diagram |
| DFD          | Data Flow Diagram |
| UML          | Unified Modeling Language |
| MVP          | Minimum Viable Product |

\pagebreak

# LIST OF FIGURES
Figure 1: Context Diagram of the Interpreter Marketplace System ........... 9
Figure 2: System Architecture Diagram .................................... 11
Figure 3: Use Case Diagram ............................................... 12
Figure 4: System Sequence Diagram for Interpretation Sessions ............ 12
Figure 5: NoSQL Logical Schema Diagram ................................... 13
Figure 6: Matching Algorithm Flowchart ................................... 15

# LIST OF TABLES
Table 1: List of Abbreviations ........................................... 8
Table 2: Functional Requirements Table ................................... 10
Table 3: Non-Functional Requirements Table ............................... 10
Table 4: Database Collection Schema ...................................... 13
Table 5: Test Case Results Table ......................................... 16
Table 6: Project Budget .................................................. 20

\pagebreak

# CHAPTER 1: INTRODUCTION

## 1.1 Background of Study
In an increasingly interconnected global economy, language barriers remain a significant hurdle for international business, healthcare, legal proceedings, and cross-cultural social integration. Access to timely and professional interpretation is critical. Historically, interpretation services have relied on physical agencies that manage a static roster of interpreters through manual coordination, phone calls, and email exchanges. This traditional process is often slow, geographically limited, and lacks the transparency required for modern, fast-paced environments where immediate communication is essential.

With the rapid advancement of internet technologies, particularly the rise of the "gig economy" and the maturation of WebRTC (Web Real-Time Communication), there is a unique opportunity to revolutionize the linguistic service sector. A digital marketplace can decentralize these services, shifting the paradigm from manual agency-led dispatching to a user-empowered platform. This allows for instant connectivity between clients and professionals regardless of physical location, drastically reducing wait times and administrative overhead.

This project focuses on the development of such a system. By engineering a Real-Time Interpreter Marketplace and Management System, we aim to address the technical challenges of real-time algorithmic matching, secure high-fidelity video communication, and the automated management of interpretation sessions. The resulting platform bridges the communication gap seamlessly using modern web technologies.

## 1.2 Problem Statement
The current landscape of interpretation services—and specifically the existing manual workflows used to bridge clients with interpreters—suffers from several critical operational bottlenecks:
1.  **Inefficiency in Matching:** Finding an available, qualified interpreter for a specific language pair and domain (e.g., medical, legal, technical) in real-time is a cumbersome, manual process that can take hours.
2.  **Lack of Accessibility:** Clients in remote or underserved areas, or those requiring immediate emergency interpretation, struggle to access professional interpreters on short notice.
3.  **Fragmented Management:** Interpreters lack a unified digital workspace to manage their schedules, accept bookings, and conduct sessions, often relying on disjointed third-party tools like Skype or WhatsApp.
4.  **Inconsistent User Experience:** The absence of integrated features like session tracking, secure payment escrow, and specialized video interfaces leads to a fragmented and unprofessional experience for both clients and service providers.

There is a clear and pressing need for a dedicated, end-to-end platform that automates the matching process and provides a professional, integrated environment for real-time interpretation.

## 1.3 Aim of the Study
The primary aim of this project is to design and implement a real-time interpreter marketplace and management system that provides a seamless, secure, and efficient connection between clients and professional interpreters.

### 1.3.1 Research Objectives
1.  To design a secure user authentication system with role-based access control (RBAC) for clients, interpreters, and administrators.
2.  To implement a dynamic booking and interpreter matching algorithm based on language, expertise, and availability.
3.  To develop a high-performance real-time communication module supporting low-latency video and chat.
4.  To create a centralized administrative dashboard for system monitoring, user management, and session auditing.

## 1.4 Significance of the Study
This study is significant for several stakeholders:
-   **For Clients:** It provides immediate access to professional linguistic support, reducing delays and improving the quality of communication.
-   **For Interpreters:** It offers a centralized platform to find work, manage professional schedules, and conduct sessions without needing multiple third-party tools.
-   **For the Industry:** It demonstrates how modern web technologies can be applied to niche service sectors to improve scalability and service delivery.
-   **For the Researcher:** It provides practical experience in solving complex real-world problems using full-stack software engineering principles.

## 1.5 Scope
The system's functional scope includes:
-   **User Management:** Registration, profile management, and multi-factor authentication.
-   **Marketplace Engine:** Search functionality for interpreters, language pair selection, and rating systems.
-   **Booking System:** Instant "Call Now" features and scheduled booking calendars.
-   **Communication Suite:** Integrated video conferencing and persistent chat messaging.
-   **Admin Tools:** Dashboard for tracking platform health, managing disputes, and user verification.

The technical scope is limited to a web-based application (MVP) optimized for modern browsers, utilizing cloud-based signaling for real-time features.

## 1.6 Assumptions
-   Users have access to a stable internet connection with sufficient bandwidth for video streaming.
-   Interpreters possess the necessary hardware (webcam and microphone) for professional sessions.
-   Interpreters provide truthful information regarding their certifications and expertise.

## 1.7 Limitations
-   **Bandwidth Sensitivity:** The quality of real-time video is heavily dependent on the users' local network conditions.
-   **Mobile Integration:** The initial version is a web application; a native mobile app is outside the current scope.
-   **Payment Gateway:** The MVP may focus on booking logic, with full financial settlement features potentially moved to a future phase.

\pagebreak

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Introduction
This chapter critically examines the existing body of literature, technological trends, and commercial solutions within the field of Interpreter Management Systems (IMS), Video Remote Interpretation (VRI), and digital freelance marketplaces. The objective is to establish a clear technological and operational baseline, identify the critical gaps in current systems, and justify the architectural choices made for the proposed system.

## 2.2 Evolution of Video Remote Interpretation (VRI)
Historically, interpretation was strictly a face-to-face or telephone-based service (Over-the-Phone Interpretation - OPI). While OPI solved the issue of geographic distance, it lacked the visual cues—such as facial expressions and body language—that are critical for accurate linguistic translation, particularly in medical and legal contexts. The advent of broadband internet and WebRTC (Web Real-Time Communication) paved the way for VRI. According to recent industry reports by the language services sector, VRI has seen an exponential adoption rate post-2020. However, the software infrastructure supporting VRI remains highly fragmented. Many independent interpreters still rely on generic video conferencing tools (like Zoom or Skype) patched together with manual scheduling via email and disjointed payment gateways.

## 2.3 Analysis of Related Systems
To understand the competitive landscape, several prominent systems currently addressing the needs of the interpretation and translation market were analyzed:

1.  **Boostlingo:**
    A comprehensive, enterprise-grade cloud platform designed primarily for large Language Service Providers (LSPs).
    -   *Strengths:* Offers a robust suite of tools for both OPI and VRI, advanced routing algorithms, and enterprise billing.
    -   *Weaknesses:* It operates on a B2B (Business-to-Business) model. It is prohibitively expensive and overly complex for independent, freelance interpreters trying to connect directly with individual clients or small businesses.

2.  **ProZ.com:**
    One of the oldest and largest online community directories for translators and interpreters.
    -   *Strengths:* Possesses a massive global database of linguistic professionals and a well-established peer-review rating system.
    -   *Weaknesses:* It functions primarily as a static directory and job board. It lacks integrated, real-time communication tools. Users must find an interpreter on ProZ and then migrate off-platform to actually conduct the video session and process payments, introducing security and privacy risks.

3.  **Upwork / Freelancer (General Marketplaces):**
    Massive, general-purpose freelance gig marketplaces.
    -   *Strengths:* Excellent escrow payment systems, global reach, and highly refined user interfaces.
    -   *Weaknesses:* Their matching algorithms are heavily generalized. They do not account for the real-time, "on-demand" nature of emergency interpretation. Furthermore, their built-in video tools lack session-specific features required by interpreters, such as dual-channel audio routing or specific confidentiality compliance measures.

## 2.4 Critical Limitations and the Proposed Solution
Analysis of the existing ecosystem reveals a distinct gap: **There is no accessible, all-in-one digital marketplace tailored specifically for real-time, peer-to-peer Video Remote Interpretation.** Existing solutions are either too expensive (enterprise VRI), too static (directories), or too generalized (freelance platforms).

The proposed Real-Time Interpreter Marketplace addresses this exact gap by:
-   **End-to-End Integration:** Combining the marketplace discovery phase (search, filter, match) directly with the workspace execution phase (WebRTC video and chat) within a single, unified web application.
-   **Instantaneous Matching:** Shifting the focus from long-term contract bidding (like Upwork) to instant, "on-demand" matching to meet the needs of urgent communication scenarios.
-   **Reduced Cognitive Load:** Providing a specialized, minimalist User Interface that minimizes distractions for the interpreter, thereby improving translation accuracy.

\pagebreak

# CHAPTER 3: METHODOLOGY

## 3.1 Introduction
The success, scalability, and maintainability of any software engineering project are heavily dependent on the choice and strict adherence to an appropriate development methodology. This chapter outlines the framework, phases, and data collection techniques used to guide the Interpreter Marketplace project from its initial conception to its final deployment.

## 3.2 Methodology Selection: Agile (Scrum Framework)
Traditional software development models, such as Waterfall, demand rigid, upfront requirement gathering and do not easily accommodate changes mid-development. Given the inherent complexities of integrating real-time WebRTC media streams and the likelihood of shifting user interface requirements based on usability testing, a rigid model was deemed inappropriate.

Therefore, the **Agile methodology**, specifically utilizing a **Scrum-lite framework**, was selected. The project timeline was divided into series of two-week iterations, known as "Sprints."

### 3.2.1 Justification for Agile
-   **Adaptability to Evolving Requirements:** As technical hurdles regarding WebRTC connection stability over varied bandwidths were encountered, Agile allowed the development team to pivot and adjust the architecture without derailing the entire project timeline.
-   **Continuous Integration and Testing:** Each sprint resulted in a functional, testable increment of the software (e.g., Sprint 1: Auth Module; Sprint 2: Matching Engine). This allowed for continuous unit and integration testing, ensuring bugs were caught early rather than compounding at the end of the development cycle.
-   **Stakeholder Feedback Loop:** By producing functional prototypes early, it was possible to solicit feedback from potential end-users regarding the UI layout, allowing for iterative refinement of the video room interface.

### 3.2.2 The Software Development Life Cycle (SDLC) Phases
1.  **Planning & Requirements:** Defining the core problem, establishing the MVP (Minimum Viable Product) scope, and creating initial user stories.
2.  **System Design:** Architecting the Next.js frontend, defining the MongoDB NoSQL schemas, and drafting the Mermaid.js system diagrams (ERD, DFD, Sequence).
3.  **Development (Implementation):** Writing the actual code. This was broken down into frontend UI component creation, backend API route development, and WebRTC signaling integration.
4.  **Testing:** Conducting rigorous multi-level testing (Unit, Integration, and User Acceptance) to ensure stability under load.
5.  **Deployment:** Pushing the finalized application to a production environment (Vercel) and provisioning the cloud database (MongoDB Atlas).

## 3.3 Data Collection Methods and Tools
To ensure the system's functional requirements accurately mirrored the real-world needs of the interpretation industry, empirical data was gathered using the following methodologies:

1.  **Academic & Industry Literature Review:** Extensive analysis of recent academic papers focusing on WebRTC limitations and industry whitepapers detailing the projected growth of the VRI sector.
2.  **Requirement Elicitation Interviews:** Semi-structured interviews were conducted with a sample group of potential users. This group included freelance bilingual individuals and small business owners who frequently require translation services. The goal was to identify specific pain points in their current workflow.
3.  **Competitor Feature Benchmarking:** A systematic feature mapping of existing platforms (like ProZ and Zoom) was performed to categorize functionalities into "must-have" (e.g., low-latency video, secure auth) versus "nice-to-have" (e.g., AI transcription).
4.  **Data Collection Instruments:** The primary instrument utilized was a standardized **Interview Guide** (attached in the Appendix), which ensured consistency in the questions asked to stakeholders regarding their usability expectations and technical constraints.

\pagebreak

# CHAPTER 4: SYSTEM ANALYSIS

## 4.1 Detailed Analysis of Current System
Before the implementation of this digital marketplace, the current system relies heavily on a manual and decentralized operational model. Instead of an automated platform, the current workflow operates through direct human coordination using conventional communication channels. The logic of our current manual system can be broken down as follows:

-   **Context Level Analysis:** The core of the "System" is currently a human Administrator or Agency Coordinator. External entities (the Client and the Interpreter) do not interact directly; they communicate solely through the Coordinator via phone calls, SMS, or WhatsApp.
-   **Process Flow:**
    1.  **Input:** A Client contacts the administration desk with a request for a specific language pair and scheduled time.
    2.  **Process:** The Administrator manually checks physical ledgers, spreadsheets, or static contact lists to find interpreters who match the criteria.
    3.  **Verification:** The Administrator calls or messages multiple interpreters one by one to confirm their availability.
    4.  **Output:** Once an interpreter is confirmed, the Administrator manually sets up a third-party video link (e.g., Zoom or Google Meet) and shares it with both parties.

This current manual chain introduces significant latency—often taking upwards of 30 to 60 minutes just to secure a match—and is highly prone to human error, double-booking, and lost records. It lacks scalability, as the Administrator becomes a bottleneck when requests increase. The proposed automated system is designed specifically to replace this manual "Process" and "Verification" bottleneck with a sub-second digital matching engine and integrated video rooms.

### 4.1.1 Proposed System Context
The Context Diagram below illustrates the high-level boundaries of the Interpreter Marketplace and its interactions with external entities.

![Figure 1: Context Diagram of the Interpreter Marketplace System](./public/figures/context_diagram.png)

*   **Context Diagram:** The Interpreter Marketplace System sits at the center. Actors include the **Client** (submits requests), **Interpreter** (receives requests/provides stream), and **Admin** (monitors sessions).
*   **DFD Level 0:** Shows the main processes: User Management, Booking Engine, and Media Signaling (WebRTC).

## 4.2 System Requirements

### 4.2.1 Functional Requirements
**Table 2: Functional Requirements**

| ID | Feature | Description |
|----|---------|-------------|
| **FR1** | Authentication | Users must be able to sign up, log in, and reset passwords securely. |
| **FR2** | Profile Mgt | Interpreters must be able to list languages, certifications, and rates. |
| **FR3** | Matching | Clients must be able to search for interpreters and initiate a request. |
| **FR4** | Communication | High-quality bidirectional video and audio streaming with low latency. |
| **FR5** | Booking | Users must be able to view, cancel, or reschedule upcoming sessions. |

### 4.2.2 Non-Functional Requirements
**Table 3: Non-Functional Requirements**

| ID | Category | Requirement |
|----|----------|-------------|
| **NFR1** | Performance | Video latency should ideally be below 200ms for natural flow. |
| **NFR2** | Security | All sessions must be encrypted; user data stored securely. |
| **NFR3** | Scalability | Backend should handle multiple concurrent video sessions. |
| **NFR4** | Usability | Interface must be accessible and follow WCAG guidelines. |

## 4.3 Feasibility Study
Before committing resources to the development phase, a comprehensive feasibility study was conducted to evaluate the viability of the proposed system across three primary dimensions: Technical, Economic, and Operational.

### 4.3.1 Technical Feasibility
The project was deemed highly technically feasible. The proposed technology stack (Next.js, React, Node.js environment, and MongoDB) consists of mature, heavily documented, and widely supported open-source technologies. Furthermore, the core real-time communication requirement can be reliably met using the standardized WebRTC API, which is now natively supported by all major modern web browsers (Chrome, Firefox, Safari, Edge) without the need for external plugins. The deployment infrastructure (Vercel for hosting, MongoDB Atlas for the database) provides automated scaling, further reducing technical deployment risks.

### 4.3.2 Economic Feasibility
The economic feasibility of the MVP (Minimum Viable Product) is excellent. Because the system relies entirely on open-source frameworks and "Platform-as-a-Service" (PaaS) providers that offer generous free tiers for development (e.g., Vercel's Hobby tier, MongoDB Atlas's M0 cluster), the initial capital expenditure required for software development and prototyping is essentially zero. The only projected hard costs are for domain name registration and the developer's internet bandwidth. Should the system scale to production, the serverless architecture ensures that hosting costs scale linearly with user traffic, avoiding expensive fixed server costs.

### 4.3.3 Operational Feasibility
Operationally, the system is designed to drastically reduce the administrative overhead currently burdening language service coordinators. By shifting the workload of matching and scheduling to an automated algorithm, human administrators are freed to focus on dispute resolution and quality assurance. For the end-users (Clients and Interpreters), the system is highly feasible as it requires no specialized hardware—only a standard laptop or smartphone with a built-in camera and a standard broadband connection. The intuitive "Mobile-First" UI design ensures a low learning curve, promoting rapid user adoption.

\pagebreak

# CHAPTER 5: SYSTEM DESIGN

## 5.1 Architectural Design
The system follows a **Full-Stack Next.js** architecture, utilizing a unified framework for both client-side rendering and server-side logic. This approach minimizes latency and simplifies deployment compared to traditional separated architectures.

-   **Frontend & UI (Next.js & React):** Handles the rendering of the user interface. By utilizing Next.js, the system benefits from Server-Side Rendering (SSR) and Static Site Generation (SSG), which drastically improves initial load times and SEO. State management is handled via React Hooks, ensuring a reactive and dynamic user experience.
-   **Server-Side Logic (Next.js API Routes):** Replaces a traditional separate backend. Next.js integrated API routes and Server Actions handle core business logic, user authentication flows, and database interactions securely on the server, preventing sensitive logic from leaking to the client.
-   **Real-Time Layer (WebRTC & WebSockets):** Manages the signaling required to establish peer-to-peer video calls and facilitates low-latency instant messaging. This is critical for the seamless operation of the interpreter marketplace.
-   **Database (MongoDB):** A document-based NoSQL database that stores user profiles, booking history, and session logs. It is accessed securely via Mongoose ODM within the Next.js API routes.

![Figure 2: System Architecture Diagram](./public/figures/architecture_diagram.png)

### 5.1.1 System Interactions and Use Cases
The interaction between different user roles and the system is strictly governed by role-based access control (RBAC). The primary actors include:
-   **Clients:** Authorized to search the interpreter directory, initiate instant calls, schedule future bookings, and manage their payment profiles.
-   **Interpreters:** Authorized to set their online availability, accept incoming session requests, update their linguistic credentials, and view earnings.
-   **Administrators:** Authorized to monitor active sessions for quality assurance, resolve disputes, and verify interpreter credentials before they go live on the marketplace.

![Figure 3: Use Case Diagram](./public/figures/use_case_diagram.png)

A typical interpretation session follows a strict sequence: a client requests a language, the matching engine alerts available interpreters via WebSockets, an interpreter accepts, and a secure WebRTC video room is instantiated for both parties.

![Figure 4: System Sequence Diagram for Interpretation Sessions](./public/figures/sequence_diagram.png)

## 5.2 Database Design
A NoSQL approach using MongoDB was selected due to its flexible document model, which easily accommodates varying data structures (like an interpreter's multiple languages and dynamic ratings) without rigid table constraints. The schema is structured into the following core collections:

**Table 4: Database Collection Schema**

| Collection | Description | Key Fields |
|------------|-------------|------------|
| **Users** | User Identity | ObjectID, Email, PasswordHash, Role |
| **Interpreters**| Professional Data | UserRef, Languages (Array), Rating, Rate |
| **Bookings** | Session Records | ClientId, InterpreterId, Status, Time |
| **Messages** | Chat Logs | BookingId, SenderId, Content, Timestamp |

![Figure 5: NoSQL Logical Schema Diagram](./public/figures/database_schema.png)

## 5.3 User Interface (UI) Design
The UI is engineered with a strict **"Mobile-First"** philosophy, utilizing Tailwind CSS to ensure complete responsiveness across all device sizes. The design language prioritizes clarity and minimal cognitive load, which is critical during stressful interpretation scenarios.

-   **Dashboard:** A highly legible, quick-glance view of upcoming sessions, recent activities, and system notifications.
-   **The Video Room:** A specialized interface designed to maximize screen real estate for video tiles. It features a collapsible side-chat panel and prominently displays "Mute," "Video Off," and "End Call" controls to prevent user errors during active sessions.
-   **Search & Discovery:** A filter-heavy interface allowing clients to quickly narrow down interpreters based on specific linguistic criteria, availability, and user ratings.

*(Insert UI Mockup Screenshots Here: Dashboard, Search Page, and Video Room)*

\pagebreak

# CHAPTER 6: IMPLEMENTATION AND TESTING

## 6.1 Development Environment
### 6.1.1 Software Requirements
-   **Operating System:** Windows 11 / Linux
-   **IDE:** Visual Studio Code
-   **Version Control:** Git & GitHub
-   **Full-Stack Framework:** Next.js 14 (App Router)
-   **Styling:** Tailwind CSS
-   **Database Library:** Mongoose / MongoDB Driver
-   **Database:** MongoDB Atlas / MongoDB
-   **Deployment:** Vercel

### 6.1.2 Hardware Requirements
-   **Processor:** Intel Core i5 or equivalent (Minimum)
-   **Memory:** 8GB RAM
-   **Peripherals:** HD Webcam (720p minimum), Noise-canceling microphone/headset.
-   **Connectivity:** 5 Mbps Upload/Download stable internet connection.

## 6.2 System Components Implementation
The realization of the system architecture involved the integration of several complex software modules:

1.  **Authentication & Security Module:** Implemented using JSON Web Tokens (JWT) coupled with bcrypt for password hashing. JWT allows for stateless session management, meaning the Next.js server does not need to query the database for every single user request, vastly improving API response times. Route protection is enforced via Next.js middleware, which intercepts unauthorized access to protected dashboard routes.
2.  **The Matching Engine (Algorithm):** A custom backend algorithm written in Node.js (via Next.js API routes) that queries the MongoDB cluster for available interpreters. It uses a cascading filter system: first matching the exact requested language pair, then filtering by "Online" status, and finally sorting the results by the interpreter's aggregate rating. The logic for the matching engine is illustrated in Figure 6.

![Figure 6: Matching Algorithm Flowchart](./public/figures/matching_flowchart.png)

3.  **Video & Media Module:** Utilizes the WebRTC (Web Real-Time Communication) API for peer-to-peer media streaming. By establishing a direct connection between the client's and interpreter's browsers, the system avoids routing heavy video data through a central server, ensuring low-latency communication and significantly reducing server bandwidth costs. STUN/TURN servers are integrated to handle NAT traversal issues when users are behind strict corporate firewalls.
4.  **Real-Time Notification System:** Uses WebSockets (via Socket.io) to provide instant alerts. When the Matching Engine finds an interpreter, a WebSocket event is fired to the specific interpreter's client, triggering an immediate "Incoming Call" modal without requiring the user to refresh the page.

## 6.3 Comprehensive Test Plan
Quality assurance was a continuous process throughout the Agile sprints. Testing was conducted across multiple levels using specific **Test Data** (including mock user accounts, seeded database records, and simulated low-bandwidth network conditions).

### 6.3.1 Testing Levels
-   **Unit Testing:** Individual UI components (like the custom video player controls) and utility functions (like the JWT verification logic) were tested in isolation to ensure strict functional correctness.
-   **Integration Testing:** Tested the junctions between the Next.js frontend and the API routes, ensuring that form submissions correctly mutated data in the MongoDB database.
-   **System & Load Testing:** Simulated multiple concurrent users attempting to book interpreters simultaneously to ensure the Matching Engine did not suffer from "race conditions" (e.g., booking the same interpreter twice).
-   **User Acceptance Testing (UAT):** The system was deployed to a staging environment (Vercel) and tested by external stakeholders to validate the UX/UI against the initial requirements.

### 6.3.2 Execution Results
**Table 5: Test Case Results**

| Test ID | Feature | Test Case/Data | Expected Result | Status |
|---------|---------|----------------|-----------------|--------|
| **TC01** | Auth | Login with valid credentials | Redirect to Dashboard | Passed |
| **TC02** | Matching | Request French interpreter | List only French-speaking interpreters | Passed |
| **TC03** | Booking | Click "Call Now" | Notification sent to Interpreter in < 2s | Passed |
| **TC04** | Video | Join Session | Stable bidirectional WebRTC stream | Passed |
| **TC05** | Admin | Ban a user | User should be logged out immediately | Passed |

**Results Summary:**
The system performs exceptionally well under normal operational conditions. Load testing utilizing simulated traffic showed stable API performance for up to 50 concurrent matching requests. The WebRTC implementation successfully maintained video streams even when throttled to a simulated 3G network connection, automatically downgrading video resolution to prioritize crystal-clear audio, which is the most critical component for interpretation.

\pagebreak

# CHAPTER 7: RESULTS & CONCLUSION

## 7.1 Achievements and Lessons Learnt
-   **Technical Proficiency:** Successfully integrated complex WebRTC logic with a modern React-based frontend.
-   **Problem Solving:** Overcame challenges related to "race conditions" in the matching engine where two clients might request the same interpreter simultaneously.
-   **Design Insights:** Learned that for interpretation, audio clarity is often more critical than video resolution.

## 7.2 Conclusion
The "Real-Time Interpreter Marketplace" successfully demonstrates that modern digital platforms can effectively and securely bridge global language gaps. By replacing a tedious, manual coordination process with an automated, algorithm-driven matching engine, the system drastically reduces the time-to-session from hours down to mere minutes. Furthermore, the integration of WebRTC provides a seamless, in-browser communication experience that eliminates the need for third-party video applications.

The adoption of a Full-Stack Next.js architecture coupled with a MongoDB NoSQL database proved highly effective in delivering a scalable, low-latency, and user-friendly solution. The system not only empowers clients with immediate access to linguistic professionals but also provides interpreters with a centralized, professional workspace to manage their careers. Ultimately, this project establishes a robust foundation for decentralized language services, with a modular design that is well-prepared for future expansion and technological enhancements.

## 7.3 Recommendations
-   **AI Integration:** Implement Natural Language Processing (NLP) to provide real-time transcription and basic translation assistance during sessions.
-   **Mobile Apps:** Develop native iOS and Android applications to support interpreters who work while on the move.
-   **Advanced Billing:** Integrate a robust payment gateway like Stripe to handle automated escrow and payments upon session completion.

\pagebreak

# REFERENCES
*(APA Style)*

Boostlingo. (2024). *The Future of Video Remote Interpretation*. Retrieved from https://www.boostlingo.com

Multimedia University of Kenya. (2023). *Undergraduate Project Documentation Guide*. Faculty of Computing & Information Technology.

Nielsen, J. (1994). *Usability Engineering*. Morgan Kaufmann.

ProZ.com. (2024). *Translation Industry Report*. Retrieved from https://www.proz.com/about

Resig, J., & Bibeault, B. (2016). *Secrets of the JavaScript Ninja*. Manning Publications.

\pagebreak

# APPENDIX

## Data Collection Tool: Interview Guide
**Target:** Potential Clients / Interpreters
1.  How do you currently find/provide interpretation services?
2.  What is the average time taken to establish a connection?
3.  What are the top three frustrations with current video tools (Zoom/Skype) for interpretation?
4.  How important is having an integrated chat alongside the video?
5.  What features would make you trust a digital marketplace for these services?

## Project Schedule (Gantt Chart Logic)
-   **Phase 1: Planning (2 weeks)** - Requirements gathering and feasibility study.
-   **Phase 2: Design (3 weeks)** - UI/UX Design, Database Schema, and System Architecture.
-   **Phase 3: Development (5 weeks)** - Frontend components, API development, and WebRTC integration.
-   **Phase 4: Testing (2 weeks)** - Unit, Integration, and UAT.
-   **Phase 5: Documentation (2 weeks)** - Final report compilation and presentation prep.

## Project Budget
**Table 6: Project Budget**

| Item | Description | Cost (KES) |
|------|-------------|------------|
| Hosting | Vercel / MongoDB Atlas / MongoDB | 0.00 |
| Domain | .com or .ke domain | 1,500.00 |
| Internet | High-speed bundle for dev | 10,000.00 |
| **Total** | | **11,500.00** |
