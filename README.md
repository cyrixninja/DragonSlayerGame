# Dragon Slayer
![1](/Screenshots/1.png)

Dragon Slayer is an immersive educational game that combines learning with adventure. Players embark on an epic quest to defeat a formidable dragon by demonstrating their knowledge across various topics. Each correct answer brings them closer to victory, while wrong answers could spell doom for our hero!
 
[Explore the Lore Behind Game](/GameLore.md)
## Features

- **Interactive Gameplay**: Answer multiple-choice questions to attack the dragon.
- **Dynamic Questions**: Questions are dynamically generated based on the chosen topic.
- **Engaging Animations**: Enjoy captivating animations for both the hero and the dragon.
- **Health Bars**: Track the health of both the hero and the dragon.
- **Responsive Design**: Play the game on any device with a responsive design.

## AWS Services Used

### 1. Amazon S3 - For Storing the Game Assets

Amazon S3 (Simple Storage Service) is used to store and serve the game assets, including images, animations, and other static files. By leveraging S3, we ensure that the assets are highly available, durable, and can be delivered with low latency to users around the world.
![aws1](/Screenshots/aws1.png)

### 2. AWS Bedrock - For Game's Quiz Generation for any Topic user provides

AWS Bedrock is utilized to generate dynamic quiz questions based on the topic provided by the user. This service allows us to create a wide variety of questions, ensuring that the game remains challenging and engaging for players. AWS Bedrock's powerful AI capabilities enable us to generate high-quality questions on-the-fly.

### 3. AWS EC2 - For Hosting the App and its Backend

Amazon EC2 (Elastic Compute Cloud) is used to host the game application and its backend services. EC2 provides scalable computing capacity, allowing us to handle varying levels of traffic and ensure a smooth gaming experience for all users. By using EC2, we can easily deploy, manage, and scale our application as needed.
![aws2](/Screenshots/aws2.png)


## Getting Started
To  play the Game Navigate to Here - 

Or Setup the Game Locally By Following Instructions
### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python 12

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/cyrixninja/DragonSlayerGame
   cd DragonSlayerGame
   ```

2. Install Node dependencies:
   ```sh
   cd Frontend
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Install Python Libraries:
    ```
    pip install boto3 flask_cors flask
    aws configure
    ```

5. Run Backend
    ```
    flask run
    ```

Open your browser and navigate to `http://localhost:3000/start` to play the game.

## Usage

### Starting the Game

1. Open the game in your browser.
2. Click the "Play" button to start the game.
3. Answer the questions correctly to attack the dragon.
4. Track the health of both the hero and the dragon using the health bars.
5. Defeat the dragon to win the game!

### Additional Buttons

- **Code**: Redirects to the GitHub repository.
- **How to Play**: Provides instructions on how to play the game.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
