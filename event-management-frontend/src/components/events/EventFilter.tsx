// src/components/events/EventFilter.tsx
'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
    <div className="mb-6 space-y-4">
      <div className="flex space-x-4">
        {/* Search Input */}
        <Input 
          placeholder="Search events..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />

        {/* Date From Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-[240px] justify-start text-left font-normal ${!dateFrom ? "text-muted-foreground" : ""}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "PPP") : <span>From Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={setDateFrom}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date To Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-[240px] justify-start text-left font-normal ${!dateTo ? "text-muted-foreground" : ""}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "PPP") : <span>To Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={setDateTo}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="seats">Available Seats</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Order */}
        <Select 
          value={sortOrder} 
          onValueChange={(val) => setSortOrder(val as 'asc' | 'desc')}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>

        {/* Apply Filters Button */}
        <Button onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}