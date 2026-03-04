# Timetable Scheduling System – Fullstack Project

## Project Overview

A fullstack end-to-end system for generating school timetables.

The system automatically schedules classes while satisfying logical and structural constraints, and provides a management interface for viewing and editing data.

---

## Technologies

### Server Side

* Python
* Layered Architecture (Controller / Service / Repository / Data Access Layer)

### Client Side

* Angular 19

### Database

* SQL Server

---

## System Architecture

### Server Layers

* **Controller Layer**
  Handles HTTP requests and responses.

* **Service Layer**
  Contains business logic and scheduling algorithms.

* **Repository / Data Access Layer**
  Manages communication with the database.

* **Database Layer**
  SQL Server with relational constraints and validations.

---

## Database Structure

Main Tables:

* Teachers
* Classes
* Subjects
* Schedule
* Users

### Enforced Constraints

* A teacher cannot be assigned to multiple classes at the same time.
* A subject cannot be scheduled for consecutive hours in the same class (based on defined rules).
* Valid relationships between teacher, subject, and class.
* User authentication based on username and password.

---

## Scheduling Algorithms

The system integrates two algorithmic approaches:

### 1. CSP – Constraint Satisfaction Problem

* Constraint-based scheduling.
* Ensures all hard constraints are satisfied.
* Generates a valid initial timetable solution.

### 2. Genetic Algorithm

* Uses a fitness function to evaluate schedule quality.
* Assigns different weights to constraints.
* Improves solutions using mutation and crossover techniques.
* Optimizes the overall timetable quality.

---

## Validation

* Real data from an existing school was used for testing.
* Output schedules were validated against real-world constraints.
* Algorithm correctness was verified through comparison.

---

## Client Application (Angular)

Main Features:

* Clear and structured timetable display.
* Editable tables.
* Add new teachers.
* Add new subjects.
* Update existing records.
* Secure login (username and password validation).

---

## Workflow

1. Load data from the database.
2. Generate an initial solution using CSP.
3. Improve the solution using a Genetic Algorithm.
4. Store the final schedule in the database.
5. Display results in the client interface.

---

## Authentication

* Users are validated against the `Users` table.
* Access to the system is granted only after successful login.

---

## Running the Project

### Server

```bash
python main.py
```

### Client

```bash
npm install
ng serve
```

---

## Project Goal

To develop an intelligent timetable scheduling system based on constraint solving and optimization techniques, using a clean layered architecture and fullstack implementation.

