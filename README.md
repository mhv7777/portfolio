# Video Portfolio App

This project is a video portfolio application that allows users to view various projects, and administrators to manage project uploads and details.

## Features

- **User Interface**: A responsive layout that displays project categories and individual project details.
- **Project Management**: An admin panel for viewing, editing, and deleting projects.
- **Upload Functionality**: A form for administrators to upload new projects with relevant details.
- **Dynamic Project Listing**: Projects are fetched and displayed dynamically based on selected categories.

## Project Structure

```
video-portfolio-app
├── src
│   ├── components
│   │   ├── Header.tsx          # Displays the site title and project categories
│   │   ├── ProjectCard.tsx     # Represents an individual project
│   │   ├── ProjectList.tsx     # Fetches and displays a list of projects
│   │   ├── AdminPanel.tsx      # Main interface for administrators
│   │   └── UploadForm.tsx      # Form for uploading new projects
│   ├── pages
│   │   ├── Home.tsx            # Landing page displaying projects
│   │   ├── Admin.tsx           # Admin page for managing projects
│   │   └── ProjectDetails.tsx   # Displays detailed information about a project
│   ├── types
│   │   └── index.ts            # TypeScript interfaces for project data
│   ├── utils
│   │   └── api.ts              # Utility functions for API calls
│   └── App.tsx                 # Main entry point of the application
├── public
│   └── index.html              # Main HTML file for the application
├── package.json                # Configuration file for npm
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd video-portfolio-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```
This will launch the app in your default web browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.