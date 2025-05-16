import React, { useState } from 'react';
import { Member } from '../../types';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Search, Filter, PlusCircle, UserRound, Mail, Phone, Calendar } from 'lucide-react';
import { members } from '../../data/mockData';

const MembersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Filter members based on search and filter
  const filteredMembers = members.filter(member => {
    // Filter by search term (name or email)
    if (
      searchTerm && 
      !`${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !member.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    
    // Filter by membership status
    if (filterStatus !== 'all' && member.paymentStatus !== filterStatus) {
      return false;
    }
    
    return true;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <Button variant="primary" icon={<PlusCircle size={16} />}>
          Add New Member
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter by status */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Members List */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <Card key={member.id} className="h-full hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {member.firstName} {member.lastName}
                  </CardTitle>
                  <Badge 
                    variant={
                      member.paymentStatus === 'active' ? 'success' : 
                      member.paymentStatus === 'pending' ? 'warning' : 'danger'
                    }
                  >
                    {member.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail size={16} className="mr-2 text-gray-500" />
                    <span className="text-gray-700">{member.email}</span>
                  </div>
                  
                  {member.phone && (
                    <div className="flex items-center text-sm">
                      <Phone size={16} className="mr-2 text-gray-500" />
                      <span className="text-gray-700">{member.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <UserRound size={16} className="mr-2 text-gray-500" />
                    <span className="text-gray-700 capitalize">{member.membershipType} Membership</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span className="text-gray-700">
                      Valid until: {formatDate(member.membershipEnd)}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-4">No members found matching your criteria.</p>
          <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default MembersList;