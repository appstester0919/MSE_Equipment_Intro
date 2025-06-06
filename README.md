# MSE Equipment Introduction Website

This project is a web application designed to provide information about laboratory equipment located on the 2nd and 7th floors.

## Features

- **Floor Selection**: Users can choose between the 2nd floor and 7th floor labs.
- **Room Selection**: After selecting a floor, users can browse rooms available on that floor.
- **Equipment Viewing**: Within each room, users can see images of the available equipment.
- **Audio Introductions**: For each piece of equipment, audio recordings are available.
  - **Languages**: English and Putonghua.
  - **Versions**: General and Professional.
- **Interactive UI**: Users can switch between language and version preferences using controls at the bottom of the screen.

## Project Structure

- `index.html`: The main HTML file for the application.
- `style.css`: Contains all CSS styles for the application.
- `script.js`: Handles the dynamic behavior and user interactions.
- `data.js`: Stores the data for floors, rooms, equipment, image paths, and audio file paths.
- `assets/`: Folder for static assets.
  - `images/`: Contains equipment images and placeholders.
  - (Audio files are expected to be in their respective folders as per the initial setup, e.g., `Eng. Pro Ver. 2F MSE Equipment introduction/`)

## Setup

1. Ensure all equipment images are placed in the `Equipment image/` folder (or update paths in `data.js`).
2. Ensure all audio files are in their respective language/version folders (e.g., `Eng. Pro Ver. 2F MSE Equipment introduction/`) as specified in `data.js`.
3. Open `index.html` in a web browser to run the application.

## Data Management

The `data.js` file is critical. It contains a structured representation of all equipment, including:
- Display name
- Path to its image
- Paths to its four audio recordings (English/General, English/Professional, Putonghua/General, Putonghua/Professional)

Care must be taken to ensure these paths accurately reflect the filenames and locations in your project directory.