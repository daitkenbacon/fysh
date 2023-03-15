import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../contexts/user.context";

import { formatDistance } from "date-fns";

const DashboardPage = () => {
  const { currentUserDoc, upcomingTournaments, currentTournament } =
    useContext(UserContext);
  const [user, setUser] = useState({
    name: "",
    about: "",
    avatar: "",
  });

  useEffect(() => {
    if (currentUserDoc) {
      let { displayName, bio, profilePicture } = currentUserDoc;
      setUser({
        name: displayName,
        about: bio,
        avatar: profilePicture,
      });
    }
  }, [currentUserDoc]);

  return (
    <div>
      <div className="mx-auto max-w-2xl pb-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div>
          <div className="bg-white rounded-3xl p-8 mb-5">
            <div className="flex flex-row items-center align-center text-left gap-4 justify-center">
              <img
                alt={user.name}
                className="rounded-full w-100"
                src={user.avatar}
              />
              <h1 className="text-3xl font-bold">{user.name}'s Dashboard</h1>
            </div>

            <hr className="my-10" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-x-20">
              <div>
                <h2 className="text-2xl font-bold mb-4">Current Tournament</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <div className="p-4 bg-leaf-600 rounded-xl">
                      <div className="font-bold text-xl text-white leading-none">
                        {currentTournament ? currentTournament.name : "None"}
                      </div>
                      <div className="mt-5">
                        {currentTournament && (
                          <Link to={`/tournament/${currentTournament.id}`}>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-white border hover:bg-gray-100 text-gray-800 text-sm font-semibold transition"
                            >
                              Submit a catch
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-600 rounded-xl text-white">
                    <div className="font-bold text-2xl leading-none">
                      {currentTournament
                        ? `${formatDistance(new Date(), new Date(currentTournament.end_date))}`
                        : "n/a"}
                    </div>
                    <div className="mt-2">until tournament closes</div>
                  </div>

                  <div className="p-4 bg-blue-600 rounded-xl text-white">
                    <div className="font-bold text-2xl leading-none">
                      {currentTournament
                        ? currentTournament.catches.length
                        : "n/a"}
                    </div>
                    <div className="mt-2">
                      catch
                      {currentTournament &&
                        currentTournament.catches.length !== 1 &&
                        "es"}{" "}
                      submitted
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="p-4 bg-leaf-600 rounded-xl text-white">
                      <div className="font-bold text-xl leading-none">
                        Updated pot size
                      </div>
                      <div className="mt-2">
                        $
                        {currentTournament
                          ? currentTournament.registration_fee *
                            currentTournament.participants.length
                          : "0"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="sm:hidden my-5" />
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Upcoming Tournaments
                </h2>

                <div className="space-y-4">
                  {upcomingTournaments &&
                    upcomingTournaments.map((tournament) => {
                      var startDate = new Date(
                        tournament.start_date
                      );

                      var endDate = new Date(tournament.end_date);

                      var isNow = (new Date() > startDate && new Date() < endDate);

                      return (
                        <div
                          key={tournament.id}
                          className="p-4 bg-white border rounded-xl text-gray-800 space-y-2"
                        >
                          <div className="flex justify-between">
                            <div className="text-gray-400 text-xs">
                              {startDate.toLocaleDateString()}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {isNow ? 'now' : formatDistance(new Date(), startDate)}
                            </div>
                          </div>
                          <Link to={`/tournament/${tournament.id}`}>
                            <button className="font-bold hover:text-yellow-800 hover:underline">
                              {tournament.name}
                            </button>
                          </Link>
                        </div>
                      );
                    })}
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
