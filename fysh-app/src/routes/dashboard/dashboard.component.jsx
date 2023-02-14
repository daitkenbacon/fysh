import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user.context';
import { TournamentsContext } from '../../contexts/tournaments.context';

const DashboardPage = () => {

  const { currentUserDoc } = useContext(UserContext);
  const [ user, setUser ] = useState({
    name: '',
    about: '',
    avatar: '',
  });
  useEffect(() => {
    if(currentUserDoc){
      let { displayName, bio, profilePicture } = currentUserDoc;
      setUser({
        name: displayName,
        about: bio,
        avatar: profilePicture,
      })
    }
  }, [currentUserDoc])

  return (
    <div>
      <div className="mx-auto max-w-2xl pb-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div>
          <div className="bg-white rounded-3xl p-8 mb-5">
            <div className='flex flex-row items-center align-center text-left gap-4 justify-center'>
              <img alt={user.name} className='rounded-full w-100' src={user.avatar}/>
              <h1 className="text-3xl font-bold">{user.name}'s Dashboard</h1>
            </div>

            <hr className="my-10"/>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-20">
              <div>
                <h2 className="text-2xl font-bold mb-4">Current Tournament</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <div className="p-4 bg-leaf-600 rounded-xl">
                      <div className="font-bold text-xl text-white leading-none">Flying Fish Frenzy</div>
                      <div className="mt-5">
                        <button type="button" className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-white border hover:bg-gray-100 text-gray-800 text-sm font-semibold transition">
                          Submit a catch
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-600 rounded-xl text-white">
                    <div className="font-bold text-2xl leading-none">2 Days</div>
                    <div className="mt-2">Remaining until closed</div>
                  </div>

                  <div className="p-4 bg-blue-600 rounded-xl text-white">
                    <div className="font-bold text-2xl leading-none">1</div>
                    <div className="mt-2">Catch submitted</div>
                  </div>

                  <div className="col-span-2">
                    <div className="p-4 bg-leaf-600 rounded-xl text-white">
                      <div className="font-bold text-xl leading-none">Updated pot size</div>
                      <div className="mt-2">$200</div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className='my-5' />
              <div>
                <h2 className="text-2xl font-bold mb-4">Upcoming Tournaments</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-xs">2/14/2023</div>
                      <div className="text-gray-400 text-xs">tomorrow</div>
                    </div>
                    <button className="font-bold hover:text-yellow-800 hover:underline">Big ole Bass Bonanza</button>
                  </div>

                  <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-xs">2/15/2023</div>
                      <div className="text-gray-400 text-xs">in 2 days</div>
                    </div>
                    <button className="font-bold hover:text-yellow-800 hover:underline">Fishy Fyshers</button>
                  </div>

                  <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                    <div className="flex justify-between">
                      <div className="text-gray-400 text-xs">2/28/23</div>
                      <div className="text-gray-400 text-xs">in 2 weeks</div>
                    </div>
                    <button className="font-bold hover:text-yellow-800 hover:underline">February Fish Fest</button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
