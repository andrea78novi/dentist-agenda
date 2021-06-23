import mongoose from 'mongoose';
import config from './config/config';

async function connect() {

   try {
      await mongoose.connect(config.dbConnection, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      });
      console.log('>>> Database connected');
   }
   catch {
      console.log('Error during DB connection');
   }

}

export default connect;
