# Menuverse

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white)](https://www.java.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://javascript.info/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)

**A full-stack demo application for planning and managing menus.**  
Menuverse is a demonstration of full-stack development, featuring a responsive frontend menu planner and a Java-based API backend.

## Table of Contents
- [Demo/Screenshots](#demoscreenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Demo/Screenshots
<!-- Add screenshots here! Upload images to the repo or use external links -->
![Login Page](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/Login.png)
![Registration Page](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/Registrtion.png)
![Login Page Filled In](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots\Login_filled.png)
![Welcome Page](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/Welcome.png)
![Main Course List](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/MainCourse_list.png)
![Main Course Add](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/MainCourse_add_category.png)
![Main Course Add Orgin](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/MainCourse_add_orgin.png)
![Main Course Add Num Sides](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/MainCourse_add_numsides.png)
![Main Course Edit](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/MainCourse_edit.png)
![Side Item List](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/SideItem_list.png)
![Side Item Add](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/SideItem_add.png)
![Side Item Add Complete](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/SideItem_add_complete.png)
![Side Item Edit](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/SideItem_edit.png)
![Web Meal Search](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/MealSearch.png)
![Web Meal Search Side Item](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/MealSearch_side.png)
![Web Meal Search Side Item Selected](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/MealSearch_side_selected.png)
![Web Meal Search Main Course Selected](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/MealSearch_main_selected.png)
![Menu Creation](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/Menu_choice.png)
![Menu Creation Selection](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/Menu_selection.png)
![Menu Creation Change Option](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/Menu_changed.png)
![About Page](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/About.png)
![Contact Page](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/Contact.png)
![Logout Option](https://github.com/DougMansmann/menuverse/blob/main/menu-planner/screenshots/Logout_choice.png)
*(Replace with actual images/GIFs showing the app running)*

## Features
- Create and customize weekly meal menus
- Search/add recipes or items
- Backend API for data persistence (e.g., saving menus)
- Responsive UI for desktop/mobile
- [Add more based on what your app does]

## Tech Stack
- **Frontend**: JavaScript (Node.js), HTML, CSS (in `menu-planner/` folder)
- **Backend**: Java (in `menuapi/` folder)
- **Other**: Spring Boot and React

## Installation
### Prerequisites
- Java JDK ["21.0.9" 2025-10-21 LTS]
- Node.js (if needed for frontend)
- MySQL

### Backend Setup (`menuapi/`)
```bash
cd menuapi
# Compile and run commands, e.g.:
javac ...
java ...
# Or if using Maven/Gradle: mvn install, etc.
