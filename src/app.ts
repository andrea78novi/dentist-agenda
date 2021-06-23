import express from 'express';
import morgan from 'morgan';
import exphbs from 'express-handlebars';
import path from 'path';

import config from './config/config';
import indexRoutes from './routes';
import usersRoutes from './routes/users';
import appointmentsRoutes from './routes/appointments';

class Application {

   app: express.Application;

   constructor() {
      this.app = express();
      this.settings();
      this.middlewares();
      this.routes();
   }

   settings() {
      this.app.set('port', config.port);
      this.app.set('views', path.join(__dirname, 'views'));
      this.app.engine('.hbs', exphbs({
         layoutsDir:  path.join(this.app.get('views'), 'layouts'),
         partialsDir:  path.join(this.app.get('views'), 'partials'),
         defaultLayout: 'main',
         extname: '.hbs',
         helpers: {
            select: this.hbsSelectHelper
         }
      }));
      this.app.set('view engine', '.hbs');
   }

   middlewares() {
      this.app.use(morgan('dev'));  // Use morgan (https://www.npmjs.com/package/morgan) to format log
      // this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: true }));
   }

   routes() {
      this.app.use(indexRoutes);
      this.app.use('/users', usersRoutes);
      this.app.use('/appointments', appointmentsRoutes);
      this.app.use(express.static(path.join(__dirname, 'public')));
   }

   start() {
      this.app.listen(this.app.get('port'), () => {
         console.log('Server running on port', this.app.get('port'));
      });
   }

   // Helper to set selected option in an edit form
   hbsSelectHelper(value: any, options: any) {
      return options.fn(this).split('\n').map(function(v: any) {
         var t = 'value="' + value + '"';
         return ! RegExp(t).test(v) ? v : v.replace(t, t + ' selected="selected"')
      })
      .join('\n')
   }

}

export default Application;
