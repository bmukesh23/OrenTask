# 🪴 ESG Questionnaire App
Capture ESG metrics by financial year with auto-calculated KPIs update in real time where you can view summaries and export to Excel.

## 📦 Technologies

- `Next.js`
- `Turbopack`
- `Typescript`
- `Tailwind CSS`
- `Prisma ORM`
- `PostgreSQL`
- `Chart.js`

## 🚦Running the project

### Prerequisites

Before you begin, ensure you have the following installed on your machine:


- [Node.js](https://nodejs.org/): Make sure to install Node.js, which includes npm (Node Package Manager).
- [PostgreSQL](https://www.postgresql.org/): Database used to store application data.


### Steps

1. **Clone the repository:**
    ```bash
    git clone https://github.com/bmukesh23/OrenTask.git
    ```

2. **Navigate to the project directory:**
    ```bash
    cd OrenTask
    ```


3. **Install Dependencies:**
    ```bash
    npm install
    ```


4. **Set Environment Variables:**
    1. Create a `.env` file in the root of the of the project.
    2. Add the following environment variables and replace the values with your own:

    ```env
    DATABASE_URL=
    NEXTAUTH_SECRET=
    ```


5. **Run the application:**
    ```bash
    npm run dev
    ```

6. **Access the App:**
- By default, the application will be available at [http://localhost:3000](http://localhost:3000)