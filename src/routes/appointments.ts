import { Router, Request, Response } from "express";
import moment from "moment";
import User from '../models/User';
import Appointment from '../models/Appointment';

const router = Router();

router.route('/create')

   // Get the doctors and render the page with the form to create a new appointment
   .get(async (req: Request, res: Response) => {
      const doctors = await User.find({ type: 'Doctor' }).lean(); // .lean() tells Mongoose to skip instantiating a full Mongoose document and just give you the POJO
      console.log('Doctors found:', doctors);
      const today = moment().format('YYYY-MM-DD'); // Pass today to set filter for date picker
      res.render('appointments/create', { doctors, today });
   })

   // Save a new appointment and redirect to the result page
   .post(async (req: Request, res: Response) => {
      let { patientEmail, doctorId, dateFrom, timeFrom } = req.body;
      dateFrom = moment(dateFrom).add(timeFrom, 'hours');  // Add time to date

      const doctor = await User.findById(doctorId).lean();
      const appointment = await Appointment.findOne({ doctorId, dateFrom }).lean();

      // If the appointment already exists, stop saving a new one and send a KO message
      if (appointment) {
         res.render('appointments/result', { koMessage: 'The datetime ' + moment(dateFrom).utc(true).format('YYYY-MM-DD HH:mm') + ' is already booked for the doctor ' + doctor.firstName + ' ' + doctor.lastName });
      }
      // else save the appointment with an OK message
      else {
         const newAppointment = new Appointment({ patientEmail, doctorId, dateFrom });
         await newAppointment.save();
         console.log('New appointment created:', newAppointment);
         res.render('appointments/result', { okMessage: 'The appointment has been booked for ' + moment(dateFrom).utc(true).format('YYYY-MM-DD HH:mm') + ' with doctor ' + doctor.firstName + ' ' + doctor.lastName });
      }
   });

router.route('/list')

   // Get all the appointments and render the list appointment page
   .get(async (req: Request, res: Response) => {
      const appointments = await Appointment.find().populate('doctorId').lean();
      console.log('Appointments list:', appointments);
      res.render('appointments/list', { appointments });
   });

router.route('/delete/:id')

   // Delete an appointment and redirect to the list appointment page
   .get(async (req: Request, res: Response) => {
      const { id } = req.params;
      await Appointment.findByIdAndDelete(id);
      res.redirect('/appointments/list');
   });

export default router;
