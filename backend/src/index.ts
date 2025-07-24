import app from './app';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.backend' });
const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});