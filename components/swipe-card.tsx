'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, DollarSign, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SwipeCardProps {
  college: any;
  onSwipe: (direction: 'left' | 'right', collegeId: string) => void;
  active: boolean; // Is it the top card?
}

export function SwipeCard({ college, onSwipe, active }: SwipeCardProps) {
  const [exitX, setExitX] = useState<number | null>(null);
  const x = useMotionValue(0);
  
  // Transform x to rotate
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  // Opacity of the "SAVE" and "PASS" stamps
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      setExitX(1000); // animate to the right
      onSwipe('right', college.id);
    } else if (info.offset.x < -swipeThreshold) {
      setExitX(-1000); // animate to the left
      onSwipe('left', college.id);
    }
  };

  // Generate a consistent but random-looking gradient based on college name length
  const gradients = [
    'from-blue-500 to-purple-600',
    'from-emerald-400 to-cyan-500',
    'from-orange-400 to-rose-500',
    'from-pink-500 to-violet-600',
    'from-indigo-500 to-blue-600'
  ];
  const gradient = gradients[college.name.length % gradients.length];

  const placement = college.placements?.[0];
  const course = college.courses?.[0];

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full shadow-2xl rounded-3xl overflow-hidden bg-white border border-gray-200 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, touchAction: 'none' }}
      drag={active ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX !== null ? exitX : 0, scale: active ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      exit={{ opacity: 0, scale: 0.8 }}
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ opacity: 1 }}
    >
      {/* "SAVE" Stamp */}
      <motion.div
        className="absolute top-10 left-8 z-10 border-4 border-green-500 text-green-500 font-black text-4xl rounded-lg px-4 py-2 rotate-[-15deg]"
        style={{ opacity: likeOpacity }}
      >
        SAVE
      </motion.div>

      {/* "PASS" Stamp */}
      <motion.div
        className="absolute top-10 right-8 z-10 border-4 border-red-500 text-red-500 font-black text-4xl rounded-lg px-4 py-2 rotate-[15deg]"
        style={{ opacity: passOpacity }}
      >
        PASS
      </motion.div>

      {/* Hero Image Gradient */}
      <div className={`h-1/2 w-full bg-gradient-to-br ${gradient} flex items-center justify-center p-8 relative`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <h2 className="text-white text-3xl font-bold text-center z-10 drop-shadow-md leading-tight">
          {college.name}
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 h-1/2 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">{college.city}, {college.state}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {placement && (
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <div className="flex items-center gap-1.5 text-blue-700 font-semibold mb-1">
                  <Briefcase className="h-4 w-4" /> Avg Package
                </div>
                <div className="text-xl font-bold text-gray-900">{placement.avgPackage} LPA</div>
              </div>
            )}
            
            {course && (
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mb-1">
                  <DollarSign className="h-4 w-4" /> Total Fees
                </div>
                <div className="text-xl font-bold text-gray-900">₹{(course.totalFees / 100000).toFixed(1)}L</div>
              </div>
            )}
          </div>
          
          {placement?.topRecruiters && (
             <div className="mt-4">
               <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Top Recruiters</span>
               <div className="flex flex-wrap gap-2 mt-2">
                 {JSON.parse(placement.topRecruiters).slice(0, 3).map((rec: string) => (
                   <Badge key={rec} variant="secondary" className="bg-gray-100">{rec}</Badge>
                 ))}
               </div>
             </div>
          )}
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <button 
             onClick={() => { setExitX(-1000); onSwipe('left', college.id); }}
             className="w-14 h-14 bg-white border-2 border-red-100 text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <button 
             onClick={() => { setExitX(1000); onSwipe('right', college.id); }}
             className="w-14 h-14 bg-white border-2 border-green-100 text-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-50 transition-colors"
          >
            <Check className="h-6 w-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
