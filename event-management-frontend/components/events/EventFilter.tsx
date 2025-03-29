'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

interface EventFilterProps {
  onFilter: (filters: {
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
    priceRange?: [number, number];
    sortBy?: 'date' | 'price' | 'seats';
    sortOrder?: 'asc' | 'desc';
  }) => void;
}

export function EventFilter({ onFilter }: EventFilterProps) {
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleApplyFilters = () => {
    onFilter({
      search,
      dateFrom,
      dateTo,
      sortBy: sortBy as 'date' | 'price' | 'seats',
      sortOrder
    });
  };

  return (
    <div className="backdrop-blur-lg bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-700 mb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
          Filter Events
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Search Input */}
        <div className="w-full">
          <Input 
            placeholder="Search events..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-900/60 border-gray-700 placeholder-gray-500 text-gray-200 focus:border-indigo-500 rounded-xl h-12 w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date From Filter */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal h-12 rounded-xl",
                    "bg-gray-900/60 border-gray-700 text-gray-200",
                    !dateFrom && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  {dateFrom ? format(dateFrom, "PPP") : <span>From Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="bg-gray-800 text-gray-200"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To Filter */}
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal h-12 rounded-xl",
                    "bg-gray-900/60 border-gray-700 text-gray-200",
                    !dateTo && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  {dateTo ? format(dateTo, "PPP") : <span>To Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="bg-gray-800 text-gray-200"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sort By */}
          <div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-gray-900/60 border-gray-700 text-gray-200 focus:border-indigo-500 rounded-xl h-12 w-full">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                <SelectItem value="date" className="focus:bg-gray-700">Date</SelectItem>
                <SelectItem value="price" className="focus:bg-gray-700">Price</SelectItem>
                <SelectItem value="seats" className="focus:bg-gray-700">Available Seats</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <Select 
              value={sortOrder} 
              onValueChange={(val) => setSortOrder(val as 'asc' | 'desc')}
            >
              <SelectTrigger className="bg-gray-900/60 border-gray-700 text-gray-200 focus:border-indigo-500 rounded-xl h-12 w-full">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                <SelectItem value="asc" className="focus:bg-gray-700">Ascending</SelectItem>
                <SelectItem value="desc" className="focus:bg-gray-700">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Apply Filters Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-2"
        >
          <Button 
            onClick={handleApplyFilters}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl py-3 h-12 shadow-lg hover:shadow-indigo-700/20 transition-all font-medium"
          >
            Apply Filters
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}