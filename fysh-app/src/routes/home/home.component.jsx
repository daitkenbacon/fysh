import { Link } from 'react-router-dom';

const Home = () => {
    return (
    <div className="relative overflow-hidden shadow rounded lg:p-10 lg:max-w-7xl lg:mx-auto lg:mt-8">
      <div className="pt-8 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="font text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to Fysh!
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Create, judge, and join fishing tournaments at the click of a button. 
            </p>
          </div>
          <div>
            <div className="mt-10">
              {/* rounded solids grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute opacity-20 sm:opacity-50 md:opacity-70 lg:opacity-100 transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 bg-leaf-800 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100"/>
                      <div className="h-64 bg-leaf-800 w-44 overflow-hidden rounded-lg"/>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 bg-leaf-600 w-44 overflow-hidden rounded-lg"/>
                      <div className="h-64 bg-leaf-600 w-44 overflow-hidden rounded-lg"/>
                      <div className="h-64 bg-leaf-600 w-44 overflow-hidden rounded-lg"/>
                    </div>
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 bg-leaf-800 w-44 overflow-hidden rounded-lg"/>
                      <div className="h-64 bg-leaf-800 w-44 overflow-hidden rounded-lg"/>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to='/tournaments'
                className="inline-block rounded-md border border-transparent bg-blue-600 py-3 px-4 text-center font-medium text-white hover:bg-blue-700"
              >
                Browse Tournaments
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default Home;