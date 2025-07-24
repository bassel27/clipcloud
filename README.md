# System Architecture
<img width="955" height="635" alt="image" src="https://github.com/user-attachments/assets/d20f5fab-a254-42fe-ac80-563048ac7294" />

# Backend

The backend is built using Express.js with TypeScript, containerized with Docker, and deployed on AWS ECS using Fargate. Docker images are stored in Amazon ECR.

## Postman

The backend API collection is available on Postman [here](https://grad-project-9975.postman.co/workspace/Personal~aec82f60-08b4-4964-8861-0b9414f1b7c4/collection/44435924-1bb3ce08-54bf-4cf3-9bb0-1adac6b8afd9?action=share&source=copy-link&creator=44435924).

# Database

The database is implemented using MySQL and deployed via AWS RDS in a private subnet for security. It is only accessible through the backend ECS container. Both the backend and the database are in the same VPC, which has an Internet Gateway (IGW) to allow public access to the backend only.

# Frontend

The frontend is developed using React with TypeScript.

# Setup Instructions
No setup required for backend and database. Both are already deployed and accessible. Otherwise:
- For the frontend React app:
  1. Clone the project.
  2. Run "docker-compose up -d --pull always" in main directory
- For the Flutter mobile application:
  1. Download the .apk file from [here](https://drive.google.com/drive/folders/1yyi20oIRq53Mug5WAduRbgFvfKUt1Bvn?usp=sharing).

# Limitations & Future Work
1.	Use DTOs in the frontend for consistent API communication.
2.	Remove hardcoded folder paths in the backend.
3.	Update the database schema so that likes and media are user-specific.
4.	Remove unused media-related attributes (e.g., media.url, thumbnail.url) from the schema.
5.	Replace use of localStorage with secure methods (e.g., HTTP-only cookies or sessionStorage) for storing access tokens.
6.	Allow images to be enlarged when clicked.
7.	Add proper validation to login and signup forms in the frontend.
8.	Implement pagination for media API responses.
9.	Write unit and integration tests for both frontend and backend.
10.	Replace hardcoded size values in the Flutter app for better responsiveness.
