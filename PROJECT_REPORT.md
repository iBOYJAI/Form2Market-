# PROJECT REPORT: Farm to Market

### Synopsis

**Farm to Market** is a complete, fully offline agricultural marketplace designed specifically to bridge the gap between local farmers and buyers without the need for an active internet connection. In many rural agricultural sectors, farmers struggle to secure fair prices for their produce due to heavy reliance on intermediaries and limited access to broader markets. Farm to Market addresses this critical issue by providing a direct, localized digital platform where agricultural transactions and negotiations can take place transparently and efficiently, ensuring that farmers retain the maximum value of their hard work.

The system operates natively on local networks using technologies like Node.js and XAMPP MySQL, making it an ideal, resilient solution for regions with spotty or entirely non-existent internet infrastructure. Users interact with a modern, responsive React.js interface that categorizes them into three distinct roles: Farmers, Buyers, and Administrators. This role-based architecture ensures that each user experiences a tailored dashboard that best suits their needs—whether it’s managing crop listings, browsing available produce, or maintaining the overall integrity of the platform.

Crucially, Farm to Market facilitates direct farmer-to-buyer communication through an intuitive inquiry system. Farmers can easily upload product details and images directly to the local server, while buyers can browse, filter, and initiate contact regarding specific listings. Secured by JWT authentication and bcrypt password hashing, the platform guarantees a safe and private environment for localized trade. By eliminating the middleman, Farm to Market not only modernizes rural agricultural commerce but also fosters stronger, more direct community relationships and fairer economic outcomes.

---

## 1. INTRODUCTION

### 1.1 ABOUT THE PROJECT

Farm to Market is a full-stack web application developed to modernize the traditional agricultural supply chain. In many rural areas, the absence of reliable internet makes existing e-commerce solutions inaccessible, forcing farmers to depend on local brokers who often take significant commissions. This project addresses this technological gap by providing a self-hosted, 100% offline platform that runs on a local server. It combines a user-friendly React-based frontend with a robust Express/MySQL backend to create a high-performance marketplace that functions seamlessly without any external dependencies, empowering local producers to manage their business independently.

### OBJECTIVES OF THE PROJECT

The primary objective of this project is to eliminate the exploitation of farmers by middle-men by providing a direct communication channel with potential buyers through an offline-capable digital marketplace. It aims to provide a secure and efficient platform for managing agricultural product listings, processing buyer inquiries, and maintaining user records without requiring internet access. Additionally, the project seeks to simplify the inventory management process for farmers and provide buyers with a categorized, searchable interface to discover fresh local produce, ultimately improving the economic efficiency of local agricultural trade.

### SCOPE OF THE PROJECT

The scope of this project encompasses the design and implementation of a role-based marketplace system including Farmer, Buyer, and Admin modules. It covers the development of a product management subsystem for farmers (CRUD operations and image uploads), a product discovery and inquiry subsystem for buyers, and a comprehensive administrative dashboard for user and content moderation. Technically, the scope is limited to an offline-first architecture designed for local network deployment using XAMPP for database management and Node.js for server-side logic, focused specifically on facilitating direct communication rather than payment gateway integration, which is handled offline between parties.

---

## 2. SYSTEM ANALYSIS

### 2.1 PROBLEM DEFINITION

The existing agricultural trade system in rural areas remains heavily reliant on physical markets and multiple layers of intermediaries, commonly known as middlemen. Farmers typically transport their heavy produce to local trading hubs where brokers dictate purchase prices, often without providing any transparency regarding the actual market value or end-consumer demand. This manual and opaque process is remarkably time-consuming and frequently forces farmers to sell at significantly lower rates due to the perishable nature of their goods and the lack of alternative digital avenues to reach interested buyers.

The limitations of this traditional system are numerous and deeply impact the rural economy. The most significant drawback is the presence of middlemen who absorb a substantial portion of the profit as commissions, leaving the actual producers with minimal margins. Furthermore, there is a total lack of price transparency, as farmers have no digital means to compare rates or verify demand before committing to a sale. The reach is also restricted to buyers physically present at the market, and the entire process lacks any digital record-keeping, making it impossible to track inquiry history or analyze seasonal market trends for future planning.

### 2.2 SYSTEM STUDY

The proposed system is technically feasible as it leverages a modern yet accessible technology stack consisting of React.js for the user interface and Node.js with MySQL for the backend architecture. It has been specifically designed to function within a local-host environment using XAMPP, meaning it requires zero internet connectivity to operate. The hardware requirements are kept to a minimum so that the platform can be hosted on basic desktop or laptop configurations that are already commonly found in administrative offices or local community centers.

Economic feasibility is a core strength of Farm to Market because it is constructed entirely using open-source technologies, eliminating the need for expensive software licenses or recurring internet subscription fees. Since the primary goal is to connect farmers and buyers directly, the economic benefits remain within the local community by bypassing broker commissions. Operationally, the platform features an intuitive design that caters to users with varying levels of digital literacy. It integrates smoothly into the existing workflow of agricultural trade by digitizing the inquiry process, allowing farmers to manage inventory from their own location while providing buyers with a professional interface to discover fresh produce.

### 2.3 PROPOSED SYSTEM

The proposed Farm to Market system acts as a digital bridge that connects farmers directly to buyers through a local-area network or a single shared machine. By implementing a sophisticated role-based access control system, the platform ensures that Farmers, Buyers, and Administrators each have a dedicated workspace tailored to their specific needs. This centralized approach allows all product listings and communications to be managed within a single, searchable digital environment that remains resilient even in the absence of a wider internet connection.

The advantages of this proposed system are extensive, starting with the facilitation of direct interaction which allows buyers and farmers to negotiate through a dedicated inquiry system. By eliminating the middleman entirely, the system ensures that farmers receive the full value for their labor while buyers get access to better prices. The offline resilience of the platform makes it uniquely suited for rural deployment where connectivity is unreliable. Additionally, the organized digital management tools allow farmers to keep a clear history of their transactions and inquiries, while the administrative dashboard ensures that the platform remains a safe and moderated space for all participants.

---

## 3. SYSTEM REQUIREMENTS

### 3.1 HARDWARE REQUIREMENTS

The Farm to Market system is optimized to run on standard computing hardware that is widely available in most corporate or educational environments. For the primary host machine acting as the local server, a processor such as an Intel Core i3 is sufficient as a minimum requirement, though an Intel Core i5 or higher is recommended to ensure smooth performance during concurrent user interactions. The host machine should ideally have at least 4 GB of RAM, with 8 GB being the preferred configuration for optimal multitasking and database responsiveness.

Storage requirements are remarkably light, needing only about 500 MB of available hard disk space to accommodate the application source code, its dependencies, and the local database storage for product images and user data. To enable the marketplace functionality over a local network, the host machine must be equipped with a functional Wi-Fi adapter or an Ethernet port. On the client side, any device with a modern web browser—including tablets, smartphones, and older desktop computers—can access the marketplace as long as they are connected to the same local area network as the host server.

### 3.2 SOFTWARE REQUIREMENTS

The platform is built upon a reliable software stack that prioritizes stability and local performance. It is fully compatible with modern operating systems such as Windows 10 and Windows 11, with 64-bit versions being recommended for better resource management. The core of the database operations is handled by the XAMPP Control Panel, specifically utilizing the MySQL or MariaDB services which provide a robust relational database environment. The backend logic is powered by Node.js, specifically version 16.x or higher, which provides the necessary runtime environment for the Express-based API server.

For development and maintenance, the system uses npm as the primary package manager to handle all internal dependencies efficiently. Users can access the platform through any modern web browser such as Google Chrome, Mozilla Firefox, or Microsoft Edge, provided they are updated to recent versions to support modern React components and CSS styling. If any local configurations or code modifications are required, Visual Studio Code is the recommended development tool due to its excellent support for the JavaScript and Markdown languages used throughout the project.

---

## 3. SYSTEM DESIGN

### 3.1 DATA FLOW DIAGRAM (DFD)

#### DFD LEVEL 0 — CONTEXT DIAGRAM
The Context Diagram of the Farm to Market system represents the highest-level view of the initial business logic. In this diagram, the entire system is treated as a single process that interacts with external entities including Farmers, Buyers, and Administrators. Farmers provide product data and receive inquiry notifications, while Buyers input search queries and send inquiries to the system. The Administrator interacts with the system to perform monitoring, user moderation, and content management tasks, ensuring that the local marketplace operates within defined parameters.

#### DFD LEVEL 1 — MAJOR PROCESSES
The Level 1 DFD breaks down the context diagram into several key sub-processes that manage the flow of information within the offline environment. The primary processes included are User Authentication, Product Management, Inquiry Processing, and System Administration. The Authentication process handles secure credential verification and role assignment. Product Management allows for the creation and storage of agricultural listings in the local database. Inquiry Processing facilitates the digital bridge between buyers and producers, while the Administration process manages the integrity of user accounts and global site content.

### 3.2 ENTITY RELATIONSHIP DIAGRAM
The ER Diagram for Farm to Market illustrates the logical relationships between the core data entities of the system. The central entity is the User, which possesses attributes such as name, email, and role, and maintains a one-to-many relationship with both Products and Inquiries. A Farmer (User) can list multiple Products, while a Buyer (User) can initiate multiple Inquiries. Each Inquiry is linked to exactly one Product and one Buyer, forming a relational chain that ensures all communications are tracked back to specific users and agricultural items. This structure maintains high referential integrity and supports complex queries for local market analytics.

### 3.3 FILE SPECIFICATIONS
The database schema consists of several interconnected tables that ensure detailed record keeping and referential integrity for the marketplace system. Each table is designed with specific primary and foreign keys to maintain a normalized data structure.

**Table Name: users**
Purpose: Stores authentication and profile data for all authorized farmers, buyers, and admins.

| Field name | Data type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | Integer | 11 | Primary Key | Unique User ID |
| name | Varchar | 100 | Not Null | User's Full Name |
| email | Varchar | 191 | Unique | Unique Email Login |
| password | Varchar | 255 | Not Null | Hashed Password |
| role | Enum | - | Not Null | farmer, buyer, admin |
| status | Enum | - | Default: active | active or blocked |
| created_at | Timestamp | - | - | Registration Date |

**Table Name: products**
Purpose: Maintains the catalog of all agricultural produce listed by farmers.

| Field name | Data type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | Integer | 11 | Primary Key | Unique Product ID |
| farmer_id | Integer | 11 | Foreign Key | Owner (User ID) |
| name | Varchar | 200 | Not Null | Product Title |
| category | Varchar | 100 | Not Null | Produce Category |
| price | Decimal | 10,2 | Not Null | Price per Unit |
| quantity | Integer | 11 | Not Null | Available Amount |
| description | Text | - | - | Product Details |
| image_path | Varchar | 255 | - | Local Image Path |

**Table Name: inquiries**
Purpose: Records digital communications between buyers and farmers regarding specific products.

| Field name | Data type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | Integer | 11 | Primary Key | Unique Inquiry ID |
| product_id | Integer | 11 | Foreign Key | Linked Product |
| buyer_id | Integer | 11 | Foreign Key | Sender (User ID) |
| message | Text | - | Not Null | Inquiry Content |
| created_at | Timestamp | - | - | Time of Inquiry |
| read_status | TinyInt | 1 | Default: 0 | Read (1) or Unread (0) |

**Table Name: contact_messages**
Purpose: Stores general inquiries from the public contact form.

| Field name | Data type | Size | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| id | Integer | 11 | Primary Key | Unique Message ID |
| name | Varchar | 100 | Not Null | Sender Name |
| email | Varchar | 191 | Not Null | Sender Email |
| subject | Varchar | 150 | Not Null | Message Subject |
| message | Text | - | Not Null | Message Body |
| created_at | Timestamp | - | - | Sent Time |

### 3.4 MODULE SPECIFICATIONS
The system architecture is divided into several modules to handle specific administrative and operational tasks. Each module is designed to interact with the core database while providing a seamless user interface for the farmers, buyers, and administrators.

**1. User Authentication and Account Management**
This module handles secure login for all users via hashed password verification and role-based session initialization. It allows new users to register as either Farmers or Buyers, ensuring that each user has appropriate permissions for their specific role while protecting the system from unauthorized access.

**2. Farmer Product Management Engine**
The product management engine allows Farmers to maintain a professional digital catalog of their produce. It provides full CRUD (Create, Read, Update, Delete) capabilities including the ability to upload product images, set competitive pricing, and update inventory levels in real-time as stock changes.

**3. Buyer Discovery and Marketplace Hub**
The marketplace hub provides a professional interface for Buyers to discover high-quality local produce. It features advanced search and category-based filtering tools that allow buyers to quickly locate specific items, view detailed farmer information, and initiate direct communication with producers.

**4. Digital Inquiry and Communication System**
This module facilitates the direct link between the buyer's interest and the farmer's supply. It allows buyers to send detailed inquiries about specific products and enables farmers to view and manage these inquiries from their dashboard, fostering a transparent negotiation environment.

**5. Administrative Oversight and Moderation Panel**
The administrative panel provides visual insights into system-wide performance, including total user counts and product distributions. It empowers the administrator to moderate the marketplace by managing user statuses—such as blocking or deleting accounts—and removing inappropriate product listings to maintain platform integrity.
