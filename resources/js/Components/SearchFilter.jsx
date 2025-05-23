import React from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Search } from 'lucide-react';

export default function SearchFilter({ value, onChange, onSubmit, placeholder = 'Search...' }) {
  return (
    <form onSubmit={onSubmit} className="flex items-center space-x-2">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          className="pl-10 w-full"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <Button type="submit" variant="outline">
        Search
      </Button>
    </form>
  );
} 