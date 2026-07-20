import { Sparkles, Printer, CheckCircle, ShieldCheck, Mail, Calendar, Clock, DollarSign } from 'lucide-react';
import { Appointment, Doctor, Department } from '../types';

interface ReceiptDownloadProps {
  appointment: Appointment;
  doctor?: Doctor;
  department?: Department;
  clinicName: string;
}

export default function ReceiptDownload({
  appointment,
  doctor,
  department,
  clinicName
}: ReceiptDownloadProps) {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(appointment.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-xl mx-auto bg-white text-slate-800 p-8 rounded-3xl border border-slate-200 shadow-xl text-left space-y-6 print:border-none print:shadow-none">
      
      {/* Brand Header */}
      <div className="flex justify-between items-start pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-teal-600 mb-1">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4.5 h-4.5 fill-white/10" />
            </div>
            <span className="font-bold tracking-tight text-slate-900">{clinicName}</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Official Project Booking Receipt</span>
        </div>
        
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400">INVOICE NO</p>
          <p className="text-sm font-extrabold text-slate-950 uppercase">{appointment.id.replace('apt_', 'REC-')}</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Client Details</p>
          <p className="font-bold text-slate-900">{appointment.patientName}</p>
          <p className="text-slate-500">{appointment.patientEmail}</p>
          <p className="text-slate-500">{appointment.patientPhone}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction Details</p>
          <p className="font-semibold text-slate-700">Date Issued: {formattedDate}</p>
          <p className="font-bold text-teal-600 flex items-center gap-1 justify-end mt-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Retainer Paid Online
          </p>
        </div>
      </div>

      {/* Consultation Summary */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Service Breakdown</h4>
        <div className="space-y-3.5 text-xs">
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-900">Expert Strategy & Consultation Session</p>
              <p className="text-slate-500">{doctor ? doctor.name : 'Lead Consultant'} ({doctor ? doctor.specialization : 'Expert Specialist'})</p>
            </div>
            <p className="font-extrabold text-slate-900">${appointment.fee || (doctor ? doctor.fee : 120)}</p>
          </div>

          <div className="flex justify-between items-center border-t border-slate-200/60 pt-3">
            <div>
              <p className="font-bold text-slate-900">Service Group</p>
              <p className="text-slate-500">{department ? department.name : 'Digital Agency Services'}</p>
            </div>
            <p className="text-slate-500 font-semibold">Included</p>
          </div>

          <div className="flex justify-between items-center border-t border-slate-200/60 pt-3">
            <div>
              <p className="font-bold text-slate-900">Scheduled Consulting Slot</p>
              <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                {appointment.date}
                <Clock className="w-3.5 h-3.5 text-teal-600 ml-1.5" />
                {appointment.timeSlot}
              </p>
            </div>
            <p className="text-slate-500 font-semibold">Confirmed</p>
          </div>

        </div>
      </div>

      {/* Grand Total Area */}
      <div className="flex justify-between items-center border-t-2 border-dashed border-slate-200 pt-5">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Total Retainer Paid</p>
          <p className="text-[10px] text-slate-400 mt-1">WebMagpie agency transaction handling fee is fully waived.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-slate-950">${appointment.fee || (doctor ? doctor.fee : 120)}</p>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block mt-0.5 bg-teal-50 px-2 py-0.5 rounded-md inline-block">Authorized Payment</span>
        </div>
      </div>

      {/* Footer Security Badge */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-500">
        <ShieldCheck className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-slate-800">Secure Consultation Receipt</p>
          <p>Please keep this digital receipt or calendar entry. Your consultant will initiate the secure link or conference meeting at the scheduled hour.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 print:hidden justify-center">
        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-md shadow-teal-600/15"
        >
          <Printer className="w-4 h-4" />
          Print / PDF Export
        </button>
      </div>

    </div>
  );
}
