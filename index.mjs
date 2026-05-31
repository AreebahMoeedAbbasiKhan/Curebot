// CureBot v3 - Lahore AI Medical Agent (Full Interactive Step-by-Step)
// AWS Lambda Handler (ES Module)

import { findAnswer, isMedicalQuestion } from './medical-ai.mjs';

const HOSPITALS = [
  { id:1, name:"Mayo Hospital", area:"Anarkali", phone:"042-99211100", type:"Government", lat:31.5720, lng:74.3290, address:"Neela Gumbad, Anarkali, Lahore", specialties:["General Medicine","Surgery","Cardiology","Orthopedics","Neurology","Gynecology","Pediatrics","ENT","Ophthalmology","Dermatology","Urology","Psychiatry"] },
  { id:2, name:"Services Hospital", area:"Jail Road", phone:"042-99203402", type:"Government", lat:31.5540, lng:74.3430, address:"Jail Road, Lahore", specialties:["General Medicine","Gynecology","Pediatrics","ENT","Surgery","Cardiology","Orthopedics","Neurology","Dermatology"] },
  { id:3, name:"Jinnah Hospital", area:"Canal Road", phone:"042-99231401", type:"Government", lat:31.5204, lng:74.3587, address:"Allama Iqbal Medical College, Canal Road", specialties:["General Medicine","Surgery","Gynecology","Pediatrics","Orthopedics","ENT","Ophthalmology"] },
  { id:4, name:"Lahore General Hospital", area:"Ferozepur Road", phone:"042-99264091", type:"Government", lat:31.5200, lng:74.3100, address:"Ferozepur Road, Chungi Amar Sadhu", specialties:["General Medicine","Surgery","Cardiology","Neurology","Orthopedics","Gynecology","Ophthalmology","Dermatology","Psychiatry"] },
  { id:5, name:"Sir Ganga Ram Hospital", area:"Queens Road", phone:"042-99211142", type:"Government", lat:31.5615, lng:74.3230, address:"Queens Road, Lahore", specialties:["General Medicine","Surgery","Gynecology","Pediatrics","ENT"] },
  { id:6, name:"Children Hospital", area:"Ferozepur Road", phone:"042-99231504", type:"Government", lat:31.5190, lng:74.3120, address:"Ferozepur Road, Lahore", specialties:["Pediatrics","Pediatric Surgery","Neonatology","Pediatric Cardiology"] },
  { id:7, name:"Shaikh Zayed Medical Complex", area:"New Campus", phone:"042-99231891", type:"Semi-Private", lat:31.4700, lng:74.3100, address:"University Avenue, New Campus", specialties:["General Medicine","Surgery","Cardiology","Neurology","Orthopedics","Gynecology","Urology","Gastroenterology"] },
  { id:8, name:"Ghurki Trust Teaching Hospital", area:"Jail Road", phone:"042-35761407", type:"Trust", lat:31.5500, lng:74.3400, address:"Jail Road, Lahore", specialties:["Orthopedics","General Surgery","Neurosurgery","Plastic Surgery","Gynecology"] },
  { id:9, name:"Shaukat Khanum Memorial Cancer Hospital", area:"Johar Town", phone:"042-35905000", type:"Private", lat:31.4697, lng:74.2728, address:"7A Block R-3, Johar Town", specialties:["Oncology","Surgery","Radiology","Pathology","Internal Medicine"] },
  { id:10, name:"Hameed Latif Hospital", area:"Garden Town", phone:"042-35862301", type:"Private", lat:31.5180, lng:74.3350, address:"14 Abu Bakar Block, Garden Town", specialties:["Cardiology","Orthopedics","Gynecology","Dermatology","Neurology","Urology","Gastroenterology","Pediatrics","ENT"] },
  { id:11, name:"National Hospital & Medical Centre", area:"DHA", phone:"042-35714000", type:"Private", lat:31.4800, lng:74.3750, address:"132/3 L Block, DHA Phase 1", specialties:["General Medicine","Surgery","Urology","Gastroenterology","Cardiology","Orthopedics","Gynecology","ENT"] },
  { id:12, name:"Doctors Hospital", area:"Johar Town", phone:"042-35300061", type:"Private", lat:31.4710, lng:74.2900, address:"152-G/1, Canal Bank, Johar Town", specialties:["Cardiology","Neurology","Orthopedics","Gynecology","Gastroenterology","Urology","Oncology","Dermatology"] },
  { id:13, name:"Surgimed Hospital", area:"Gulberg", phone:"042-35714411", type:"Private", lat:31.5250, lng:74.3500, address:"1 Zafar Ali Road, Gulberg V", specialties:["General Surgery","Cardiac Surgery","Neurosurgery","Orthopedics","Gynecology","ENT","Urology","Gastroenterology"] },
  { id:14, name:"Evercare Hospital", area:"DHA Phase 4", phone:"042-111-227-333", type:"Private", lat:31.4650, lng:74.3900, address:"Ittehad Commercial Area, DHA Phase 4", specialties:["Cardiology","Neurology","Orthopedics","Oncology","Gynecology","Gastroenterology","Urology","Pediatrics","Dermatology"] },
  { id:15, name:"Ittefaq Hospital Trust", area:"Model Town", phone:"042-35880261", type:"Private", lat:31.4840, lng:74.3200, address:"Model Town Link Road", specialties:["General Medicine","Surgery","Cardiology","Orthopedics","Gynecology","Neurology","Gastroenterology","Urology","ENT"] },
  { id:16, name:"Fatima Memorial Hospital", area:"Shadman", phone:"042-111-555-600", type:"Private", lat:31.5400, lng:74.3350, address:"Shadman Road, Lahore", specialties:["Gynecology","Obstetrics","Pediatrics","General Medicine","Surgery","Cardiology","Orthopedics","Dermatology"] },
  { id:17, name:"Omar Hospital & Cardiac Centre", area:"Johar Town", phone:"042-35310091", type:"Private", lat:31.4720, lng:74.2800, address:"Johar Town, Lahore", specialties:["Cardiac Surgery","Cardiology","General Medicine","Surgery","Gynecology","Orthopedics"] },
  { id:18, name:"Shalamar Hospital", area:"Shalimar Link Road", phone:"042-111-205-205", type:"Private", lat:31.5900, lng:74.3600, address:"Shalimar Link Road, Mughalpura", specialties:["Cardiology","Neurology","Orthopedics","Gynecology","Gastroenterology","Urology","ENT","Ophthalmology"] },
  { id:19, name:"Chughtai Medical Centre", area:"DHA Phase 4", phone:"042-111-456-789", type:"Private", lat:31.4660, lng:74.3880, address:"DD Block, Phase 4, DHA", specialties:["General Medicine","Gynecology","Dermatology","ENT","Orthopedics","Pediatrics","Cardiology"] },
  { id:20, name:"Akram Medical Complex", area:"Garden Town", phone:"042-35941581", type:"Private", lat:31.5170, lng:74.3340, address:"Garden Town, Lahore", specialties:["General Medicine","Surgery","Gynecology","Orthopedics","Cardiology","Urology"] },
  { id:21, name:"City International Hospital", area:"Cavalry Ground", phone:"042-36620561", type:"Private", lat:31.5100, lng:74.3800, address:"Cavalry Ground Extension, Lahore Cantt", specialties:["General Medicine","Surgery","Cardiology","Orthopedics","Gynecology","Neurology","Gastroenterology"] },
  { id:22, name:"CMH Lahore", area:"Lahore Cantt", phone:"042-99200601", type:"Military", lat:31.5200, lng:74.3900, address:"Sarwar Road, Lahore Cantt", specialties:["General Medicine","Surgery","Cardiology","Neurology","Orthopedics","Gynecology","Urology","Oncology","Dermatology"] },
  { id:23, name:"Indus Hospital", area:"Jubilee Town", phone:"042-111-111-880", type:"Trust", lat:31.4500, lng:74.2700, address:"Jubilee Town, Lahore", specialties:["General Medicine","Surgery","Pediatrics","Gynecology","Orthopedics","Oncology"] },
  { id:24, name:"Nawaz Sharif Social Security Hospital", area:"Multan Road", phone:"042-99260041", type:"Government", lat:31.4900, lng:74.3000, address:"Multan Road, Lahore", specialties:["General Medicine","Surgery","Orthopedics","Gynecology","Cardiology"] },
  { id:25, name:"Lahore Care Hospital", area:"Canal Road", phone:"042-35761551", type:"Private", lat:31.5210, lng:74.3580, address:"Canal Bank Road, Lahore", specialties:["General Medicine","Surgery","Gynecology","Cardiology","Orthopedics"] },
  { id:26, name:"Iqra Medical Complex", area:"Johar Town", phone:"042-35170091", type:"Private", lat:31.4700, lng:74.2750, address:"Johar Town, Lahore", specialties:["General Medicine","Surgery","Gynecology","Orthopedics","Pediatrics","ENT"] },
  { id:27, name:"Lady Aitchison Hospital", area:"Lawrence Road", phone:"042-99211153", type:"Government", lat:31.5600, lng:74.3300, address:"Lawrence Road, Lahore", specialties:["Gynecology","Obstetrics","Neonatology"] },
];

const DOCTORS = [
  { id:1, name:"Dr. Nadeem Hayat Mallick", specialty:"Cardiology", hospitalId:1, fee:2500, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:2, name:"Dr. Ahmad Masood Akbar", specialty:"Cardiology", hospitalId:9, fee:3000, slots:["Mon 10AM-2PM","Thu 10AM-2PM","Sat 10AM-1PM"] },
  { id:3, name:"Dr. Azhar Mahmood Kayani", specialty:"Cardiology", hospitalId:11, fee:3500, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:4, name:"Dr. Farqad Alamgir", specialty:"Cardiology", hospitalId:12, fee:4000, slots:["Mon 2PM-6PM","Wed 2PM-6PM","Fri 2PM-6PM"] },
  { id:5, name:"Dr. Shahid Iqbal", specialty:"Cardiac Surgery", hospitalId:17, fee:3000, slots:["Mon 10AM-2PM","Wed 10AM-2PM","Sat 10AM-1PM"] },
  { id:6, name:"Dr. Saulat Fatimi", specialty:"Cardiac Surgery", hospitalId:9, fee:3000, slots:["Tue 9AM-1PM","Thu 9AM-1PM"] },
  { id:7, name:"Dr. Amer Aziz", specialty:"Orthopedics", hospitalId:12, fee:4000, slots:["Mon 4PM-8PM","Wed 4PM-8PM","Sat 10AM-2PM"] },
  { id:8, name:"Dr. Javed Akram", specialty:"Orthopedics", hospitalId:8, fee:2000, slots:["Mon 9AM-1PM","Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:9, name:"Dr. Rizwan Akram Gill", specialty:"Orthopedics", hospitalId:10, fee:3000, slots:["Mon 2PM-5PM","Wed 2PM-5PM","Fri 2PM-5PM"] },
  { id:10, name:"Dr. Mujahid Husnain", specialty:"Orthopedics", hospitalId:13, fee:3500, slots:["Tue 4PM-8PM","Thu 4PM-8PM","Sat 10AM-2PM"] },
  { id:11, name:"Dr. Saima Ashraf", specialty:"Gynecology", hospitalId:10, fee:3000, slots:["Mon 10AM-2PM","Wed 10AM-2PM","Fri 10AM-1PM"] },
  { id:12, name:"Dr. Ayesha Siddiqua", specialty:"Gynecology", hospitalId:16, fee:2500, slots:["Mon 9AM-1PM","Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:13, name:"Dr. Lubna Ejaz", specialty:"Gynecology", hospitalId:2, fee:2000, slots:["Mon 9AM-2PM","Wed 9AM-2PM","Fri 9AM-2PM"] },
  { id:14, name:"Dr. Shaheen Akhtar", specialty:"Gynecology", hospitalId:1, fee:2000, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:15, name:"Dr. Abeera Choudry", specialty:"Gynecology", hospitalId:14, fee:4000, slots:["Mon 2PM-6PM","Wed 2PM-6PM","Fri 2PM-5PM"] },
  { id:16, name:"Dr. Ijaz Hussain", specialty:"Dermatology", hospitalId:10, fee:3000, slots:["Mon 4PM-7PM","Wed 4PM-7PM","Sat 10AM-1PM"] },
  { id:17, name:"Dr. Atif Kazmi", specialty:"Dermatology", hospitalId:12, fee:3500, slots:["Tue 5PM-8PM","Thu 5PM-8PM","Sat 2PM-5PM"] },
  { id:18, name:"Dr. Mazhar Badshah", specialty:"Neurology", hospitalId:1, fee:2500, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:19, name:"Dr. Khalid Jameel", specialty:"Neurology", hospitalId:4, fee:2500, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:20, name:"Dr. Rashid Jooma", specialty:"Neurosurgery", hospitalId:12, fee:5000, slots:["Mon 10AM-1PM","Thu 10AM-1PM"] },
  { id:21, name:"Dr. Arif Amir Nawaz", specialty:"Gastroenterology", hospitalId:12, fee:4000, slots:["Mon 2PM-5PM","Wed 2PM-5PM","Fri 2PM-5PM"] },
  { id:22, name:"Dr. Amjad Ali Siddiqui", specialty:"Gastroenterology", hospitalId:13, fee:3500, slots:["Tue 4PM-7PM","Thu 4PM-7PM","Sat 10AM-1PM"] },
  { id:23, name:"Dr. Samia Khan", specialty:"General Medicine", hospitalId:19, fee:2500, slots:["Mon 9AM-2PM","Tue 9AM-2PM","Wed 9AM-2PM","Thu 9AM-2PM","Sat 9AM-1PM"] },
  { id:24, name:"Dr. Tahir Shamsi", specialty:"General Medicine", hospitalId:14, fee:3500, slots:["Mon 10AM-2PM","Wed 10AM-2PM","Fri 10AM-2PM"] },
  { id:25, name:"Dr. Asim Mumtaz", specialty:"General Medicine", hospitalId:15, fee:2500, slots:["Mon 9AM-1PM","Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:26, name:"Dr. Sajid Sultan", specialty:"Urology", hospitalId:11, fee:3500, slots:["Mon 4PM-7PM","Wed 4PM-7PM","Sat 10AM-1PM"] },
  { id:27, name:"Dr. Mumtaz Rasool", specialty:"Urology", hospitalId:12, fee:4000, slots:["Tue 2PM-6PM","Thu 2PM-6PM"] },
  { id:28, name:"Dr. Masood Sadiq", specialty:"Pediatrics", hospitalId:6, fee:2500, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:29, name:"Dr. Huma Arshad Cheema", specialty:"Pediatrics", hospitalId:6, fee:2000, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:30, name:"Dr. Asad Aslam Khan", specialty:"Ophthalmology", hospitalId:1, fee:2500, slots:["Mon 2PM-5PM","Wed 2PM-5PM","Fri 2PM-5PM"] },
  { id:31, name:"Dr. Nadeem Qureshi", specialty:"Ophthalmology", hospitalId:4, fee:3000, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:32, name:"Dr. Iqbal Hussain Udaipurwala", specialty:"ENT", hospitalId:2, fee:2000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:33, name:"Dr. Asif Ali Arain", specialty:"ENT", hospitalId:10, fee:3000, slots:["Tue 4PM-7PM","Thu 4PM-7PM","Sat 10AM-1PM"] },
  { id:34, name:"Dr. Aasim Yusuf", specialty:"Oncology", hospitalId:9, fee:3000, slots:["Mon 9AM-2PM","Wed 9AM-2PM","Thu 9AM-2PM"] },
  { id:35, name:"Dr. Khalid Mufti", specialty:"Psychiatry", hospitalId:2, fee:3000, slots:["Mon 2PM-5PM","Wed 2PM-5PM","Fri 2PM-5PM"] },
  { id:36, name:"Dr. Fareed Minhas", specialty:"Psychiatry", hospitalId:4, fee:2500, slots:["Tue 10AM-1PM","Thu 10AM-1PM"] },
  { id:37, name:"Dr. Uzma Sarwar", specialty:"Dermatology", hospitalId:14, fee:3500, slots:["Mon 5PM-8PM","Wed 5PM-8PM","Sat 10AM-1PM"] },
  // Additional doctors - Mayo Hospital (id:1)
  { id:38, name:"Dr. Tahira Naseem", specialty:"Gynecology", hospitalId:1, fee:2000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-12PM"] },
  { id:39, name:"Dr. Khalid Masood", specialty:"General Medicine", hospitalId:1, fee:1500, slots:["Mon 9AM-2PM","Tue 9AM-2PM","Wed 9AM-2PM","Thu 9AM-2PM","Fri 9AM-2PM"] },
  { id:40, name:"Dr. Amjad Iqbal", specialty:"Orthopedics", hospitalId:1, fee:2000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Sat 9AM-12PM"] },
  { id:41, name:"Dr. Saqib Naseem", specialty:"General Surgery", hospitalId:1, fee:2000, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:42, name:"Dr. Rabia Arshed", specialty:"Dermatology", hospitalId:1, fee:2000, slots:["Mon 2PM-5PM","Wed 2PM-5PM","Fri 2PM-5PM"] },
  { id:43, name:"Dr. Irfan Malik", specialty:"Urology", hospitalId:1, fee:2500, slots:["Tue 9AM-1PM","Thu 9AM-1PM"] },
  { id:44, name:"Dr. Zafar Iqbal", specialty:"ENT", hospitalId:1, fee:2000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:45, name:"Dr. Shafqat Rasool", specialty:"Pediatrics", hospitalId:1, fee:1500, slots:["Mon 9AM-2PM","Tue 9AM-2PM","Thu 9AM-2PM","Sat 9AM-12PM"] },
  // Services Hospital (id:2)
  { id:46, name:"Dr. Nadia Naseem", specialty:"Gynecology", hospitalId:2, fee:2000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:47, name:"Dr. Asif Naveed", specialty:"General Medicine", hospitalId:2, fee:1500, slots:["Mon 9AM-2PM","Tue 9AM-2PM","Wed 9AM-2PM","Thu 9AM-2PM","Fri 9AM-2PM"] },
  { id:48, name:"Dr. Tariq Mahmood", specialty:"Cardiology", hospitalId:2, fee:2500, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:49, name:"Dr. Faisal Masud", specialty:"Neurology", hospitalId:2, fee:2500, slots:["Mon 2PM-5PM","Wed 2PM-5PM"] },
  { id:50, name:"Dr. Saira Afzal", specialty:"Dermatology", hospitalId:2, fee:2000, slots:["Tue 2PM-5PM","Thu 2PM-5PM","Sat 9AM-12PM"] },
  { id:51, name:"Dr. Ahsan Waheed", specialty:"Orthopedics", hospitalId:2, fee:2000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  // Jinnah Hospital (id:3)
  { id:52, name:"Dr. Arshad Kamal", specialty:"General Medicine", hospitalId:3, fee:1500, slots:["Mon 9AM-2PM","Tue 9AM-2PM","Wed 9AM-2PM","Thu 9AM-2PM"] },
  { id:53, name:"Dr. Rubina Ghani", specialty:"Gynecology", hospitalId:3, fee:2000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:54, name:"Dr. Naveed Ashraf", specialty:"General Surgery", hospitalId:3, fee:2000, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:55, name:"Dr. Imran Sadiq", specialty:"Orthopedics", hospitalId:3, fee:2000, slots:["Mon 2PM-5PM","Wed 2PM-5PM","Fri 2PM-5PM"] },
  // Lahore General Hospital (id:4)
  { id:56, name:"Dr. Athar Saeed", specialty:"Cardiology", hospitalId:4, fee:2500, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:57, name:"Dr. Saba Khalid", specialty:"Gynecology", hospitalId:4, fee:2000, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:58, name:"Dr. Waseem Abbas", specialty:"General Surgery", hospitalId:4, fee:2000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:59, name:"Dr. Amna Rashid", specialty:"Dermatology", hospitalId:4, fee:2500, slots:["Mon 2PM-5PM","Wed 2PM-5PM"] },
  { id:60, name:"Dr. Kashif Munir", specialty:"Orthopedics", hospitalId:4, fee:2500, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  // Shaukat Khanum (id:9)
  { id:61, name:"Dr. Aamir Ali Syed", specialty:"Oncology", hospitalId:9, fee:3000, slots:["Tue 9AM-2PM","Thu 9AM-2PM","Sat 9AM-1PM"] },
  { id:62, name:"Dr. Raza Hussain", specialty:"General Surgery", hospitalId:9, fee:3000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:63, name:"Dr. Faisal Sultan", specialty:"Internal Medicine", hospitalId:9, fee:3000, slots:["Mon 10AM-2PM","Wed 10AM-2PM","Fri 10AM-2PM"] },
  // Hameed Latif (id:10)
  { id:64, name:"Dr. Tahir Siddique", specialty:"General Medicine", hospitalId:10, fee:3000, slots:["Mon 9AM-1PM","Tue 9AM-1PM","Wed 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:65, name:"Dr. Nosheen Akhtar", specialty:"Gynecology", hospitalId:10, fee:3000, slots:["Mon 2PM-6PM","Wed 2PM-6PM","Fri 2PM-5PM"] },
  { id:66, name:"Dr. Kamran Khalid", specialty:"Neurology", hospitalId:10, fee:3000, slots:["Tue 4PM-7PM","Thu 4PM-7PM","Sat 10AM-1PM"] },
  { id:67, name:"Dr. Usman Ghani", specialty:"Gastroenterology", hospitalId:10, fee:3000, slots:["Mon 4PM-7PM","Wed 4PM-7PM"] },
  { id:68, name:"Dr. Bilal Ahmad", specialty:"Urology", hospitalId:10, fee:3000, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:69, name:"Dr. Faizan Mustafa", specialty:"Pediatrics", hospitalId:10, fee:2500, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  // National Hospital (id:11)
  { id:70, name:"Dr. Imran Yousaf", specialty:"General Medicine", hospitalId:11, fee:3500, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:71, name:"Dr. Sadia Rashid", specialty:"Gynecology", hospitalId:11, fee:3500, slots:["Tue 10AM-2PM","Thu 10AM-2PM","Sat 10AM-1PM"] },
  { id:72, name:"Dr. Hassan Ali", specialty:"Gastroenterology", hospitalId:11, fee:3500, slots:["Mon 4PM-7PM","Wed 4PM-7PM","Fri 4PM-7PM"] },
  { id:73, name:"Dr. Adnan Bashir", specialty:"Orthopedics", hospitalId:11, fee:3500, slots:["Tue 9AM-1PM","Thu 9AM-1PM"] },
  { id:74, name:"Dr. Zainab Fatima", specialty:"ENT", hospitalId:11, fee:3000, slots:["Mon 2PM-5PM","Wed 2PM-5PM","Sat 10AM-1PM"] },
  // Doctors Hospital (id:12)
  { id:75, name:"Dr. Asad Mahmood", specialty:"General Medicine", hospitalId:12, fee:4000, slots:["Mon 10AM-2PM","Wed 10AM-2PM","Fri 10AM-2PM"] },
  { id:76, name:"Dr. Sana Tariq", specialty:"Gynecology", hospitalId:12, fee:4000, slots:["Tue 2PM-6PM","Thu 2PM-6PM","Sat 10AM-1PM"] },
  { id:77, name:"Dr. Waqas Ahmed", specialty:"Orthopedics", hospitalId:12, fee:4000, slots:["Mon 4PM-8PM","Wed 4PM-8PM"] },
  { id:78, name:"Dr. Haris Majeed", specialty:"ENT", hospitalId:12, fee:3500, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  // Surgimed (id:13)
  { id:79, name:"Dr. Naveed Haider", specialty:"General Surgery", hospitalId:13, fee:3500, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:80, name:"Dr. Asma Bukhari", specialty:"Gynecology", hospitalId:13, fee:3000, slots:["Tue 10AM-2PM","Thu 10AM-2PM","Sat 10AM-1PM"] },
  { id:81, name:"Dr. Kashif Siddique", specialty:"ENT", hospitalId:13, fee:3000, slots:["Mon 4PM-7PM","Wed 4PM-7PM"] },
  // Evercare (id:14)
  { id:82, name:"Dr. Farah Naz", specialty:"Gynecology", hospitalId:14, fee:4000, slots:["Mon 10AM-2PM","Wed 10AM-2PM","Fri 10AM-1PM"] },
  { id:83, name:"Dr. Kamran Aziz", specialty:"Cardiology", hospitalId:14, fee:4500, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:84, name:"Dr. Saad Ullah", specialty:"Orthopedics", hospitalId:14, fee:4000, slots:["Mon 4PM-8PM","Wed 4PM-8PM","Sat 10AM-2PM"] },
  { id:85, name:"Dr. Ayesha Waqar", specialty:"Pediatrics", hospitalId:14, fee:3500, slots:["Mon 9AM-1PM","Tue 9AM-1PM","Thu 9AM-1PM"] },
  { id:86, name:"Dr. Zubair Ahmed", specialty:"Gastroenterology", hospitalId:14, fee:4000, slots:["Tue 4PM-7PM","Thu 4PM-7PM"] },
  { id:87, name:"Dr. Noman Khalid", specialty:"Neurology", hospitalId:14, fee:4000, slots:["Mon 2PM-5PM","Wed 2PM-5PM","Fri 2PM-5PM"] },
  { id:88, name:"Dr. Rehan Malik", specialty:"Urology", hospitalId:14, fee:4000, slots:["Tue 9AM-1PM","Thu 9AM-1PM"] },
  // Ittefaq Hospital (id:15)
  { id:89, name:"Dr. Shahzad Alam", specialty:"General Medicine", hospitalId:15, fee:2500, slots:["Mon 9AM-2PM","Tue 9AM-2PM","Wed 9AM-2PM","Thu 9AM-2PM","Sat 9AM-1PM"] },
  { id:90, name:"Dr. Bushra Iqbal", specialty:"Gynecology", hospitalId:15, fee:2500, slots:["Mon 2PM-5PM","Wed 2PM-5PM","Fri 2PM-5PM"] },
  { id:91, name:"Dr. Tariq Saleem", specialty:"Cardiology", hospitalId:15, fee:3000, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:92, name:"Dr. Wasim Javed", specialty:"Orthopedics", hospitalId:15, fee:2500, slots:["Mon 4PM-7PM","Wed 4PM-7PM"] },
  { id:93, name:"Dr. Naeem Akhtar", specialty:"ENT", hospitalId:15, fee:2500, slots:["Tue 2PM-5PM","Thu 2PM-5PM"] },
  // Fatima Memorial (id:16)
  { id:94, name:"Dr. Samina Qadir", specialty:"Gynecology", hospitalId:16, fee:2500, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:95, name:"Dr. Rizwan Ahmed", specialty:"Pediatrics", hospitalId:16, fee:2500, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:96, name:"Dr. Amir Shahzad", specialty:"General Medicine", hospitalId:16, fee:2500, slots:["Mon 9AM-2PM","Wed 9AM-2PM","Fri 9AM-2PM"] },
  { id:97, name:"Dr. Hina Pervaiz", specialty:"Dermatology", hospitalId:16, fee:2500, slots:["Mon 4PM-7PM","Wed 4PM-7PM","Sat 10AM-1PM"] },
  // Omar Hospital (id:17)
  { id:98, name:"Dr. Irfan Ahmed", specialty:"Cardiology", hospitalId:17, fee:3000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:99, name:"Dr. Nauman Qadir", specialty:"General Surgery", hospitalId:17, fee:2500, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  // Shalamar (id:18)
  { id:100, name:"Dr. Amir Hamza", specialty:"Cardiology", hospitalId:18, fee:3000, slots:["Mon 10AM-2PM","Wed 10AM-2PM","Fri 10AM-1PM"] },
  { id:101, name:"Dr. Faiza Aslam", specialty:"Gynecology", hospitalId:18, fee:3000, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:102, name:"Dr. Umar Farooq", specialty:"Orthopedics", hospitalId:18, fee:3000, slots:["Mon 4PM-7PM","Wed 4PM-7PM"] },
  { id:103, name:"Dr. Sohail Akhtar", specialty:"ENT", hospitalId:18, fee:2500, slots:["Tue 4PM-7PM","Thu 4PM-7PM"] },
  { id:104, name:"Dr. Nadia Jamil", specialty:"Ophthalmology", hospitalId:18, fee:3000, slots:["Mon 9AM-1PM","Wed 9AM-1PM"] },
  // Ghurki (id:8)
  { id:105, name:"Dr. Rana Dilawar", specialty:"Orthopedics", hospitalId:8, fee:2000, slots:["Mon 2PM-5PM","Wed 2PM-5PM","Fri 2PM-5PM"] },
  { id:106, name:"Dr. Shahid Mehmood", specialty:"Neurosurgery", hospitalId:8, fee:2500, slots:["Tue 9AM-1PM","Thu 9AM-1PM"] },
  { id:107, name:"Dr. Asma Rani", specialty:"Gynecology", hospitalId:8, fee:2000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Sat 9AM-12PM"] },
  // CMH (id:22)
  { id:108, name:"Dr. Brig. Aslam Khan", specialty:"General Medicine", hospitalId:22, fee:3000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:109, name:"Dr. Col. Faisal Raza", specialty:"Cardiology", hospitalId:22, fee:3500, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:110, name:"Dr. Col. Nadia Shah", specialty:"Gynecology", hospitalId:22, fee:3000, slots:["Mon 2PM-5PM","Wed 2PM-5PM"] },
  { id:111, name:"Dr. Maj. Usman Ali", specialty:"Orthopedics", hospitalId:22, fee:3000, slots:["Tue 2PM-5PM","Thu 2PM-5PM","Sat 9AM-12PM"] },
  // City International (id:21)
  { id:112, name:"Dr. Kashif Iqbal", specialty:"General Medicine", hospitalId:21, fee:3000, slots:["Mon 9AM-2PM","Wed 9AM-2PM","Fri 9AM-2PM"] },
  { id:113, name:"Dr. Amina Bibi", specialty:"Gynecology", hospitalId:21, fee:3000, slots:["Tue 10AM-2PM","Thu 10AM-2PM","Sat 10AM-1PM"] },
  { id:114, name:"Dr. Zahid Hussain", specialty:"Cardiology", hospitalId:21, fee:3500, slots:["Mon 4PM-7PM","Wed 4PM-7PM"] },
  // Shaikh Zayed (id:7)
  { id:115, name:"Dr. Abid Hussain", specialty:"General Medicine", hospitalId:7, fee:2000, slots:["Mon 9AM-2PM","Tue 9AM-2PM","Wed 9AM-2PM","Thu 9AM-2PM","Fri 9AM-2PM"] },
  { id:116, name:"Dr. Nasreen Akhtar", specialty:"Gynecology", hospitalId:7, fee:2000, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:117, name:"Dr. Tanveer Ahmad", specialty:"Cardiology", hospitalId:7, fee:2500, slots:["Tue 9AM-1PM","Thu 9AM-1PM","Sat 9AM-12PM"] },
  { id:118, name:"Dr. Saeed Anwar", specialty:"Orthopedics", hospitalId:7, fee:2000, slots:["Mon 2PM-5PM","Wed 2PM-5PM"] },
  { id:119, name:"Dr. Farzana Rizvi", specialty:"Neurology", hospitalId:7, fee:2500, slots:["Tue 2PM-5PM","Thu 2PM-5PM"] },
  // Indus Hospital (id:23)
  { id:120, name:"Dr. Abdul Bari Khan", specialty:"General Surgery", hospitalId:23, fee:0, slots:["Mon 9AM-2PM","Tue 9AM-2PM","Wed 9AM-2PM","Thu 9AM-2PM","Fri 9AM-2PM","Sat 9AM-1PM"] },
  { id:121, name:"Dr. Shamsa Humayun", specialty:"Gynecology", hospitalId:23, fee:0, slots:["Mon 9AM-1PM","Wed 9AM-1PM","Fri 9AM-1PM"] },
  { id:122, name:"Dr. Qaiser Sajjad", specialty:"Pediatrics", hospitalId:23, fee:0, slots:["Mon 9AM-2PM","Tue 9AM-2PM","Thu 9AM-2PM"] },
  // Chughtai Medical Centre (id:19)
  { id:123, name:"Dr. Aftab Mohsin", specialty:"Gastroenterology", hospitalId:19, fee:3000, slots:["Mon 4PM-7PM","Wed 4PM-7PM","Sat 10AM-1PM"] },
  { id:124, name:"Dr. Sadia Hameed", specialty:"Gynecology", hospitalId:19, fee:2500, slots:["Tue 10AM-2PM","Thu 10AM-2PM"] },
  { id:125, name:"Dr. Imran Sharif", specialty:"Dermatology", hospitalId:19, fee:2500, slots:["Mon 5PM-8PM","Wed 5PM-8PM","Sat 2PM-5PM"] },
];

const LABS = [
  { id:1, name:"Chughtai Lab", areas:["Gulberg","DHA","Johar Town","Model Town","Garden Town","Ferozepur Road","Multan Road","Wapda Town","Iqbal Town","Township","Shadman","Cavalry Ground"], phone:"042-111-456-789", lat:31.5220, lng:74.3480, address:"Main Boulevard Gulberg, Lahore", tests:["CBC","Blood Sugar","HbA1c","Lipid Profile","LFT","RFT","Thyroid (T3/T4/TSH)","Urine DR","Vitamin D","Vitamin B12","Iron Studies","Hepatitis B & C","Dengue NS1","MRI","CT Scan","X-Ray","Ultrasound","ECG"], homeCollection:true },
  { id:2, name:"Excel Labs", areas:["DHA","Gulberg","Johar Town","Model Town","Ferozepur Road","Garden Town"], phone:"042-111-392-352", lat:31.4800, lng:74.3750, address:"DHA Phase 5, Lahore", tests:["CBC","Blood Sugar","Lipid Profile","LFT","RFT","Thyroid Profile","Urine DR","Hepatitis Panel","Vitamin D","HbA1c","Iron Studies","Dengue Test"], homeCollection:true },
  { id:3, name:"Al Razi Healthcare", areas:["Gulberg","Model Town","DHA"], phone:"042-35886100", lat:31.5200, lng:74.3400, address:"Main Boulevard Gulberg III, Lahore", tests:["MRI","CT Scan","X-Ray","Ultrasound","ECG","Echocardiography","Mammography","Bone Densitometry","Doppler"], homeCollection:false },
  { id:4, name:"Dr. Essa Lab", areas:["DHA","Garden Town","Johar Town","Model Town","Gulberg","Ferozepur Road","Iqbal Town"], phone:"042-111-372-372", lat:31.4670, lng:74.3870, address:"DHA Phase 4, Lahore", tests:["CBC","Blood Sugar","Lipid Profile","LFT","RFT","Thyroid","Urine DR","Hepatitis","Vitamin D","Vitamin B12","HbA1c","Iron Studies"], homeCollection:true },
  { id:5, name:"Shaukat Khanum Diagnostic", areas:["Johar Town","Liberty","Jail Road","DHA"], phone:"03-111-756-000", lat:31.4697, lng:74.2728, address:"7A Block R-3, Johar Town", tests:["CBC","Tumor Markers","Biopsy","Histopathology","MRI","CT Scan","PET Scan","Ultrasound","X-Ray","Mammography","LFT","RFT"], homeCollection:true },
  { id:6, name:"Citi Lab", areas:["Gulberg","DHA","Model Town","Garden Town","Johar Town"], phone:"0332-1555333", lat:31.5230, lng:74.3500, address:"Gulberg III, Lahore", tests:["CBC","Blood Sugar","Lipid Profile","LFT","RFT","Thyroid","Urine DR","Hepatitis","Vitamin D","Hormonal Assays","Allergy Testing"], homeCollection:false },
  { id:7, name:"IDC (Islamabad Diagnostic Centre)", areas:["Gulberg","DHA","Johar Town"], phone:"042-111-113-432", lat:31.5210, lng:74.3460, address:"44-Gulberg III, Lahore", tests:["MRI","CT Scan","Ultrasound","X-Ray","Mammography","ECG","Echocardiography","Bone Densitometry","Doppler"], homeCollection:false },
  { id:8, name:"The Lahore Diagnostics", areas:["Gulberg","DHA"], phone:"042-35788900", lat:31.5240, lng:74.3520, address:"Gulberg, Lahore", tests:["MRI","CT Scan","Ultrasound","X-Ray","Mammography","Bone Densitometry","ECG","Echocardiography"], homeCollection:false },
  { id:9, name:"One Health Labs", areas:["DHA","Gulberg","Johar Town"], phone:"042-111-111-504", lat:31.4810, lng:74.3760, address:"DHA Phase 5, Lahore", tests:["CBC","Blood Sugar","Lipid Profile","LFT","RFT","Thyroid","Vitamin D","Vitamin B12","Hepatitis","Allergy Panel"], homeCollection:true },
  { id:10, name:"Al-Khidmat Lab", areas:["Township","Iqbal Town","Multan Road"], phone:"042-111-786-786", lat:31.4600, lng:74.2900, address:"Township, Lahore", tests:["CBC","Blood Sugar","Urine DR","LFT","RFT","Hepatitis","Ultrasound","X-Ray","ECG"], homeCollection:false },
  { id:11, name:"Lahore Medical Lab", areas:["Gulberg","DHA","Model Town"], phone:"042-35761234", lat:31.5200, lng:74.3450, address:"Gulberg, Lahore", tests:["CBC","Blood Sugar","LFT","RFT","Thyroid","Vitamin D","Hepatitis","Lipid Profile","Genetic Testing"], homeCollection:false },
];

const TEST_PREPARATIONS = {
  "cbc":"No special preparation. Stay hydrated.","blood sugar":"Fast 8-12 hours. Water only.","hba1c":"No fasting required.","lipid profile":"Fast 9-12 hours. Avoid fatty foods.","lft":"Fast 8-12 hours. No alcohol 24hrs prior.","rft":"No special preparation. Stay hydrated.","thyroid":"Morning sample preferred. Inform about medications.","vitamin d":"No preparation needed.","vitamin b12":"No fasting required.","hepatitis":"No preparation needed.","urine dr":"Midstream clean-catch. Morning sample preferred.","mri":"Remove all metal. No food 4hrs before. Inform about implants.","ct scan":"Fast 4 hours. Inform about allergies.","x-ray":"Remove jewelry/metal. Wear loose clothing.","ultrasound":"Drink 4-6 glasses water 1hr before (abdominal).","ecg":"Avoid caffeine 2hrs before.","mammography":"No deodorant/powder on chest area.","pet scan":"Fast 6 hours. No exercise 24hrs before.","iron studies":"Fast 8-12 hours. Morning sample preferred.","dengue":"No preparation needed.","biopsy":"Follow doctor instructions. May need fasting.",
};

const SPECIALTIES = ["Cardiology","Cardiac Surgery","Orthopedics","Gynecology","Obstetrics","Dermatology","Neurology","Neurosurgery","Gastroenterology","General Medicine","General Surgery","Urology","Pediatrics","ENT","Ophthalmology","Oncology","Psychiatry"];

function getMapLink(lat, lng, name) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name + " Lahore")}`;
}

function getMapLinkByName(name, address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", " + address + ", Lahore")}`;
}

// ============================================================
// INTENT PARSER
// ============================================================

function parseMessage(message) {
  const msg = message.toLowerCase().trim();
  const result = { raw: msg, entities: {} };

  // Extract number selection (user picking from a list)
  const numMatch = msg.match(/^(\d+)$/);
  if (numMatch) { result.intent = "select_number"; result.entities.number = parseInt(numMatch[1]); return result; }

  // Extract name/phone for booking confirmation
  const nameMatch = msg.match(/(?:my name is|name:|i am|i'm)\s+(.+)/i);
  if (nameMatch) result.entities.patientName = nameMatch[1].trim();
  const phoneMatch = msg.match(/(?:phone|number|contact|cell|mobile)[\s:]*(\+?[\d\s-]{10,})/i);
  if (phoneMatch) result.entities.phone = phoneMatch[1].trim();
  // Also match standalone phone numbers
  const standalonePhone = msg.match(/^[\d\s+-]{10,}$/);
  if (standalonePhone) { result.entities.phone = msg.trim(); }

  // Greeting
  if (msg.match(/^(hi|hello|hey|salam|assalam|aoa|good morning|good evening|good afternoon)/)) { result.intent = "greeting"; return result; }
  // Help
  if (msg.match(/\b(help|what can you|how do|guide|options|menu)\b/)) { result.intent = "help"; return result; }
  // Emergency
  if (msg.match(/\b(emergency|urgent|critical|ambulance|rescue)\b/)) { result.intent = "emergency"; return result; }

  // Symptoms check
  if (msg.match(/\b(symptom|symptoms|i feel|i have|feeling|pain|ache|hurt|sick|unwell|ill)\b/)) { result.intent = "symptoms"; return result; }

  // Preparation
  if (msg.match(/\b(preparation|prepare|before|instructions|prep)\b/)) { result.intent = "test_preparation"; extractTestType(msg, result); return result; }

  // Book appointment
  if (msg.match(/\b(book|schedule|make|set)\b.*\b(appointment|visit|checkup|consultation|doctor)\b/)) { result.intent = "book_appointment"; extractHospital(msg, result); extractSpecialty(msg, result); return result; }

  // Book lab test
  if (msg.match(/\b(book|schedule|get|do|need)\b.*\b(test|lab|blood|mri|ct|sugar|cholesterol|cbc|thyroid|x-ray|ultrasound|ecg|scan|lipid|lft|rft|vitamin|hepatitis|urine)\b/)) { result.intent = "book_lab_test"; extractLab(msg, result); extractTestType(msg, result); return result; }

  // Find doctor
  if (msg.match(/\b(doctor|dr|specialist|find doctor|show doctor|list doctor)\b/) || msg.match(/\b(cardiologist|orthopedic|gynecologist|dermatologist|neurologist|gastroenterologist|urologist|pediatrician|oncologist|psychiatrist|surgeon|physician)\b/)) { result.intent = "find_doctor"; extractSpecialty(msg, result); extractHospital(msg, result); return result; }

  // Find hospital
  if (msg.match(/\bhospitals?\b/)) { result.intent = "find_hospital"; extractArea(msg, result); return result; }

  // Find lab
  if (msg.match(/\blabs?\b/) || msg.match(/\bdiagnostic\b/)) { result.intent = "find_lab"; extractArea(msg, result); return result; }

  // Cancel/Reschedule/Status
  if (msg.match(/\b(cancel|remove)\b/)) { result.intent = "cancel"; return result; }
  if (msg.match(/\b(reschedule|change date)\b/)) { result.intent = "reschedule"; return result; }
  if (msg.match(/\b(status|track|my appointment|my booking)\b/)) { result.intent = "check_status"; return result; }

  // Specialty mentioned
  extractSpecialty(msg, result);
  if (result.entities.specialty) { result.intent = "find_doctor"; return result; }

  // If user provides name and phone (for booking flow)
  if (result.entities.patientName || result.entities.phone) { result.intent = "provide_info"; return result; }

  result.intent = "unknown";
  return result;
}

function extractHospital(msg, result) {
  for (const h of HOSPITALS) {
    if (msg.includes(h.name.toLowerCase())) { result.entities.hospital = h; return; }
  }
  if (msg.includes("mayo")) result.entities.hospital = HOSPITALS[0];
  else if (msg.includes("services")) result.entities.hospital = HOSPITALS[1];
  else if (msg.includes("jinnah")) result.entities.hospital = HOSPITALS[2];
  else if (msg.includes("general hospital") || msg.includes("lgh")) result.entities.hospital = HOSPITALS[3];
  else if (msg.includes("ganga ram")) result.entities.hospital = HOSPITALS[4];
  else if (msg.includes("children")) result.entities.hospital = HOSPITALS[5];
  else if (msg.includes("shaikh zayed") || msg.includes("sheikh zayed")) result.entities.hospital = HOSPITALS[6];
  else if (msg.includes("ghurki")) result.entities.hospital = HOSPITALS[7];
  else if (msg.includes("shaukat") || msg.includes("skm")) result.entities.hospital = HOSPITALS[8];
  else if (msg.includes("hameed") || msg.includes("latif")) result.entities.hospital = HOSPITALS[9];
  else if (msg.includes("national")) result.entities.hospital = HOSPITALS[10];
  else if (msg.includes("doctors hospital")) result.entities.hospital = HOSPITALS[11];
  else if (msg.includes("surgimed")) result.entities.hospital = HOSPITALS[12];
  else if (msg.includes("evercare")) result.entities.hospital = HOSPITALS[13];
  else if (msg.includes("ittefaq")) result.entities.hospital = HOSPITALS[14];
  else if (msg.includes("fatima")) result.entities.hospital = HOSPITALS[15];
  else if (msg.includes("omar")) result.entities.hospital = HOSPITALS[16];
  else if (msg.includes("shalamar")) result.entities.hospital = HOSPITALS[17];
  else if (msg.includes("chughtai medical")) result.entities.hospital = HOSPITALS[18];
  else if (msg.includes("cmh") || msg.includes("military")) result.entities.hospital = HOSPITALS[21];
  else if (msg.includes("indus")) result.entities.hospital = HOSPITALS[22];
}

function extractLab(msg, result) {
  if (msg.includes("chughtai") && !msg.includes("medical")) result.entities.lab = LABS[0];
  else if (msg.includes("excel")) result.entities.lab = LABS[1];
  else if (msg.includes("al razi") || msg.includes("alrazi")) result.entities.lab = LABS[2];
  else if (msg.includes("essa")) result.entities.lab = LABS[3];
  else if (msg.includes("shaukat khanum") || msg.includes("sk lab")) result.entities.lab = LABS[4];
  else if (msg.includes("citi")) result.entities.lab = LABS[5];
  else if (msg.includes("idc")) result.entities.lab = LABS[6];
  else if (msg.includes("lahore diagnostics")) result.entities.lab = LABS[7];
  else if (msg.includes("one health")) result.entities.lab = LABS[8];
  else if (msg.includes("alkhidmat") || msg.includes("al-khidmat")) result.entities.lab = LABS[9];
  else if (msg.includes("lahore medical lab")) result.entities.lab = LABS[10];
}

function extractSpecialty(msg, result) {
  if (msg.includes("cardiology") || msg.includes("cardiologist") || msg.includes("heart")) result.entities.specialty = "Cardiology";
  else if (msg.includes("cardiac surgery")) result.entities.specialty = "Cardiac Surgery";
  else if (msg.includes("orthopedic") || msg.includes("bone") || msg.includes("joint")) result.entities.specialty = "Orthopedics";
  else if (msg.includes("gynecol") || msg.includes("gynae") || msg.includes("gyne") || msg.includes("women")) result.entities.specialty = "Gynecology";
  else if (msg.includes("dermatol") || msg.includes("skin")) result.entities.specialty = "Dermatology";
  else if (msg.includes("neurosurg")) result.entities.specialty = "Neurosurgery";
  else if (msg.includes("neurol") || msg.includes("brain")) result.entities.specialty = "Neurology";
  else if (msg.includes("gastro") || msg.includes("stomach") || msg.includes("liver")) result.entities.specialty = "Gastroenterology";
  else if (msg.includes("general medicine") || msg.includes("physician")) result.entities.specialty = "General Medicine";
  else if (msg.includes("urolog") || msg.includes("kidney")) result.entities.specialty = "Urology";
  else if (msg.includes("pediatric") || msg.includes("child") || msg.includes("baby")) result.entities.specialty = "Pediatrics";
  else if (msg.match(/\bent\b/) || msg.includes("ear") || msg.includes("nose") || msg.includes("throat")) result.entities.specialty = "ENT";
  else if (msg.includes("eye") || msg.includes("ophthal")) result.entities.specialty = "Ophthalmology";
  else if (msg.includes("cancer") || msg.includes("oncol")) result.entities.specialty = "Oncology";
  else if (msg.includes("psychiatr") || msg.includes("mental") || msg.includes("depression")) result.entities.specialty = "Psychiatry";
  else if (msg.includes("surgery") || msg.includes("surgeon")) result.entities.specialty = "General Surgery";
}

function extractTestType(msg, result) {
  const tests = ["cbc","blood sugar","hba1c","lipid profile","lft","rft","thyroid","vitamin d","vitamin b12","hepatitis","urine dr","mri","ct scan","x-ray","ultrasound","ecg","mammography","pet scan","iron studies","dengue","biopsy","tumor markers"];
  for (const t of tests) { if (msg.includes(t)) { result.entities.testType = t; return; } }
  if (msg.includes("blood")) result.entities.testType = "cbc";
  else if (msg.includes("sugar") || msg.includes("diabetes")) result.entities.testType = "blood sugar";
  else if (msg.includes("cholesterol")) result.entities.testType = "lipid profile";
}

function extractArea(msg, result) {
  const areas = ["DHA","Gulberg","Johar Town","Model Town","Garden Town","Shadman","Cavalry Ground","Multan Road","Ferozepur Road","Jail Road","Canal Road","Iqbal Town","Township","Cantt"];
  for (const a of areas) { if (msg.includes(a.toLowerCase())) { result.entities.area = a; return; } }
}

// ============================================================
// STEP-BY-STEP CONVERSATION FLOW
// ============================================================

function handleConversation(parsed, context) {
  const { intent, entities } = parsed;

  // If user is in a flow (context tells us where they are)
  if (context.flow === "book_appointment") return appointmentFlow(parsed, context);
  if (context.flow === "book_lab_test") return labTestFlow(parsed, context);
  if (context.flow === "find_doctor") return findDoctorFlow(parsed, context);

  switch (intent) {
    case "greeting": return greeting();
    case "help": return help();
    case "emergency": return emergency();
    case "symptoms": return symptomsGuide();
    case "book_appointment": return startAppointmentFlow(entities);
    case "book_lab_test": return startLabTestFlow(entities);
    case "find_doctor": return findDoctor(entities);
    case "find_hospital": return findHospital(entities);
    case "find_lab": return findLab(entities);
    case "test_preparation": return testPreparation(entities);
    case "cancel": return cancel();
    case "reschedule": return reschedule();
    case "check_status": return checkStatus();
    default: return unknownIntent(entities);
  }
}

function symptomsGuide() {
  const symptoms = Object.keys(LEARNING_STORE.symptomMap).map(s => `• ${s.charAt(0).toUpperCase() + s.slice(1)}`).join("\n");
  return { reply: `🩺 **Symptom Checker**\n\nDescribe your symptoms and I'll provide possible causes and advice.\n\n**Common symptoms I can help with:**\n${symptoms}\n\n👉 Just tell me what you're feeling, e.g.:\n• \"I have a headache\"\n• \"I feel dizzy\"\n• \"My chest hurts\"\n\n⚠️ This is not a medical diagnosis. Always consult a doctor for proper evaluation.`, context: {} };
}

function greeting() {
  return { reply: "Assalam-o-Alaikum! 👋\nWelcome to CureBot — your AI-powered healthcare assistant for Lahore.\n\nHow may I assist you today?\n\n1️⃣ Book a Doctor Appointment\n2️⃣ Schedule a Lab Test\n3️⃣ Search for a Doctor\n4️⃣ Find a Hospital\n5️⃣ Locate a Diagnostic Lab\n6️⃣ View Emergency Contacts\n\nJust type the number or tell me what you need!", context: {} };
}

function help() {
  return { reply: "🏥 **CureBot - Your Lahore Medical Assistant**\n\n**I have data for:**\n• 27 Hospitals (Govt + Private + Military)\n• 11 Diagnostic Labs\n• 37+ Specialist Doctors with fees & schedules\n• 20+ Areas of Lahore\n\n**Commands:**\n• \"Book appointment\" → Step-by-step hospital & doctor selection\n• \"Book lab test\" → Choose lab, test, and schedule\n• \"Find cardiologist\" → List specialists\n• \"Hospitals in DHA\" → Area-based search\n• \"Labs\" → All diagnostic labs\n• \"Preparation for MRI\" → Test prep instructions\n• \"Emergency\" → Urgent contacts\n\n**I'll guide you step by step - just follow along!**", context: {} };
}

function emergency() {
  return { reply: "🚨 **EMERGENCY - LAHORE**\n\n📞 **Rescue 1122**: 1122\n📞 **Ambulance**: 115\n📞 **Police**: 15\n\n🏥 **24/7 Emergency Hospitals:**\n\n• Mayo Hospital - 042-99211100\n• Services Hospital - 042-99203402\n• Jinnah Hospital - 042-99231401\n• LGH - 042-99264091\n• Shaukat Khanum - 042-35905000\n• Doctors Hospital - 042-35300061\n• Evercare - 042-111-227-333\n• CMH - 042-99200601\n\n⚠️ Call **1122** immediately for life-threatening emergencies!", context: {} };
}

// ============================================================
// APPOINTMENT FLOW (Step by Step)
// ============================================================

function startAppointmentFlow(entities) {
  // If hospital already mentioned, skip to step 2
  if (entities.hospital) {
    const h = entities.hospital;
    const docs = DOCTORS.filter(d => d.hospitalId === h.id);
    const mapLink = getMapLinkByName(h.name, h.address);
    if (docs.length > 0) {
      const docList = docs.map((d,i) => `${i+1}. **${d.name}** - ${d.specialty}\n   💰 Fee: Rs. ${d.fee}\n   📅 ${d.slots.join(", ")}`).join("\n\n");
      return { reply: `🏥 **${h.name}**\n📍 ${h.address}\n📞 ${h.phone}\n🗺️ [Open in Google Maps](${mapLink})\n\n**Available Doctors:**\n\n${docList}\n\n👉 **Which doctor would you like to see?** (Type the number)`, context: { flow:"book_appointment", step:"select_doctor", hospitalId:h.id, doctors:docs.map(d=>d.id) } };
    }
    const specList = h.specialties.map((s,i) => `${i+1}. ${s}`).join("\n");
    return { reply: `🏥 **${h.name}**\n📍 ${h.address}\n📞 ${h.phone}\n🗺️ [Open in Google Maps](${mapLink})\n\n**Specialties Available:**\n${specList}\n\n👉 **Which specialty do you need?** (Type the number or name)`, context: { flow:"book_appointment", step:"select_specialty", hospitalId:h.id } };
  }

  // Step 1: Show all hospitals
  const hospitalList = HOSPITALS.map((h,i) => `${i+1}. ${h.name} (${h.area}) - ${h.type}`).join("\n");
  return { reply: `Let's book your appointment! 🏥\n\n**Select a Hospital:**\n\n${hospitalList}\n\n👉 **Type the number** of your preferred hospital.`, context: { flow:"book_appointment", step:"select_hospital" } };
}

function appointmentFlow(parsed, context) {
  const { step } = context;
  const msg = parsed.raw;
  const num = parsed.entities.number;

  // STEP: Select Hospital
  if (step === "select_hospital") {
    let hospital;
    if (num && num >= 1 && num <= HOSPITALS.length) {
      hospital = HOSPITALS[num - 1];
    } else {
      // Try to match by name
      extractHospital(msg, parsed);
      hospital = parsed.entities.hospital;
    }
    if (!hospital) return { reply: `❌ I didn't understand that. Please type a number between 1 and ${HOSPITALS.length}, or type the hospital name.`, context };

    const docs = DOCTORS.filter(d => d.hospitalId === hospital.id);
    const mapLink = getMapLinkByName(hospital.name, hospital.address);

    if (docs.length > 0) {
      const docList = docs.map((d,i) => `${i+1}. **${d.name}** - ${d.specialty}\n   💰 Rs. ${d.fee} | 📅 ${d.slots[0]}...`).join("\n\n");
      return { reply: `✅ **${hospital.name}**\n📍 ${hospital.address}\n📞 ${hospital.phone}\n🗺️ [Open in Google Maps](${mapLink})\n\n**Available Doctors:**\n\n${docList}\n\n👉 **Which doctor?** (Type the number)`, context: { flow:"book_appointment", step:"select_doctor", hospitalId:hospital.id, doctors:docs.map(d=>d.id) } };
    }
    const specList = hospital.specialties.map((s,i) => `${i+1}. ${s}`).join("\n");
    return { reply: `✅ **${hospital.name}**\n📍 ${hospital.address}\n📞 ${hospital.phone}\n🗺️ [Open in Google Maps](${mapLink})\n\n**Specialties:**\n${specList}\n\n👉 **Which specialty?** (Type number or name)`, context: { flow:"book_appointment", step:"select_specialty", hospitalId:hospital.id } };
  }

  // STEP: Select Specialty (when no specific doctors in DB)
  if (step === "select_specialty") {
    const hospital = HOSPITALS.find(h => h.id === context.hospitalId);
    let specialty;
    if (num && num >= 1 && num <= hospital.specialties.length) {
      specialty = hospital.specialties[num - 1];
    } else {
      extractSpecialty(msg, parsed);
      specialty = parsed.entities.specialty;
    }
    if (!specialty) return { reply: "❌ Please type a number from the list or the specialty name.", context };

    return { reply: `✅ **${specialty}** at ${hospital.name}\n\nNow I need your details to confirm:\n\n👉 **Please provide your full name and phone number.**\n\nExample: \"Muhammad Ali, 0300-1234567\"`, context: { flow:"book_appointment", step:"collect_info", hospitalId:hospital.id, specialty } };
  }

  // STEP: Select Doctor
  if (step === "select_doctor") {
    const docIds = context.doctors;
    const docs = DOCTORS.filter(d => docIds.includes(d.id));
    let doctor;
    if (num && num >= 1 && num <= docs.length) {
      doctor = docs[num - 1];
    } else {
      doctor = docs.find(d => msg.includes(d.name.toLowerCase().split(" ").pop()));
    }
    if (!doctor) return { reply: `❌ Please type a number between 1 and ${docs.length}.`, context };

    const hospital = HOSPITALS.find(h => h.id === doctor.hospitalId);
    const slotList = doctor.slots.map((s,i) => `${i+1}. ${s}`).join("\n");
    return { reply: `✅ **${doctor.name}** - ${doctor.specialty}\n🏥 ${hospital.name}\n💰 Fee: Rs. ${doctor.fee}\n\n**Available Slots:**\n${slotList}\n\n👉 **Which slot?** (Type the number)`, context: { flow:"book_appointment", step:"select_slot", doctorId:doctor.id, hospitalId:hospital.id } };
  }

  // STEP: Select Slot
  if (step === "select_slot") {
    const doctor = DOCTORS.find(d => d.id === context.doctorId);
    let slot;
    if (num && num >= 1 && num <= doctor.slots.length) {
      slot = doctor.slots[num - 1];
    } else {
      slot = doctor.slots.find(s => msg.includes(s.toLowerCase().split(" ")[0]));
    }
    if (!slot) return { reply: `❌ Please type a number between 1 and ${doctor.slots.length}.`, context };

    return { reply: `✅ Slot selected: **${slot}**\n\nAlmost done! I need your details:\n\n👉 **Please type your full name and phone number.**\n\nExample: \"Muhammad Ali, 0300-1234567\"`, context: { flow:"book_appointment", step:"collect_info", doctorId:doctor.id, hospitalId:context.hospitalId, slot } };
  }

  // STEP: Collect patient info
  if (step === "collect_info") {
    // Try to extract name and phone from message
    let patientName = parsed.entities.patientName;
    let phone = parsed.entities.phone;

    // If not extracted via patterns, try comma-separated format
    if (!patientName && !phone) {
      const parts = msg.split(/[,،]/);
      if (parts.length >= 2) {
        patientName = parts[0].trim();
        phone = parts[1].trim().replace(/[^0-9+\-\s]/g, "");
      } else if (msg.match(/[a-zA-Z]/) && msg.match(/\d{10,}/)) {
        patientName = msg.replace(/[\d+\-\s]+/g, "").trim();
        phone = msg.match(/[\d+\-\s]{10,}/)?.[0]?.trim();
      } else {
        patientName = msg;
      }
    }

    if (!patientName || patientName.length < 2) {
      return { reply: "❌ Please provide your **name** and **phone number**.\n\nExample: \"Muhammad Ali, 0300-1234567\"", context };
    }

    // Generate booking
    const bookingId = `APT-${Date.now().toString(36).toUpperCase()}`;
    const hospital = HOSPITALS.find(h => h.id === context.hospitalId);
    const doctor = context.doctorId ? DOCTORS.find(d => d.id === context.doctorId) : null;
    const mapLink = getMapLinkByName(hospital.name, hospital.address);

    let reply = `✅ **APPOINTMENT CONFIRMED!** 🎉\n\n🔖 Booking ID: **${bookingId}**\n👤 Patient: ${patientName}\n📱 Phone: ${phone || "Not provided"}\n🏥 Hospital: ${hospital.name}\n📍 ${hospital.address}\n🗺️ [📍 Open Location in Google Maps](${mapLink})\n📞 Hospital: ${hospital.phone}`;

    if (doctor) {
      reply += `\n👨‍⚕️ Doctor: ${doctor.name}\n🩺 Specialty: ${doctor.specialty}\n💰 Fee: Rs. ${doctor.fee}`;
      if (context.slot) reply += `\n📅 Slot: ${context.slot}`;
    }
    if (context.specialty) reply += `\n🩺 Department: ${context.specialty}`;

    reply += `\n\n📌 **Instructions:**\n• Arrive 15 minutes early\n• Bring CNIC/ID\n• Bring previous medical reports\n• Fee is payable at reception\n\nNeed anything else? Type \"book appointment\" or \"book lab test\"!`;

    return { reply, context: {}, booking: { id:bookingId, patient:patientName, phone, hospital:hospital.name, doctor:doctor?.name, slot:context.slot, status:"confirmed" } };
  }

  return startAppointmentFlow({});
}

// ============================================================
// LAB TEST FLOW (Step by Step)
// ============================================================

function startLabTestFlow(entities) {
  if (entities.lab) {
    const lab = entities.lab;
    const mapLink = getMapLinkByName(lab.name, lab.address);
    const testList = lab.tests.map((t,i) => `${i+1}. ${t}`).join("\n");
    return { reply: `🧪 **${lab.name}**\n📍 ${lab.address}\n📞 ${lab.phone}\n🗺️ [Open in Google Maps](${mapLink})\n${lab.homeCollection ? "🏠 Home collection available!\n" : ""}\n**Available Tests:**\n${testList}\n\n👉 **Which test do you need?** (Type the number)`, context: { flow:"book_lab_test", step:"select_test", labId:lab.id } };
  }

  // Step 1: Show all labs
  const labList = LABS.map((l,i) => `${i+1}. **${l.name}**\n   📍 ${l.areas.slice(0,3).join(", ")}${l.areas.length>3?"...":""}\n   📞 ${l.phone}${l.homeCollection?" | 🏠 Home Collection":""}`).join("\n\n");
  return { reply: `Let's book your lab test! 🧪\n\n**Select a Lab:**\n\n${labList}\n\n👉 **Type the number** of your preferred lab.`, context: { flow:"book_lab_test", step:"select_lab" } };
}

function labTestFlow(parsed, context) {
  const { step } = context;
  const msg = parsed.raw;
  const num = parsed.entities.number;

  // STEP: Select Lab
  if (step === "select_lab") {
    let lab;
    if (num && num >= 1 && num <= LABS.length) {
      lab = LABS[num - 1];
    } else {
      extractLab(msg, parsed);
      lab = parsed.entities.lab;
    }
    if (!lab) return { reply: `❌ Please type a number between 1 and ${LABS.length}, or type the lab name.`, context };

    const mapLink = getMapLinkByName(lab.name, lab.address);
    const testList = lab.tests.map((t,i) => `${i+1}. ${t}`).join("\n");
    return { reply: `✅ **${lab.name}**\n📍 ${lab.address}\n📞 ${lab.phone}\n🗺️ [Open in Google Maps](${mapLink})\n${lab.homeCollection ? "🏠 Home collection available!\n" : ""}\n**Available Tests:**\n${testList}\n\n👉 **Which test?** (Type the number)`, context: { flow:"book_lab_test", step:"select_test", labId:lab.id } };
  }

  // STEP: Select Test
  if (step === "select_test") {
    const lab = LABS.find(l => l.id === context.labId);
    let test;
    if (num && num >= 1 && num <= lab.tests.length) {
      test = lab.tests[num - 1];
    } else {
      test = lab.tests.find(t => msg.includes(t.toLowerCase()));
      if (!test) { extractTestType(msg, parsed); if (parsed.entities.testType) test = lab.tests.find(t => t.toLowerCase().includes(parsed.entities.testType)); }
    }
    if (!test) return { reply: `❌ Please type a number between 1 and ${lab.tests.length}.`, context };

    const prep = TEST_PREPARATIONS[test.toLowerCase()] || TEST_PREPARATIONS[test.toLowerCase().split(" ")[0]] || "No special preparation. Bring CNIC and previous reports.";
    return { reply: `✅ Test: **${test}**\n📋 Preparation: ${prep}\n\n**Select preferred time:**\n1. Morning (8AM - 12PM)\n2. Afternoon (12PM - 4PM)\n3. Evening (4PM - 7PM)\n\n👉 **Type 1, 2, or 3**`, context: { flow:"book_lab_test", step:"select_time", labId:lab.id, test } };
  }

  // STEP: Select Time
  if (step === "select_time") {
    const times = ["Morning (8AM-12PM)", "Afternoon (12PM-4PM)", "Evening (4PM-7PM)"];
    let time;
    if (num && num >= 1 && num <= 3) time = times[num-1];
    else if (msg.includes("morning")) time = times[0];
    else if (msg.includes("afternoon")) time = times[1];
    else if (msg.includes("evening")) time = times[2];
    if (!time) return { reply: "❌ Please type 1 (Morning), 2 (Afternoon), or 3 (Evening).", context };

    return { reply: `✅ Time: **${time}**\n\nAlmost done! I need your details:\n\n👉 **Please type your full name and phone number.**\n\nExample: \"Fatima Ahmed, 0321-9876543\"`, context: { flow:"book_lab_test", step:"collect_info", labId:context.labId, test:context.test, time } };
  }

  // STEP: Collect Info
  if (step === "collect_info") {
    let patientName = parsed.entities.patientName;
    let phone = parsed.entities.phone;

    if (!patientName && !phone) {
      const parts = msg.split(/[,،]/);
      if (parts.length >= 2) {
        patientName = parts[0].trim();
        phone = parts[1].trim().replace(/[^0-9+\-\s]/g, "");
      } else if (msg.match(/[a-zA-Z]/) && msg.match(/\d{10,}/)) {
        patientName = msg.replace(/[\d+\-\s]+/g, "").trim();
        phone = msg.match(/[\d+\-\s]{10,}/)?.[0]?.trim();
      } else {
        patientName = msg;
      }
    }

    if (!patientName || patientName.length < 2) {
      return { reply: "❌ Please provide your **name** and **phone number**.\n\nExample: \"Fatima Ahmed, 0321-9876543\"", context };
    }

    const bookingId = `LAB-${Date.now().toString(36).toUpperCase()}`;
    const lab = LABS.find(l => l.id === context.labId);
    const mapLink = getMapLinkByName(lab.name, lab.address);
    const prep = TEST_PREPARATIONS[context.test.toLowerCase()] || TEST_PREPARATIONS[context.test.toLowerCase().split(" ")[0]] || "No special preparation needed.";

    let reply = `✅ **LAB TEST BOOKED!** 🎉\n\n🔖 Booking ID: **${bookingId}**\n👤 Patient: ${patientName}\n📱 Phone: ${phone || "Not provided"}\n🧪 Lab: ${lab.name}\n🔬 Test: ${context.test}\n⏰ Time: ${context.time}\n📍 ${lab.address}\n🗺️ [📍 Open Location in Google Maps](${mapLink})\n📞 Lab: ${lab.phone}`;
    if (lab.homeCollection) reply += `\n🏠 Home collection available - call ${lab.phone}`;
    reply += `\n\n📋 **Preparation:**\n${prep}\n\n📌 **Instructions:**\n• Bring CNIC/ID\n• Bring previous reports if any\n• Arrive 10 minutes early\n• Follow preparation instructions above\n\nNeed anything else?`;

    return { reply, context: {}, booking: { id:bookingId, patient:patientName, phone, lab:lab.name, test:context.test, time:context.time, status:"confirmed" } };
  }

  return startLabTestFlow({});
}

// ============================================================
// OTHER HANDLERS
// ============================================================

function findDoctor(entities) {
  const { specialty } = entities;
  if (specialty) {
    const docs = DOCTORS.filter(d => d.specialty === specialty);
    if (docs.length > 0) {
      const docList = docs.map((d,i) => {
        const h = HOSPITALS.find(h => h.id === d.hospitalId);
        return `${i+1}. **${d.name}**\n   🏥 ${h.name} (${h.area})\n   💰 Rs. ${d.fee === 0 ? "Free" : d.fee}\n   📅 ${d.slots.join(", ")}`;
      }).join("\n\n");
      return { reply: `**${specialty} Specialists in Lahore (${docs.length} doctors):**\n\n${docList}\n\n👉 Say \"book appointment\" to schedule with any of them!`, context: {} };
    }
    const hosps = HOSPITALS.filter(h => h.specialties.includes(specialty));
    const list = hosps.map((h,i) => `${i+1}. ${h.name} (${h.area}) - 📞 ${h.phone}`).join("\n");
    return { reply: `Hospitals with **${specialty}** department:\n\n${list}\n\n👉 Say \"book appointment at [hospital name]\" to proceed!`, context: {} };
  }

  // No specialty specified - show specialties as numbered list for selection
  const specialties = [...new Set(DOCTORS.map(d => d.specialty))].sort();
  const specData = specialties.map((spec, i) => {
    const count = DOCTORS.filter(d => d.specialty === spec).length;
    let emoji = "🩺";
    switch(spec) {
      case "Cardiology": emoji = "❤️"; break;
      case "Cardiac Surgery": emoji = "💓"; break;
      case "Orthopedics": emoji = "🦴"; break;
      case "Gynecology": emoji = "👩"; break;
      case "Dermatology": emoji = "🧴"; break;
      case "Neurology": emoji = "🧠"; break;
      case "Neurosurgery": emoji = "🧠"; break;
      case "Gastroenterology": emoji = "🫁"; break;
      case "General Medicine": emoji = "🩺"; break;
      case "General Surgery": emoji = "🔪"; break;
      case "Urology": emoji = "🫘"; break;
      case "Pediatrics": emoji = "👶"; break;
      case "ENT": emoji = "👂"; break;
      case "Ophthalmology": emoji = "👁️"; break;
      case "Oncology": emoji = "🎗️"; break;
      case "Psychiatry": emoji = "🧘"; break;
      case "Internal Medicine": emoji = "🏥"; break;
    }
    return `${i+1}. ${emoji} **${spec}** (${count} doctors)`;
  });

  return { reply: `👨‍⚕️ **FIND A DOCTOR - Select Specialty**\n\nTotal: ${DOCTORS.length} doctors registered in Lahore\n\n${specData.join("\n")}\n\n👉 **Type the number** to see all doctors in that specialty.`, context: { flow:"find_doctor", step:"select_specialty", specialties } };
}

function findDoctorFlow(parsed, context) {
  const { step } = context;
  const msg = parsed.raw;
  const num = parsed.entities.number;

  if (step === "select_specialty") {
    const specialties = context.specialties;
    let selectedSpecialty;

    if (num && num >= 1 && num <= specialties.length) {
      selectedSpecialty = specialties[num - 1];
    } else {
      // Try to match by name
      extractSpecialty(msg, parsed);
      selectedSpecialty = parsed.entities.specialty;
    }

    if (!selectedSpecialty) {
      return { reply: `❌ Please type a number between 1 and ${specialties.length}, or type the specialty name.`, context };
    }

    const docs = DOCTORS.filter(d => d.specialty === selectedSpecialty);
    if (docs.length > 0) {
      let emoji = "🩺";
      switch(selectedSpecialty) {
        case "Cardiology": emoji = "❤️"; break;
        case "Cardiac Surgery": emoji = "💓"; break;
        case "Orthopedics": emoji = "🦴"; break;
        case "Gynecology": emoji = "👩"; break;
        case "Dermatology": emoji = "🧴"; break;
        case "Neurology": emoji = "🧠"; break;
        case "Neurosurgery": emoji = "🧠"; break;
        case "Gastroenterology": emoji = "🫁"; break;
        case "General Medicine": emoji = "🩺"; break;
        case "General Surgery": emoji = "🔪"; break;
        case "Urology": emoji = "🫘"; break;
        case "Pediatrics": emoji = "👶"; break;
        case "ENT": emoji = "👂"; break;
        case "Ophthalmology": emoji = "👁️"; break;
        case "Oncology": emoji = "🎗️"; break;
        case "Psychiatry": emoji = "🧘"; break;
        case "Internal Medicine": emoji = "🏥"; break;
      }

      const docList = docs.map((d,i) => {
        const h = HOSPITALS.find(h => h.id === d.hospitalId);
        return `${i+1}. **${d.name}**\n   🏥 ${h.name} (${h.area})\n   💰 Fee: Rs. ${d.fee === 0 ? "Free" : d.fee}\n   📅 Available: ${d.slots.join(", ")}`;
      }).join("\n\n");

      return { reply: `${emoji} **${selectedSpecialty} Specialists in Lahore (${docs.length} doctors):**\n\n${docList}\n\n👉 Say \"book appointment\" to schedule with any doctor\n👉 Or type \"find doctor\" to go back to specialties`, context: {} };
    }
  }

  return findDoctor({});
}

function findHospital(entities) {
  const { area } = entities;
  if (area) {
    const filtered = HOSPITALS.filter(h => h.area.toLowerCase().includes(area.toLowerCase()));
    if (filtered.length > 0) {
      const list = filtered.map((h,i) => {
        const mapLink = getMapLinkByName(h.name, h.address);
        return `${i+1}. **${h.name}** (${h.type})\n   📍 ${h.address}\n   📞 ${h.phone}\n   🗺️ [Google Maps](${mapLink})`;
      }).join("\n\n");
      return { reply: `🏥 Hospitals in **${area}**:\n\n${list}\n\n👉 Say \"book appointment at [name]\" to book!`, context: {} };
    }
  }
  const govt = HOSPITALS.filter(h => h.type==="Government");
  const pvt = HOSPITALS.filter(h => h.type==="Private");
  const other = HOSPITALS.filter(h => !["Government","Private"].includes(h.type));
  let reply = "🏥 **All Hospitals in Lahore:**\n\n**🏛️ Government:**\n" + govt.map((h,i) => `${i+1}. ${h.name} - ${h.area} (📞 ${h.phone})`).join("\n");
  reply += "\n\n**🏨 Private:**\n" + pvt.map((h,i) => `${i+1}. ${h.name} - ${h.area} (📞 ${h.phone})`).join("\n");
  reply += "\n\n**🏥 Trust/Military:**\n" + other.map((h,i) => `${i+1}. ${h.name} - ${h.area} (📞 ${h.phone})`).join("\n");
  reply += "\n\n👉 Say \"hospitals in [area]\" to filter, or \"book appointment\" to start booking!";
  return { reply, context: {} };
}

function findLab(entities) {
  const { area } = entities;
  if (area) {
    const filtered = LABS.filter(l => l.areas.some(a => a.toLowerCase().includes(area.toLowerCase())));
    if (filtered.length > 0) {
      const list = filtered.map((l,i) => {
        const mapLink = getMapLinkByName(l.name, l.address);
        return `${i+1}. **${l.name}**\n   📍 ${l.address}\n   📞 ${l.phone}\n   🗺️ [Google Maps](${mapLink})\n   ${l.homeCollection?"🏠 Home Collection Available":""}`;
      }).join("\n\n");
      return { reply: `🧪 Labs in **${area}**:\n\n${list}\n\n👉 Say \"book lab test\" to book!`, context: {} };
    }
  }
  const list = LABS.map((l,i) => {
    const mapLink = getMapLinkByName(l.name, l.address);
    return `${i+1}. **${l.name}**\n   📍 ${l.areas.slice(0,3).join(", ")}...\n   📞 ${l.phone}\n   🗺️ [Google Maps](${mapLink})${l.homeCollection?" | 🏠 Home Collection":""}`;
  }).join("\n\n");
  return { reply: `🧪 **All Labs in Lahore:**\n\n${list}\n\n👉 Say \"labs in [area]\" to filter, or \"book lab test\" to start!`, context: {} };
}

function testPreparation(entities) {
  if (entities.testType) {
    const prep = TEST_PREPARATIONS[entities.testType];
    if (prep) return { reply: `📋 **Preparation for ${entities.testType.toUpperCase()}:**\n\n${prep}\n\n**General Tips:**\n• Bring CNIC\n• Bring previous reports\n• Arrive early\n\n👉 Want to book this test? Say \"book lab test\"`, context: {} };
  }
  const all = Object.entries(TEST_PREPARATIONS).map(([t,p]) => `• **${t.toUpperCase()}**: ${p}`).join("\n");
  return { reply: `📋 **Test Preparation Guide:**\n\n${all}\n\n👉 Which test? Or say \"book lab test\" to book.`, context: {} };
}

function cancel() { return { reply: "❌ To cancel, please provide your **Booking ID** (APT-xxx or LAB-xxx).\n\nOr call the hospital/lab directly.", context: {} }; }
function reschedule() { return { reply: "🔄 To reschedule, provide your **Booking ID** and new preferred time.\n\nOr call the facility directly.", context: {} }; }
function checkStatus() { return { reply: "📋 Provide your **Booking ID** to check status.\n\nOr call:\n• Chughtai: 042-111-456-789\n• Excel: 042-111-392-352", context: {} }; }

function unknownIntent(entities) {
  if (entities.specialty) return findDoctor(entities);
  if (entities.hospital) return startAppointmentFlow(entities);
  if (entities.lab) return startLabTestFlow(entities);
  return { reply: "I'm not sure what you need. Try:\n\n1️⃣ \"Book appointment\"\n2️⃣ \"Book lab test\"\n3️⃣ \"Find cardiologist\"\n4️⃣ \"Hospitals in DHA\"\n5️⃣ \"Labs\"\n6️⃣ \"Emergency\"\n7️⃣ \"Check symptoms\" (describe how you feel)\n8️⃣ \"Medicine info\" (ask about any medicine)\n9️⃣ \"First aid\" (emergency guidance)\n\nOr type \"help\" for full guide!", context: {} };
}

// ============================================================
// MACHINE LEARNING MODULE - Learn from mistakes
// ============================================================

// In-memory learning store (persists during Lambda warm starts)
const LEARNING_STORE = {
  // Patterns learned from user corrections
  learnedPatterns: [],
  // Track unknown queries to find common patterns
  unknownQueries: [],
  // User feedback on responses
  feedback: [],
  // Symptom-condition mappings learned over time
  symptomMap: {
    "headache": { conditions: ["Tension headache", "Migraine", "Dehydration", "Eye strain", "Sinusitis"], advice: "Rest in a dark room, stay hydrated, take paracetamol if needed. See a doctor if persistent for 3+ days." },
    "fever": { conditions: ["Viral infection", "Flu", "Dengue", "UTI", "COVID-19"], advice: "Take paracetamol (500mg), stay hydrated, rest. See a doctor if fever exceeds 103°F or lasts 3+ days." },
    "cough": { conditions: ["Common cold", "Bronchitis", "Allergies", "Asthma", "COVID-19"], advice: "Drink warm fluids, honey with warm water, avoid cold drinks. See a doctor if cough has blood or lasts 2+ weeks." },
    "stomach pain": { conditions: ["Gastritis", "Food poisoning", "IBS", "Appendicitis", "Ulcer"], advice: "Avoid spicy food, take antacid, drink warm water. See a doctor immediately if pain is severe or in lower right." },
    "chest pain": { conditions: ["Muscle strain", "Acid reflux", "Anxiety", "Heart attack"], advice: "⚠️ If severe with shortness of breath, call 1122 IMMEDIATELY. Could be cardiac emergency." },
    "back pain": { conditions: ["Muscle strain", "Disc problem", "Poor posture", "Kidney issue"], advice: "Apply warm compress, gentle stretching, avoid heavy lifting. See orthopedic if persistent." },
    "sore throat": { conditions: ["Viral infection", "Tonsillitis", "Strep throat", "Allergies"], advice: "Gargle with warm salt water, drink warm fluids, take lozenges. See ENT if lasts 5+ days." },
    "dizziness": { conditions: ["Low blood pressure", "Dehydration", "Anemia", "Inner ear issue", "Low blood sugar"], advice: "Sit down immediately, drink water, eat something sweet. See a doctor if frequent." },
    "fatigue": { conditions: ["Anemia", "Thyroid disorder", "Vitamin D deficiency", "Depression", "Diabetes"], advice: "Get blood tests (CBC, Thyroid, Vitamin D, Sugar). Ensure 7-8 hours sleep." },
    "joint pain": { conditions: ["Arthritis", "Gout", "Injury", "Vitamin D deficiency"], advice: "Rest the joint, apply ice, take pain reliever. See orthopedic if swelling persists." },
    "breathing difficulty": { conditions: ["Asthma", "Anxiety", "Pneumonia", "Heart failure"], advice: "⚠️ If severe, call 1122. Sit upright, try to stay calm. Use inhaler if prescribed." },
    "skin rash": { conditions: ["Allergic reaction", "Eczema", "Fungal infection", "Contact dermatitis"], advice: "Avoid scratching, apply calamine lotion, take antihistamine. See dermatologist if spreading." },
    "nausea": { conditions: ["Food poisoning", "Gastritis", "Pregnancy", "Migraine", "Medication side effect"], advice: "Sip ginger tea, eat bland food (crackers), avoid strong smells. See doctor if vomiting blood." },
    "dehydration": { conditions: ["Diarrhea", "Vomiting", "Heat exposure", "Not drinking enough water"], advice: "Drink ORS solution, small sips frequently. Signs: dry mouth, dark urine, dizziness. ER if severe." },
  },
  // Medicine information database
  medicines: {
    "paracetamol": { use: "Pain relief, fever reduction", dose: "500mg-1000mg every 4-6 hours (max 4g/day)", sideEffects: "Rare at normal doses. Liver damage if overdosed.", warning: "Do not exceed 4g/day. Avoid with alcohol." },
    "ibuprofen": { use: "Pain, inflammation, fever", dose: "200-400mg every 4-6 hours with food", sideEffects: "Stomach upset, ulcers with long use", warning: "Take with food. Avoid if kidney problems or stomach ulcers." },
    "amoxicillin": { use: "Bacterial infections", dose: "As prescribed by doctor (usually 500mg 3x/day)", sideEffects: "Diarrhea, nausea, rash", warning: "Complete full course. Tell doctor if allergic to penicillin." },
    "omeprazole": { use: "Acid reflux, stomach ulcers", dose: "20mg once daily before breakfast", sideEffects: "Headache, nausea, vitamin B12 deficiency with long use", warning: "Take 30 min before food. Not for long-term use without doctor." },
    "metformin": { use: "Type 2 diabetes", dose: "As prescribed (usually 500mg-2000mg/day)", sideEffects: "Nausea, diarrhea initially", warning: "Take with meals. Monitor blood sugar regularly." },
    "cetirizine": { use: "Allergies, hay fever, hives", dose: "10mg once daily", sideEffects: "Drowsiness, dry mouth", warning: "May cause drowsiness. Avoid driving if affected." },
    "aspirin": { use: "Pain, fever, blood thinning", dose: "300-600mg every 4-6 hours for pain", sideEffects: "Stomach irritation, bleeding risk", warning: "Not for children under 16. Take with food." },
  },
  // First aid guides
  firstAid: {
    "burn": "🔥 **Burns First Aid:**\n1. Cool under running water for 20 minutes\n2. Remove jewelry/clothing near burn\n3. Cover with clean cling film or non-fluffy dressing\n4. Do NOT apply ice, butter, or toothpaste\n5. Take paracetamol for pain\n⚠️ Call 1122 if burn is larger than palm or on face/hands",
    "choking": "🫁 **Choking First Aid:**\n1. Encourage coughing\n2. Give 5 back blows between shoulder blades\n3. Give 5 abdominal thrusts (Heimlich maneuver)\n4. Alternate back blows and thrusts\n5. Call 1122 if person becomes unconscious",
    "bleeding": "🩸 **Bleeding First Aid:**\n1. Apply firm pressure with clean cloth\n2. Keep pressing for at least 10 minutes\n3. Elevate the injured area above heart\n4. Do NOT remove the cloth if blood soaks through — add more\n5. Call 1122 if bleeding won't stop",
    "fracture": "🦴 **Fracture First Aid:**\n1. Do NOT move the injured area\n2. Support with padding/pillows\n3. Apply ice wrapped in cloth (not directly)\n4. Do NOT try to straighten the bone\n5. Call 1122 or go to ER immediately",
    "heart attack": "❤️ **Heart Attack Signs & First Aid:**\nSigns: Chest pain/pressure, pain in arm/jaw, shortness of breath, sweating\n1. Call 1122 IMMEDIATELY\n2. Have person sit/lie down\n3. Give aspirin (300mg) to chew if available\n4. Loosen tight clothing\n5. Be ready to perform CPR if they become unresponsive",
    "seizure": "⚡ **Seizure First Aid:**\n1. Clear area of dangerous objects\n2. Cushion their head\n3. Do NOT put anything in their mouth\n4. Do NOT restrain them\n5. Time the seizure\n6. Call 1122 if seizure lasts 5+ minutes or first seizure",
    "fainting": "😵 **Fainting First Aid:**\n1. Lay person flat, raise legs above heart level\n2. Loosen tight clothing\n3. Check breathing\n4. When they wake, keep lying down for 10 min\n5. Give water when fully conscious\n6. See doctor if frequent fainting",
  },
  // Confidence scores for learned patterns
  confidenceThreshold: 0.6,
};

// Simple similarity scoring (Jaccard-like)
function calculateSimilarity(str1, str2) {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = new Set(str2.toLowerCase().split(/\s+/));
  const intersection = [...words1].filter(w => words2.has(w));
  const union = new Set([...words1, ...words2]);
  return intersection.length / union.size;
}

// Learn from unknown queries - find patterns
function learnFromUnknown(message, context) {
  LEARNING_STORE.unknownQueries.push({
    message: message.toLowerCase(),
    timestamp: Date.now(),
    context: context
  });

  // Keep only last 200 unknown queries
  if (LEARNING_STORE.unknownQueries.length > 200) {
    LEARNING_STORE.unknownQueries = LEARNING_STORE.unknownQueries.slice(-200);
  }

  // Try to find similar past queries that were resolved
  for (const pattern of LEARNING_STORE.learnedPatterns) {
    const sim = calculateSimilarity(message, pattern.trigger);
    if (sim >= LEARNING_STORE.confidenceThreshold) {
      return { matched: true, response: pattern.response, confidence: sim };
    }
  }
  return { matched: false };
}

// Record user feedback for learning
function recordFeedback(message, wasHelpful, correction) {
  LEARNING_STORE.feedback.push({
    message,
    wasHelpful,
    correction,
    timestamp: Date.now()
  });

  // If user provided a correction, learn from it
  if (correction && !wasHelpful) {
    LEARNING_STORE.learnedPatterns.push({
      trigger: message.toLowerCase(),
      response: correction,
      confidence: 0.7,
      learnedAt: Date.now()
    });
  }
}

// Handle medical assistant queries (symptoms, medicine, first aid)
function handleMedicalAssistant(message) {
  const msg = message.toLowerCase();

  // Check symptoms
  for (const [symptom, data] of Object.entries(LEARNING_STORE.symptomMap)) {
    if (msg.includes(symptom)) {
      const conditions = data.conditions.map((c, i) => `${i+1}. ${c}`).join("\n");
      return {
        reply: `🩺 **Symptom: ${symptom.charAt(0).toUpperCase() + symptom.slice(1)}**\n\n**Possible causes:**\n${conditions}\n\n**Advice:** ${data.advice}\n\n⚠️ This is not a diagnosis. Please consult a doctor for proper evaluation.\n\n👉 Want me to find a specialist? Say \"find doctor\"`,
        context: {},
        handled: true
      };
    }
  }

  // Check medicine queries
  if (msg.includes("medicine") || msg.includes("medication") || msg.includes("drug") || msg.includes("tablet") || msg.includes("dose")) {
    for (const [med, info] of Object.entries(LEARNING_STORE.medicines)) {
      if (msg.includes(med)) {
        return {
          reply: `💊 **${med.charAt(0).toUpperCase() + med.slice(1)}**\n\n**Use:** ${info.use}\n**Dosage:** ${info.dose}\n**Side Effects:** ${info.sideEffects}\n**⚠️ Warning:** ${info.warning}\n\n⚠️ Always consult your doctor before taking any medication.`,
          context: {},
          handled: true
        };
      }
    }
    // Generic medicine info request
    const medList = Object.keys(LEARNING_STORE.medicines).map(m => `• ${m.charAt(0).toUpperCase() + m.slice(1)}`).join("\n");
    return {
      reply: `💊 **Medicine Information**\n\nI can provide info about:\n${medList}\n\n👉 Type the medicine name to learn more.\n\n⚠️ Always consult your doctor before taking any medication.`,
      context: {},
      handled: true
    };
  }

  // Check specific first aid topics (before generic first aid check)
  for (const [topic, guide] of Object.entries(LEARNING_STORE.firstAid)) {
    if (msg.includes(topic)) {
      return { reply: guide + "\n\n⚠️ Always call 1122 for serious emergencies.", context: {}, handled: true };
    }
  }

  // Check first aid queries (generic)
  if (msg.includes("first aid") || msg.includes("what to do") || msg.includes("how to help")) {
    const topics = Object.keys(LEARNING_STORE.firstAid).map(t => `• ${t.charAt(0).toUpperCase() + t.slice(1)}`).join("\n");
    return {
      reply: `🏥 **First Aid Guide**\n\nI can help with:\n${topics}\n\n👉 Type the situation (e.g., \"burn first aid\", \"choking\")`,
      context: {},
      handled: true
    };
  }

  // Health questions
  if (msg.includes("when to see a doctor") || msg.includes("when should i see")) {
    return {
      reply: "🏥 **When to See a Doctor:**\n\n• Fever above 103°F for 2+ days\n• Unexplained weight loss\n• Persistent pain lasting 1+ week\n• Blood in stool/urine/cough\n• Difficulty breathing\n• Chest pain or pressure\n• Sudden severe headache\n• Vision changes\n• Fainting or seizures\n• Wound that won't heal\n\n👉 Want me to find a doctor? Say \"find doctor\" or \"book appointment\"",
      context: {},
      handled: true
    };
  }

  if (msg.includes("reduce fever") || msg.includes("lower fever") || msg.includes("bring down fever")) {
    return {
      reply: "🌡️ **How to Reduce Fever:**\n\n1. Take paracetamol (500mg-1000mg)\n2. Drink plenty of fluids (water, ORS, juices)\n3. Rest in a cool room\n4. Use a damp cloth on forehead\n5. Wear light clothing\n6. Take a lukewarm (not cold) bath\n\n⚠️ See a doctor if:\n• Fever exceeds 103°F (39.4°C)\n• Lasts more than 3 days\n• Accompanied by rash, stiff neck, or confusion\n\n👉 Want to book a doctor? Say \"book appointment\"",
      context: {},
      handled: true
    };
  }

  return { handled: false };
}


// ============================================================
// MAIN LAMBDA HANDLER
// ============================================================

export const handler = async (event) => {
  const headers = { "Content-Type": "application/json" };
  const method = event.requestContext?.http?.method || event.httpMethod || "POST";

  if (method === "OPTIONS") return { statusCode:200, headers, body:"" };
  if (method === "GET") return { statusCode:200, headers, body:JSON.stringify({service:"CureBot",version:"4.0",status:"active",hospitals:HOSPITALS.length,labs:LABS.length,doctors:DOCTORS.length,mlPatterns:LEARNING_STORE.learnedPatterns.length,knownSymptoms:Object.keys(LEARNING_STORE.symptomMap).length}) };

  try {
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const message = body?.message;
    const context = body?.context || {};

    if (!message || typeof message !== "string") {
      return { statusCode:400, headers, body:JSON.stringify({error:"Send: {\"message\":\"your text\", \"context\":{}}"}) };
    }

    // Handle feedback messages (learning from user corrections)
    if (message.startsWith("__feedback:")) {
      const parts = message.split(":");
      const wasHelpful = parts[1] === "yes";
      const correction = parts[2] || null;
      recordFeedback(context.lastMessage || "", wasHelpful, correction);
      return { statusCode:200, headers, body:JSON.stringify({ reply: wasHelpful ? "Thanks for the feedback! 😊" : "Sorry about that. I'll try to do better next time! 🙏", context: {} }) };
    }

    // First, try the medical assistant (symptoms, medicine, first aid)
    const medResult = handleMedicalAssistant(message);
    if (medResult.handled) {
      return { statusCode:200, headers, body:JSON.stringify({ reply: medResult.reply, context: { lastMessage: message } }) };
    }

    // Try ML-powered medical Q&A (before standard parsing, but not during active flows)
    const activeFlow = context.flow;
    if (!activeFlow && isMedicalQuestion(message)) {
      const mlAnswer = findAnswer(message);
      if (mlAnswer) {
        return { statusCode:200, headers, body:JSON.stringify({ reply: mlAnswer, context: { lastMessage: message } }) };
      }
    }

    // Standard NLP parsing
    const parsed = parseMessage(message);

    // If intent is unknown, try ML learning store
    if (parsed.intent === "unknown") {
      const learned = learnFromUnknown(message, context);
      if (learned.matched) {
        return { statusCode:200, headers, body:JSON.stringify({ reply: learned.response + `\n\n_(Confidence: ${Math.round(learned.confidence*100)}%)_`, context: { lastMessage: message } }) };
      }
    }

    const result = handleConversation(parsed, context);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: result.reply,
        context: { ...(result.context || {}), lastMessage: message },
        ...(result.booking && { booking: result.booking }),
      }),
    };
  } catch (err) {
    return { statusCode:400, headers, body:JSON.stringify({error:"Invalid request. Send: {\"message\":\"text\",\"context\":{}}"}) };
  }
};
