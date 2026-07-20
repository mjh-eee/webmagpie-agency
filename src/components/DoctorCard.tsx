import React from 'react';
import { Star, Calendar, Clock, DollarSign, Award } from 'lucide-react';
import { Doctor, Department } from '../types';

interface DoctorCardProps {
  key?: React.Key;
  doctor: Doctor;
  department?: Department;
  onBook: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, department, onBook }: DoctorCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all duration-300 overflow-hidden flex flex-col h-full text-left">
      {/* Doctor Image & rating badge */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <img
          src={doctor.image}
          alt={doctor.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-950/90 text-amber-500 text-xs font-bold shadow-sm backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 fill-amber-500" />
          <span>{doctor.rating.toFixed(1)}</span>
        </div>
        {department && (
          <div className="absolute bottom-4 left-4 inline-flex px-2.5 py-1 rounded-lg bg-teal-600/90 text-white text-xs font-bold shadow-sm backdrop-blur-sm">
            {department.name}
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white line-clamp-1">
            {doctor.name}
          </h3>
          <p className="text-xs font-semibold text-teal-600 dark:text-teal-400">
            {doctor.specialization}
          </p>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed flex-grow">
          {doctor.bio}
        </p>

        {/* Dynamic Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-50 dark:border-slate-800/80 py-3">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Award className="w-4 h-4 text-slate-400" />
            <span>{doctor.experience} yrs exp</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Star className="w-4 h-4 text-slate-400 fill-amber-500/10" />
            <span>{doctor.consultations}+ projects</span>
          </div>
        </div>

        {/* Schedule & pricing info */}
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-500" />
            <span className="line-clamp-1">{doctor.availableDays.join(', ')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            <span>{doctor.availableSlots[0]} - {doctor.availableSlots[doctor.availableSlots.length - 1]}</span>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold leading-none">Consultation Fee</span>
            <span className="text-xl font-black text-slate-950 dark:text-white leading-tight">${doctor.fee}</span>
          </div>

          <button
            onClick={() => onBook(doctor)}
            className="px-4.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/10 active:scale-95 transition-all cursor-pointer"
          >
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
}
