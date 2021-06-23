import { Router, Request, Response } from "express";
import User from '../models/User';

const router = Router();

router.route('/create')

   // Render the page with the form to create a new user
   .get((req: Request, res: Response) => {
      res.render('users/create');
   })

   // Save a new user and redirect to the list user page
   .post(async (req: Request, res: Response) => {
      const { email, type, firstName, lastName, gender, address, phone } = req.body;
      const user = await User.findOne({ email: email });
      console.log('User found:', user);
      // If the user already exists, stop saving a new one
      if (user) {
         res.render('users/create', { message: 'User ' + email + ' already exists!' });
      }
      // else save the user and redirect to the user list
      else {
         const newUser = new User({ email, type, firstName, lastName, gender, address, phone });
         await newUser.save();
         console.log('New user created:', newUser);
         res.redirect('/users/list');
      }
   });

router.route('/list')

   // Get all the users and render the list user page
   .get(async (req: Request, res: Response) => {
      const users = await User.find().lean();   // .lean() tells Mongoose to skip instantiating a full Mongoose document and just give you the POJO
      console.log('User list:', users);
      res.render('users/list', { users });
   });

router.route('/delete/:id')

   // Delete a user and redirect to the list user page: if the user is a doctor, it should delete also the appointments with this doctor,
   // but this opens up a series of relative problems to how to notify the patient...
   .get(async (req: Request, res: Response) => {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.redirect('/users/list');
   });

router.route('/edit/:id')

   // Get the user to edit and render the edit user page
   .get(async (req: Request, res: Response) => {
      const { id } = req.params;
      const user = await User.findById(id).lean(); // .lean() tells Mongoose to skip instantiating a full Mongoose document and just give you the POJO
      res.render('users/edit', { user });
   })

   // Update the user and redirect to the list user page
   .post(async (req: Request, res: Response) => {
      const { id } = req.params;
      const { type, firstName, lastName, gender, address, phone } = req.body;
      await User.findByIdAndUpdate(id, { type, firstName, lastName, gender, address, phone });
      res.redirect('/users/list');
   });

export default router;
