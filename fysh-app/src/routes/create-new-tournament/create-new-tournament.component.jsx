import React from "react";

import Resizer from "react-image-file-resizer";

import PropTypes from "prop-types";
import { MemoryRouter } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";

import { format } from 'date-fns'

import {
  createDocInCollection,
  storage,
} from "../../utils/firebase/firebase.utils";
import { ref, getDownloadURL, uploadString } from "firebase/storage";

import { useState, useContext } from "react";
import { UserContext } from "../../contexts/user.context";

import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { TournamentsContext } from "../../contexts/tournaments.context";

const TournamentForm = () => {
  const {  currentUserUID } = useContext(UserContext);
  const { addTournament } = useContext(TournamentsContext);

  const MAX_COST = 10;

  const defaultFormFields = {
    name: "",
    description: "",
    rules: "",
    registration_fee: 0,
    max_participants: 1,
    participants: [],
    start_date: format(new Date(), "yyyy-MM-dd'T'HH:00"),
    end_date: format(new Date(), "yyyy-MM-dd'T'HH:00"),
    image: "",
    author: currentUserUID,
    catches: [],
    isOpen: false,
  };

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [resizedImage, setResizedImage] = useState("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const {
    name,
    description,
    rules,
    registration_fee,
    max_participants,
    author,
    start_date,
    end_date,
  } = formFields;

  function Router(props) {
    const { children } = props;
    if (typeof window === "undefined") {
      return <StaticRouter location="/">{children}</StaticRouter>;
    }

    return <MemoryRouter>{children}</MemoryRouter>;
  }

  Router.propTypes = {
    children: PropTypes.node,
  };

  useEffect(() => {
    if (!selectedImage) {
      setPreviewImage(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewImage(objectUrl);
  }, [selectedImage]);

  useEffect(() => {
    if (currentUserUID) {
      setFormFields({ ...formFields, author: currentUserUID });
    }
  }, [currentUserUID]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isUploading) {
      toast.error("Image is still uploading.");
      return;
    } else if (!isImageUploaded) {
      toast.error("Please upload the image you have selected.");
      return;
    } else if (currentUserUID) {
      try {
        await createDocInCollection(formFields, "tournaments");
        addTournament(formFields);
        setFormFields(defaultFormFields);
        console.log("Finished submitting: ", formFields);
      } catch (err) {
        console.error(err);
      }
    } else {
      toast.error("You must be logged in to create a tournament!");
    }
  };

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(file, 500, 500, "jpeg", 100, 0, (uri) => {
        resolve(uri);
      });
    });

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please choose a file before uploading.");
      return;
    }

    const newMetadata = {
      cacheControl: "public,max-age=300",
      contentType: "image/jpeg",
    };
    setIsUploading(true);
    const storageRef = ref(storage, `/tournaments/${selectedImage.name}`);

    uploadString(storageRef, resizedImage, "data_url", newMetadata)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((URL) => {
          setFormFields({ ...formFields, image: URL });
          setIsUploading(false);
          setIsImageUploaded(true);
        });
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
    
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!event.target.files || event.target.files.length === 0) {
      setSelectedImage(undefined);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be less than 5MB.");
    } else {
      try {
        const uri = await resizeFile(file);
        setResizedImage(uri);
        setSelectedImage(file);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    let newDate = format(new Date(value), "yyyy-MM-dd'T'HH:mm")
    setFormFields({ ...formFields, [name]: newDate});
  }

  const handleNumberKeyDown = (event) => {
    if (event.key === '-' || event.key === '.'){
      event.preventDefault();
    } else {
      const value = Number(event.target.value + event.key);
      if(value < 0) {
        event.preventDefault();
      } else if (value > MAX_COST) {
        event.preventDefault();
      }
    }
  }

  return (
    <>
      <Toaster/>
      <div className="lg: pt-20 p-5 max-w-screen-xl mx-auto">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-3xl font-medium leading-6 text-gray-900">
                New Tournament
              </h3>
              <p className="mt-1 text-md text-gray-600">
                Get fyshing! Enter all of the details for your tournament here.
                All fields are required.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label
                        htmlFor="name"
                        className="block text-md font-medium text-gray-700"
                      >
                        Tournament Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={handleChange}
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={name}
                          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="Joe's Crab Catch for Cash"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-md font-medium text-gray-700"
                    >
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        onChange={handleChange}
                        name="description"
                        value={description}
                        rows={3}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="This is a crab-catching tournament for fyshers all over."
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your tournament.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="rules"
                      className="block text-md font-medium text-gray-700"
                    >
                      Rules
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="rules"
                        onChange={handleChange}
                        name="rules"
                        value={rules}
                        required
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="This is a crab-catching tournament for fyshers all over."
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Set the rules! Be specific, but simple.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="registration_fee"
                      className="block text-md font-medium text-gray-700"
                    >
                      Registration Fee
                    </label>
                    <div className="mt-1">
                      <input
                        id="registration_fee"
                        type='number'
                        min={0}
                        max={10}
                        onKeyDown={handleNumberKeyDown}
                        onChange={handleChange}
                        name="registration_fee"
                        value={registration_fee}
                        required
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="$0"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      The cost of registering for your tournament. Maximum of $10.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="max_participants"
                      className="block text-md font-medium text-gray-700"
                    >
                      Maximum Participants
                    </label>
                    <div className="mt-1">
                      <input
                        id="max_participants"
                        type='number'
                        min={0}
                        max={10}
                        onKeyDown={handleNumberKeyDown}
                        onChange={handleChange}
                        name="max_participants"
                        value={max_participants}
                        required
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="$0"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      How many fyshers can participate in your tournament.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="dates"
                      className="block text-md font-medium text-gray-700"
                    >
                      Tournament Dates
                    </label>
                    <div className="mt-1 flex gap-2">
                      <input 
                        className="rounded"
                        id='start_date' 
                        onChange={handleDateChange} 
                        name='start_date' 
                        value={start_date}
                        type='datetime-local'
                        required/>
                      <input 
                        className="rounded"
                        id='end_date' 
                        onChange={handleDateChange} 
                        name='end_date' 
                        value={end_date}
                        type='datetime-local'
                        required/>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Choose when your tournament starts and ends.
                    </p>
                  </div>

                  <div>
                    <label className="block text-md font-medium text-gray-700">
                      Cover photo
                    </label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-gray-200 px-6 pt-5 pb-6">
                      {!selectedImage && (
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative items-center cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                id="file-upload"
                                required
                                name="file-upload"
                                className="border-2 rounded"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      )}
                      {selectedImage && (
                        <div className="">
                          <img src={previewImage} />
                          <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="p-2 mt-1 shadow bg-blue-600 rounded-lg text-white"
                          >
                            {isUploading ? "Uploading..." : "Upload"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentForm;

{
  /* <div>
            <div className='header'>
            <Typography sx={{
                fontFamily: 'Abril Fatface, cursive',
                color: '#d1dbbd',
                fontSize: '5vw',
                textShadow: '2px 2px 5px #193441'
            }} variant='h1'
            >
                Create a Tournament
                </Typography>
            </div>
            <div className='tournament-form-container'>
                <Toaster/>
                <form onSubmit={handleSubmit} className="tournament-form">
                    <TextField sx={{input: {color: '#FCFFF5'}}} variant='standard' label='Name' type='text' required onChange={handleChange} max_length={12} name='name' value={name}/>
                    <TextField multiline variant='standard' label='Description' type='text' required onChange={handleChange} name='description' value={description}/>
                    <TextField multiline variant='standard' label='Rules' type='text' required onChange={handleChange} name='rules' value={rules}/>
                    <TextField sx={{width: '150px'}} variant='outlined' label='Max participants' type='number' required onChange={handleChange} name='max_participants' value={max_participants}/>
                    <TextField sx={{width: '150px'}} variant='outlined' label='Registration fee' type='number' required onChange={handleChange} name='registration_fee' value={registration_fee}/>
                    <div className='date-forms'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={startValue}
                                name="start_date"
                                type="date"
                                onChange={(newValue) => {
                                    setStartValue(newValue);
                                    }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endValue}
                                name="end_date"
                                onChange={(newValue) => {
                                    setEndValue(newValue);
                                    }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                    {selectedImage && <img src={previewImage}/>}
                    <Box>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{width: 150, alignSelf: 'left', backgroundColor: '#91AA9D', color: '#FCFFF5', mr: 2, mb: 2, '&:hover': {backgroundColor: '#576a60'}}}
                            >
                                Add an image
                                <input
                                    type="file"
                                    accept='image/*'
                                    onChange={handleFileChange}
                                    hidden
                                />
                        </Button>
                        {selectedImage &&
                            <Button variant='contained' sx={{width: 150, alignSelf: 'left', backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2, '&:hover': {backgroundColor: '#576a60'}}} onClick={handleUpload}>{isUploading ? 'Uploading...' : 'Upload Image'}</Button>
                        }
                        {(percent > 0) && <p>{percent}%</p>}
                    </Box>
                    <Button disabled={isLoading || isUploading} sx={{width: 100, alignSelf: 'center', backgroundColor: '#91AA9D', color: '#FCFFF5', mb: 2, '&:hover': {backgroundColor: '#576a60'}}} variant='contained' type='submit'>{`${isLoading ? 'Submitting...' : 'Submit'}`}</Button>
                </form>
            </div>
        </div> */
}
