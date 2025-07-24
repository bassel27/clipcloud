Backend

The backend is built using Express.js with TypeScript, containerized with Docker, and deployed on AWS ECS using Fargate. Docker images are stored in Amazon ECR.

Setup Instructions

No setup required. The backend is already deployed and accessible.

⸻

Database

The database is implemented using MySQL and deployed via AWS RDS in a private subnet for security. It is only accessible through the backend ECS container. Both the backend and the database are in the same VPC, which has an Internet Gateway (IGW) to allow public access to the backend only.

Setup Instructions

No setup required. The database is already deployed.

⸻

Frontend

The frontend is developed using React with TypeScript.

Setup Instructions
	1.	Clone the project.
  2.  Run "docker-compose up -d --pull always" in main directory


⸻

Mobile

The mobile app is built using Flutter.

Setup Instructions

Download the .apk file from [here](https://drive.google.com/drive/folders/1yyi20oIRq53Mug5WAduRbgFvfKUt1Bvn?usp=sharing).

⸻

Postman

The backend API collection is available on Postman here.

⸻

System Architecture
<img width="851" height="611" alt="system_arch_clipcloud" src="https://github.com/user-attachments/assets/6920bcc0-4c83-4378-b484-9da9ec3acf9c" />

⸻

Limitations & Future Work
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
