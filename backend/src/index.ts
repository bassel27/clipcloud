import dotenv from 'dotenv';
dotenv.config({ path: '.env.backend' });
import app from './app';

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});