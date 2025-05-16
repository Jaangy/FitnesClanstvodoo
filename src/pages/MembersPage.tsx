import React from 'react';
import MembersList from '../components/members/MembersList';
import RequireAuth from '../components/auth/RequireAuth';

const MembersPage: React.FC = () => {
  return (
    <RequireAuth allowedRoles={['admin', 'instructor']}>
      <MembersList />
    </RequireAuth>
  );
};

export default MembersPage;