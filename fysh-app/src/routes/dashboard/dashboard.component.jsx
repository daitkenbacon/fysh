import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user.context';
import { TournamentsContext } from '../../contexts/tournaments.context';

const DashboardPage = () => {

  const { currentUserDoc } = useContext(UserContext);

  return (
    <div className='bg-white'>
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex items-center mb-8">
          <img
            className="w-32 h-32 rounded-full mr-4"
            src={currentUserDoc && currentUserDoc.profilePicture}
            alt={currentUserDoc && currentUserDoc.displayName}
          />
          <div>
            <h1 className="text-2xl font-medium">{currentUserDoc && currentUserDoc.displayName}</h1>
            <p className="text-sm text-gray-700">Fysh User</p>
          </div>
        </div>
        <div className=''>
          Test text
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
